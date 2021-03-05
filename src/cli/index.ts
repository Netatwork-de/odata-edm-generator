#!/usr/bin/env node

import * as https from 'https';
import { Configuration } from './configuration';
import { generateEdm, generateEndpointsFile } from './generator';
import { Endpoint, Logger } from './shared';

function getData(url: string) {
  return new Promise<string>((resolve, reject) => {
    let rawData = '';
    Logger.info(`fetching data for ${url}`);
    const req = https.request(
      url,
      { rejectUnauthorized: false },
      (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => { resolve(rawData); });
        res.on('error', (e) => { reject(new Error(`problem with response: ${e.message}`)); });
      });
    req.on('error', (e) => { reject(new Error(`problem with request: ${e.message}`)); });
    req.end();
  });
}

async function main() {
  try {
    const args = process.argv.slice(2);
    if (args.length === 0 || args[0].replace(/^-*/g, '') === 'help') {
      Logger.log(
        `Usage: gen-edm options

A CLI tool to generate EDM from OData service.
For details, refer the docs: https://github.com/Netatwork-de/odata-edm-generator.

Options:
  --config       The path to the config file.
  --outputDir    The base output directory to write the generated files.
  --endpoint     The OData endpoint. '{endpoint}' is used to get the list of endpoints, and '{endpoint}/$metadata' is used to get the EDM.
  --endpoints    Serialized array of endpoints configuration. Only one of 'endpoint' and 'endpoints' can be provided.
  --quoteStyle   Single or double quote to use; Allowed values are 'single', and 'double'.
  --indentSize   Number of spaces to use for indentation.
`
      );
      return;
    }

    const configuration = Configuration.createFromCLIArgs(args);
    for (const ep of configuration.endpoints) {
      const baseEndpoint = ep.url;
      const { value: endpoints } = JSON.parse(await getData(baseEndpoint)) as { value: Endpoint[] };

      generateEndpointsFile(endpoints, ep);
      Logger.info(`generated endpoints for ${baseEndpoint}.`);

      generateEdm(await getData(`${baseEndpoint}/$metadata`), endpoints, ep);
      Logger.info(`generated EDM for ${baseEndpoint}.`);
    }
  } finally {
    Configuration.dispose();
  }
}

void main();
