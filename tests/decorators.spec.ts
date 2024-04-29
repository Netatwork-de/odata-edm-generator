import { assert } from 'chai';
import { ODataComplexType, ODataEntity, odataEndpoint, odataType } from '../src/api/decorators.js';

describe('decorators', function () {
  it('odataEndpoint', function () {
    @odataEndpoint('test')
    class Test {}

    assert.strictEqual((Test as ODataEntity<unknown>).ODataEndpoint, 'test');
  });

  it('odataType', function () {
    @odataType('rawTestType', 'friendlyTestType', 'testType')
    class Test {}
    const instance = new Test();
    assert.strictEqual((Test as ODataComplexType<unknown>).canHandle('wrongType'), false);
    assert.strictEqual((Test as ODataComplexType<unknown>).canHandle('rawTestType'), true);
    assert.strictEqual((instance as { '@odata.type': string })['@odata.type'], 'rawTestType');
    assert.strictEqual((Test.prototype as { testType: string }).testType, 'friendlyTestType');
    assert.strictEqual((instance as { testType: string }).testType, 'friendlyTestType');
  });
});
