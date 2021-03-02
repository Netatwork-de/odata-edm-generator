#!/usr/bin/env node

import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { argv } from 'yargs';
import { Configuration } from './configuration';
import { generateEdm, generateEndpointsFile } from './generator';
import { Endpoint } from './shared';

function getData(url: string) {
  return new Promise<string>((resolve, reject) => {
    let rawData = '';

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
    const baseEndpoint: string = argv.endpoint as string;
    const baseOutputPath: string = path.resolve(process.cwd(), argv.outputPath as string);
    if (!fs.existsSync(baseOutputPath)) {
      throw new Error(`The output path "${baseOutputPath}" does not exist`);
    }
    Configuration.create(baseEndpoint, baseOutputPath);
    const { value: endpoints } = JSON.parse(await getData(baseEndpoint)) as { value: Endpoint[] };

    generateEndpointsFile(endpoints);
    generateEdm(await getData(`${baseEndpoint}/$metadata`), endpoints);

  } finally {
    Configuration.dispose();
  }
}

void main();
