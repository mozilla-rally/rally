import { style } from "typestyle";

import { Colors } from "./Colors";
import { FontSizeRaw, FontsRaw } from "./Fonts";

export const PrimaryButton = style({
  color: Colors.ColorWhite,
  backgroundColor: Colors.ColorBlack,
  $nest: {
    "&:hover": {
      color: Colors.ColorBlack,
      backgroundColor: Colors.ColorMarketingGray20,
    },
  },
});

export const SecondaryButton = style({
  backgroundColor: Colors.ColorLink,
  borderColor: Colors.ColorTransparent,
  $nest: {
    "&:hover": {
      backgroundColor: Colors.ColorLinkHover,
      borderColor: Colors.ColorTransparent,
    },
  },
});

export const TertiaryButton = style({
  color: Colors.ColorMarketingGray70,
  borderColor: Colors.ColorMarketingGray30,
  $nest: {
    "&:hover": {
      backgroundColor: Colors.ColorMarketingGray20,
      color: Colors.ColorBlack,
    },
  },
});

export const AccentButton = style({
  color: Colors.ColorRed60,
  borderColor: Colors.ColorRed60,
  $nest: {
    "&:hover": {
      backgroundColor: Colors.ColorRed60,
      color: Colors.ColorWhite,
    },
  },
});

export const ProductButton = style({
  color: Colors.ColorWhite,
  borderColor: Colors.ColorBlue50,
  backgroundColor: Colors.ColorBlue50,
  $nest: {
    "&:hover": {
      backgroundColor: Colors.ColorBlue60,
      color: Colors.ColorWhite,
    },
  },
});

export const DisabledProductButton = style({
  color: `${Colors.ColorWhite} !important`,
  borderColor: `${Colors.ColorBlue40} !important`,
  backgroundColor: `${Colors.ColorBlue40} !important`,
});

export const TransparentButton = style({
  ...FontsRaw.MediumBodySM,
  color: Colors.ColorMarketingGray70,
  border: "none",
  $nest: {
    "&:hover": {
      backgroundColor: Colors.ColorTransparent,
      color: Colors.ColorMarketingGray70,
      textDecoration: "underline",
    },
  },
});

export const LinkButton = style({
  ...FontsRaw.MediumBodySM,
  ...FontSizeRaw.Normal,
  color: "#000000",
  border: "none",
  backgroundColor: Colors.ColorTransparent,
  $nest: {
    "&:hover": {
      backgroundColor: Colors.ColorTransparent,
      textDecoration: "underline",
      color: "#000000",
    },
  },
});
