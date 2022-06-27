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

export const SecondaryButton = style({
  color: Colors.ColorMarketingGray70,
  borderColor: Colors.ColorMarketingGray30,
  $nest: {
    "&:hover": {
      backgroundColor: Colors.ColorMarketingGray20,
      color: Colors.ColorBlack,
    },
  },
});