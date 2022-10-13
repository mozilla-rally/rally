import { style } from "typestyle";

export const LinkStyles = {
  NoUnderline: style({
    textDecoration: "none",
    $nest: {
      "&:hover": {
        textDecoration: "underline",
      },
    },
  }),
  Underline: style({
    textDecoration: "underline",
    $nest: {
      "&:hover": {
        textDecoration: "none",
      },
    },
  }),
};
