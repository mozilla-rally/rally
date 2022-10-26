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
      boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
      borderRadius: Spacing.Micro,
      backgroundColor: "#ffffff",
    }),
  },
};
