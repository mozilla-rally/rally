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

const strings = Strings.components.pages.login.loginPageContentV2;

export function LoginPageContentV2(props: { children: React.ReactNode }) {
  return (
    <LoginStateProvider>
      <>
        {props.children}
        <LoginPageLayoutV2 displayInCollapsedMode={true}>
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
    loginState === LoginState.ResetPassword
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
  return (
    <Container>
      <Row>
        <Col>
          <div className={`${Fonts.Headline} tagline font-weight-bold mb-4`}>
            {strings.valuePropositions.default.tagline}
          </div>

          <img
            src="/img/illustration-group-rally.png"
            alt="a group of people with flags"
          />
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
