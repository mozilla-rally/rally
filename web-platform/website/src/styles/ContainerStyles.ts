import { style } from "typestyle";

import { createResponsiveStyle } from "./ResponsiveStyle";
import { ScreenSize } from "./ScreenSize";
import { Spacing } from "./Spacing";

const smallerStyle = {
  paddingTop: Spacing.xLarge,
  paddingBottom: Spacing.xLarge,
  paddingLeft: Spacing.xxxLarge,
  paddingRight: Spacing.xxxLarge,
};

const largeStyle = {
  paddingLeft: Spacing.xxxLarge * 4.5,
  paddingRight: Spacing.xxxLarge * 4.5,
};

export const ContainerStyles = {
  TopLevelContainer: style(
    smallerStyle,
    createResponsiveStyle(ScreenSize.Large, largeStyle, true)
  ),
};
