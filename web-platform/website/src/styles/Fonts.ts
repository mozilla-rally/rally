import { style } from "typestyle";

export const Fonts = {
  Headline: style({
    fontFamily: `"Zilla Slab", Inter, X-LocaleSpecific, sans-serif`,
    fontWeight: 700,
  }),
};

export const FontSize = {
  xSmall: style({
    fontSize: `${12 / 16}rem`,
  }),
  Small: style({
    fontSize: `${14 / 16}rem`,
  }),
  Normal: style({
    fontSize: "1rem",
  }),
  Large: style({
    fontSize: `${18 / 16}rem`,
  }),
};
