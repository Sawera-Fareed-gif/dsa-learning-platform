module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/server/tests/**/*.test.ts', '**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  collectCoverageFrom: [
    'server/src/controllers/**/*.ts',
    'server/src/middleware/**/*.ts',
    '!server/src/server.ts',
    '!server/src/types.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
