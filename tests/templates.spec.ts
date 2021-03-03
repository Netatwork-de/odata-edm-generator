import { assert } from 'chai';
import mockFs from 'mock-fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { Configuration } from '../src/cli/configuration';
import { ClassInfo, EdmInfo, EnumInfo, InterfaceInfo, PropertyInfo } from '../src/cli/shared';
import { EdmTemplate, EndpointTemplate } from '../src/cli/templates';
import { standardEndpoints } from './data';
describe('templates', function () {

  describe('EndpointTemplate', function () {

    it('Renders correctly', function () {
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
    });

    it('Respects the given template', function () {
      const template = 'export const enum Endpoints {<% for(const endpoint of it.endpoints) { %> <%= endpoint.name %> = "<%= endpoint.url %>",<% } %>}'
      const actual = new EndpointTemplate(template).render(standardEndpoints);
      assert.strictEqual(actual, 'export const enum Endpoints { People = "People", Foos = "Foos", Bar = "fizzbazz",}');
    });

  });

  describe('EdmTemplate', function () {
    it('Renders correctly', function () {
      try {
        const basePath = join(process.cwd(), uuid());
        mockFs({ [basePath]: {} }, { createCwd: true });
        Configuration.createFromCLIArgs(['--outputDir', basePath]);

        const base1 = new ClassInfo(
          'BaseOne',
          [
            new PropertyInfo('name', 'string', false, false),
          ],
        );
        const interface1 = new InterfaceInfo(
          'ComplexType1',
          [
            new PropertyInfo('prop11', 'number', false, false),
            new PropertyInfo('prop12', 'string', false, false),
          ]
        );
        const info = new EdmInfo(
          'Awesome.Possum',
          [],
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
            new InterfaceInfo(
              'ComplexType2',
              [
                new PropertyInfo('prop21', 'number', false, false),
                new PropertyInfo('prop22', 'string', false, false),
                new PropertyInfo('prop23', 'boolean', false, false),
              ]
            ),
            new InterfaceInfo(
              'ChildComplexType',
              [
                new PropertyInfo('prop31', 'number', false, false),
                new PropertyInfo('prop32', 'string', false, false),
                new PropertyInfo('prop33', 'boolean', false, false),
              ],
              interface1.name,
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
} from "@netatwork/odata-edm-generator";
import {
    Endpoints,
} from "../../Endpoints";

@odataEndpoint(Endpoints.foos)
export class Foo {

    public static create<TFoo extends Foo = Foo>(this: Class<TFoo>, model: Partial<TFoo>): TFoo {
        return new this(
            model.id,
            model.name,
            model.isActive,
            model.optional,
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

    public static create<TBar extends Bar = Bar>(this: Class<TBar>, model: Partial<TBar>): TBar {
        return new this(
            model.id,
            model.boolProp,
            model.strProp,
            model.optionalProp,
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

    public static create<TBaseOne extends BaseOne = BaseOne>(this: Class<TBaseOne>, model: Partial<TBaseOne>): TBaseOne {
        return new this(
            model.name,
        );
    }

    public constructor(
        public name: string,
    ) { }
}

@odataEndpoint(Endpoints.Children)
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class Child extends BaseOne {

    public static create<TChild extends Child = Child>(this: Class<TChild>, model: Partial<TChild>): TChild {
        return new this(
            model.id,
            model.name,
            model.strProp,
            model.optionalProp,
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

export interface ComplexType1 {
    prop11: number;
    prop12: string;
}

export interface ComplexType2 {
    prop21: number;
    prop22: string;
    prop23: boolean;
}

export interface ChildComplexType extends ComplexType1 {
    prop31: number;
    prop32: string;
    prop33: boolean;
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
