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
} from "../../Endpoints";

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
            model.BazzProp1,
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
export class Child extends Base {

    public static create<TChild extends Child = Child>(this: Class<TChild>, model: Partial<TChild>): TChild {
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
