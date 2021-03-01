import { assert } from 'chai';
import { existsSync, readFileSync } from 'fs';
import mockfs from 'mock-fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { Configuration } from '../src/cli/configuration';
import { generateEndpoints, getEndpointsPath } from '../src/cli/endpoint-generator';
import { standardEndpoints } from './data';

describe('endpoint-generator', function () {
  it('generateEndpoints writes the endpoints file', function () {
    const basePath = uuid();
    Configuration.create('irrelevant', basePath);
    mockfs({ [basePath]: {} });

    generateEndpoints(standardEndpoints);

    const epPath = getEndpointsPath();
    assert.strictEqual(epPath, join(basePath, 'Endpoints.ts'));
    assert.strictEqual(existsSync(epPath), true);
    assert.strictEqual(
      readFileSync(epPath, 'utf8'),
      `/**
* This is a generated file. Please don't change this manually.
*/
export const enum Endpoints {
    People = 'People',
    Foos = 'Foos',
    Bar = 'fizzbazz',
}`
      );

    mockfs.restore();
    Configuration.dispose();
  });
});