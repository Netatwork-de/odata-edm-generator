/**
 * This is a generated file. Please don't change this manually.
 */

import {
    Class,
    odataEndpoint,
    odataType,
    odataTypeKey,
    ODataRawType,
    createModel,
} from "@netatwork/odata-edm-generator";
import {
    Endpoints,
} from "../../Endpoints.js";

export class Bar {

    public static create<TBar extends Bar = Bar>(this: Class<TBar>, raw: TBar): TBar {
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
        public Prop11?: string | null,
        public Prop14?: number | null,
    ) { }
}

export class Base {

    public static create<TBase extends Base = Base>(this: Class<TBase>, raw: TBase): TBase {
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
        public BaseProp11?: string | null,
        public BaseProp14?: number | null,
    ) { }
}

@odataEndpoint(Endpoints.Fizz)
export class Bazz {

    public static create<TBazz extends Bazz = Bazz>(this: Class<TBazz>, raw: TBazz): TBazz {
        return new this(
            raw.Id,
            raw.BazzProp2,
            raw.BazzProp1,
        );
    }

    public constructor(
        public Id: number,
        public BazzProp2: number,
        public BazzProp1?: string | null,
    ) { }
}

@odataEndpoint(Endpoints.Foos)
export class Foo {

    public static create<TFoo extends Foo = Foo>(this: Class<TFoo>, raw: TFoo): TFoo {
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
        public StrProp?: string | null,
    ) { }
}

@odataEndpoint(Endpoints.Children)
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class Child extends Base {

    public static create<TChild extends Child = Child>(this: Class<TChild>, raw: TChild): TChild {
        return new this(
            raw.ChildId,
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
        public ChildId: number,
        public BaseProp12: number,
        public BaseProp13: string,
        public ChildProp12: number,
        public ChildProp13: string,
        public BaseProp11?: string | null,
        public BaseProp14?: number | null,
        public ChildProp11?: number | null,
    ) {
        super(
            BaseProp12,
            BaseProp13,
            BaseProp11,
            BaseProp14,
        );
    }
}

export interface Interface1 {
    I1P1: string;
    I1P2?: number | null;
}

export interface Interface2 {
    I2P1: number;
    I2P2?: string | null;
}

export enum Enum1 {
    Member1 = "Member1",
    Member2 = "Member2",
    Member3 = "Member3",
}
