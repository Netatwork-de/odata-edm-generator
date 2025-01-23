import { createModel, ODataRawType, odataTypeKey } from '@netatwork/odata-edm-generator';
import { assert } from 'chai';
import * as FooService from './data/multiple-endpoints/expected/foo/entities/Company/FooService.js';

describe('runtime', function () {
  describe('generated code', function () {
    it('instantiate base class', function () {
      const instance = FooService.Base.create({
        BaseProp12: 1,
        BaseProp13: '2',
        BaseProp11: '3',
      });
      assert.instanceOf(instance, FooService.Base);
      assert.strictEqual(instance.BaseProp12, 1);
      assert.strictEqual(instance.BaseProp13, '2');
      assert.strictEqual(instance.BaseProp11, '3');
      assert.strictEqual(instance.BaseProp14, undefined);

      const clone = FooService.Base.create(instance);
      assert.notStrictEqual(instance, clone);
      assert.instanceOf(clone, FooService.Base);
      assert.strictEqual(clone.BaseProp12, 1);
    });

    it('instantiate extended non complex model', function() {
      const instance = FooService.ChildOne.create({
        BaseProp12: 1,
        BaseProp13: '2',
        BaseProp11: '3',
        ChildId: 4,
        ChildProp12: 5,
        ChildProp13: '6',
      });
      assert.instanceOf(instance, FooService.Base);
      assert.instanceOf(instance, FooService.ChildOne);

      const clone = FooService.ChildOne.create(instance);
      assert.notStrictEqual(instance, clone);
      assert.instanceOf(clone, FooService.Base);
      assert.strictEqual(clone.BaseProp12, 1);
    });

    it('instantiate complex child model', function() {
      const instance = FooService.ChildOne.create({
        BaseProp12: 1,
        BaseProp13: '2',
        ChildId: 4,
        ChildProp12: 5,
        ChildProp13: '6',
        Condition: {
          [odataTypeKey]: '#Company.FooService.BarCondition',
          BC1P1: 7,
          CBC1P1: 9,
        } as ODataRawType<FooService.BarCondition>,
      });
      assert.isTrue(instance.Condition instanceof FooService.StandardCondition);
      assert.instanceOf(instance.Condition, FooService.BarCondition);
      assert.strictEqual(instance.Condition.$$type, FooService.$$StandardConditionTypes.BarCondition);

      const clone = FooService.ChildOne.create(instance);
      assert.strictEqual(clone.Condition, instance.Condition);
    });
  });

  describe('createModel', function () {
    class TestModel {
      public constructor(public readonly a: number) {}
      public static create<T extends TestModel = TestModel>(raw: TestModel): T {
        return new TestModel(raw.a) as T;
      }
    }

    it('forwards null, undefined', function () {
      assert.strictEqual(createModel(TestModel, null), null);
      assert.strictEqual(createModel(TestModel, undefined), undefined);
    });

    it('forwards existing instances', function () {
      const instance = new TestModel(1);
      assert.strictEqual(createModel(TestModel, instance), instance);
    });

    it('create from raw object', function () {
      const instance = createModel(TestModel, { a: 1 });
      assert.instanceOf(instance, TestModel);
      assert.strictEqual(instance.a, 1);
    });

    it('return type inference', function () {
      class A {
        public static create(): string {
          return 'test';
        }
      }
      /* eslint-disable @typescript-eslint/no-unused-vars */
      // The unused constants below are for testing assignability at compile time.
      const _test: string = createModel(A, 'test');
      const _null: null = createModel(A, null);
      const _undefined: undefined = createModel(A, undefined);
      /* eslint-enable @typescript-eslint/no-unused-vars */
    });
  });
});
