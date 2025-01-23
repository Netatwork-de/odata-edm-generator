import { assert } from 'chai';
import { ODataComplexType, ODataEntity, odataEndpoint, odataType } from '@netatwork/odata-edm-generator';

describe('decorators', function () {
  it('odataEndpoint', function () {
    @odataEndpoint('test')
    class Test {}

    assert.strictEqual((Test as ODataEntity<unknown>).ODataEndpoint, 'test');
  });

  it('odataType', function () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
    interface Test {
      testType: string;
      '@odata.type': string;
    }

    @odataType('rawTestType', 'friendlyTestType', 'testType')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
    class Test {}

    const instance = new Test();

    assert.strictEqual((Test as ODataComplexType<unknown>).canHandle('wrongType'), false);
    assert.strictEqual((Test as ODataComplexType<unknown>).canHandle('rawTestType'), true);
    assert.strictEqual(instance['@odata.type'], 'rawTestType');
    assert.strictEqual(Test.prototype.testType, 'friendlyTestType');
    assert.strictEqual(instance.testType, 'friendlyTestType');
  });

  it('odataType with type name override', function () {
    @odataType('rawTestType', 'friendlyTestType', 'testType')
    class Test {
      public testType = 'override';
    }

    const instance = new Test();
    assert.strictEqual(instance.testType, 'override');
  });
});
