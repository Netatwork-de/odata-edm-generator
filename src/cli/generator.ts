/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { EOL } from 'os';
import { dirname } from 'path';
// eslint-disable-next-line @typescript-eslint/no-shadow
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
  return enCollator.compare(e1.getAttribute('Name')!, e2.getAttribute('Name')!);
}

function getMembers(properties: Element[], /* imports: ImportInfo[], */ keys: string[] = []) {
  return properties
    .map((property) => {
      const name = property.getAttribute('Name')!;
      const isKey = keys.includes(name);
      return new PropertyInfo(
        name,
        getType(property.getAttribute('Type')!/* , imports */),
        !isKey && property.getAttribute('Nullable') !== 'false',
        isKey
      );
    })
    .sort(propertyComparator);
}

function getBaseTypeName(type: Element) {
  return (type.getAttribute('BaseType') || null)
    ?.split('.')
    ?.pop();
}
export class Generator {

  private readonly endpointTemplate = new EndpointTemplate();
  private readonly edmTemplate = new EdmTemplate();

  public generateEdm(metadata: string, endpoints: Endpoint[], configuration: EndpointConfiguration): void {
    const parsed = new DOMParser()
      .parseFromString(metadata, 'application/xml')
      .documentElement;
    const error = Array.from(parsed.getElementsByTagName('parsererror'));
    if (error.length !== 0) {
      throw new Error(`Error parsing the edmx xml.${EOL}Parsing error: ${error.map((e) => e.outerHTML).join(EOL)}`);
    }
    const edmInfo = this.generateCodeContent(parsed, endpoints, configuration);
    if (edmInfo !== null) {
      this.generateEdmFile(edmInfo);
    }
  }

  public generateEndpointsFile(endpoints: Endpoint[], configuration: EndpointConfiguration): void {
    const path = getEndpointsPath(configuration);
    const dirName = dirname(path);
    if (!existsSync(dirName)) {
      mkdirSync(dirName, { recursive: true });
    }
    writeFileSync(path, this.endpointTemplate.render(endpoints));
  }

  public dispose(): void {
    this.edmTemplate.dispose();
  }

  private generateStringEnum(acc: EnumInfo[], enumType: Element, ignored: string[]): EnumInfo[] {
    const name = enumType.getAttribute('Name')!;
    if (ignored.includes(name)) { return acc; }
    const members = Array.from(enumType.getElementsByTagName('Member')).map((m) => m.getAttribute('Name')!);
    acc.push(new EnumInfo(name, members));
    return acc;
  }

  private generateCodeContent(
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

    const ignored = configuration.ignore;
    const entitySets = Array.from(edmxNode.getElementsByTagName('EntitySet'))
      .map((e) => new EntitySet(e.getAttribute('Name')!, e.getAttribute('EntityType')!.split('.').pop()!));
    const singletons = Array.from(edmxNode.getElementsByTagName('Singleton'))
      .map((e) => new Singleton(e.getAttribute('Name')!, e.getAttribute('Type')!.split('.').pop()!));
    const entities = entityTypes
      .sort(compareTypes)
      .reduce(
        (acc, et) => this.generateEntityInfo(
          et,
          // imports,
          endpoints,
          endpointImports,
          acc,
          entitySets,
          singletons,
          ignored,
        ),
        [] as ClassInfo[]);
    const $complexTypes = complexTypes
      .sort(compareTypes)
      .reduce((acc, item) => this.generateComplexTypeInfo(acc, item, complexTypes, ignored), new ComplexTypeInfoSet());
    const enums = enumTypes
      .sort(compareTypes)
      .reduce((acc, et) => this.generateStringEnum(acc, et, ignored), [] as EnumInfo[]);

    return new EdmInfo(schema.getAttribute('Namespace')!, /* imports, */ entities, $complexTypes, enums, configuration);
  }

  private generateEdmFile(edmInfo: EdmInfo) {
    const filePath = edmInfo.filePath;

    const dirName = dirname(filePath);
    if (!existsSync(dirName)) {
      mkdirSync(dirName, { recursive: true });
    }

    const template = this.edmTemplate;
    const content = template.render(edmInfo);
    writeFileSync(filePath, content);
  }

  private generateEntityInfo(
    entityType: Element,
    // imports: ImportInfo[],
    endpoints: Endpoint[],
    endpointImports: string[],
    entities: ClassInfo[],
    entitySets: EntitySet[],
    singletons: Singleton[],
    ignored: string[],
  ) {
    const entityName = entityType.getAttribute('Name')!;
    if (ignored.includes(entityName)) { return entities; }
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
      let baseEntity: ClassInfo | undefined = undefined;
      if (baseTypeName
        && !ignored.includes(baseTypeName)
        && (baseEntity = entities.find((e) => e.name === baseTypeName)) === undefined
      ) {
        throw new Error(`Base type '${baseTypeName}' not found.`);
      }
      entities.push(new ClassInfo(
        entityName,
        propertyInfos,
        endpoint,
        baseEntity,
      ));
      return entities;
    } catch (e) {
      Logger.error(`Entity generation failed for '${entityType.getAttribute('Name')!}'`);
      throw e;
    }
  }

  private generateComplexTypeInfo(
    acc: ComplexTypeInfoSet,
    entityType: Element,
    complexTypes: Element[],
    ignored: string[],
    /* , imports: ImportInfo[] */
  ): ComplexTypeInfoSet {
    const name = entityType.getAttribute('Name')!;

    if (ignored.includes(name)) { return acc; }

    const baseTypeName = getBaseTypeName(entityType);
    let baseType: ComplexTypeInfo | null = null;
    if (baseTypeName !== undefined
      && !ignored.includes(baseTypeName)
      && (baseType = acc.find((x) => x.name === baseTypeName) ?? null) === null) {
      const x = complexTypes.find((ct) => ct.getAttribute('Name') === baseTypeName);
      if (x === undefined) {
        throw new Error(`Base type '${baseTypeName}' was not found for '${name}'.`);
      }
      this.generateComplexTypeInfo(acc, x, complexTypes, ignored);
      baseType = acc[acc.length - 1];
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