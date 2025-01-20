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
} from '../../Endpoints.js';

export class Base {

  public static create<TBase extends Base | undefined | null = Base>(this: Class<TBase>, raw: TBase): TBase {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
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

  public static create<TBazz extends Bazz | undefined | null = Bazz>(this: Class<TBazz>, raw: TBazz): TBazz {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
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

  public static create<TFoo extends Foo | undefined | null = Foo>(this: Class<TFoo>, raw: TFoo): TFoo {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
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

  public static create<TBar extends Bar | undefined | null = Bar>(this: Class<TBar>, raw: TBar): TBar {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
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

  public static create<TChildOne extends ChildOne | undefined | null = ChildOne>(this: Class<TChildOne>, raw: TChildOne): TChildOne {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
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

  public static create<TChildTwo extends ChildTwo | undefined | null = ChildTwo>(this: Class<TChildTwo>, raw: TChildTwo): TChildTwo {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
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

  public static create<TGrandChild extends GrandChild | undefined | null = GrandChild>(this: Class<TGrandChild>, raw: TGrandChild): TGrandChild {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
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

export interface BaseConfiguration {
  readonly $$type: $$BaseConfigurationTypes;
}

export class BaseConfiguration {

  protected static get derivedTypes(): typeof BaseConfiguration[] {
    return [
      BarConfiguration,
      FooConfiguration,
    ] as unknown as typeof BaseConfiguration[];
  }

  public static create<TBaseConfiguration extends BaseConfiguration | undefined | null = BaseConfiguration>(raw: TBaseConfiguration): TBaseConfiguration {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
    const edmType = raw[odataTypeKey];
    const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
    if (!ctor) {
      return raw;
    }
    return ctor.create(raw);
  }

  protected static canHandle(_odataType: string): boolean { return false; }

  public constructor(
    public BC1P1: number,
    public BC1P2?: string,
  ) { }
}

export enum $$DummyTypeTypes {
  B1BarCondition = 'B1BarCondition',
  B1FizzCondition = 'B1FizzCondition',
  B1FooCondition = 'B1FooCondition',
  BranchTwoCondition = 'BranchTwoCondition',
}

export interface DummyType {
  readonly $$type: $$DummyTypeTypes;
}

export abstract class DummyType {

  protected static get derivedTypes(): typeof DummyType[] {
    return [
      B1BarCondition,
      B1FizzCondition,
      B1FooCondition,
      BranchTwoCondition,
    ] as unknown as typeof DummyType[];
  }

  public static create<TDummyType extends DummyType | undefined | null = DummyType>(raw: TDummyType): TDummyType {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
    const edmType = raw[odataTypeKey];
    const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
    if (!ctor) {
      return raw;
    }
    return ctor.create(raw);
  }

  protected static canHandle(_odataType: string): boolean { return false; }

  protected constructor(
    public Dummy_Do_Not_Use?: string,
  ) { }
}

export interface Interface1 {
  I1P1: string;
  I1P2?: number;
}

export interface Interface2 {
  I2P1: number;
  I2P2?: string;
}

export abstract class BranchOneCondition extends DummyType {

  protected constructor(
    public B1C1P1: number,
    public B1C1P2?: string,
    public Dummy_Do_Not_Use?: string,
  ) {
    super(
      Dummy_Do_Not_Use,
    );
  }
}

@odataType('#Company.FooService.B1BarCondition', $$DummyTypeTypes.B1BarCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class B1BarCondition extends BranchOneCondition {

  public constructor(
    public B1C1P1: number,
    public CBC1P1: number,
    public B1C1P2?: string,
    public CBC1P2?: Interface1,
    public Dummy_Do_Not_Use?: string,
  ) {
    super(
      B1C1P1,
      B1C1P2,
      Dummy_Do_Not_Use,
    );
  }

  public static create<TB1BarCondition extends B1BarCondition | undefined | null = B1BarCondition>(raw: TB1BarCondition): TB1BarCondition {
    if (raw === undefined || raw === null || (raw as unknown) instanceof this) { return raw; }
    return new this(
      raw.B1C1P1,
      raw.CBC1P1,
      raw.B1C1P2,
      raw.CBC1P2,
      raw.Dummy_Do_Not_Use,
    ) as TB1BarCondition;
  }

}

@odataType('#Company.FooService.B1FizzCondition', $$DummyTypeTypes.B1FizzCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class B1FizzCondition extends BranchOneCondition {

  public constructor(
    public B1C1P1: number,
    public FC1P1: number,
    public B1C1P2?: string,
    public Dummy_Do_Not_Use?: string,
    public FC1P2?: Interface1,
  ) {
    super(
      B1C1P1,
      B1C1P2,
      Dummy_Do_Not_Use,
    );
  }

  public static create<TB1FizzCondition extends B1FizzCondition | undefined | null = B1FizzCondition>(raw: TB1FizzCondition): TB1FizzCondition {
    if (raw === undefined || raw === null || (raw as unknown) instanceof this) { return raw; }
    return new this(
      raw.B1C1P1,
      raw.FC1P1,
      raw.B1C1P2,
      raw.Dummy_Do_Not_Use,
      raw.FC1P2,
    ) as TB1FizzCondition;
  }

}

@odataType('#Company.FooService.B1FooCondition', $$DummyTypeTypes.B1FooCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class B1FooCondition extends BranchOneCondition {

  public constructor(
    public B1C1P1: number,
    public FC1P1: number,
    public B1C1P2?: string,
    public Dummy_Do_Not_Use?: string,
    public FC1P2?: Enum1,
  ) {
    super(
      B1C1P1,
      B1C1P2,
      Dummy_Do_Not_Use,
    );
  }

  public static create<TB1FooCondition extends B1FooCondition | undefined | null = B1FooCondition>(raw: TB1FooCondition): TB1FooCondition {
    if (raw === undefined || raw === null || (raw as unknown) instanceof this) { return raw; }
    return new this(
      raw.B1C1P1,
      raw.FC1P1,
      raw.B1C1P2,
      raw.Dummy_Do_Not_Use,
      raw.FC1P2,
    ) as TB1FooCondition;
  }

}

export enum $$StandardConditionTypes {
  BarCondition = 'BarCondition',
  FizzCondition = 'FizzCondition',
  FooCondition = 'FooCondition',
}

export interface StandardCondition {
  readonly $$type: $$StandardConditionTypes;
}

export abstract class StandardCondition {

  protected static get derivedTypes(): typeof StandardCondition[] {
    return [
      BarCondition,
      FizzCondition,
      FooCondition,
    ] as unknown as typeof StandardCondition[];
  }

  public static create<TStandardCondition extends StandardCondition | undefined | null = StandardCondition>(raw: TStandardCondition): TStandardCondition {
    if (raw === undefined || raw === null || raw instanceof this) { return raw; }
    const edmType = raw[odataTypeKey];
    const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
    if (!ctor) {
      return raw;
    }
    return ctor.create(raw);
  }

  protected static canHandle(_odataType: string): boolean { return false; }

  protected constructor(
    public BC1P1: number,
    public BC1P2?: string,
  ) { }
}

@odataType('#Company.FooService.BarCondition', $$StandardConditionTypes.BarCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class BarCondition extends StandardCondition {

  public constructor(
    public BC1P1: number,
    public CBC1P1: number,
    public BC1P2?: string,
    public CBC1P2?: Interface1,
  ) {
    super(
      BC1P1,
      BC1P2,
    );
  }

  public static create<TBarCondition extends BarCondition | undefined | null = BarCondition>(raw: TBarCondition): TBarCondition {
    if (raw === undefined || raw === null || (raw as unknown) instanceof this) { return raw; }
    return new this(
      raw.BC1P1,
      raw.CBC1P1,
      raw.BC1P2,
      raw.CBC1P2,
    ) as TBarCondition;
  }

}

@odataType('#Company.FooService.BarConfiguration', $$BaseConfigurationTypes.BarConfiguration, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class BarConfiguration extends BaseConfiguration {

  public constructor(
    public BC1P1: number,
    public CBC1P1: number,
    public BC1P2?: string,
    public CBC1P2?: Interface1,
  ) {
    super(
      BC1P1,
      BC1P2,
    );
  }

  public static create<TBarConfiguration extends BarConfiguration | undefined | null = BarConfiguration>(raw: TBarConfiguration): TBarConfiguration {
    if (raw === undefined || raw === null || (raw as unknown) instanceof this) { return raw; }
    return new this(
      raw.BC1P1,
      raw.CBC1P1,
      raw.BC1P2,
      raw.CBC1P2,
    ) as TBarConfiguration;
  }

}

@odataType('#Company.FooService.BranchTwoCondition', $$DummyTypeTypes.BranchTwoCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class BranchTwoCondition extends DummyType {

  public constructor(
    public B2C1P1: number,
    public B2C1P2?: string,
    public Dummy_Do_Not_Use?: string,
  ) {
    super(
      Dummy_Do_Not_Use,
    );
  }

  public static create<TBranchTwoCondition extends BranchTwoCondition | undefined | null = BranchTwoCondition>(raw: TBranchTwoCondition): TBranchTwoCondition {
    if (raw === undefined || raw === null || (raw as unknown) instanceof this) { return raw; }
    return new this(
      raw.B2C1P1,
      raw.B2C1P2,
      raw.Dummy_Do_Not_Use,
    ) as TBranchTwoCondition;
  }

}

@odataType('#Company.FooService.FizzCondition', $$StandardConditionTypes.FizzCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class FizzCondition extends StandardCondition {

  public constructor(
    public BC1P1: number,
    public FC1P1: number,
    public BC1P2?: string,
    public FC1P2?: Interface1,
    public FC1P3?: BaseConfiguration,
  ) {
    super(
      BC1P1,
      BC1P2,
    );
  }

  public static create<TFizzCondition extends FizzCondition | undefined | null = FizzCondition>(raw: TFizzCondition): TFizzCondition {
    if (raw === undefined || raw === null || (raw as unknown) instanceof this) { return raw; }
    return new this(
      raw.BC1P1,
      raw.FC1P1,
      raw.BC1P2,
      raw.FC1P2,
      BaseConfiguration.create(raw.FC1P3),
    ) as TFizzCondition;
  }

}

@odataType('#Company.FooService.FooCondition', $$StandardConditionTypes.FooCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class FooCondition extends StandardCondition {

  public constructor(
    public BC1P1: number,
    public FC1P1: number,
    public BC1P2?: string,
    public FC1P2?: Enum1,
  ) {
    super(
      BC1P1,
      BC1P2,
    );
  }

  public static create<TFooCondition extends FooCondition | undefined | null = FooCondition>(raw: TFooCondition): TFooCondition {
    if (raw === undefined || raw === null || (raw as unknown) instanceof this) { return raw; }
    return new this(
      raw.BC1P1,
      raw.FC1P1,
      raw.BC1P2,
      raw.FC1P2,
    ) as TFooCondition;
  }

}

@odataType('#Company.FooService.FooConfiguration', $$BaseConfigurationTypes.FooConfiguration, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class FooConfiguration extends BaseConfiguration {

  public constructor(
    public BC1P1: number,
    public FC1P1: number,
    public BC1P2?: string,
    public FC1P2?: Enum1,
  ) {
    super(
      BC1P1,
      BC1P2,
    );
  }

  public static create<TFooConfiguration extends FooConfiguration | undefined | null = FooConfiguration>(raw: TFooConfiguration): TFooConfiguration {
    if (raw === undefined || raw === null || (raw as unknown) instanceof this) { return raw; }
    return new this(
      raw.BC1P1,
      raw.FC1P1,
      raw.BC1P2,
      raw.FC1P2,
    ) as TFooConfiguration;
  }

}

export enum Enum1 {
  Member1 = 'Member1',
  Member2 = 'Member2',
  Member3 = 'Member3',
}
