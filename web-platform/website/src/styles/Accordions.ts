import { style } from "typestyle";

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
      $nest: {
        "&:after": {
          backgroundImage: `url("img/caret.svg")`,
          marginLeft: Spacing.Micro,
          height: Spacing.Large,
          width: Spacing.Large,
        },
        "&:not(.collapsed)": {
          color: "unset",
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
