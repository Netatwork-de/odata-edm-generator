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

export class Bar {

    public static create<TBar extends Bar = Bar>(this: Class<TBar>, model: Partial<TBar>): TBar {
        return new this(
            model.Id,
            model.Prop12,
            model.Prop13,
            model.Prop11,
            model.Prop14,
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

export class Base {

    public static create<TBase extends Base = Base>(this: Class<TBase>, model: Partial<TBase>): TBase {
        return new this(
            model.BaseProp12,
            model.BaseProp13,
            model.BaseProp11,
            model.BaseProp14,
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

    public static create<TBazz extends Bazz = Bazz>(this: Class<TBazz>, model: Partial<TBazz>): TBazz {
        return new this(
            model.Id,
            model.BazzProp2,
            model.Bar,
            model.BarId,
            model.BazzProp1,
            model.Cp,
            model.Foos,
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

    public static create<TFoo extends Foo = Foo>(this: Class<TFoo>, model: Partial<TFoo>): TFoo {
        return new this(
            model.Id,
            model.ByteProp,
            model.DateStrProp,
            model.StrProp,
        );
    }

    public constructor(
        public Id: number,
        public ByteProp: number,
        public DateStrProp: string,
        public StrProp?: string,
    ) { }
}

@odataEndpoint(Endpoints.Children)
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class ChildOne extends Base {

    public static create<TChildOne extends ChildOne = ChildOne>(this: Class<TChildOne>, model: Partial<TChildOne>): TChildOne {
        return new this(
            model.ChildId,
            model.BaseProp12,
            model.BaseProp13,
            model.ChildProp12,
            model.ChildProp13,
            model.BaseProp11,
            model.BaseProp14,
            model.ChildProp11,
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

    public static create<TChildTwo extends ChildTwo = ChildTwo>(this: Class<TChildTwo>, model: Partial<TChildTwo>): TChildTwo {
        return new this(
            model.Id,
            model.BaseProp12,
            model.BaseProp13,
            model.ChildProp12,
            model.ChildProp13,
            model.BaseProp11,
            model.BaseProp14,
            model.ChildProp11,
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

    public static create<TGrandChild extends GrandChild = GrandChild>(this: Class<TGrandChild>, model: Partial<TGrandChild>): TGrandChild {
        return new this(
            model.ChildId,
            model.Id,
            model.BaseProp12,
            model.BaseProp13,
            model.ChildProp12,
            model.ChildProp13,
            model.GrandChildProp12,
            model.GrandChildProp13,
            model.BaseProp11,
            model.BaseProp14,
            model.ChildProp11,
            model.GrandChildProp11,
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
        );
    }
}

export enum $$BaseConditionTypes {
    BarCondition = 'BarCondition',
    FizzCondition = 'FizzCondition',
    FooCondition = 'FooCondition',
}

export class BaseCondition {

    protected static get derivedTypes(): typeof BaseCondition[] {
        return [
            BarCondition,
            FizzCondition,
            FooCondition,
        ];
    }

    public static create(raw: Partial<BaseCondition>): BaseCondition {
        if (raw === undefined || raw === null) { return raw as BaseCondition; }
        const edmType = raw[odataTypeKey];
        const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
        if (!ctor) {
            return raw as BaseCondition;
        }
        const result = new ctor();
        result.initialize(raw);
        return result;
    }

    protected static canHandle(_odataType: string): boolean { return false; }

    public BC1P1: number;
    public BC1P2?: string;
    public readonly $$type: $$BaseConditionTypes;

    protected initialize(raw: Partial<BaseCondition>) {
        this.BC1P1 = raw.BC1P1;
        this.BC1P2 = raw.BC1P2;
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
        if (raw === undefined || raw === null) { return raw as BaseConfiguration; }
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

export interface Interface1 {
    I1P1: string;
    I1P2?: number;
}

export interface Interface2 {
    I2P1: number;
    I2P2?: string;
}

@odataType('#Company.Service.BarCondition', $$BaseConditionTypes.BarCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class BarCondition extends BaseCondition {

    public CBC1P1: number;
    public CBC1P2?: Interface1;

    protected initialize(raw: Partial<BarCondition>) {
        super.initialize(raw);
        this.CBC1P1 = raw.CBC1P1;
        this.CBC1P2 = raw.CBC1P2;
    }
}

@odataType('#Company.Service.BarConfiguration', $$BaseConfigurationTypes.BarConfiguration, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class BarConfiguration extends BaseConfiguration {

    public CBC1P1: number;
    public CBC1P2?: Interface1;

    protected initialize(raw: Partial<BarConfiguration>) {
        super.initialize(raw);
        this.CBC1P1 = raw.CBC1P1;
        this.CBC1P2 = raw.CBC1P2;
    }
}

@odataType('#Company.Service.FizzCondition', $$BaseConditionTypes.FizzCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class FizzCondition extends BaseCondition {

    public FC1P1: number;
    public FC1P2?: Interface1;

    protected initialize(raw: Partial<FizzCondition>) {
        super.initialize(raw);
        this.FC1P1 = raw.FC1P1;
        this.FC1P2 = raw.FC1P2;
    }
}

@odataType('#Company.Service.FooCondition', $$BaseConditionTypes.FooCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class FooCondition extends BaseCondition {

    public FC1P1: number;
    public FC1P2?: Enum1;

    protected initialize(raw: Partial<FooCondition>) {
        super.initialize(raw);
        this.FC1P1 = raw.FC1P1;
        this.FC1P2 = raw.FC1P2;
    }
}

@odataType('#Company.Service.FooConfiguration', $$BaseConfigurationTypes.FooConfiguration, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
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
