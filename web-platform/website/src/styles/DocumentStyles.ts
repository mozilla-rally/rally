import { cssRule, fontFace, style } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

import { Colors } from "./Colors";
import { createResponsiveStyle } from "./ResponsiveStyle";
import { ScreenSize } from "./ScreenSize";
import { Spacing } from "./Spacing";

cssRule("html, body", {
  fontFamily: "Inter, X-LocaleSpecific, sans-serif",
  "-webkit-font-smoothing": "antialiased",
  margin: 0,
  padding: 0,
});

cssRule("a, a:hover", {
  color: "inherit",
});

fontFace(
  {
    fontDisplay: "swap",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    src: "url('fonts/Inter-Regular.woff2') format('woff2')",
  },
  {
    fontDisplay: "swap",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "bold",
    src: "url('fonts/Inter-Bold.woff2') format('woff2')",
  },
  {
    fontDisplay: "swap",
    fontFamily: "Inter",
    fontStyle: "italic",
    fontWeight: "normal",
    src: "url('fonts/Inter-Italic.woff2') format('woff2')",
  },
  {
    fontDisplay: "swap",
    fontFamily: "Inter",
    fontStyle: "italic",
    fontWeight: "bold",
    src: "url('fonts/Inter-BoldItalic.woff2') format('woff2')",
  },
  {
    fontDisplay: "swap",
    fontFamily: "Zilla Slab",
    fontStyle: "normal",
    fontWeight: "normal",
    src: "url('fonts/ZillaSlab-Regular.woff2') format('woff2')",
  },
  {
    fontDisplay: "swap",
    fontFamily: "Zilla Slab",
    fontStyle: "normal",
    fontWeight: "bold",
    src: "url('fonts/ZillaSlab-Bold.woff2') format('woff2')",
  }
);

const fullscapePageSmallerSize: NestedCSSProperties = {
  width: "100%",
  paddingTop: Spacing.xxxLarge,
  paddingLeft: Spacing.xxLarge,
  paddingRight: Spacing.xxLarge,
};

export const FullscapePageContainer = style(
  createResponsiveStyle(ScreenSize.ExtraSmall, fullscapePageSmallerSize),
  createResponsiveStyle(ScreenSize.Small, fullscapePageSmallerSize),
  createResponsiveStyle(ScreenSize.Medium, fullscapePageSmallerSize),
  {
    color: Colors.ColorMarketingGray70,
    paddingTop: Spacing.xxxLarge * 2,
    paddingBottom: 200,
    width: "688px",
    $nest: {
      "h1, h2, h3, h4": {
        marginBottom: Spacing.xxLarge,
        color: Colors.ColorBlack,
      },
      h1: {
        fontSize: "2.375rem",
      },
      h2: {
        fontSize: "1.5rem",
      },
      hr: {
        marginTop: Spacing.xLarge,
        marginBottom: Spacing.xLarge,
      },
    },
  }
);

cssRule(".modal-backdrop.show", {
  opacity: 0.8,
});

export function ApplyFullscapePageStyles() {
  cssRule("body", {
    background: `url("/img/noise-texture-top.png"), url("/img/noise-texture.png")`,
    backgroundBlendMode: "screen",
  });
}
