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
};
