/**
 * This is a generated file. Please don't change this manually.
 */

import {
    Class,
    odataEndpoint,
} from "@netatwork/odata-edm-generator";
import {
    Endpoints,
} from "../../Endpoints";

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