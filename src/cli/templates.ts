import * as eta from 'eta';
import { Endpoint } from './contracts';

const defaultEndpointsTemplate = `/**
* This is a generated file. Please don't change this manually.
*/
export const enum Endpoints {
<% for(const endpoint of it.endpoints) { %>
    <%= endpoint.name %> = '<%= endpoint.url %>',
<% } %>
}`;
export class EndpointTemplate {
  private readonly compiled;
  public constructor(
    template: string = defaultEndpointsTemplate,
  ) {
    this.compiled = eta.compile(template);
  }

  public render(endpoints: Endpoint[]): string {
    return this.compiled({ endpoints }, eta.config);
  }
}