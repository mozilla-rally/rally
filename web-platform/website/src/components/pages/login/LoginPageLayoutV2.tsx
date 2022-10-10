import React from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../styles";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import { Footer } from "../../Footer";
import { NavigationBar } from "../../navigation-bar";

export function LoginPageLayoutV2(props: {
  children?: React.ReactNode;
  isExtensionView: boolean;
}) {
  let leftContent: JSX.Element | null = null;
  let rightContent: JSX.Element | null = null;
  const isExtensionView = props.isExtensionView;

  React.Children.forEach(props.children, (c) => {
    const child = React.isValidElement(c) ? (c as JSX.Element) : null;

    if (child && child.type === LoginPageLayoutV2.LeftContent) {
      leftContent = child;
    }

    if (child && child.type === LoginPageLayoutV2.RightContent) {
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
                    displayInCollapsedMode={isExtensionView}
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
LoginPageLayoutV2.LeftContent = function (props: { children?: JSX.Element }) {
  return props.children || null;
};

// eslint-disable-next-line react/display-name
LoginPageLayoutV2.RightContent = function (props: { children?: JSX.Element }) {
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
