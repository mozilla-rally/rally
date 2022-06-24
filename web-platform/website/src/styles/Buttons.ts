import { style } from "typestyle";
import { Colors } from "./Colors";

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