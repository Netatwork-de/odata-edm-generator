/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Decorator to associate an endpoint with an odata entity.
 */
export function odataEndpoint(endpoint: string) {
    return function(constructor: Class<any>): void {
        Reflect.defineProperty(constructor, 'ODataEndpoint', { configurable: true, writable: false, enumerable: false, value: endpoint });
    };
}

export type Class<T> = {
    readonly prototype: T;
    new(...args: any[]): T;
};
export type ODataEntity<T> = Class<T> & {
    ODataEndpoint: string;
};

export const odataTypeKey = '@odata.type' as const;
export type ODataComplexType<T> = Class<T> & {
    readonly prototype: T & { [odataTypeKey]: string };
    canHandle(arg: string): boolean;
};

/**
 * This is similar to `@odataEndpoint`, but this is more useful for interfaces and abstract class hierarchy in odata.
 * It does as follows:
 *  - Adds the `rawOdataType` to the instance of the class, so that it is serialized for OData.
 *  - Assigns the `prototype[typePropertyName] = friendlyType`
 *  - Adds a static method to the class named `canHandle`, which when given a `@odata.type` value (string) returns `true`/`false`
 *    depending on whether the value matches the given `rawOdataType` or not. This is useful for factory methods.
 */
export function odataType(rawOdataType: string): any;
export function odataType(rawOdataType: string, friendlyType: string, typePropertyName: string): any;
export function odataType(rawOdataType: string, friendlyType?: string, typePropertyName?: string): any {

    return function <T extends new (...args: any[]) => any>(constructorFunction: T) {
        if (!rawOdataType) {
            throw new Error(`Cannot define odataType on ${constructorFunction.name}, as missing rawOdataType`);
        }
        Reflect.defineProperty(constructorFunction, 'canHandle', { get() { return (arg: string) => arg === rawOdataType; } });
        if (friendlyType && typePropertyName) {
            Reflect.set(constructorFunction.prototype as object, typePropertyName, friendlyType);
        }

        return class extends constructorFunction {
            public constructor(...args: any[]) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                super(...args);
                Reflect.set(this, odataTypeKey, rawOdataType);
            }
        };
    };
}