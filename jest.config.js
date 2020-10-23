module.exports = {
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json-summary', 'json', 'text', 'lcov', 'clover'],
  // A set of global variables that need to be available in all test environments
  globals: {
    window: {},
  },
}
