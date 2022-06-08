export const parameters = {
  layout: "fullscreen",
  actions: {
    argTypesRegex: "^on[A-Z].*",
    argTypesRegex: "^fetch[A-Z].*",
    argTypesRegex: "^create[A-Z].*",
    argTypesRegex: "^update[A-Z].*",
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
