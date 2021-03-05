import { assert } from 'chai';
import mockFs from 'mock-fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { Configuration } from '../src/cli/configuration';
import { ClassInfo, EdmInfo, EnumInfo, ComplexTypeInfo, PropertyInfo } from '../src/cli/shared';
import { EdmTemplate, EndpointTemplate } from '../src/cli/templates';
import { standardEndpoints } from './data';
describe('templates', function () {

  describe('EndpointTemplate', function () {

    it('Renders correctly', function () {
      try {
        Configuration.createFromCLIArgs(['--quoteStyle', 'single']);
        const actual = new EndpointTemplate().render(standardEndpoints);
        assert.strictEqual(actual,
          `/**
 * This is a generated file. Please don't change this manually.
 */
export const enum Endpoints {
    People = 'People',
    Foos = 'Foos',
    Bar = 'fizzbazz',
}`
        );
      } finally {
        Configuration.dispose();
      }
    });

    it('Respects the given template', function () {
      try {
        Configuration.createFromCLIArgs(['--quoteStyle', 'single']);
        const template = 'export const enum Endpoints {<% for(const endpoint of it.endpoints) { %> <%= endpoint.name %> = "<%= endpoint.url %>",<% } %>}';
        const actual = new EndpointTemplate(template).render(standardEndpoints);
        assert.strictEqual(actual, 'export const enum Endpoints { People = "People", Foos = "Foos", Bar = "fizzbazz",}');
      } finally {
        Configuration.dispose();
      }
    });

  });

  describe('EdmTemplate', function () {
    it('Renders correctly', function () {
      try {
        const basePath = join(process.cwd(), uuid());
        mockFs({ [basePath]: {} }, { createCwd: true });
        const config = Configuration.createFromCLIArgs(['--outputDir', basePath, '--endpoint', 'https://api.example.com']);

        const base1 = new ClassInfo(
          'BaseOne',
          [
            new PropertyInfo('name', 'string', false, false),
          ],
        );
        const interface1 = new ComplexTypeInfo(
          'ComplexType1',
          [
            new PropertyInfo('prop11', 'number', false, false),
            new PropertyInfo('prop12', 'string', false, false),
          ],
          false,
          null
        );
        const info = new EdmInfo(
          'Awesome.Possum',
          // [],
          [
            new ClassInfo(
              'Foo',
              [
                new PropertyInfo('id', 'number', false, true),
                new PropertyInfo('name', 'string', false, false),
                new PropertyInfo('isActive', 'boolean', false, false),
                new PropertyInfo('optional', 'string', true, false),
              ],
              'foos'
            ),
            new ClassInfo(
              'Bar',
              [
                new PropertyInfo('id', 'number', false, true),
                new PropertyInfo('boolProp', 'boolean', false, false),
                new PropertyInfo('strProp', 'string', false, false),
                new PropertyInfo('optionalProp', 'number', true, false),
              ],
            ),
            base1,
            new ClassInfo(
              'Child',
              [
                new PropertyInfo('id', 'number', false, true),
                new PropertyInfo('strProp', 'string', false, false),
                new PropertyInfo('optionalProp', 'number', true, false),
              ],
              'Children',
              base1,
            ),
          ],
          [
            interface1,
            new ComplexTypeInfo(
              'ComplexType2',
              [
                new PropertyInfo('prop21', 'number', false, false),
                new PropertyInfo('prop22', 'string', false, false),
                new PropertyInfo('prop23', 'boolean', false, false),
              ],
              false,
              null
            ),
            new ComplexTypeInfo(
              'ChildComplexType',
              [
                new PropertyInfo('prop31', 'number', false, false),
                new PropertyInfo('prop32', 'string', false, false),
                new PropertyInfo('prop33', 'boolean', false, false),
              ],
              false,
              interface1,
            ),
          ],
          [
            new EnumInfo(
              'EnumOne',
              ['member11', 'member12']
            ),
            new EnumInfo(
              'EnumTwo',
              ['member21', 'member22']
            ),
          ],
          config.endpoints[0],
        );

        const actual = new EdmTemplate().render(info);

        assert.strictEqual(
          actual,
          `/**
 * This is a generated file. Please don't change this manually.
 */

import {
    Class,
    odataEndpoint,
    odataType,
    odataTypeKey,
} from '@netatwork/odata-edm-generator';
import {
    Endpoints,
} from '../../Endpoints';

@odataEndpoint(Endpoints.foos)
export class Foo {

    public static create<TFoo extends Foo = Foo>(this: Class<TFoo>, raw: Partial<TFoo>): TFoo {
        if (raw === undefined || raw === null || raw instanceof this) { return raw as TFoo; }
        return new this(
            raw.id,
            raw.name,
            raw.isActive,
            raw.optional,
        );
    }

    public constructor(
        public id: number,
        public name: string,
        public isActive: boolean,
        public optional?: string,
    ) { }
}

export class Bar {

    public static create<TBar extends Bar = Bar>(this: Class<TBar>, raw: Partial<TBar>): TBar {
        if (raw === undefined || raw === null || raw instanceof this) { return raw as TBar; }
        return new this(
            raw.id,
            raw.boolProp,
            raw.strProp,
            raw.optionalProp,
        );
    }

    public constructor(
        public id: number,
        public boolProp: boolean,
        public strProp: string,
        public optionalProp?: number,
    ) { }
}

export class BaseOne {

    public static create<TBaseOne extends BaseOne = BaseOne>(this: Class<TBaseOne>, raw: Partial<TBaseOne>): TBaseOne {
        if (raw === undefined || raw === null || raw instanceof this) { return raw as TBaseOne; }
        return new this(
            raw.name,
        );
    }

    public constructor(
        public name: string,
    ) { }
}

@odataEndpoint(Endpoints.Children)
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class Child extends BaseOne {

    public static create<TChild extends Child = Child>(this: Class<TChild>, raw: Partial<TChild>): TChild {
        if (raw === undefined || raw === null || raw instanceof this) { return raw as TChild; }
        return new this(
            raw.id,
            raw.name,
            raw.strProp,
            raw.optionalProp,
        );
    }

    public constructor(
        public id: number,
        public name: string,
        public strProp: string,
        public optionalProp?: number,
    ) {
        super(
            name,
        );
    }
}

export enum $$ComplexType1Types {
    ChildComplexType = 'ChildComplexType',
}

export class ComplexType1 {

    protected static get derivedTypes(): typeof ComplexType1[] {
        return [
            ChildComplexType,
        ];
    }

    public static create(raw: Partial<ComplexType1>): ComplexType1 {
        if (raw === undefined || raw === null || raw instanceof this) { return raw as ComplexType1; }
        const edmType = raw[odataTypeKey];
        const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
        if (!ctor) {
            return raw as ComplexType1;
        }
        const result = new ctor();
        result.initialize(raw);
        return result;
    }

    protected static canHandle(_odataType: string): boolean { return false; }

    public prop11: number;
    public prop12: string;
    public readonly $$type: $$ComplexType1Types;

    protected initialize(raw: Partial<ComplexType1>) {
        this.prop11 = raw.prop11;
        this.prop12 = raw.prop12;
    }
}

export interface ComplexType2 {
    prop21: number;
    prop22: string;
    prop23: boolean;
}

@odataType('#Awesome.Possum.ChildComplexType', $$ComplexType1Types.ChildComplexType, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class ChildComplexType extends ComplexType1 {

    public prop31: number;
    public prop32: string;
    public prop33: boolean;

    protected initialize(raw: Partial<ChildComplexType>) {
        super.initialize(raw);
        this.prop31 = raw.prop31;
        this.prop32 = raw.prop32;
        this.prop33 = raw.prop33;
    }
}

export enum EnumOne {
    member11 = 'member11',
    member12 = 'member12',
}

export enum EnumTwo {
    member21 = 'member21',
    member22 = 'member22',
}
`        );
      } finally {
        Configuration.dispose();
        mockFs.restore();
      }
    });
  });

});
