import React from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Colors, ScreenSize, Spacing, createResponsiveStyle } from "../styles";
import { ContainerStyles } from "../styles/ContainerStyles";
import { Footer } from "./Footer";
import { NavigationBar, NavigationBarProps } from "./navigation-bar";

export function TwoColumnLayout(props: NavigationBarProps) {
  let leftContent: JSX.Element | null = null;
  let rightContent: JSX.Element | null = null;
  const displayInCollapsedMode = !!props.displayInCollapsedMode;

  React.Children.forEach(props.children, (c) => {
    const child = React.isValidElement(c) ? (c as JSX.Element) : null;

    if (child && child.type === TwoColumnLayout.LeftContent) {
      leftContent = child;
    }

    if (child && child.type === TwoColumnLayout.RightContent) {
      rightContent = child;
    }
  });

  return (
    <>
      <Container className={`${ContainerStyles.NoSpacing} ${styles.container}`}>
        <Row>
          <Col className="col-first">
            <Container
              className={`${ContainerStyles.NoSpacing} inner-container`}
            >
              <Row>
                <Col>
                  <NavigationBar
                    displayInCollapsedMode={displayInCollapsedMode}
                    className="ps-5"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="ps-5">{leftContent}</Col>
              </Row>
            </Container>
          </Col>
          <Col className="col-second">
            <Container
              className={`${ContainerStyles.NoSpacing} d-flex container-right justify-content-center`}
            >
              <Row>
                <Col>{rightContent}</Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Footer className="ps-5" />
    </>
  );
}

// eslint-disable-next-line react/display-name
TwoColumnLayout.LeftContent = function (props: { children?: JSX.Element }) {
  return props.children || null;
};

// eslint-disable-next-line react/display-name
TwoColumnLayout.RightContent = function (props: { children?: JSX.Element }) {
  return props.children || null;
};

const styles = {
  container: style(
    {
      margin: 0,
      width: "100%",
      maxWidth: "100%",
      $nest: {
        ".inner-container": {
          margin: 0,
          minHeight: "100vh",
          maxWidth: "100%",
        },
        ".col-second": {
          display: "none",
        },
        ".container-right": {
          paddingTop: Spacing.xxxLarge * 4.5,
        },
        ".tagline": {
          fontSize: Spacing.xLarge,
        },
      },
    },
    createResponsiveStyle(
      ScreenSize.Large,
      {
        $nest: {
          ".col-second": {
            display: "unset",
            maxWidth: Spacing.xxxLarge * 9.4,
            backgroundColor: Colors.ColorLightGray20,
          },
        },
      },
      true
    )
  ),
};
