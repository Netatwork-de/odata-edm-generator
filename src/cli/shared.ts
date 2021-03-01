import { join, dirname, relative } from 'path';
import { Configuration } from './configuration';

export interface Endpoint {
  name: string;
  url: string;
}

export interface ImportInfo {
  ns: string;
  type: string;
}

export class PropertyInfo {
  public constructor(
    public name: string,
    public type: string,
    public isNullable: boolean,
    public isKey: boolean,
  ) { }
}

export class ClassInfo {
  public constructor(
    public className: string,
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

export class InterfaceInfo {
  public constructor(
    public name: string,
    public propertyInfos: PropertyInfo[],
    public baseType?: string,
  ) { }
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

export class EdmInfo {
  public importDirectives!: ImportDirectiveInfo[];
  public constructor(
    public namespace: string,
    public imports: ImportInfo[],
    public classInfos: ClassInfo[],
    public interfaceInfos: InterfaceInfo[],
    public enumInfos: EnumInfo[],
  ) { }

  public createImportDirectives(filePath: string): void {
    const importMap = this.imports.reduce((acc, i) => {
      let prevImports = acc.get(i.ns);
      if (!prevImports) {
        prevImports = new Set<string>();
      }
      prevImports.add(i.type);
      acc.set(i.ns, prevImports);
      return acc;
    }, new Map<string, Set<string>>());

    const directives = this.importDirectives = Array.from(importMap)
      .filter(([ns,]) => ns !== this.namespace)
      .map(([ns, imports]) => ([
        relative(dirname(filePath), nsToPath(ns)).replace(/\\/g, '/'),
        Array.from(imports).sort()
      ] as [string, string[]]))
      .sort(([p1,], [p2,]) => p1 < p2 ? -1 : 1)
      .map(([nsPath, imports]) => new ImportDirectiveInfo(nsPath, imports));
    directives.push(
      new ImportDirectiveInfo('@netatwork/odata-edm-generator', ['Class', 'odataEndpoint']),
      new ImportDirectiveInfo('../../Endpoints', ['Endpoints']), // TODO: fix the import path
    );
  }
}

export function nsToPath(ns: string): string {
  return join(Configuration.instance.baseOutputPath, 'entities', ns.replace(/\./g, '/'));
}

const enCollator = new Intl.Collator('en');
export function propertyComparator(p1: PropertyInfo, p2: PropertyInfo): number {
  const isP1Key = p1.isKey;
  if (isP1Key !== p2.isKey) { return isP1Key ? -1 : 1; }

  const p1Nullable = p1.isNullable;
  if (p1Nullable !== p2.isNullable) { return !p1Nullable ? -1 : 1; }

  return enCollator.compare(p1.name.toLowerCase(), p2.name.toLowerCase());
}