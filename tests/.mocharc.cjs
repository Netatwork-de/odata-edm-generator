const path = require("path");
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const cwd = pathToFileURL("./");
register(
  "ts-node/esm",
  cwd,
  { project: path.resolve(cwd.href, './tests/tsconfig.json') }
);

const isDev = !!process.env.DEV;
module.exports = {
  // extension: ['ts', 'js'],
  spec: './tests/**/*.spec.ts',
  // "node-option": [
  //   "loader=ts-node/esm"
  // ],
  // require: [path.resolve('./tests/ts-hook.cjs')/* , 'source-map-support/register' */],
  // reporter: '@netatwork/mocha-utils/dist/JunitSpecReporter.js',
  // reporterOptions: ['mochaFile=./tests/.artifacts/results.xml'],
  // ...(isDev ? { watch: true, 'watch-files': './**/*.ts' } : {})
};