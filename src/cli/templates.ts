import * as eta from 'eta';
import type { TemplateFunction } from 'eta/dist/types/compile';
import { EdmInfo, Endpoint } from './shared';

eta.configure({ autoTrim: false });

const defaultEndpointsTemplate = `/**
 * This is a generated file. Please don't change this manually.
 */
export const enum Endpoints {
<% for(const endpoint of it.endpoints) { -%>
    <%= endpoint.name %> = '<%= endpoint.url %>',
<% } -%>
}`;

export class EndpointTemplate {
  private readonly compiled: TemplateFunction;
  public constructor(
    template: string = defaultEndpointsTemplate,
  ) {
    this.compiled = eta.compile(template);
  }

  public render(endpoints: Endpoint[]): string {
    return this.compiled({ endpoints }, eta.config);
  }
}

const defaultClassTemplateName = '$$class';
const defaultClassTemplate = `<%-
  const tabSize = 4;
  const tabs2 = ' '.repeat(tabSize*2);
  const tabs3 = ' '.repeat(tabSize*3);
-%>
<%- if (it.endpoint) { -%>
@odataEndpoint(Endpoints.<%= it.endpoint %>)
<% } -%>
<%- if (it.baseType && it.propertyInfos.length > it.baseType.propertyInfos.length) { -%>
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
<% } -%>
export class <%= it.className %><% if (it.baseType) { %> extends <%= it.baseType.className %><% } %> {

    public static create<T<%= it.className %> extends <%= it.className %> = <%= it.className %>>(this: Class<T<%= it.className %>>, model: Partial<T<%= it.className %>>): T<%= it.className %> {
        return new this(
<% for(const p of it.propertyInfos) { -%>
            model.<%= p.name %>,
<% } -%>
        );
    }

    public constructor(
<% for(const p of it.propertyInfos) { -%>
        public <%= p.name %><% if(p.isNullable){%>?<% } %>: <%= p.type %>,
<% } -%>
    ) <%_ if (it.baseType) { %> {
        super(
<% for(const p of it.baseType.propertyInfos) { -%>
            <%= p.name %>,
<% } -%>
        );
    }
    <%_ } else { %> { } <%_ } -%>

}`;

const defaultInterfaceTemplateName = '$$interface';
const defaultInterfaceTemplate = `export interface <%= it.name %><% if (it.baseType) { %> extends <%= it.baseType %><% } %> {
<% for(const p of it.propertyInfos) { -%>
    <%= p.name %><% if(p.isNullable){%>?<% } %>: <%= p.type %>;
<% } -%>
}`;

const defaultEnumTemplateName = '$$enum';
const defaultEnumTemplate = `export enum <%= it.name %> {
<% for(const member of it.members) { -%>
    <%= member %> = '<%= member %>',
<% } -%>
}`;
const defaultEdmTemplate = `/**
 * This is a generated file. Please don't change this manually.
 */

<% for(const i of it.importDirectives) { -%>
import {
<% for(const item of i.items) { -%>
    <%= item %>,
<% } -%>
} from "<%= i.nsPath %>";
<% } -%>
<%- for(const info of it.classInfos) { %>
<%~ include('${defaultClassTemplateName}', {...info, namespace: it.namespace}) %>
<% } -%>

<%- for(const info of it.interfaceInfos) { %>
<%~ include('${defaultInterfaceTemplateName}', info) %>
<% } -%>

<%- for(const info of it.enumInfos) { %>
<%~ include('${defaultEnumTemplateName}', info) %>
<% } -%>`;
export class EdmTemplate {
  private compiled!: TemplateFunction;

  public constructor(
    template?: string,
  ) {
    if (template !== undefined) {
      this.compiled = eta.compile(template);
    } else {
      this.initializeDefault();
    }
  }

  private initializeDefault(): void {
    eta.templates.define(defaultClassTemplateName, eta.compile(defaultClassTemplate));
    eta.templates.define(defaultInterfaceTemplateName, eta.compile(defaultInterfaceTemplate));
    eta.templates.define(defaultEnumTemplateName, eta.compile(defaultEnumTemplate));
    this.compiled = eta.compile(defaultEdmTemplate);
  }

  public render(info: EdmInfo): string {
    return this.compiled(info, eta.config);
  }
}