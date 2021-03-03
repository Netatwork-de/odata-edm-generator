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
    const defaultOptions: Partial<Configuration> = { quote: '\'', indent: ' '.repeat(4) };
    for (const prefix of ['', '-', '--']) {
      yield new TestData(
        [`${prefix}endpoint`, 'https://api.example.com', `${prefix}outputDir`, 'out'],
        { ...defaultOptions, endpoint: 'https://api.example.com', outputDir: join(process.cwd(), 'out') },
      );
      yield new TestData(
        [`${prefix}endpoint`, 'https://api.example.com', `${prefix}outputDir`, 'out', `${prefix}quoteStyle`, 'single'],
        { ...defaultOptions, endpoint: 'https://api.example.com', outputDir: join(process.cwd(), 'out'), quote: '\'' },
      );
      yield new TestData(
        [`${prefix}endpoint`, 'https://api.example.com', `${prefix}outputDir`, 'out', `${prefix}quoteStyle`, 'double'],
        { ...defaultOptions, endpoint: 'https://api.example.com', outputDir: join(process.cwd(), 'out'), quote: '"' },
      );
      yield new TestData(
        [`${prefix}endpoint`, 'https://api.example.com', `${prefix}outputDir`, 'out', `${prefix}indentSize`, '2'],
        { ...defaultOptions, endpoint: 'https://api.example.com', outputDir: join(process.cwd(), 'out'), indent: '  ' },
      );
    }
  }

  for (const data of getTestData()) {
    it(`createFromCLIArgs works correctly - ${data.toString()}`, function () {
      try {
        const expectedOutputPath = data.expected.outputDir;
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