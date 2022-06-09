import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";
import replace from "@rollup/plugin-replace";

const emulatorMode = process.argv.includes("--config-emulator-mode");

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    sourceMap: true,
  }),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#rally",
    adapter: adapter({
      env: {
        log: { warn }
      }
    }),
    ssr: false,
    vite: {
      plugins: [
        replace({
          preventAssignment: true,
          // the following replacements build the site URLs.
          // In the templates, use (for example) __BASE_SITE_URL__/__FAQ_PATH__
          __BASE_SITE__: "https://rally.mozilla.org",
          __EMULATOR_MODE__: emulatorMode,
        }),
      ],
    },
  },
};

export default config;
