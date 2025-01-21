import { Eta } from 'eta';
import { Configuration } from './configuration.js';
import { EdmInfo, Endpoint } from './shared.js';

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
  private static readonly templateName: string = '@endpoint';
  private readonly eta: Eta;
  public constructor(
    template: string = defaultEndpointsTemplate,
  ) {
    const eta = this.eta = new Eta({ autoTrim: false, autoEscape: false });
    eta.loadTemplate(EndpointTemplate.templateName, template);
  }

  public render(endpoints: Endpoint[]): string {
    const config = Configuration.instance;
    return this.eta.render(
      EndpointTemplate.templateName,
      {
        endpoints,
        quote: config.quote,
        indent: config.indent,
      });
  }
}

const defaultClassTemplateName = '@$$class';
const defaultClassTemplate = `<%-
  const indent = it.indent;
-%>
<%- if (it.endpoint) { -%>
@odataEndpoint(Endpoints.<%= it.endpoint %>)
<% } -%>
<%- if (it.baseType && it.propertyInfos.length > it.baseType.propertyInfos.length) { -%>
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
<% } -%>
export class <%= it.name %><% if (it.baseType) { %> extends <%= it.baseType.name %><% } %> {

<%= indent %>public static create<T<%= it.name %> extends <%= it.name %> = <%= it.name %>>(this: Class<T<%= it.name %>>, raw: T<%= it.name %>): T<%= it.name %> {
<%= indent.repeat(2) %>return new this(
<% for(const p of it.propertyInfos) { -%>
<%= indent.repeat(3) %><% if (typeof p.type === 'string') { %>raw.<%= p.name %><% } else { %>tryCreateModel(<%= p.type.name %>, raw.<%= p.name %>)<% } %>,
<% } -%>
<%= indent.repeat(2) %>);
<%= indent %>}

<%= indent %>public constructor(
<% for(const p of it.propertyInfos) { -%>
<%= indent.repeat(2) %>public <%= p.name %><% if(p.isNullable){%>?<% } %>: <% if (typeof p.type === 'string') { %><%= p.type %><% } else { %><%= p.type.name %><% } %>,
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

const defaultComplexTypeTemplateName = '@$$complex';
const defaultComplexTypeTemplate = `<%-
const indent = it.indent;
const quote = it.quote;
const derivedTypes = it.derivedTypes;
const baseType = it.baseType;
const name =  it.name;
const isAbstract = it.isAbstract;
-%>
<% if (derivedTypes.length > 0) { -%>
export enum $$<%= name %>Types {
<% for(const t of derivedTypes) { -%>
<% if (!t.isAbstract) { -%>
<%= indent %><%= t.name %> = <%= quote %><%= t.name %><%= quote %>,
<% } -%>
<% } -%>
}

export interface <%= name %> {
<%= indent %>readonly $$type: $$<%= name %>Types;
}

export<% if(isAbstract) { %> abstract<% } %> class <%= name %> {

<%= indent %>protected static get derivedTypes(): typeof <%= name %>[] {
<%= indent.repeat(2) %>return [
<% for(const t of derivedTypes) { -%>
<% if (!t.isAbstract) { -%>
<%= indent.repeat(3) %><%= t.name %>,
<% } -%>
<% } -%>
<%= indent.repeat(2) %>] as unknown as typeof <%= name %>[];
<%= indent %>}

<%= indent %>public static create<T<%= name %> extends <%= name %> = <%= name %>>(raw: T<%= name %>): T<%= name %> {
<%= indent.repeat(2) %>const edmType = (raw as ODataRawType<T<%= name %>>)[odataTypeKey];
<%= indent.repeat(2) %>const ctor = this.derivedTypes.find((f) => f.canHandle(edmType));
<%= indent.repeat(2) %>if (!ctor) {
<%= indent.repeat(3) %>return raw;
<%= indent.repeat(2) %>}
<%= indent.repeat(2) %>return ctor.create(raw);
<%= indent %>}

<%= indent %>protected static canHandle(_odataType: string): boolean { return false; }

<%= indent %><% if(isAbstract) { %>protected<% } else { %>public<% } %> constructor(
<% for(const p of it.propertyInfos) { -%>
<%= indent.repeat(2) %>public <%= p.name %><% if(p.isNullable){%>?<% } %>: <% if (typeof p.type === 'string') { %><%= p.type %><% } else { %><%= p.type.name %><% } %>,
<% } -%>
<%= indent %>) { }
}
<%- } else if (baseType !== null) { -%>
<% if (!isAbstract) { -%>
@odataType(<%= quote %>#<%= it.namespace %>.<%= name %><%= quote %>, $$<%= it.rootType.name %>Types.<%= name %>, <%= quote %>$$type<%= quote %>)
// @ts-ignore needed to avoid this issue: https://github.com/microsoft/TypeScript/issues/4628
<% } -%>
export<% if(isAbstract) { %> abstract<% } %> class <%= name %> extends <%= baseType.name %> {

<%= indent %><% if(isAbstract) { %>protected<% } else { %>public<% } %> constructor(
<% for(const p of it.propertyInfos) { -%>
<%= indent.repeat(2) %>public <%= p.name %><% if(p.isNullable){%>?<% } %>: <% if (typeof p.type === 'string') { %><%= p.type %><% } else { %><%= p.type.name %><% } %>,
<% } -%>
<%= indent %>) <%_ if (it.baseType) { %> {
<%= indent.repeat(2) %>super(
<% for(const p of it.baseType.propertyInfos) { -%>
<%= indent.repeat(3) %><%= p.name %>,
<% } -%>
<%= indent.repeat(2) %>);
<%= indent %>}
<%- } else { %> { } <%_ } -%>
<% if(!isAbstract) { %>

<%= indent %>public static create<T<%= name %> extends <%= name %> = <%= name %>>(raw: T<%= name %>): T<%= name %> {
<%= indent.repeat(2) %>return new this(
<% for(const p of it.propertyInfos) { -%>
<%= indent.repeat(3) %><% if (typeof p.type === 'string') { %>raw.<%= p.name %><% } else { %>tryCreateModel(<%= p.type.name %>, raw.<%= p.name %>)<% } %>,
<% } -%>
<%= indent.repeat(2) %>) as T<%= name %>;
<%= indent %>}
<% } %>
}
<%- } else { -%>
export interface <%= name %> {
<% for(const p of it.propertyInfos) { -%>
<%= indent %><%= p.name %><% if(p.isNullable){%>?<% } %>: <%= p.type %>;
<% } -%>
}
<%- } -%>`;

const defaultEnumTemplateName = '@$$enum';
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
  private static readonly templateName: string = '@edm';
  private readonly eta!: Eta;

  public constructor(
    template?: string,
  ) {
    this.eta = new Eta({ autoTrim: false, autoEscape: false });
    if (template !== undefined) {
      this.eta.loadTemplate(EdmTemplate.templateName, template);
    } else {
      this.initializeDefault();
    }
  }

  private initializeDefault(): void {
    const eta = this.eta;
    eta.loadTemplate(defaultClassTemplateName, defaultClassTemplate);
    eta.loadTemplate(defaultComplexTypeTemplateName, defaultComplexTypeTemplate);
    eta.loadTemplate(defaultEnumTemplateName, defaultEnumTemplate);
    eta.loadTemplate(EdmTemplate.templateName, defaultEdmTemplate);
  }

  public render(info: EdmInfo): string {
    return this.eta.render(EdmTemplate.templateName, info);
  }
}