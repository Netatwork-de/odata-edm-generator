import { createSpecFunction, TestContext, TestFunction } from '@netatwork/mocha-utils';
import { assert } from 'chai';
import * as fs from 'fs';
import mock from 'mock-fs';
import * as path from 'path';
import * as xmlJs from 'xml-js';
import { DOMParser } from 'xmldom';
import { generateEdm, Metadata } from '../../src/cli/EdmGenerator';

describe('CodeGenerator', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface EdmTestContext extends TestContext<any> {
    edmxNode: Document;
  }
  interface TestSetupContext {
    edmxXml: string;
  }
  const cwd = process.cwd();
  const baseOutputPath = path.join(cwd, 'tests', 'generated');
  const templatesPath = path.join(cwd, 'templates');
  async function runTest(
    testFunction: TestFunction<EdmTestContext>,
    { edmxXml }: Partial<TestSetupContext> = {}
  ) {
    if (!edmxXml) { throw new Error('edmxXml missing'); }
    mock({
      [cwd]: {
        tests: {
          generated: {}
        },
        'templates': {
          'class.ejs': fs.readFileSync(path.join(templatesPath, 'class.ejs')),
          'interface.ejs': fs.readFileSync(path.join(templatesPath, 'interface.ejs')),
          'enum.ejs': fs.readFileSync(path.join(templatesPath, 'enum.ejs')),
        }
      }
    }, { createCwd: false });
    const edmxNode = new DOMParser().parseFromString(edmxXml, 'text/xml');
    const metadata = JSON.parse(xmlJs.xml2json(edmxXml, { compact: true })) as Metadata;
    generateEdm(metadata, [], baseOutputPath);
    await testFunction({ edmxNode });
    mock.restore();
  }
  const $it = createSpecFunction(runTest);

  class TestData {
    public constructor(
      public name: string,
      public edmxXml: string,
      public output: string,
    ) { }
  }
  function* getTestData() {
    const dataPath = path.join(__dirname, 'data');
    const baseNames = new Set(fs.readdirSync(dataPath).map((x) => path.basename(x, path.extname(x))));
    for (const baseName of baseNames) {
      yield new TestData(
        baseName,
        fs.readFileSync(path.join(dataPath, `${baseName}.xml`), 'utf8'),
        fs.readFileSync(path.join(dataPath, `${baseName}.tsgen`), 'utf8'),
      );
    }
  }
  for (const value of getTestData()) {
    $it(`works for ${value.name}`, function ({ edmxNode }) {
      const namespace = edmxNode.getElementsByTagName('Schema')[0].attributes.getNamedItem('Namespace')!.value;
      const parts = namespace.split('.');
      const baseName = parts.pop()!;
      const actual = fs.readFileSync(path.join(baseOutputPath, 'entities', ...parts, `${baseName}.ts`), 'utf8');
      assert.equal(actual.replace(/\r\n/g, '\n'), value.output.replace(/\r\n/g, '\n'));
    }, { edmxXml: value.edmxXml });
  }
});