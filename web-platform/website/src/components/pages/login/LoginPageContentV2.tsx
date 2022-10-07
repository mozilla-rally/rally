import React from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useStudies } from "../../../services/StudiesService";
import { Fonts } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";
import { LoginCardFactory } from "./LoginCardFactory";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "./LoginDataContext";
import { LoginPageLayoutV2 } from "./LoginPageLayoutV2";
import {
  ValuePropositionInitial,
  ValuePropositionNoExtension,
} from "./ValuePropView";

const strings = Strings.components.pages.login.loginPageContentV2;

export function LoginPageContentV2(props: { children: React.ReactNode }) {
  return (
    <LoginStateProvider>
      <>
        {props.children}
        <LoginPageLayoutV2>
          <LoginPageLayoutV2.LeftContent>
            <LoginCards />
          </LoginPageLayoutV2.LeftContent>

          <LoginPageLayoutV2.RightContent>
            <ValueProposition />
          </LoginPageLayoutV2.RightContent>
        </LoginPageLayoutV2>
      </>
    </LoginStateProvider>
  );
}

function LoginCards() {
  return (
    <Container className={`${styles.loginCards}`}>
      <Row>
        <Col>
          <LoginCardTitle />
          <LoginCardFactory />
        </Col>
      </Row>
    </Container>
  );
}

function LoginCardTitle() {
  const { loginState } = useLoginDataContext();
  const { installedStudyIds } = useStudies();

  if (
    loginState === LoginState.Login ||
    loginState === LoginState.ResetPassword ||
    loginState === LoginState.GetExtension
  ) {
    return null;
  }

  const { title, subtitle } = installedStudyIds.length
    ? strings.titles.extensionFirst
    : strings.titles.accountFirst;

  return (
    <>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Highlighter className={`w-100 text-left ${styles.v2Highlighter}`}>
            <h1 className={Fonts.Headline}>{title}</h1>
          </Highlighter>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <h5>{subtitle}</h5>
        </Col>
      </Row>
    </>
  );
}

function ValueProposition() {
  const { loginState } = useLoginDataContext();
  if (loginState === LoginState.GetExtension) {
    return <ValuePropositionNoExtension />;
  } else {
    return <ValuePropositionInitial />;
  }
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
