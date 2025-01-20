/**
 * This is a generated file. Please don't change this manually.
 */

import {
    Class,
    odataEndpoint,
    odataType,
    odataTypeKey,
} from "@netatwork/odata-edm-generator";
import {
    Endpoints,
} from "../../Endpoints.js";

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
            raw.BazzProp1,
        );
    }

    public constructor(
        public Id: number,
        public BazzProp2: number,
        public BazzProp1?: string,
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
export class Child extends Base {

    public static create<TChild extends Child | undefined | null = Child>(this: Class<TChild>, raw: TChild): TChild {
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

export interface Interface1 {
    I1P1: string;
    I1P2?: number;
}

export interface Interface2 {
    I2P1: number;
    I2P2?: string;
}

export enum Enum1 {
    Member1 = "Member1",
    Member2 = "Member2",
    Member3 = "Member3",
}
