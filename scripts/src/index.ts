import minimist from "minimist";

import { initializeFirebase } from "./FirebaseConfig";

const argv = minimist(process.argv.slice(2));

const { scriptName, ...others } = argv;

assert(!!scriptName, `Missing scriptName argument.`, 1);

initializeFirebase();

(async () => {
  const { default: script } = await import(`./${scriptName}`);

  assert(!!script, `Missing script ${scriptName}.`, 1);

  await script(others);
})();

function assert(condition: boolean, error: string, code: number) {
  if (!condition) {
    console.error(error);
    process.exit(code);
  }
}
