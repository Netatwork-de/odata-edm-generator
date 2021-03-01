import * as fs from 'fs';
import * as path from 'path';
import { Configuration } from './configuration';
import { Endpoint } from './shared';
import { EndpointTemplate } from './templates';

export function generateEndpoints(endpoints: Endpoint[]): void {
  fs.writeFileSync(
    getEndpointsPath(),
    new EndpointTemplate().render(endpoints),
  );
}

export function getEndpointsPath(): fs.PathLike {
  return path.join(Configuration.instance.baseOutputPath, 'Endpoints.ts');
}

