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
} from '@netatwork/odata-edm-generator';
import {
    Endpoints,
} from '../../Endpoints.js';

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
