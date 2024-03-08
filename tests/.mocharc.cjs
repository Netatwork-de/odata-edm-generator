module.exports = {
  spec: './tests/.artifacts/dist/tests/**/*.spec.js',
  reporter: '@netatwork/mocha-utils/dist/JunitSpecReporter.js',
  reporterOptions: ['mochaFile=./tests/.artifacts/results.xml'],
};