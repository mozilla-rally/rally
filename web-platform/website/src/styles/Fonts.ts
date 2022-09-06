import { style } from "typestyle";
import {Colors} from "./Colors"

export const FontsRaw = {
  Headline: {
    fontFamily: `"Zilla Slab", Inter, X-LocaleSpecific, sans-serif`,
    fontWeight: 700,
  },
  MediumBodySM:{
    fontFamily: 'Inter',
    fontStyle: "normal",
    fontWeight: "500",
  },
  Labels:{
    color: Colors.ColorMarketingGray70
  }
};

export const Fonts = {
  Headline: style(FontsRaw.Headline),
  MediumBodySM: style(FontsRaw.MediumBodySM),
  Labels: style(FontsRaw.Labels)
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
  xLarge: {
    fontSize: `${20 / 16}rem`,
  },
  xxLarge: {
    fontSize: `${24 / 16}rem`,
  },
};

export const FontSize = {
  xSmall: style(FontSizeRaw.xSmall),
  Small: style(FontSizeRaw.Small),
  Normal: style(FontSizeRaw.Normal),
  Large: style(FontSizeRaw.Large),
  xLarge: style(FontSizeRaw.xLarge),
  xxLarge: style(FontSizeRaw.xxLarge),
};
