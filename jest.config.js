const merge = require('merge');
const ts_preset = require('ts-jest/jest-preset');

module.exports = merge.recursive(ts_preset, {
    collectCoverage: true,
    collectCoverageFrom: [
        'lib/**/*.ts',
    ],
    coverageProvider: 'v8',
    clearMocks: true,
    verbose: true,
    testPathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/node_modules/',
    ],
    testResultsProcessor: 'jest-sonar-reporter',
});
