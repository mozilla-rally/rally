import React from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { TwoColumnLayout } from "../../TwoColumnLayout";
import { GetExtensionValueProp } from "./GetExtensionValueProp";
import { GetExtensionView } from "./GetExtensionView";

export function GetExtensionContent(props: { children: React.ReactNode }) {
  return (
    <>
      {props.children}
      <TwoColumnLayout displayInCollapsedMode={true}>
        <TwoColumnLayout.LeftContent>
          <ExtensionCard />
        </TwoColumnLayout.LeftContent>

        <TwoColumnLayout.RightContent>
          <GetExtensionValueProp />
        </TwoColumnLayout.RightContent>
      </TwoColumnLayout>
    </>
  );
}

function ExtensionCard() {
  return (
    <Container className={`${styles.loginCards}`}>
      <Row>
        <Col>
          <GetExtensionView />
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  loginCards: style({
    maxWidth: 500,
  }),

  v2Highlighter: style({
    $nest: {
      ".highlight": {
        width: "52%",
        top: "72%",
        height: "25%",
      },
    },
  }),
};
