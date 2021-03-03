import mockFs from 'mock-fs';
import { join } from 'path';
import { assert } from 'chai';
import { Configuration } from '../src/cli/configuration';

describe('configuration', function () {
  class TestData {
    public constructor(
      public readonly args: string[],
      public readonly expected: Partial<Configuration>
    ) { }

    public toString() {
      return `${this.args.join(' ')} -> ${JSON.stringify(this.expected)}`;
    }
  }

  function* getTestData() {
    yield new TestData(
      ['--endpoint', 'https://api.example.com', '--outputDir', 'out'],
      { endpoint: 'https://api.example.com', baseOutputPath: join(process.cwd(), 'out') },
    );
  }

  for (const data of getTestData()) {
    it(`createFromCLIArgs works correctly - ${data.toString()}`, function () {
      try {
        const expectedOutputPath = data.expected.baseOutputPath;
        mockFs({
          ...(expectedOutputPath ? { [expectedOutputPath]: {} } : {})
        }, { createCwd: true });

        const actual = Configuration.createFromCLIArgs(data.args);
        assert.deepStrictEqual(JSON.parse(JSON.stringify(actual)), data.expected);
      } finally {
        Configuration.dispose();
        mockFs.restore();
      }
    });
  }
});