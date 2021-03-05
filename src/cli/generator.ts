/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { EOL } from 'os';
import { dirname } from 'path';
import { DOMParser } from 'xmldom';
import {
  ClassInfo,
  EdmInfo,
  Endpoint,
  EndpointConfiguration,
  EnumInfo,
  getEndpointsPath,
  ComplexTypeInfo,
  Logger,
  propertyComparator,
  PropertyInfo,
  ComplexTypeInfoSet,
} from './shared';
import { EdmTemplate, EndpointTemplate } from './templates';

// interface ImportInfo { ns: string; type: string; }

// this map is not exhaustive (http://docs.oasis-open.org/odata/odata-csdl-json/v4.01/cs01/odata-csdl-json-v4.01-cs01.html#sec_PrimitiveTypes)
const typeMap = new Map([
  ['Edm.Binary', 'string'],
  ['Edm.Boolean', 'boolean'],
  ['Edm.Byte', 'number'],
  ['Edm.Date', 'string'],
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

function getType(originalType: string/* , imports: ImportInfo[] */) {
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
    // imports.push({ ns: nsParts.join('.'), type });
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

function getMembers(properties: Element[], /* imports: ImportInfo[], */ keys: string[] = []) {
  return properties
    .map((property) => {
      const name = property.getAttribute('Name')!;
      return new PropertyInfo(
        name,
        getType(property.getAttribute('Type')!/* , imports */),
        property.getAttribute('Nullable') !== 'false',
        keys.includes(name)
      );
    })
    .sort(propertyComparator);
}

function generateEntityInfo(
  entityType: Element,
  // imports: ImportInfo[],
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
    // imports,
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
    const baseEntity = entities.find((e) => e.name === baseTypeName);
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
    Logger.error(`Entity generation failed for ${JSON.stringify(entityType, undefined, 2)}`);
    throw e;
  }
}

function generateComplexTypeInfo(acc: ComplexTypeInfoSet, entityType: Element/* , imports: ImportInfo[] */): ComplexTypeInfoSet {
  const name = entityType.getAttribute('Name')!;
  const baseTypeName = getBaseTypeName(entityType);
  let baseType: ComplexTypeInfo | null = null;
  if (baseTypeName !== undefined
    && (baseType = acc.find((x) => x.name === baseTypeName) ?? null) === null) {
    // As the types are already sorted, the base type info is expected to be generated, before the derived types.
    throw new Error(`Base type '${baseTypeName}' was not found for '${name}'.`);
  }
  const members = getMembers(Array.from(entityType.getElementsByTagName('Property')) /* , imports */);
  const complexType = new ComplexTypeInfo(
    name,
    members,
    entityType.getAttribute('Abstract') === 'true',
    baseType
  );
  acc.push(complexType);
  return acc;
}

function getBaseTypeName(type: Element) {
  return (type.getAttribute('BaseType') || null)
    ?.split('.')
    ?.pop();
}

function generateStringEnum(enumType: Element) {
  const members = Array.from(enumType.getElementsByTagName('Member')).map((m) => m.getAttribute('Name')!);
  return new EnumInfo(enumType.getAttribute('Name')!, members);
}

function generateCodeContent(
  edmxNode: HTMLElement,
  endpoints: Endpoint[],
  configuration: EndpointConfiguration,
): EdmInfo | null {
  const schemaElements = edmxNode.getElementsByTagName('Schema');
  const numSchema = schemaElements.length;
  if (numSchema === 0) {
    throw new Error('No schema found to generate the EDM.');
  }
  if (numSchema > 1) {
    throw new Error('Multiple schemas not yet supported.');
  }
  const schema = schemaElements.item(0)!;
  const entityTypes = Array.from(schema.getElementsByTagName('EntityType'));
  const complexTypes = Array.from(schema.getElementsByTagName('ComplexType'));
  const enumTypes = Array.from(schema.getElementsByTagName('EnumType'));

  if (entityTypes.length === 0 && enumTypes.length === 0 && complexTypes.length === 0) { return null; }

  // const imports: ImportInfo[] = [];
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
        // imports,
        endpoints,
        endpointImports,
        acc,
        entitySets,
        singletons,
      ),
      [] as ClassInfo[]);
  const $complexTypes = complexTypes
    .sort(compareTypes)
    .reduce(generateComplexTypeInfo, new ComplexTypeInfoSet());
  const enums = enumTypes
    .sort(compareTypes)
    .map((et) => generateStringEnum(et));

  return new EdmInfo(schema.getAttribute('Namespace')!, /* imports, */ entities, $complexTypes, enums, configuration);
}

function generateEdmFile(edmInfo: EdmInfo) {
  const filePath = edmInfo.filePath;

  const dirName = dirname(filePath);
  if (!existsSync(dirName)) {
    mkdirSync(dirName, { recursive: true });
  }

  const template = new EdmTemplate();
  const content = template.render(edmInfo);
  writeFileSync(filePath, content);
  template.dispose();
}

export function generateEdm(metadata: string, endpoints: Endpoint[], configuration: EndpointConfiguration): void {
  const parsed = new DOMParser()
    .parseFromString(metadata, 'application/xml')
    .documentElement;
  const error = Array.from(parsed.getElementsByTagName('parsererror'));
  if (error.length !== 0) {
    throw new Error(`Error parsing the edmx xml.${EOL}Parsing error: ${error.map((e) => e.outerHTML).join(EOL)}`);
  }
  const edmInfo = generateCodeContent(parsed, endpoints, configuration);
  if (edmInfo !== null) {
    generateEdmFile(edmInfo);
  }
}

export function generateEndpointsFile(endpoints: Endpoint[], configuration: EndpointConfiguration): void {
  const path = getEndpointsPath(configuration);
  const dirName = dirname(path);
  if (!existsSync(dirName)) {
    mkdirSync(dirName, { recursive: true });
  }
  writeFileSync(path, new EndpointTemplate().render(endpoints));
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