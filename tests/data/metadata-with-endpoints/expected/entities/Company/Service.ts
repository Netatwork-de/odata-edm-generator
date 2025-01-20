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

export class Domain {

    public static create<TDomain extends Domain | undefined | null = Domain>(this: Class<TDomain>, raw: TDomain): TDomain {
        if (raw === undefined || raw === null || raw instanceof this) { return raw; }
        return new this(
            raw.Id,
            raw.TXT,
            raw.CertificateData,
            raw.TrustedSubnetsData,
        );
    }

    public constructor(
        public Id: number,
        public TXT: string,
        public CertificateData?: string,
        public TrustedSubnetsData?: string,
    ) { }
}

export class DomainSetting {

    public static create<TDomainSetting extends DomainSetting | undefined | null = DomainSetting>(this: Class<TDomainSetting>, raw: TDomainSetting): TDomainSetting {
        if (raw === undefined || raw === null || raw instanceof this) { return raw; }
        return new this(
            raw.DomainId,
            raw.CertificateCount,
            raw.UserCount,
            Domain.create(raw.Domain),
            raw.DomainName,
        );
    }

    public constructor(
        public DomainId: number,
        public CertificateCount: number,
        public UserCount: number,
        public Domain?: Domain,
        public DomainName?: string,
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
            BaseCondition.create(raw.Condition),
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
        public Condition?: BaseCondition,
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
            BaseCondition.create(raw.Condition),
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
        public Condition?: BaseCondition,
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

export enum $$BaseConditionTypes {
    BarCondition = 'BarCondition',
    FizzCondition = 'FizzCondition',
    FooCondition = 'FooCondition',
}

export interface BaseCondition {
    readonly $$type: $$BaseConditionTypes;
}

export abstract class BaseCondition {

    protected static get derivedTypes(): typeof BaseCondition[] {
        return [
            BarCondition,
            FizzCondition,
            FooCondition,
        ] as unknown as typeof BaseCondition[];
    }

    public static create<TBaseCondition extends BaseCondition | undefined | null = BaseCondition>(raw: TBaseCondition): TBaseCondition {
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

@odataType('#Company.Service.BarConfiguration', $$BaseConfigurationTypes.BarConfiguration, '$$type')
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

@odataType('#Company.Service.FizzCondition', $$BaseConditionTypes.FizzCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class FizzCondition extends BaseCondition {

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

@odataType('#Company.Service.FooCondition', $$BaseConditionTypes.FooCondition, '$$type')
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class FooCondition extends BaseCondition {

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

@odataType('#Company.Service.FooConfiguration', $$BaseConfigurationTypes.FooConfiguration, '$$type')
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
