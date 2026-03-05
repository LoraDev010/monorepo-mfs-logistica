/** @type {import('jest').Config} */
const path = require('node:path')

module.exports = {
  rootDir: '..',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.resolve(__dirname, '../../../shared/test/jest.setup.ts')],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { configFile: path.resolve(__dirname, '../../../shared/test/babel.config.cjs') }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    '^motion/react$': path.resolve(__dirname, '../../../shared/test/motion.mock.tsx'),
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/bootstrap.tsx',
    '!src/**/types.ts',
    '!src/**/*.d.ts',
    '!src/__mocks__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}
