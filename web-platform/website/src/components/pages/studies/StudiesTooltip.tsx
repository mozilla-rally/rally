import { HTMLAttributes } from "react";
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
} from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../styles";
import { StandardAccordion } from "../../../styles/Accordions";

const strings = Strings.components.pages.studies.tooltip;

export function StudiesTooltip({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <UncontrolledAccordion
      defaultOpen="1"
      open="1"
      className={`${StandardAccordion} ${className || ""}`}
      {...rest}
    >
      <AccordionItem>
        <AccordionHeader targetId="1" className="mb-3 mt-3">
          {strings.title}
        </AccordionHeader>
        <AccordionBody accordionId="1">
          <ol className={styles.tooltips}>
            {strings.sections.map(({ title, text }, i) => (
              <li key={i}>
                <h1>{title}</h1>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
}

const styles = {
  tooltips: style(
    {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      padding: Spacing.Large,
      listStyleType: "none",
      background: Colors.ColorWhite,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: Colors.ColorMarketingGray30,
      boxSizing: "border-box",
      borderRadius: Spacing.Micro,
      textAlign: "center",

      $nest: {
        li: {
          counterIncrement: "step-counter",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          flexBasis: 0,
          alignSelf: "stretch",
          margin: Spacing.Micro,

          $nest: {
            "&:before": {
              content: "counter(step-counter)",
              backgroundColor: Colors.ColorInk20,
              color: Colors.ColorWhite,
              width: 28.65,
              height: 28.65,
              borderRadius: "50%",
              display: "flex",
              alignSelf: "center",
              justifyContent: "center",
              fontFamily: "Zilla Slab",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: Spacing.xLarge,
              lineHeight: "100%",
              marginBottom: Spacing.Medium,
            },

            "&:not(:first-child)": {
              borderLeft: "1px solid #c4c4c4",
              paddingLeft: 12,
            },

            h1: {
              fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji","Segoe UI Symbol"`,
              fontWeight: 600,
              fontSize: 14,
              lineHeight: `${Spacing.xLarge}px`,
              color: Colors.ColorInk40,
              marginBottom: Spacing.Micro,
            },

            p: {
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: Spacing.Medium,
              lineHeight: `${Spacing.Large}px`,
              color: Colors.ColorMarketingGray70,
            },
          },
        },
      },
    },
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      flexDirection: "column",
      padding: Spacing.Medium,
      textAlign: "left",

      $nest: {
        li: {
          border: "none !important",
          paddingLeft: "0px !important",
          $nest: {
            "&:before": {
              alignSelf: "unset",
              position: "absolute",
            },

            "h1,p": {
              marginLeft: "36.65px",
            },
          },
        },
      },
    })
  ),
};
