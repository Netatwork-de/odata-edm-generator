import * as eta from 'eta';
import type { TemplateFunction } from 'eta/dist/types/compile';
import { Configuration } from './configuration';
import { EdmInfo, Endpoint } from './shared';

eta.configure({ autoTrim: false, autoEscape: false });

const defaultEndpointsTemplate = `/**
 * This is a generated file. Please don't change this manually.
 */
<%-
  const quote = it.quote;
  const indent = it.indent;
%>
export const enum Endpoints {
<% for(const endpoint of it.endpoints) { -%>
<%= indent %><%= endpoint.name %> = <%= quote %><%= endpoint.url %><%= quote %>,
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
    const config = Configuration.instance;
    return this.compiled(
      {
        endpoints,
        quote: config.quote,
        indent: config.indent,
      },
      eta.config);
  }
}

const defaultClassTemplateName = '$$class';
const defaultClassTemplate = `<%-
  const indent = it.indent;
-%>
<%- if (it.endpoint) { -%>
@odataEndpoint(Endpoints.<%= it.endpoint %>)
<% } -%>
<%- if (it.baseType && it.propertyInfos.length > it.baseType.propertyInfos.length) { -%>
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
<% } -%>
export class <%= it.className %><% if (it.baseType) { %> extends <%= it.baseType.className %><% } %> {

<%= indent %>public static create<T<%= it.className %> extends <%= it.className %> = <%= it.className %>>(this: Class<T<%= it.className %>>, model: Partial<T<%= it.className %>>): T<%= it.className %> {
<%= indent.repeat(2) %>return new this(
<% for(const p of it.propertyInfos) { -%>
<%= indent.repeat(3) %>model.<%= p.name %>,
<% } -%>
<%= indent.repeat(2) %>);
<%= indent %>}

<%= indent %>public constructor(
<% for(const p of it.propertyInfos) { -%>
<%= indent.repeat(2) %>public <%= p.name %><% if(p.isNullable){%>?<% } %>: <%= p.type %>,
<% } -%>
<%= indent %>) <%_ if (it.baseType) { %> {
<%= indent.repeat(2) %>super(
<% for(const p of it.baseType.propertyInfos) { -%>
<%= indent.repeat(3) %><%= p.name %>,
<% } -%>
<%= indent.repeat(2) %>);
<%= indent %>}
<%- } else { %> { } <%_ } -%>

}`;

const defaultComplexTypeTemplateName = '$$complex';
const defaultComplexTypeTemplate = `<%-
const indent = it.indent;
const quote = it.quote;
const derivedTypes = it.derivedTypes;
const baseType = it.baseType;
const name =  it.name;
-%>
<% if (derivedTypes.length > 0) { -%>
export enum $$<%= name %>Types {
<% for(const t of derivedTypes) { -%>
<%= indent %><%= t.name %> = <%= quote %><%= t.name %><%= quote %>,
<% } -%>
}

export class <%= name %> {

<%= indent %>protected static get derivedTypes(): typeof <%= name %>[] {
<%= indent.repeat(2) %>return [
<% for(const t of derivedTypes) { -%>
<%= indent.repeat(3) %><%= t.name %>,
<% } -%>
<%= indent.repeat(2) %>];
<%= indent %>}

<%= indent %>public static create(raw: Partial<<%= name %>>): <%= name %> {
<%= indent.repeat(2) %>if (raw === undefined || raw === null) { return raw as <%= name %>; }
<%= indent.repeat(2) %>const edmType = raw[odataTypeKey];
<%= indent.repeat(2) %>const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
<%= indent.repeat(2) %>if (!ctor) {
<%= indent.repeat(3) %>return raw as <%= name %>;
<%= indent.repeat(2) %>}
<%= indent.repeat(2) %>const result = new ctor();
<%= indent.repeat(2) %>result.initialize(raw);
<%= indent.repeat(2) %>return result;
<%= indent %>}

<%= indent %>protected static canHandle(_odataType: string): boolean { return false; }

<% for(const p of it.propertyInfos) { -%>
<%= indent %>public <%= p.name %><% if(p.isNullable){%>?<% } %>: <%= p.type %>;
<% } -%>
<%= indent %>public readonly $$type: $$<%= name %>Types;

<%= indent %>protected initialize(raw: Partial<<%= name %>>) {
<% for(const p of it.propertyInfos) { -%>
<%= indent.repeat(2) %>this.<%= p.name %> = raw.<%= p.name %>;
<% } -%>
<%= indent %>}
}
<%- } else if (baseType !== null) { -%>
@odataType(<%= quote %>#<%= it.namespace %>.<%= name %><%= quote %>, $$<%= baseType.name %>Types.<%= name %>, <%= quote %>$$type<%= quote %>)
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
export class <%= name %> extends <%= baseType.name %> {

<% for(const p of it.propertyInfos) { -%>
<%= indent %>public <%= p.name %><% if(p.isNullable){%>?<% } %>: <%= p.type %>;
<% } %>
<%= indent %>protected initialize(raw: Partial<<%= name %>>) {
<%= indent.repeat(2) %>super.initialize(raw);
<% for(const p of it.propertyInfos) { -%>
<%= indent.repeat(2) %>this.<%= p.name %> = raw.<%= p.name %>;
<% } -%>
<%= indent %>}
}
<%- } else { -%>
export interface <%= name %> {
<% for(const p of it.propertyInfos) { -%>
<%= indent %><%= p.name %><% if(p.isNullable){%>?<% } %>: <%= p.type %>;
<% } -%>
}
<%- } -%>`;

const defaultEnumTemplateName = '$$enum';
const defaultEnumTemplate = `<%-
  const quote = it.quote;
  const indent = it.indent;
-%>
export enum <%= it.name %> {
<% for(const member of it.members) { -%>
<%= indent %><%= member %> = <%= quote %><%= member %><%= quote %>,
<% } -%>
}`;

const defaultEdmTemplate = `/**
 * This is a generated file. Please don't change this manually.
 */
<%-
  const quote = it.quote;
  const indent = it.indent;
  const namespace = it.namespace;
%>

<% for(const i of it.importDirectives) { -%>
import {
<% for(const item of i.items) { -%>
<%= indent %><%= item %>,
<% } -%>
} from <%= quote %><%= i.nsPath %><%= quote %>;
<% } -%>
<%- for(const info of it.classInfos) { %>
<%~ include('${defaultClassTemplateName}', {...info, namespace, quote, indent}) %>
<% } -%>

<%- for(const info of it.complexTypeInfos) { %>
<%~ include('${defaultComplexTypeTemplateName}', {...info, namespace, quote, indent}) %>
<% } -%>

<%- for(const info of it.enumInfos) { %>
<%~ include('${defaultEnumTemplateName}', {...info, quote, indent}) %>
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
    eta.templates.define(defaultComplexTypeTemplateName, eta.compile(defaultComplexTypeTemplate));
    eta.templates.define(defaultEnumTemplateName, eta.compile(defaultEnumTemplate));
    this.compiled = eta.compile(defaultEdmTemplate);
  }

  public render(info: EdmInfo): string {
    return this.compiled(info, eta.config);
  }

  public dispose(): void {
    eta.templates.remove(defaultClassTemplateName);
    eta.templates.remove(defaultComplexTypeTemplateName);
    eta.templates.remove(defaultEnumTemplateName);
  }
}