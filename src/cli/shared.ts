import { dirname, join, relative } from 'path';
import { Configuration } from './configuration';

export interface Endpoint {
  name: string;
  kind: 'EntitySet' | 'Singleton';
  url: string;
}

export interface ImportInfo {
  ns: string;
  type: string;
}

export class PropertyInfo {
  public constructor(
    public name: string,
    public type: string | ClassInfo | ComplexTypeInfo,
    public isNullable: boolean,
    public isKey: boolean,
  ) { }
}

export class ClassInfo {
  public constructor(
    public name: string,
    public propertyInfos: PropertyInfo[],
    public endpoint?: string,
    public baseType?: ClassInfo,
  ) {
    if (baseType) {
      this.propertyInfos.push(...baseType.propertyInfos);
      this.propertyInfos.sort(propertyComparator);
    }
  }
}

export class ComplexTypeInfo {
  public derivedTypes: ComplexTypeInfoSet = new ComplexTypeInfoSet();

  public constructor(
    public readonly name: string,
    public readonly propertyInfos: PropertyInfo[],
    public readonly isAbstract: boolean,
    public readonly baseType: ComplexTypeInfo | null,
  ) {
    if (baseType !== null) {
      baseType.derivedTypes.push(this);
    }
  }
}

export class ComplexTypeInfoSet extends Array<ComplexTypeInfo> {
  public constructor(...items: ComplexTypeInfo[]) {
    super(
      ...items
        .reduce(
          (acc, item) => {
            if (!acc.find((i) => i.name === item.name)) {
              acc.push(item);
            }
            return acc;
          },
          [] as ComplexTypeInfo[])
    );
    Object.setPrototypeOf(this, ComplexTypeInfoSet.prototype);
  }
  public push(item: ComplexTypeInfo): number {
    if (this.find((x) => x.name === item.name)) { return this.length; }
    return super.push(item);
  }
}

export class EnumInfo {
  public constructor(
    public name: string,
    public members: string[],
  ) { }
}

export class ImportDirectiveInfo {
  public constructor(
    public nsPath: string,
    public items: string[],
  ) { }
}

const primitivePropertyTypes = ['string', 'number', 'boolean'];
export class EdmInfo {
  public importDirectives!: ImportDirectiveInfo[];
  public readonly filePath: string;
  public readonly quote: string;
  public readonly indent: string;
  public constructor(
    public namespace: string,
    // public imports: ImportInfo[],
    public classInfos: ClassInfo[],
    public complexTypeInfos: ComplexTypeInfoSet,
    public enumInfos: EnumInfo[],
    configuration: EndpointConfiguration,
  ) {
    const config = Configuration.instance;
    this.quote = config.quote;
    this.indent = config.indent;
    this.filePath = `${nsToPath(namespace, configuration)}.ts`;
    this.adjustPropertyTypes();
    this.createImportDirectives(configuration);
  }

  private createImportDirectives(configuration: EndpointConfiguration): void {
    const filePath = this.filePath;
    // const importMap = this.imports.reduce((acc, i) => {
    //   let prevImports = acc.get(i.ns);
    //   if (!prevImports) {
    //     prevImports = new Set<string>();
    //   }
    //   prevImports.add(i.type);
    //   acc.set(i.ns, prevImports);
    //   return acc;
    // }, new Map<string, Set<string>>());

    // const directives = this.importDirectives = Array.from(importMap)
    //   .filter(([ns,]) => ns !== this.namespace)
    //   .map(([ns, imports]) => ([
    //     relative(dirname(filePath), nsToPath(ns, configuration)).replace(/\\/g, '/'),
    //     Array.from(imports).sort()
    //   ] as [string, string[]]))
    //   .sort(([p1,], [p2,]) => p1 < p2 ? -1 : 1)
    //   .map(([nsPath, imports]) => new ImportDirectiveInfo(nsPath, imports));
    this.importDirectives = [
      new ImportDirectiveInfo('@netatwork/odata-edm-generator', ['Class', 'odataEndpoint', 'odataType', 'odataTypeKey']),
      new ImportDirectiveInfo(
        relative(dirname(filePath), getEndpointsPath(configuration))
          .replace(/\\/g, '/')
          .replace('.ts', ''),
        ['Endpoints']
      ),
    ];
  }

  private adjustPropertyTypes() {
    const entities = this.classInfos;
    const complexTypes = this.complexTypeInfos;
    const lookup: Map<string, string | ClassInfo | ComplexTypeInfo> = new Map<string, ClassInfo | ComplexTypeInfo>();

    const mapTypes = (prop: PropertyInfo) => {
      const typeStr: string = prop.type as string;
      if (primitivePropertyTypes.includes(typeStr)) { return; }
      let type;
      if ((type = lookup.get(typeStr)) !== undefined) {
        prop.type = type;
        return;
      }
      if ((type = entities.find((e) => e.name === typeStr)) !== undefined) {
        lookup.set(typeStr, prop.type = type);
        return;
      }
      if (((type = complexTypes.find((c) => c.name === typeStr))?.derivedTypes.length ?? 0) > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        lookup.set(typeStr, prop.type = type!);
        return;
      }
      lookup.set(typeStr, typeStr);
    };

    for (const entity of entities) {
      for (const prop of entity.propertyInfos) {
        mapTypes(prop);
      }
    }

    for (const complexType of complexTypes) {
      for (const prop of complexType.propertyInfos) {
        mapTypes(prop);
      }
    }
  }
}

function nsToPath(ns: string, configuration: EndpointConfiguration): string {
  return join(configuration.outputDir, 'entities', ns.replace(/\./g, '/'));
}

const enCollator = new Intl.Collator('en');
export function propertyComparator(p1: PropertyInfo, p2: PropertyInfo): number {
  const isP1Key = p1.isKey;
  if (isP1Key !== p2.isKey) { return isP1Key ? -1 : 1; }

  const isP1Nullable = p1.isNullable;
  if (isP1Nullable !== p2.isNullable) { return !isP1Nullable ? -1 : 1; }

  return enCollator.compare(p1.name.toLowerCase(), p2.name.toLowerCase());
}


export function getEndpointsPath(configuration: EndpointConfiguration): string {
  return join(configuration.outputDir, 'Endpoints.ts');
}

export class EndpointConfiguration {
  public constructor(
    public readonly url: string,
    public outputDir: string,
    public readonly ignore: string[] = []
  ) { }
}

export class Logger {
  private static get prefix(): string {
    return `[gen-edm @ ${new Date().toISOString()}]`;
  }
  public static log(message: string, ...additional: unknown[]): void {
    console.log(`${this.prefix}[LOG] ${message}`, ...additional);
  }

  public static warn(message: string, ...additional: unknown[]): void {
    console.warn(`${this.prefix}[WARN] ${message}`, ...additional);
  }

  public static info(message: string, ...additional: unknown[]): void {
    console.info(`${this.prefix}[INF] ${message}`, ...additional);
  }

  public static error(message: string, ...additional: unknown[]): void {
    console.error(`${this.prefix}[ERR] ${message}`, ...additional);
  }
}