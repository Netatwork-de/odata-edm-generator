import { assert } from 'chai';
import { EndpointTemplate } from '../src/cli/templates';
import { standardEndpoints } from './data';
describe('templates', function () {

  describe('EndpointTemplate', function () {

    it('renders the template correctly', function () {
      const actual = new EndpointTemplate().render(standardEndpoints);
      assert.strictEqual(actual,
        `/**
* This is a generated file. Please don't change this manually.
*/
export const enum Endpoints {
    People = 'People',
    Foos = 'Foos',
    Bar = 'fizzbazz',
}`
      );
    });

    it('Respects the given template', function () {
      const template = 'export const enum Endpoints {<% for(const endpoint of it.endpoints) { %> <%= endpoint.name %> = "<%= endpoint.url %>",<% } %>}'
      const actual = new EndpointTemplate(template).render(standardEndpoints);
      assert.strictEqual(actual, 'export const enum Endpoints { People = "People", Foos = "Foos", Bar = "fizzbazz",}');
    });

  });

});
