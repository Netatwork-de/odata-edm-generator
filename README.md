# @netatwork/odata-edm-generator

[![npm version](https://img.shields.io/npm/v/@netatwork/odata-edm-generator)](https://www.npmjs.com/package/@netatwork/odata-edm-generator)
[![npm download](https://img.shields.io/npm/dt/@netatwork/odata-edm-generator?label=npm%20download)](https://www.npmjs.com/package/@netatwork/odata-edm-generator)
![build status](https://github.com/Netatwork-de/odata-edm-generator/workflows/build/badge.svg)

This is a CLI-utility to generate OData EDM and endpoints in TypeScript.

## Install

```shell
npm i -D @netatwork/odata-edm-generator
```

## Usage

```shell
# Inline CLI arguments can be used
gen-edm --endpoint https://api.example.com --outputDir out

# A configuration file can be used
gen-edm --config edm-gen.config.js

# Configuration file options can be overridden with inline arguments
gen-edm --config edm-gen.config.js --outputDir out
```

Check the [examples](#examples) for the generated output.

## Options

```shell
Options:
  --config       The path to the config file.
  --outputDir    The base output directory to write the generated files.
  --endpoint     The OData endpoint. '{endpoint}' is used to get the list of endpoints, and '{endpoint}/$metadata' is used to get the EDM.
  --quoteStyle   Single or double quote to use; Allowed values are 'single', and 'double'.
  --indentSize   Number of spaces to use for indentation.
```

### `--endpoint`

The OData endpoint for which the code needs to be generated.

**Example:**

```shell
gen-edm --endpoint https://example.com/api/foo --outputDir src/foo
```

> Note that it cannot be combined with `endpoints`

### `--outputDir`

The base output directory.
The generator writes the generated files in this directory.
When a relative path is used, it is resolved with the current process working directory (`process.cwd()`).

**Example:**

```shell
gen-edm --endpoint https://example.com/api/foo --outputDir src/foo
```

### `--quoteStyle`

Whether to use single or double quote in the generated files.
Allowed values are `single` (default), and `double`.

**Example:**

```shell
gen-edm --endpoint https://example.com/api/foo --outputDir src/foo --quoteStyle double
```

### `--indentSize`

The generated files are indented with space.
The indentSize can be configured by passing a numeric value for this argument.
The default value is 4.

**Example:**

```shell
gen-edm --endpoint https://example.com/api/foo --outputDir src/foo --indentSize 2
```

### `--config`

The path to the configuration (JS) file.
The file should export a single object that conforms the generator schema.
Below is an example of the file.

```js
module.exports = {
  // base output directory
  outputDir: 'src/generated/',

  // generate code for multiple OData endpoints
  endpoints: [
    {
      url: 'https://example.com/api/foo',
      outputDir: 'intranet-role',
    },
    {
      url: 'https://example.com/api/bar',
      outputDir: 'account-management',
    },
  ],

  quoteStyle: 'double',

  indentSize: 4,
}
```

The individual configuration options are same as already described above.
Only difference is the `endpoints` property.
This array of object can be used to generate EDM for multiple endpoints.
The `outputDir` specified for each endpoint is resolved with the root-level `outputDir`.

> Note that when the `--config` argument is used, it needs to be the first CLI argument.

**Example:**

```shell
gen-edm --config edm-gen.config.js
```

## Example

This sections shows an elaborate example of the generated code.
For more examples check the [tests](https://github.com/Netatwork-de/odata-edm-generator/tree/main/tests/data).

### Input

<details>
<summary> Endpoints </summary>

```json
{
  "@odata.context": "https://example.com/odata/v4/$metadata",
  "value": [
    {
      "name": "Foos",
      "kind": "EntitySet",
      "url": "Foos"
    },
    {
      "name": "Children",
      "kind": "Singleton",
      "url": "Children"
    },
    {
      "name": "Fizz",
      "kind": "EntitySet",
      "url": "FizzBazz"
    }
  ]
}
```
</details>

<details>
<summary> Metadata </summary>

```xml
<edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
  <edmx:DataServices>
    <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="Company.FooService">
      <EntityType Name="ChildTwo" BaseType="Company.Service.Base">
        <Key>
          <PropertyRef Name="Id" />
        </Key>
        <Property Name="ChildProp11" Type="Edm.Int64" />
        <Property Name="ChildProp12" Type="Edm.SByte" Nullable="false" />
        <Property Name="ChildProp13" Type="Edm.TimeOfDay" Nullable="false" />
        <Property Name="Id" Type="Edm.Int32" Nullable="false" />
      </EntityType>
      <EntityType Name="GrandChild" BaseType="Company.Service.ChildOne">
        <Key>
          <PropertyRef Name="Id" />
        </Key>
        <Property Name="GrandChildProp11" Type="Edm.Int64" />
        <Property Name="GrandChildProp12" Type="Edm.SByte" Nullable="false" />
        <Property Name="GrandChildProp13" Type="Edm.TimeOfDay" Nullable="false" />
        <Property Name="Id" Type="Edm.Int32" Nullable="false" />
      </EntityType>
      <EntityType Name="Foo">
        <Key>
          <PropertyRef Name="Id" />
        </Key>
        <Property Name="StrProp" Type="Edm.String" />
        <Property Name="DateStrProp" Type="Edm.DateTimeOffset" Nullable="false" />
        <Property Name="ByteProp" Type="Edm.Byte" Nullable="false" />
        <Property Name="Id" Type="Edm.Int32" Nullable="false" />
      </EntityType>
      <EntityType Name="Bar">
        <Key>
          <PropertyRef Name="Id" />
        </Key>
        <Property Name="Prop11" Type="Edm.String" />
        <Property Name="Prop12" Type="Edm.DateTime" Nullable="false" />
        <Property Name="Prop13" Type="Edm.Decimal" Nullable="false" />
        <Property Name="Prop14" Type="Edm.Double" />
        <Property Name="Id" Type="Edm.Int32" Nullable="false" />
      </EntityType>
      <EntityType Name="Base">
        <Property Name="BaseProp11" Type="Edm.Duration" />
        <Property Name="BaseProp12" Type="Edm.Float" Nullable="false" />
        <Property Name="BaseProp13" Type="Edm.Guid" Nullable="false" />
        <Property Name="BaseProp14" Type="Edm.Int16" />
      </EntityType>
      <EntityType Name="ChildOne" BaseType="Company.Service.Base">
        <Key>
          <PropertyRef Name="ChildId" />
        </Key>
        <Property Name="ChildProp11" Type="Edm.Int64" />
        <Property Name="ChildProp12" Type="Edm.SByte" Nullable="false" />
        <Property Name="ChildProp13" Type="Edm.TimeOfDay" Nullable="false" />
        <Property Name="ChildId" Type="Edm.Int32" Nullable="false" />
        <NavigationProperty Name="Condition" Type="Company.Service.StandardCondition" />
      </EntityType>
      <EntityType Name="Bazz">
        <Key>
          <PropertyRef Name="Id" />
        </Key>
        <Property Name="BazzProp1" Type="Edm.String" />
        <Property Name="BazzProp2" Type="Edm.Byte" Nullable="false" />
        <Property Name="Id" Type="Edm.Int32" Nullable="false" />
        <Property Name="BarId" Type="Edm.Int32" />
        <NavigationProperty Name="Cp" Type="Company.Service.Interface2" />
        <NavigationProperty Name="Foos" Type="Collection(Company.Service.Foo)" />
        <NavigationProperty Name="Bar" Type="Company.Service.Bar">
          <ReferentialConstraint Property="BarId" ReferencedProperty="Id" />
        </NavigationProperty>
      </EntityType>
      <ComplexType Name="Interface1">
        <Property Name="I1P1" Type="Edm.String" Nullable="false" />
        <Property Name="I1P2" Type="Edm.Int32" />
      </ComplexType>
      <ComplexType Name="Interface2">
        <Property Name="I2P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="I2P2" Type="Edm.Guid" />
      </ComplexType>
      <ComplexType Name="BaseConfiguration">
        <Property Name="BC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="BC1P2" Type="Edm.String" />
      </ComplexType>
      <ComplexType Name="FooConfiguration" BaseType="Company.Service.BaseConfiguration">
        <Property Name="FC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="FC1P2" Type="Company.Service.Enum1" />
      </ComplexType>
      <ComplexType Name="BarConfiguration" BaseType="Company.Service.BaseConfiguration">
        <Property Name="CBC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="CBC1P2" Type="Company.Service.Interface1" />
      </ComplexType>
      <ComplexType Name="StandardCondition" Abstract="true">
        <Property Name="BC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="BC1P2" Type="Edm.String" />
      </ComplexType>
      <ComplexType Name="FooCondition" BaseType="Company.Service.StandardCondition">
        <Property Name="FC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="FC1P2" Type="Company.Service.Enum1" />
      </ComplexType>
      <ComplexType Name="BarCondition" BaseType="Company.Service.StandardCondition">
        <Property Name="CBC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="CBC1P2" Type="Company.Service.Interface1" />
      </ComplexType>
      <ComplexType Name="FizzCondition" BaseType="Company.Service.StandardCondition">
        <Property Name="FC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="FC1P2" Type="Company.Service.Interface1" />
        <Property Name="FC1P3" Type="Company.Service.BaseConfiguration" />
      </ComplexType>
      <ComplexType Name="DummyType" Abstract="true">
        <Property Name="Dummy_Do_Not_Use" Type="Edm.String"/>
      </ComplexType>
      <ComplexType Name="BranchOneCondition" BaseType="Company.Service.DummyType" Abstract="true">
        <Property Name="B1C1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="B1C1P2" Type="Edm.String" />
      </ComplexType>
      <ComplexType Name="B1FooCondition" BaseType="Company.Service.BranchOneCondition">
        <Property Name="FC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="FC1P2" Type="Company.Service.Enum1" />
      </ComplexType>
      <ComplexType Name="B1BarCondition" BaseType="Company.Service.BranchOneCondition">
        <Property Name="CBC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="CBC1P2" Type="Company.Service.Interface1" />
      </ComplexType>
      <ComplexType Name="B1FizzCondition" BaseType="Company.Service.BranchOneCondition">
        <Property Name="FC1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="FC1P2" Type="Company.Service.Interface1" />
      </ComplexType>
      <ComplexType Name="BranchTwoCondition" BaseType="Company.Service.DummyType">
        <Property Name="B2C1P1" Type="Edm.Int32" Nullable="false" />
        <Property Name="B2C1P2" Type="Edm.String" />
      </ComplexType>
      <EnumType Name="Enum1">
        <Member Name="Member1" Value="0" />
        <Member Name="Member2" Value="1" />
        <Member Name="Member3" Value="2" />
      </EnumType>
      <EntitySet Name="Foos" EntityType="Company.Service.Foo" />
      <EntitySet Name="Fizz" EntityType="Company.Service.Bazz" />
      <Singleton Name="Children" Type="Company.Service.ChildOne" />
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>
```
</details>

### Output

<details>
<summary>out/Endpoints.ts</summary>

```ts
/**
 * This is a generated file. Please don't change this manually.
 */
export const enum Endpoints {
  Foos = 'Foos',
  Children = 'Children',
  Fizz = 'FizzBazz',
}
```
</details>

<details>
<summary>out/entities/Company/FooService.ts</summary>

```ts
/**
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

export class Base {

  public static create<TBase extends Base = Base>(this: Class<TBase>, raw: Partial<TBase>): TBase {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as TBase; }
    return new this(
      raw.BaseProp12,
      raw.BaseProp13,
      raw.BaseProp11,
      raw.BaseProp14,
    );
  }

  public constructor(
    public BaseProp12: number,
    public BaseProp13: string,
    public BaseProp11?: string,
    public BaseProp14?: number,
  ) { }
}

@odataEndpoint(Endpoints.Fizz)
export class Bazz {

  public static create<TBazz extends Bazz = Bazz>(this: Class<TBazz>, raw: Partial<TBazz>): TBazz {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as TBazz; }
    return new this(
      raw.Id,
      raw.BazzProp2,
      Bar.create(raw.Bar),
      raw.BarId,
      raw.BazzProp1,
      raw.Cp,
      raw.Foos,
    );
  }

  public constructor(
    public Id: number,
    public BazzProp2: number,
    public Bar?: Bar,
    public BarId?: number,
    public BazzProp1?: string,
    public Cp?: Interface2,
    public Foos?: Foo[],
  ) { }
}

@odataEndpoint(Endpoints.Foos)
export class Foo {

  public static create<TFoo extends Foo = Foo>(this: Class<TFoo>, raw: Partial<TFoo>): TFoo {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as TFoo; }
    return new this(
      raw.Id,
      raw.ByteProp,
      raw.DateStrProp,
      raw.StrProp,
    );
  }

  public constructor(
    public Id: number,
    public ByteProp: number,
    public DateStrProp: string,
    public StrProp?: string,
  ) { }
}

export class Bar {

  public static create<TBar extends Bar = Bar>(this: Class<TBar>, raw: Partial<TBar>): TBar {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as TBar; }
    return new this(
      raw.Id,
      raw.Prop12,
      raw.Prop13,
      raw.Prop11,
      raw.Prop14,
    );
  }

  public constructor(
    public Id: number,
    public Prop12: string,
    public Prop13: number,
    public Prop11?: string,
    public Prop14?: number,
  ) { }
}

@odataEndpoint(Endpoints.Children)
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class ChildOne extends Base {

  public static create<TChildOne extends ChildOne = ChildOne>(this: Class<TChildOne>, raw: Partial<TChildOne>): TChildOne {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as TChildOne; }
    return new this(
      raw.ChildId,
      raw.BaseProp12,
      raw.BaseProp13,
      raw.ChildProp12,
      raw.ChildProp13,
      raw.BaseProp11,
      raw.BaseProp14,
      raw.ChildProp11,
      StandardCondition.create(raw.Condition),
    );
  }

  public constructor(
    public ChildId: number,
    public BaseProp12: number,
    public BaseProp13: string,
    public ChildProp12: number,
    public ChildProp13: string,
    public BaseProp11?: string,
    public BaseProp14?: number,
    public ChildProp11?: number,
    public Condition?: StandardCondition,
  ) {
    super(
      BaseProp12,
      BaseProp13,
      BaseProp11,
      BaseProp14,
    );
  }
}

// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class ChildTwo extends Base {

  public static create<TChildTwo extends ChildTwo = ChildTwo>(this: Class<TChildTwo>, raw: Partial<TChildTwo>): TChildTwo {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as TChildTwo; }
    return new this(
      raw.Id,
      raw.BaseProp12,
      raw.BaseProp13,
      raw.ChildProp12,
      raw.ChildProp13,
      raw.BaseProp11,
      raw.BaseProp14,
      raw.ChildProp11,
    );
  }

  public constructor(
    public Id: number,
    public BaseProp12: number,
    public BaseProp13: string,
    public ChildProp12: number,
    public ChildProp13: string,
    public BaseProp11?: string,
    public BaseProp14?: number,
    public ChildProp11?: number,
  ) {
    super(
      BaseProp12,
      BaseProp13,
      BaseProp11,
      BaseProp14,
    );
  }
}

// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class GrandChild extends ChildOne {

  public static create<TGrandChild extends GrandChild = GrandChild>(this: Class<TGrandChild>, raw: Partial<TGrandChild>): TGrandChild {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as TGrandChild; }
    return new this(
      raw.ChildId,
      raw.Id,
      raw.BaseProp12,
      raw.BaseProp13,
      raw.ChildProp12,
      raw.ChildProp13,
      raw.GrandChildProp12,
      raw.GrandChildProp13,
      raw.BaseProp11,
      raw.BaseProp14,
      raw.ChildProp11,
      StandardCondition.create(raw.Condition),
      raw.GrandChildProp11,
    );
  }

  public constructor(
    public ChildId: number,
    public Id: number,
    public BaseProp12: number,
    public BaseProp13: string,
    public ChildProp12: number,
    public ChildProp13: string,
    public GrandChildProp12: number,
    public GrandChildProp13: string,
    public BaseProp11?: string,
    public BaseProp14?: number,
    public ChildProp11?: number,
    public Condition?: StandardCondition,
    public GrandChildProp11?: number,
  ) {
    super(
      ChildId,
      BaseProp12,
      BaseProp13,
      ChildProp12,
      ChildProp13,
      BaseProp11,
      BaseProp14,
      ChildProp11,
      Condition,
    );
  }
}

export enum $$BaseConfigurationTypes {
  BarConfiguration = 'BarConfiguration',
  FooConfiguration = 'FooConfiguration',
}

export class BaseConfiguration {

  protected static get derivedTypes(): typeof BaseConfiguration[] {
    return [
      BarConfiguration,
      FooConfiguration,
    ];
  }

  public static create(raw: Partial<BaseConfiguration>): BaseConfiguration {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as BaseConfiguration; }
    const edmType = raw[odataTypeKey];
    const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
    if (!ctor) {
      return raw as BaseConfiguration;
    }
    const result = new ctor();
    result.initialize(raw);
    return result;
  }

  protected static canHandle(_odataType: string): boolean { return false; }

  public BC1P1: number;
  public BC1P2?: string;
  public readonly $$type: $$BaseConfigurationTypes;

  protected initialize(raw: Partial<BaseConfiguration>) {
    this.BC1P1 = raw.BC1P1;
    this.BC1P2 = raw.BC1P2;
  }
}

export enum $$DummyTypeTypes {
  B1BarCondition = 'B1BarCondition',
  B1FizzCondition = 'B1FizzCondition',
  B1FooCondition = 'B1FooCondition',
  BranchTwoCondition = 'BranchTwoCondition',
}

export class DummyType {

  protected static get derivedTypes(): typeof DummyType[] {
    return [
      B1BarCondition,
      B1FizzCondition,
      B1FooCondition,
      BranchTwoCondition,
    ];
  }

  public static create(raw: Partial<DummyType>): DummyType {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as DummyType; }
    const edmType = raw[odataTypeKey];
    const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
    if (!ctor) {
      return raw as DummyType;
    }
    const result = new ctor();
    result.initialize(raw);
    return result;
  }

  protected static canHandle(_odataType: string): boolean { return false; }

  public Dummy_Do_Not_Use?: string;
  public readonly $$type: $$DummyTypeTypes;

  protected initialize(raw: Partial<DummyType>) {
    this.Dummy_Do_Not_Use = raw.Dummy_Do_Not_Use;
  }
}

export interface Interface1 {
  I1P1: string;
  I1P2?: number;
}

export interface Interface2 {
  I2P1: number;
  I2P2?: string;
}

export class BranchOneCondition extends DummyType {

  public B1C1P1: number;
  public B1C1P2?: string;

  protected initialize(raw: Partial<BranchOneCondition>) {
    super.initialize(raw);
    this.B1C1P1 = raw.B1C1P1;
    this.B1C1P2 = raw.B1C1P2;
  }
}

@odataType('#Company.FooService.B1BarCondition', $$DummyTypeTypes.B1BarCondition, '$$type')
export class B1BarCondition extends BranchOneCondition {

  public CBC1P1: number;
  public CBC1P2?: Interface1;

  protected initialize(raw: Partial<B1BarCondition>) {
    super.initialize(raw);
    this.CBC1P1 = raw.CBC1P1;
    this.CBC1P2 = raw.CBC1P2;
  }
}

@odataType('#Company.FooService.B1FizzCondition', $$DummyTypeTypes.B1FizzCondition, '$$type')
export class B1FizzCondition extends BranchOneCondition {

  public FC1P1: number;
  public FC1P2?: Interface1;

  protected initialize(raw: Partial<B1FizzCondition>) {
    super.initialize(raw);
    this.FC1P1 = raw.FC1P1;
    this.FC1P2 = raw.FC1P2;
  }
}

@odataType('#Company.FooService.B1FooCondition', $$DummyTypeTypes.B1FooCondition, '$$type')
export class B1FooCondition extends BranchOneCondition {

  public FC1P1: number;
  public FC1P2?: Enum1;

  protected initialize(raw: Partial<B1FooCondition>) {
    super.initialize(raw);
    this.FC1P1 = raw.FC1P1;
    this.FC1P2 = raw.FC1P2;
  }
}

export enum $$StandardConditionTypes {
  BarCondition = 'BarCondition',
  FizzCondition = 'FizzCondition',
  FooCondition = 'FooCondition',
}

export class StandardCondition {

  protected static get derivedTypes(): typeof StandardCondition[] {
    return [
      BarCondition,
      FizzCondition,
      FooCondition,
    ];
  }

  public static create(raw: Partial<StandardCondition>): StandardCondition {
    if (raw === undefined || raw === null || raw instanceof this) { return raw as StandardCondition; }
    const edmType = raw[odataTypeKey];
    const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
    if (!ctor) {
      return raw as StandardCondition;
    }
    const result = new ctor();
    result.initialize(raw);
    return result;
  }

  protected static canHandle(_odataType: string): boolean { return false; }

  public BC1P1: number;
  public BC1P2?: string;
  public readonly $$type: $$StandardConditionTypes;

  protected initialize(raw: Partial<StandardCondition>) {
    this.BC1P1 = raw.BC1P1;
    this.BC1P2 = raw.BC1P2;
  }
}

@odataType('#Company.FooService.BarCondition', $$StandardConditionTypes.BarCondition, '$$type')
export class BarCondition extends StandardCondition {

  public CBC1P1: number;
  public CBC1P2?: Interface1;

  protected initialize(raw: Partial<BarCondition>) {
    super.initialize(raw);
    this.CBC1P1 = raw.CBC1P1;
    this.CBC1P2 = raw.CBC1P2;
  }
}

@odataType('#Company.FooService.BarConfiguration', $$BaseConfigurationTypes.BarConfiguration, '$$type')
export class BarConfiguration extends BaseConfiguration {

  public CBC1P1: number;
  public CBC1P2?: Interface1;

  protected initialize(raw: Partial<BarConfiguration>) {
    super.initialize(raw);
    this.CBC1P1 = raw.CBC1P1;
    this.CBC1P2 = raw.CBC1P2;
  }
}

@odataType('#Company.FooService.BranchTwoCondition', $$DummyTypeTypes.BranchTwoCondition, '$$type')
export class BranchTwoCondition extends DummyType {

  public B2C1P1: number;
  public B2C1P2?: string;

  protected initialize(raw: Partial<BranchTwoCondition>) {
    super.initialize(raw);
    this.B2C1P1 = raw.B2C1P1;
    this.B2C1P2 = raw.B2C1P2;
  }
}

@odataType('#Company.FooService.FizzCondition', $$StandardConditionTypes.FizzCondition, '$$type')
export class FizzCondition extends StandardCondition {

  public FC1P1: number;
  public FC1P2?: Interface1;
  public FC1P3?: BaseConfiguration;

  protected initialize(raw: Partial<FizzCondition>) {
    super.initialize(raw);
    this.FC1P1 = raw.FC1P1;
    this.FC1P2 = raw.FC1P2;
    this.FC1P3 = BaseConfiguration.create(raw.FC1P3);
  }
}

@odataType('#Company.FooService.FooCondition', $$StandardConditionTypes.FooCondition, '$$type')
export class FooCondition extends StandardCondition {

  public FC1P1: number;
  public FC1P2?: Enum1;

  protected initialize(raw: Partial<FooCondition>) {
    super.initialize(raw);
    this.FC1P1 = raw.FC1P1;
    this.FC1P2 = raw.FC1P2;
  }
}

@odataType('#Company.FooService.FooConfiguration', $$BaseConfigurationTypes.FooConfiguration, '$$type')
export class FooConfiguration extends BaseConfiguration {

  public FC1P1: number;
  public FC1P2?: Enum1;

  protected initialize(raw: Partial<FooConfiguration>) {
    super.initialize(raw);
    this.FC1P1 = raw.FC1P1;
    this.FC1P2 = raw.FC1P2;
  }
}

export enum Enum1 {
  Member1 = 'Member1',
  Member2 = 'Member2',
  Member3 = 'Member3',
}
```
</details>

## Decorators

If you have seen the generated example above, you can see the decorators: `@odataEndpoint`, and `@odataType`.

### `@odataEndpoint`

It defines a static property on the class named `ODataEndpoint` that associate the entity endpoint with the class.
This is useful when you want to retrieve the entity endpoint inside your generic HTTP pipeline (service class).

**Example:**

```ts
@odataEndpoint(Endpoints.People)
public class Person {
  //...
}
```

### `@odataType`

This is another utility decorator that maps the raw OData type with the generated class.
Additionally it also add a friendly enum type to the class.
The value of the enum can be used conveniently instead of checking the raw odata type or using the `instanceof` operator (motivation: `instanceof` is slower than equality check).

This is particularly useful when dealing with hierarchical complex types.
Because as the raw OData datatype gets associated, any serialized JSON of an instance of the generated class contains the OData type annotation, which helps the server to deserialize the data correctly.

**Example:**

```ts
export enum $$StandardConditionTypes {
  BarCondition = 'BarCondition',
  FizzCondition = 'FizzCondition',
  FooCondition = 'FooCondition',
}

export class StandardCondition {
  // omitted for brevity; refer example above.
}

@odataType('#Company.FooService.BarCondition', $$StandardConditionTypes.BarCondition, '$$type')
export class BarCondition extends StandardCondition {
  public readonly $$type: $$StandardConditionTypes;
  // omitted for brevity; refer example above.
}

@odataType('#Company.FooService.FizzCondition', $$StandardConditionTypes.FizzCondition, '$$type')
export class FizzCondition extends StandardCondition {
  // omitted for brevity; refer example above.
}


@odataType('#Company.FooService.FooCondition', $$StandardConditionTypes.FooCondition, '$$type')
export class FooCondition extends StandardCondition {
  // omitted for brevity; refer example above.
}

//-------------
assert(new FooCondition().$$type === $$StandardConditionTypes.FooCondition);
assert(new BarCondition().$$type === $$StandardConditionTypes.BarCondition);
JSON.stringify(new FooCondition()); // {"@odata.type": "#Company.FooService.FooCondition", ... }
JSON.stringify(new BarCondition()); // {"@odata.type": "#Company.FooService.BarCondition", ... }
```

## TODO:

- [ ] Support custom templates: endpoints, edm, entity, complex type, enum
- [ ] Configuration option to skip endpoint association for entity
- [ ] Configuration option to skip type association for complex type
- [ ] Configuration option for having the real values for the enum types; i.e. non-string enum
- [ ] Configuration option to customize headers
- [ ] Configuration option to customize imports
- [ ] Configuration options to customize the type map
- [ ] Support endpoint-specific overrides
- [ ] Support multiple schemas
- [ ] Support odata actions and functions