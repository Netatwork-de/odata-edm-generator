import { assert } from 'chai';
import mockFs from 'mock-fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { Configuration } from '../dist/cli/configuration.js';
import { ClassInfo, EdmInfo, EnumInfo, ComplexTypeInfo, PropertyInfo, ComplexTypeInfoSet } from '../dist/cli/shared.js';
import { EdmTemplate, EndpointTemplate } from '../dist/cli/templates.js';
import { standardEndpoints } from './data.js';
describe('templates', function () {

  describe('EndpointTemplate', function () {

    it('Renders correctly', async function () {
      try {
        await Configuration.createFromCLIArgs(['--quoteStyle', 'single']);
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

    it('Respects the given template', async function () {
      try {
        await Configuration.createFromCLIArgs(['--quoteStyle', 'single']);
        const template = 'export const enum Endpoints {<% for(const endpoint of it.endpoints) { %> <%= endpoint.name %> = "<%= endpoint.url %>",<% } %>}';
        const actual = new EndpointTemplate(template).render(standardEndpoints);
        assert.strictEqual(actual, 'export const enum Endpoints { People = "People", Foos = "Foos", Bar = "fizzbazz",}');
      } finally {
        Configuration.dispose();
      }
    });

  });

  describe('EdmTemplate', function () {
    it('Renders correctly', async function () {
      try {
        const basePath = join(process.cwd(), uuid());
        mockFs({ [basePath]: {} }, { createCwd: true });
        const config = await Configuration.createFromCLIArgs(['--outputDir', basePath, '--endpoint', 'https://api.example.com']);

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
          new ComplexTypeInfoSet(
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
          ),
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
    ODataRawType,
    createModel,
} from '@netatwork/odata-edm-generator';
import {
    Endpoints,
} from '../../Endpoints.js';

@odataEndpoint(Endpoints.foos)
export class Foo {

    public static create<TFoo extends Foo = Foo>(this: Class<TFoo>, raw: TFoo): TFoo {
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

    public static create<TBar extends Bar = Bar>(this: Class<TBar>, raw: TBar): TBar {
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

    public static create<TBaseOne extends BaseOne = BaseOne>(this: Class<TBaseOne>, raw: TBaseOne): TBaseOne {
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

    public static create<TChild extends Child = Child>(this: Class<TChild>, raw: TChild): TChild {
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

export interface ComplexType1 {
    readonly $$type?: $$ComplexType1Types;
}

export class ComplexType1 {

    protected static get derivedTypes(): typeof ComplexType1[] {
        return [
            ChildComplexType,
        ] as unknown as typeof ComplexType1[];
    }

    public static create<TComplexType1 extends ComplexType1 = ComplexType1>(raw: TComplexType1): TComplexType1 {
        const edmType = (raw as ODataRawType<TComplexType1>)[odataTypeKey];
        const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
        if (!ctor) {
            return raw;
        }
        return ctor.create(raw);
    }

    protected static canHandle(_odataType: string): boolean { return false; }

    public constructor(
        public prop11: number,
        public prop12: string,
    ) { }
}

export interface ComplexType2 {
    prop21: number;
    prop22: string;
    prop23: boolean;
}

@odataType('#Awesome.Possum.ChildComplexType', $$ComplexType1Types.ChildComplexType, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class ChildComplexType extends ComplexType1 {

    public constructor(
        public prop11: number,
        public prop12: string,
        public prop31: number,
        public prop32: string,
        public prop33: boolean,
    ) {
        super(
            prop11,
            prop12,
        );
    }

    public static create<TChildComplexType extends ChildComplexType = ChildComplexType>(raw: TChildComplexType): TChildComplexType {
        return new this(
            raw.prop11,
            raw.prop12,
            raw.prop31,
            raw.prop32,
            raw.prop33,
        ) as TChildComplexType;
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
