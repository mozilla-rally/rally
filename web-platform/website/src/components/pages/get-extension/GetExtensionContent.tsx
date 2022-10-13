import React from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { LoginPageLayoutV2 } from "../login/LoginPageLayoutV2";
import { GetExtensionValueProp } from "./GetExtensionValueProp";
import { GetExtensionView } from "./GetExtensionView";

export function GetExtensionContent(props: { children: React.ReactNode }) {
  return (
    <>
      {props.children}
      <LoginPageLayoutV2 displayInCollapsedMode={true}>
        <LoginPageLayoutV2.LeftContent>
          <ExtensionCard />
        </LoginPageLayoutV2.LeftContent>

        <LoginPageLayoutV2.RightContent>
          <GetExtensionValueProp />
        </LoginPageLayoutV2.RightContent>
      </LoginPageLayoutV2>
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
