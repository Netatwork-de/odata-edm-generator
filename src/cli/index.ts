#!/usr/bin/env node

import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as xmlJs from 'xml-js';
import { argv } from 'yargs';
import { generateEdm, Metadata } from './EdmGenerator';
import { Endpoint, generateEndpoints } from './EndpointGenerator';

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

const baseEndpoint: string = argv.endpoint as string;
const baseOutputPath: string = path.resolve(process.cwd(), argv.outputPath as string);
if (!fs.existsSync(baseOutputPath)) {
  throw new Error(`The output path "${baseOutputPath}" does not exist`);
}
async function main() {
  const { value: endpoints } = JSON.parse(await getData(baseEndpoint)) as { value: Endpoint[] };
  const metadata = JSON.parse(
    xmlJs.xml2json(
      await getData(`${baseEndpoint}/$metadata`),
      { compact: true })) as Metadata;

  generateEndpoints(endpoints, baseOutputPath);
  generateEdm(metadata, endpoints, baseOutputPath);
}

void main();
