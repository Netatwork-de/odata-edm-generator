import { Endpoint } from '../dist/cli/shared.js';

export const standardEndpoints: Endpoint[] = [
  { name: 'People', kind: 'EntitySet', url: 'People' },
  { name: 'Foos', kind: 'EntitySet', url: 'Foos' },
  { name: 'Bar', kind: 'EntitySet', url: 'fizzbazz' },
];
