import React from "react";
import { style } from "typestyle";

import { Colors, Spacing } from "../styles";

export function Highlighter(props: React.HTMLAttributes<HTMLElement>) {
  const { children, className, ...otherProps } = props;
  return (
    <div className={`${styles.container} ${className || ""}`} {...otherProps}>
      <div className={`${className} highlight`}></div>
      <div className="content">{children}</div>
    </div>
  );
}

const styles = {
  container: style({
    position: "relative",
    $nest: {
      ".content": {
        zIndex: 1,
        textAlign: "center",
        display: "inline-block",
        position: "relative",
        marginLeft: Spacing.Micro,
        marginRight: Spacing.Micro,
      },
      ".highlight": {
        position: "absolute",
        backgroundColor: Colors.ColorYellow35,
        top: "50%",
        borderRadius: Spacing.Micro,
        height: "30%",
        width: "100%",
      },
      ".highlight-launch": {
        top: "75%",
        height: "25%",
        width: "75%",
      },
    },
  }),
};
