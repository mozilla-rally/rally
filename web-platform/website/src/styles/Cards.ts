
import { style } from "typestyle";
import { Spacing } from "./Spacing";

export const CardStyles = {
  account: {
    default: style({
      maxWidth: "660px",
    }),
    updates: style({
      maxWidth: "550px",
      padding: Spacing.xxLarge
    })
  }

}