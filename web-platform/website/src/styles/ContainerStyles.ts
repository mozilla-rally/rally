import { AuthErrorCodes } from "firebase/auth";
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

const smallerAccountStyle = {
  ...smallerStyle,
  paddingLeft: Spacing.Medium,
  paddingRight: Spacing.Medium,
};

const mediumStyle = {
  paddingLeft: Spacing.xxxLarge * 3,
  paddingRight: Spacing.xxxLarge * 3,
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
  NoSpacing: style({
    padding: 0,
    $nest: {
      ".row": {
        margin: 0,

        $nest: {
          ".col": {
            padding: 0,
          },
        },
      },
    },
  }),
};

export const ContainerSmallerStyles = {
  TopLevelContainer: style(
    smallerAccountStyle,
    createResponsiveStyle(ScreenSize.xLarge, mediumStyle, true),
    createResponsiveStyle(ScreenSize.xxLarge, largeStyle, true),
    
  ),
};

