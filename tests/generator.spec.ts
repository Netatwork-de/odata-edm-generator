/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { assert } from 'chai';
import { gray, green, red } from 'colorette';
import { diffLines } from 'diff';
import { promises as fs, readdirSync } from 'fs';
import mockFs from 'mock-fs';
import { URL } from 'node:url';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { Configuration } from '../dist/cli/configuration.js';
import { exists } from '../dist/cli/file-system-helper.js';
import { $Generator } from '../dist/cli/generator.js';
import { Endpoint, EndpointConfiguration } from '../dist/cli/shared.js';

const __dirname = process.cwd();

describe('generator', function () {

  async function readAllContent(path: string): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    for (const dirent of await fs.readdir(path, { encoding: 'utf8', withFileTypes: true })) {
      const entryName = dirent.name;
      const completePath = join(path, entryName);
      if (dirent.isFile()) {
        result.set(entryName, await fs.readFile(completePath, 'utf8'));
      } else {
        const content = await readAllContent(completePath);
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
      const expectedContent = expected.get(key)!;
      const actualContent = actual.get(key)!;
      const changes = diffLines(expectedContent, actualContent);
      const len = changes.length;
      if (len > 1) {
        for (const change of changes) {
          if (change.added) {
            process.stderr.write(green(change.value.replace(/\s/g, '.')));
          } else if (change.removed) {
            process.stderr.write(red(change.value.replace(/\s/g, '.')));
          } else {
            const lines = change.value.split(/[\n\r|\n]/);
            process.stderr.write(gray([...lines.slice(0, 10), '...', ...lines.slice(-10)].join('\n')));
          }
        }
        assert.strictEqual(actualContent, expectedContent, `Content mismatch in '${key}'; check the diff.`);
      }
    }
  }

  const dataPath = join(__dirname, 'tests', 'data');
  for (const dirent of (readdirSync(dataPath, { encoding: 'utf8', withFileTypes: true }))
    .filter((x) => x.isDirectory())) {
    const dirName = dirent.name;
    it(`works for ${dirName}`, async function () {
      let generator: $Generator | null = null;
      try {
        // arrange
        const baseOutputPath = join(process.cwd(), uuid());
        const caseDir = join(dataPath, dirName);
        const inputDir = join(caseDir, 'input');

        const mockFsConfig = { [baseOutputPath]: {} };
        const configFilePath = join(inputDir, 'config.cjs');

        let configuredEndpoints: EndpointConfiguration[] | undefined = undefined;
        let hasConfiguredEndpoints = false;
        const args = ['--outputDir', baseOutputPath];
        if (await mockFs.bypass(() => exists(configFilePath))) {
          args.unshift('--config', configFilePath);
          mockFsConfig[configFilePath] = mockFs.load(configFilePath);
          let importedConfig = await import(`file:///${configFilePath}`);
          importedConfig = importedConfig.default ?? importedConfig;
          configuredEndpoints = importedConfig.endpoints;
          hasConfiguredEndpoints = Array.isArray(configuredEndpoints) && configuredEndpoints.length > 0;
        }
        if (!hasConfiguredEndpoints) {
          args.push('--endpoint', 'https://api.example.com');
        }
        const expected = await readAllContent(join(caseDir, 'expected'));
        mockFs(mockFsConfig, { createCwd: true });
        const configuration = await Configuration.createFromCLIArgs(args);
        generator = new $Generator();

        for (const ep of configuration.endpoints) {
          let epInput = join(inputDir, new URL(ep.url).hostname);
          epInput = await mockFs.bypass(() => exists(epInput)) ? epInput : inputDir;

          const edmxXml = await mockFs.bypass(() => fs.readFile(join(epInput, 'metadata.xml'), 'utf8'));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          const endpoints: Endpoint[] = JSON.parse(await mockFs.bypass(() => fs.readFile(join(epInput, 'endpoints.json'), 'utf8'))).value;

          // act
          await generator.generateEndpointsFile(endpoints, ep);
          await generator.generateEdm(edmxXml, endpoints, ep);
        }

        // assert
        const actual = await readAllContent(baseOutputPath);
        assertContent(actual, expected);
      } catch (e) {
        assert.fail((e as Error).message);
      } finally {
        // cleanup
        mockFs.restore();
        Configuration.dispose();
      }
    });
  }
});