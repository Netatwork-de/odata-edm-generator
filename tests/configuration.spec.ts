import { assert } from 'chai';
import mockFs from 'mock-fs';
import { join } from 'path';
import { Configuration } from '../src/cli/configuration';
import { EndpointConfiguration } from '../src/cli/shared';

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
      const outputDir = join(process.cwd(), 'out');
      let endpoints = [new EndpointConfiguration('https://api.example.com', outputDir)];
      yield new TestData(
        [`${prefix}endpoint`, 'https://api.example.com', `${prefix}outputDir`, 'out'],
        { ...defaultOptions, endpoints, outputDir },
      );
      yield new TestData(
        [`${prefix}endpoint`, 'https://api.example.com', `${prefix}outputDir`, 'out', `${prefix}quoteStyle`, 'single'],
        { ...defaultOptions, endpoints, outputDir, quote: '\'' },
      );
      yield new TestData(
        [`${prefix}endpoint`, 'https://api.example.com', `${prefix}outputDir`, 'out', `${prefix}quoteStyle`, 'double'],
        { ...defaultOptions, endpoints, outputDir, quote: '"' },
      );
      yield new TestData(
        [`${prefix}endpoint`, 'https://api.example.com', `${prefix}outputDir`, 'out', `${prefix}indentSize`, '2'],
        { ...defaultOptions, endpoints, outputDir, indent: '  ' },
      );
      endpoints = [new EndpointConfiguration('https://foo.example.com', 'foo'), new EndpointConfiguration('https://bar.example.com', 'bar')];
      yield new TestData(
        [
          `${prefix}endpoints`, JSON.stringify([new EndpointConfiguration('https://foo.example.com', 'foo'), new EndpointConfiguration('https://bar.example.com', join(outputDir, 'bar'))]),
          `${prefix}outputDir`, 'out',
          `${prefix}indentSize`, '2'
        ],
        {
          ...defaultOptions,
          endpoints: [new EndpointConfiguration('https://foo.example.com', join(outputDir, 'foo')), new EndpointConfiguration('https://bar.example.com', join(outputDir, 'bar'))],
          outputDir,
          indent: '  '
        },
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