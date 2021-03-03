/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as fs from 'fs';
import { EOL } from 'os';
import * as path from 'path';
import { DOMParser } from 'xmldom';
import {
  ClassInfo,
  EdmInfo,
  Endpoint,
  EnumInfo,
  getEndpointsPath,
  InterfaceInfo,
  propertyComparator,
  PropertyInfo,
} from './shared';
import { EdmTemplate, EndpointTemplate } from './templates';

interface ImportInfo { ns: string; type: string; }

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
    type = nsParts.pop()!;
    imports.push({ ns: nsParts.join('.'), type });
  }
  return isArray ? `${type}[]` : type;
}

const enCollator = new Intl.Collator('en');
function compareTypes(e1: Element, e2: Element) {
  const baseType1 = e1.getAttribute('BaseType');
  const baseType2 = e2.getAttribute('BaseType');
  if (baseType1 && !baseType2) { return 1; }
  if (!baseType1 && baseType2) { return -1; }
  return enCollator.compare(e1.getAttribute('Name') ?? '', e2.getAttribute('Name') ?? '');
}

function getMembers(properties: Element[], imports: ImportInfo[], keys: string[] = []) {
  return properties
    .map((property) => {
      const name = property.getAttribute('Name')!;
      return new PropertyInfo(
        name,
        getType(property.getAttribute('Type')!, imports),
        property.getAttribute('Nullable') !== 'false',
        keys.includes(name)
      );
    })
    .sort(propertyComparator);
}

function generateEntityInfo(
  entityType: Element,
  imports: ImportInfo[],
  endpoints: Endpoint[],
  endpointImports: string[],
  entities: ClassInfo[],
  entitySets: EntitySet[],
  singletons: Singleton[],
) {
  const entityKey = Array.from(entityType.getElementsByTagName('Key'))
    .flatMap((k) => Array.from(k.getElementsByTagName('PropertyRef'))
      .map((pr) => pr.getAttribute('Name')!)
    );

  const propertyInfos = getMembers(
    [
      ...Array.from(entityType.getElementsByTagName('Property')),
      ...Array.from(entityType.getElementsByTagName('NavigationProperty')),
    ],
    imports,
    entityKey
  );
  try {
    const entityName = entityType.getAttribute('Name')!;

    const entitySetName = entitySets.find((es) => es.typeName === entityName)?.name;
    let endpoint = endpoints.find((ep) => ep.name === entitySetName && ep.kind === 'EntitySet')?.name;
    if (!endpoint) {
      const singletonName = singletons.find((s) => s.typeName === entityName)?.name;
      endpoint = endpoints.find((ep) => ep.name === singletonName && ep.kind === 'Singleton')?.name;
    }
    if (endpoint) {
      endpointImports.push(endpoint);
    }

    const baseTypeName = getBaseTypeName(entityType);
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
    console.error(`Entity generation failed for ${JSON.stringify(entityType, undefined, 2)}`);
    throw e;
  }
}

function generateInterfaceInfo(entityType: Element, imports: ImportInfo[]) {
  const members = getMembers(Array.from(entityType.getElementsByTagName('Property')), imports);
  return new InterfaceInfo(entityType.getAttribute('Name')!, members, getBaseTypeName(entityType));
}

function getBaseTypeName(type: Element) {
  return type.getAttribute('BaseType')
    ?.split('.')
    ?.pop();
}

function generateStringEnum(enumType: Element) {
  const members = Array.from(enumType.getElementsByTagName('Member')).map((m) => m.getAttribute('Name')!);
  return new EnumInfo(enumType.getAttribute('Name')!, members);
}

function generateCodeContent(edmxNode: HTMLElement, endpoints: Endpoint[]): EdmInfo[] {
  const items: EdmInfo[] = [];
  for (const schema of Array.from(edmxNode.getElementsByTagName('Schema'))) {

    const entityTypes = Array.from(schema.getElementsByTagName('EntityType'));
    const complexTypes = Array.from(schema.getElementsByTagName('ComplexType'));
    const enumTypes = Array.from(schema.getElementsByTagName('EnumType'));

    if (entityTypes.length === 0 && enumTypes.length === 0 && complexTypes.length === 0) { continue; }

    const imports: ImportInfo[] = [];
    const endpointImports: string[] = [];

    const entitySets = Array.from(edmxNode.getElementsByTagName('EntitySet'))
      .map((e) => new EntitySet(e.getAttribute('Name')!, e.getAttribute('EntityType')!.split('.').pop()!));
    const singletons = Array.from(edmxNode.getElementsByTagName('Singleton'))
      .map((e) => new Singleton(e.getAttribute('Name')!, e.getAttribute('Type')!.split('.').pop()!));
    const entities = entityTypes
      .sort(compareTypes)
      .reduce(
        (acc, et) => generateEntityInfo(
          et,
          imports,
          endpoints,
          endpointImports,
          acc,
          entitySets,
          singletons,
        ),
        [] as ClassInfo[]);
    const interfaces = complexTypes
      .sort(compareTypes)
      .map((ct) => generateInterfaceInfo(ct, imports));
    const enums = enumTypes
      .sort(compareTypes)
      .map((et) => generateStringEnum(et));

    items.push(new EdmInfo(schema.getAttribute('Namespace')!, imports, entities, interfaces, enums));
  }
  return items;
}

function generateEdmFile(items: EdmInfo[]) {
  for (const item of items) {
    const filePath = item.filePath;

    const dirName = path.dirname(filePath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    const template = new EdmTemplate();
    const content = template.render(item);
    fs.writeFileSync(filePath, content);
    template.dispose();
  }
}

export function generateEdm(metadata: string, endpoints: Endpoint[]): void {
  const parsed = new DOMParser()
    .parseFromString(metadata, 'application/xml')
    .documentElement;
  const error = Array.from(parsed.getElementsByTagName('parsererror'));
  if (error.length !== 0) {
    throw new Error(`Error parsing the edmx xml.${EOL}Parsing error: ${error.map((e) => e.outerHTML).join(EOL)}`);
  }
  const items: EdmInfo[] = generateCodeContent(parsed, endpoints);
  generateEdmFile(items);
}

export function generateEndpointsFile(endpoints: Endpoint[]): void {
  fs.writeFileSync(getEndpointsPath(), new EndpointTemplate().render(endpoints));
}

class EntitySet {
  public constructor(
    public readonly name: string,
    public readonly typeName: string,
  ) { }
}

class Singleton {
  public constructor(
    public readonly name: string,
    public readonly typeName: string,
  ) { }
}