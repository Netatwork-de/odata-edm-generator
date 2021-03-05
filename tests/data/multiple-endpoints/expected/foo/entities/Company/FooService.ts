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
