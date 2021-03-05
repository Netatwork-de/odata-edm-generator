/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { assert } from 'chai';
import { red, green, gray } from 'chalk';
import { diffLines } from 'diff';
import { existsSync, readdirSync, readFileSync } from 'fs';
import mockFs from 'mock-fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-shadow
import { URL } from 'url';
import { v4 as uuid } from 'uuid';
import { Configuration } from '../src/cli/configuration';
import { generateEdm, generateEndpointsFile } from '../src/cli/generator';
import { EndpointConfiguration } from '../src/cli/shared';

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
      const changes = diffLines(expected.get(key)!, actual.get(key)!);
      const len = changes.length;
      if (len > 1) {
        changes.forEach((part) => {
          if (part.added) {
            process.stderr.write(green(part.value));
          } else if (part.removed) {
            process.stderr.write(red(part.value));
          } else {
            const lines = part.value.split(/[\n\r|\r]/);
            process.stderr.write(gray([...lines.slice(0, 10), '...', ...lines.slice(-10)].join('\n')));
          }
        });
        assert.fail('Content mismatch; check the diff.');
      }
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

        const mockFsConfig: any = { [baseOutputPath]: {} };
        const configFilePath = join(inputDir, 'config.js');

        let configuredEndpoints: EndpointConfiguration[] | undefined = undefined;
        let hasConfiguredEndpoints = false;
        const args = ['--outputDir', baseOutputPath];
        if (existsSync(configFilePath)) {
          args.unshift('--config', configFilePath);
          mockFsConfig[configFilePath] = mockFs.load(configFilePath);
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          configuredEndpoints = require(configFilePath).endpoints;
          hasConfiguredEndpoints = Array.isArray(configuredEndpoints) && configuredEndpoints.length > 0;
        }
        if (!hasConfiguredEndpoints) {
          args.push('--endpoint', 'https://api.example.com');
        }
        const expected = readAllContent(join(caseDir, 'expected'));
        mockFs(mockFsConfig, { createCwd: true });
        const configuration = Configuration.createFromCLIArgs(args);

        for (const ep of configuration.endpoints) {
          let epInput = join(inputDir, new URL(ep.url).hostname);
          epInput = mockFs.bypass(() => existsSync(epInput)) ? epInput : inputDir;

          const edmxXml = mockFs.bypass(() => readFileSync(join(epInput, 'metadata.xml'), 'utf8'));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          const endpoints = mockFs.bypass(() => JSON.parse(readFileSync(join(epInput, 'endpoints.json'), 'utf8')).value);

          // act
          generateEndpointsFile(endpoints, ep);
          generateEdm(edmxXml, endpoints, ep);
        }

        // assert
        const actual = readAllContent(baseOutputPath);
        assertContent(actual, expected);
      } catch (e) {
        assert.fail(e);
      } finally {
        // cleanup
        mockFs.restore();
        Configuration.dispose();
      }
    });
  }
});