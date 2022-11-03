export default {
  resolver: "ts-jest-resolver",
  testRegex: ["src\.*/*.tests.ts"],
  testPathIgnorePatterns: ["lib/", "node_modules/", "setupTests.js"],
  moduleFileExtensions: ["js", "ts", "tsx", "jsx", "json", "node"],
  testEnvironment: "node",
};