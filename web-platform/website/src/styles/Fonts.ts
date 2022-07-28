import { style } from "typestyle";

export const FontsRaw = {
  Headline: {
    fontFamily: `"Zilla Slab", Inter, X-LocaleSpecific, sans-serif`,
    fontWeight: 700,
  },
};

export const Fonts = {
  Headline: style(FontsRaw.Headline),
};

export const FontSizeRaw = {
  xSmall: {
    fontSize: `${12 / 16}rem`,
  },
  Small: {
    fontSize: `${14 / 16}rem`,
  },
  Normal: {
    fontSize: "1rem",
  },
  Large: {
    fontSize: `${18 / 16}rem`,
  },
};

export const FontSize = {
  xSmall: style(FontSizeRaw.xSmall),
  Small: style(FontSizeRaw.Small),
  Normal: style(FontSizeRaw.Normal),
  Large: style(FontSizeRaw.Large),
};
