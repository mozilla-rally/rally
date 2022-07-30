import { style } from "typestyle";

import { Colors } from "./Colors";
import { Spacing } from "./Spacing";

export const StandardAccordion = style({
  $nest: {
    ".accordion-item": {
      backgroundColor: "transparent",
      border: "none",
    },
    ".accordion-button": {
      backgroundColor: "transparent",
      padding: 0,
      boxShadow: "none",
      fontWeight: 700,
      color: Colors.ColorBlack,
      $nest: {
        "&:after": {
          backgroundImage: `url("img/caret.svg")`,
          marginLeft: Spacing.Micro,
          height: Spacing.Large,
          width: Spacing.Large,
        },
        "&:not(.collapsed)": {
          backgroundColor: "unset",
          $nest: {
            "&:after": {
              transform: "rotate(90deg)",
            },
          },
        },
      },
    },
    ".accordion-body": {
      padding: 0,
    },
  },
});
