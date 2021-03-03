import { assert } from 'chai';
import { readdirSync, readFileSync } from 'fs';
import mockFs from 'mock-fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { Configuration } from '../src/cli/configuration';
import { generateEdm, generateEndpointsFile } from '../src/cli/generator';

describe('generator', function () {

  function readAllContent(path: string): Map<string, string> {
    const result = new Map<string, string>();
    for (const dirent of readdirSync(path, { encoding: 'utf8', withFileTypes: true })) {
      const entryName = dirent.name;
      const completePath = join(path, entryName);
      if (dirent.isFile()) {
        result.set(entryName, readFileSync(completePath, 'utf8'));
      } else {
        const content = readAllContent(completePath);
        for (const [key, value] of content) {
          result.set(join(entryName, key), value);
        }
      }
    }
    return result;
  }

  function assertContent(actual: Map<string, string>, expected: Map<string, string>) {
    assert.strictEqual(actual.size, expected.size, 'size mismatch');
    const actualKeys = Array.from(actual.keys()).sort();
    const expectedKeys = Array.from(expected.keys()).sort();
    assert.deepStrictEqual(actualKeys, expectedKeys, 'mismatch in entries');
    for (const key of actualKeys) {
      assert.strictEqual(actual.get(key), expected.get(key), `mismatch in content for ${key}`);
    }
  }

  const dataPath = join(__dirname, 'data');
  for (const dirent of
    readdirSync(dataPath, { encoding: 'utf8', withFileTypes: true })
      .filter((x) => x.isDirectory())
  ) {
    const dirName = dirent.name;
    it(`works for ${dirName}`, function () {
      try {
        // arrange
        const baseOutputPath = join(process.cwd(), uuid());
        const caseDir = join(dataPath, dirName);
        const inputDir = join(caseDir, 'input');
        const edmxXml = readFileSync(join(inputDir, 'metadata.xml'), 'utf8');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const endpoints = JSON.parse(readFileSync(join(inputDir, 'endpoints.json'), 'utf8')).value;
        const expected = readAllContent(join(caseDir, 'expected'));
        mockFs({ [baseOutputPath]: {} }, { createCwd: true });
        Configuration.createFromCLIArgs(['--outputDir', baseOutputPath]);

        // act
        generateEndpointsFile(endpoints);
        generateEdm(edmxXml, endpoints);

        // assert
        const actual = readAllContent(baseOutputPath);
        assertContent(actual, expected);
      } finally {
        // cleanup
        mockFs.restore();
        Configuration.dispose();
      }
    });
  }
});