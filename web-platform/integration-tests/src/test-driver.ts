import * as minimist from "minimist";

export function create() {
  const args = minimist(process.argv.slice(2), {
    boolean: ["load_extension", "headless_mode"],
    string: ["test_browser"],
  });

  for (const arg of ["test_browser", "load_extension", "headless_mode"]) {
    if (!(arg in args)) {
      throw new Error(`Missing required option: --${arg}`);
    }
  }

  return {
    type: args["test_browser"],
    isHeadless: args["headless_mode"],
  };
}
