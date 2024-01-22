module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: ['.*\\.spec\\.ts$', '.*\\.e2e-spec\\.ts$'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testSequencer: 'D:\\nest_graphql_test\\test-sequencer.js'
}
