module.exports = {
  indentSize: 2,
  endpoints: [
    {
      url: 'https://foo.example.com',
      outputDir: 'foo',
      ignore: [
        'DummyCondition',
        'Status',
        'Ignored1',
        'Ignored2',
      ]
    },
    {
      url: 'https://bar.example.com',
      outputDir: 'bar'
    },
  ]
}