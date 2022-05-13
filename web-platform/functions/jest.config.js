export default {
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  reporters: ["jest-standard-reporter"],
  resolver: "ts-jest-resolver",
  testRegex: "src(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["lib/", "node_modules/", "setupTests.js"],
  moduleFileExtensions: ["js", "ts", "tsx", "jsx", "json", "node"],
  testEnvironment: "node",
};
