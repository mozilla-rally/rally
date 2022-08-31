
import { style } from "typestyle";
import { ScreenSize } from "./ScreenSize";
import { Spacing } from "./Spacing";
import { createResponsiveStyle } from "./ResponsiveStyle";

export const ColumnStyles = {
	account: {
		buttonCol: style(
			{
				display: "block",
				width: "100%",
				$nest: {
					button: {
						display: "block",
						width: "100%",
						textAlign: "center",
						marginTop: Spacing.Large
					}
				}
			},
			createResponsiveStyle(
				ScreenSize.Medium,
				{
					display: "flex",
					flexDirection: "row-reverse",
					width: "auto",
					$nest: {
						button: {
							display: "flex",
							width: "auto",
						}
					}
				},
				true
			)
		),
		forgotPWCol: style(
			{
				width: "100%",
				marginTop: Spacing.Large,
				$nest: {
					button: {
						width: "100%",
						marginTop: Spacing.Large
					}
				}
			},
			createResponsiveStyle(
				ScreenSize.Medium,
				{
					marginRight: "1rem",
					marginTop: 0,
					width: "auto",
					$nest: {
						button: {
							display: "flex",
							width: "auto",
						}
					}
				},
				true
			)
		)
	}
}