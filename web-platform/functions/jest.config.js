export default {
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  resolver: "ts-jest-resolver",
  moduleNameMapper: {
    "^@mozilla/glean/node": "@mozilla/glean/dist/index/node.js",
    "^@mozilla/glean/plugins/(.*)": "@mozilla/glean/dist/plugins/$1.js",
    "^@mozilla/glean/uploader": "@mozilla/glean/dist/core/upload/uploader.js",
    "^@mozilla/glean/private/metrics/(.*)":
      "@mozilla/glean/dist/core/metrics/types/$1.js",
    "^@mozilla/glean/private/ping":
      "@mozilla/glean/dist/core/pings/ping_type.js",
  },
  testRegex: "src(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["lib/", "node_modules/", "setupTests.js"],
  moduleFileExtensions: ["js", "ts", "tsx", "jsx", "json", "node"],
  testEnvironment: "node",
};
