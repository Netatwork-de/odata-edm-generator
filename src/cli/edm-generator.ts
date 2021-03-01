import * as fs from 'fs';
import * as path from 'path';
import pluralize from 'pluralize';
import {
  ClassInfo,
  EdmInfo,
  Endpoint,
  EnumInfo,
  InterfaceInfo,
  nsToPath,
  propertyComparator,
  PropertyInfo,
} from './shared';
import { EdmTemplate } from './templates';

interface Attribute { [key: string]: string | boolean; Namespace: string; Name: string; Nullable: boolean | string; Type: string; BaseType: string; }
interface Property { _attributes: Attribute; }
interface Key { PropertyRef: Array<{ _attributes: Attribute }>; }
interface EntityType { _attributes: Attribute; Key: Key; Property: Property[]; NavigationProperty: Property[]; }
interface ComplexType { _attributes: Attribute; Property: Property[]; }
interface EnumMember { _attributes: Attribute; }
interface EnumType { _attributes: Attribute; Member: EnumMember[]; }
interface ImportInfo { ns: string; type: string; }
export interface Schema { _attributes: Attribute; EntityType: EntityType[]; EnumType: EnumType[]; ComplexType: ComplexType[]; }
export interface Metadata {
  ['edmx:Edmx']: {
    ['edmx:DataServices']: {
      Schema: Schema[]
    }
  }
}

// this map is not exhaustive (http://docs.oasis-open.org/odata/odata-csdl-json/v4.01/cs01/odata-csdl-json-v4.01-cs01.html#sec_PrimitiveTypes)
const typeMap = new Map([
  ['Edm.Binary', 'string'],
  ['Edm.Boolean', 'boolean'],
  ['Edm.Byte', 'number'],
  ['Edm.DateTime', 'string'],
  ['Edm.DateTimeOffset', 'string'],
  ['Edm.Decimal', 'number'],
  ['Edm.Double', 'number'],
  ['Edm.Duration', 'string'],
  ['Edm.Float', 'number'],
  ['Edm.Guid', 'string'],
  ['Edm.Int16', 'number'],
  ['Edm.Int32', 'number'],
  ['Edm.Int64', 'number'],
  ['Edm.String', 'string'],
  ['Edm.SByte', 'number'],
  ['Edm.TimeOfDay', 'string'],
]);

function getType(originalType: string, imports: ImportInfo[]) {
  let type: string;
  const isPrimitive = originalType.includes('Edm.');
  const collectionMarker = 'Collection(';
  const isArray = originalType.includes(collectionMarker);
  originalType = originalType.replace(collectionMarker, '');
  originalType = originalType.replace(')', '');

  if (isPrimitive) {
    type = typeMap.get(originalType) ?? 'any';
  } else {
    const nsParts = originalType.split('.');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    type = nsParts.pop()!;
    imports.push({ ns: nsParts.join('.'), type });
  }
  return isArray ? `${type}[]` : type;
}

const enCollator = new Intl.Collator('en');
function compareTypes(e1: EntityType | ComplexType | EnumType, e2: EntityType | ComplexType | EnumType) {
  const attributes1 = e1._attributes;
  const attributes2 = e2._attributes;
  if (attributes1.BaseType && !attributes2.BaseType) { return 1; }
  if (!attributes1.BaseType && attributes2.BaseType) { return -1; }
  return enCollator.compare(attributes1.Name, attributes2.Name);
}

function getMembers(properties: Property[], imports: ImportInfo[], keys: string[] = []) {
  return properties
    .map((property) => {
      const attributes = property._attributes;
      const name = attributes.Name;
      return new PropertyInfo(name, getType(attributes.Type, imports), attributes.Nullable !== 'false', keys.includes(name));
    })
    .sort(propertyComparator);
}

function generateEntityInfo(entityType: EntityType, imports: ImportInfo[], endpoints: Endpoint[], endpointImports: string[], entities: ClassInfo[]) {
  const entityKey = ensureArray(entityType.Key?.PropertyRef).map((x) => x._attributes.Name);
  const propertyInfos = getMembers([...ensureArray(entityType.Property), ...ensureArray(entityType.NavigationProperty)], imports, entityKey);
  try {
    const entityName = entityType._attributes.Name;

    const entitySetName = pluralize(entityName);
    const endpoint = (endpoints.find((ep) => ep.name === entitySetName) || {}).name;
    if (endpoint) {
      endpointImports.push(endpoint);
    }

    const baseTypeName = getBaseTypeName(entityType._attributes);
    const baseEntity = entities.find((e) => e.className === baseTypeName);
    if (baseTypeName && !baseEntity) {
      throw new Error(`base type ${baseTypeName} not found.`);
    }
    entities.push(new ClassInfo(
      entityName,
      propertyInfos,
      endpoint,
      baseEntity,
    ));
    return entities;
  } catch (e) {
    console.error(`entity generate failed for ${JSON.stringify(entityType, undefined, 2)}`);
    throw e;
  }
}

function generateInterfaceInfo(entityType: ComplexType, imports: ImportInfo[]) {
  const members = getMembers(ensureArray(entityType.Property), imports);
  const attributes = entityType._attributes;

  // TODO handle namespaces correctly
  return new InterfaceInfo(attributes.Name, members, getBaseTypeName(attributes));
}

function getBaseTypeName(attributes: Attribute) {
  const qualifiedBaseType = attributes.BaseType;
  const parts = qualifiedBaseType?.split('.');
  return parts?.[parts.length - 1];
}

function generateStringEnum(enumType: EnumType) {
  const members = ensureArray(enumType.Member).map((m) => m._attributes.Name);
  return new EnumInfo(enumType._attributes.Name, members);
}

function generateCodeContent(schemas: Schema[], endpoints: Endpoint[]): EdmInfo[] {
  const items: EdmInfo[] = [];
  for (const schema of schemas) {
    if (!schema.EntityType && !schema.EnumType && !schema.ComplexType) { continue; }
    const imports: ImportInfo[] = [];
    const endpointImports: string[] = [];

    const entityTypes = ensureArray(schema.EntityType);
    const complexTypes = ensureArray(schema.ComplexType);
    const enumTypes = ensureArray(schema.EnumType);

    const entities = entityTypes
      .sort(compareTypes)
      .reduce((acc, et) => generateEntityInfo(et, imports, endpoints, endpointImports, acc), [] as ClassInfo[]);
    const interfaces = complexTypes
      .sort(compareTypes)
      .map((ct) => generateInterfaceInfo(ct, imports));
    const enums = enumTypes
      .sort(compareTypes)
      .map((et) => generateStringEnum(et));

    items.push(new EdmInfo(schema._attributes.Namespace, imports, entities, interfaces, enums));
  }
  return items;
}

function generateCodeFile(items: EdmInfo[]) {
  for (const item of items) {
    const filePath = `${nsToPath(item.namespace)}.ts`;

    const dirName = path.dirname(filePath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    item.createImportDirectives(filePath);
    const content = new EdmTemplate().render(item);
    fs.writeFileSync(filePath, content);
  }
}

function ensureArray<T = unknown>(thing: T | T[]): T[] {
  let things = thing || [];
  things = Array.isArray(things) ? things : [things];
  return things;
}

export function generateEdm(metadata: Metadata, endpoints: Endpoint[]): void {
  const schemas: Schema[] = metadata['edmx:Edmx']['edmx:DataServices'].Schema;
  const items: EdmInfo[] = generateCodeContent(ensureArray(schemas), endpoints);
  generateCodeFile(items);
}