import { style } from "typestyle";

import { Colors } from "./Colors";
import { Spacing } from "./Spacing";

export const CardStyles = {
  account: {
    default: style({
      maxWidth: "660px",
    }),
    updates: style({
      maxWidth: "550px",
      padding: Spacing.xxLarge,
    }),
  },

  product: {
    container: style({
      border: `1px solid ${Colors.ColorMarketingGray30}`,
      borderRadius: Spacing.Micro,
      backgroundColor: "#ffffff",
    }),
  },
};
