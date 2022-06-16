import { cssRule, fontFace } from "typestyle";

cssRule("html, body", {
  fontFamily: "Inter, X-LocaleSpecific, sans-serif",
  margin: 0,
  padding: 0,
});

cssRule("a, a:hover", {
  color: "inherit",
});

fontFace({
  fontDisplay: "swap",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "normal",
  src: "url('fonts/Inter-Regular.woff2') format('woff2')",
}, {
  fontDisplay: "swap",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "bold",
  src: "url('fonts/Inter-Bold.woff2') format('woff2')",
}, {
  fontDisplay: "swap",
  fontFamily: "Inter",
  fontStyle: "italic",
  fontWeight: "normal",
  src: "url('fonts/Inter-Italic.woff2') format('woff2')",
}, {
  fontDisplay: "swap",
  fontFamily: "Inter",
  fontStyle: "italic",
  fontWeight: "bold",
  src: "url('fonts/Inter-BoldItalic.woff2') format('woff2')",
}, {
  fontDisplay: "swap",
  fontFamily: "Zilla Slab",
  fontStyle: "normal",
  fontWeight: "normal",
  src: "url('fonts/ZillaSlab-Regular.woff2') format('woff2')",
}, {
  fontDisplay: "swap",
  fontFamily: "Zilla Slab",
  fontStyle: "normal",
  fontWeight: "bold",
  src: "url('fonts/ZillaSlab-Bold.woff2') format('woff2')",
});