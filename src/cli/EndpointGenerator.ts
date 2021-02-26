import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
export interface Endpoint { name: string; url: string; }

const template = fs.readFileSync(path.join(__dirname, '..', '..', 'templates', 'endpoints.ejs'), 'utf8');

export function generateEndpoints(endpoints: Endpoint[], baseOutputPath: string): void {
  fs.writeFileSync(path.join(baseOutputPath, 'Endpoints.ts'), ejs.render(template, { endpoints }));
}
