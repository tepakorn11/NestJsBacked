// jest.config.ts
export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$', // รวมทั้ง unit + e2e ได้
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.module.ts', 
  ],
  coveragePathIgnorePatterns: [
    '/src/.*/entities/.*', 
    '/src/redis/',
    '/src/common/',
    '/src/main.ts',


  ],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
};
