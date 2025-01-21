/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type ODataEndpointDecorator = <T extends Class<any>>(target: T, context: ClassDecoratorContext<T>) => void;

/**
 * Decorator to associate an endpoint with an odata entity.
 */
export function odataEndpoint(endpoint: string): ODataEndpointDecorator {
  return function<T extends Class<any>>(target: T, context: ClassDecoratorContext<T>): void {
    context.addInitializer(function() {
      Reflect.defineProperty(this, 'ODataEndpoint', { configurable: true, writable: false, enumerable: false, value: endpoint });
    });
  };
}

export interface Class<T> {
  prototype: T;
  new(...args: any[]): T;
}

export interface ModelClass<M> extends Class<M> {
  create<T extends M = M>(raw: T): T;
}

export type ODataEntity<T> = Class<T> & {
  ODataEndpoint: string;
};

export const odataTypeKey = '@odata.type';
export type ODataComplexType<T> = Class<T> & {
  readonly prototype: T & { [odataTypeKey]: string };
  canHandle(arg: string): boolean;
};

export type ODataTypeDecorator = <T extends Class<any>>(target: T, context: ClassDecoratorContext<T>) => T;

/**
 * This is similar to `@odataEndpoint`, but this is more useful for interfaces and abstract class hierarchy in odata.
 * It does as follows:
 *  - Adds the `rawOdataType` to the instance of the class, so that it is serialized for OData.
 *  - Assigns the `prototype[typePropertyName] = friendlyType`
 *  - Adds a static method to the class named `canHandle`, which when given a `@odata.type` value (string) returns `true`/`false`
 *    depending on whether the value matches the given `rawOdataType` or not. This is useful for factory methods.
 */
export function odataType(rawOdataType: string): ODataTypeDecorator;
export function odataType(rawOdataType: string, friendlyType: string, typePropertyName: string): ODataTypeDecorator;
export function odataType(rawOdataType: string, friendlyType?: string, typePropertyName?: string): ODataTypeDecorator {
  return function<T extends Class<any>>(target: T, context: ClassDecoratorContext<T>) {
    if (!rawOdataType) {
      throw new Error(`Cannot define odataType on ${target.name}, as missing rawOdataType`);
    }
    context.addInitializer(function () {
      Reflect.defineProperty(this, 'canHandle', { get() { return (arg: string) => arg === rawOdataType; } });
      if (friendlyType && typePropertyName) {
        Reflect.set(this.prototype as object, typePropertyName, friendlyType);
      }
    });
    return class extends target {
      public constructor(...args: any[]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        super(...args);
        Reflect.set(this, odataTypeKey, rawOdataType);
      }
    };
  };
}

/**
 * Try converting a raw object or instance into an instance of the specified model class.
 *
 * @param modelClass The model class to convert into.
 * @param rawOrInstance
 * + `null`, `undefined` or instances of `modelClass` are returned as is.
 * + Anything else is converted into the model class using `modelClass.create`.
 */
export function tryCreateModel<M, T extends M | null | undefined = M>(modelClass: ModelClass<M>, rawOrInstance: T): T {
  if (rawOrInstance === null || rawOrInstance === undefined || rawOrInstance instanceof modelClass) {
    return rawOrInstance;
  }
  return modelClass.create(rawOrInstance);
}
