module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '\\.txt$': 'jest-raw-loader',
    '\\.html$': 'jest-raw-loader'
  },
  testMatch: ['**/tests/**/*.test.ts'],
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: !process.argv.includes('--watch'),
  collectCoverageFrom: ['app/**/*.ts', '!app/repository/*', '!handler.ts']
};
