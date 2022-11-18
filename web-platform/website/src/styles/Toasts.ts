import { style } from "typestyle";

import { Colors } from "./Colors";
import { FontSizeRaw } from "./Fonts";

export const ToastStyle = {
  accountToast: style({
    backgroundColor: Colors.ColorGreen10,
    width: "302px",
    fontSize: FontSizeRaw.Small.fontSize,
    opacity: 1,
    left: "12rem",
    top: "-2rem",
  }),
  opacityZero: style({
    opacity: "0",
  }),

  productToast: style({
    maxWidth: "unset",
    padding: "0",
    height: "38px",
  }),
};
