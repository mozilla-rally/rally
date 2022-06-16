import { Button, ButtonProps, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../styles";
import { Fonts } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";

const strings = Strings.components.pages.login.initialLoginView;

export function InitialLoginView() {
  return (
    <Container className={`${styles.container} p-0`}>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Highlighter>
            <h1 className={Fonts.Headline}>{strings.title}</h1>
          </Highlighter>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <LoginButton
            icon="/img/icon-logo-google.svg"
            title={strings.signInWithGoogle}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <LoginButton
            icon="/img/icon-email.svg"
            title={strings.signInWithEmail}
          />
        </Col>
      </Row>
      <Row className="privacy-notice mb-5">
        <Col className="d-flex justify-content-center">
          {strings.privacyNotice}
        </Col>
      </Row>
      <Row noGutters className="justify-content-center">
        <Col className="d-flex justify-content-center col-auto me-1">
          {strings.accountExists}
        </Col>
        <Col className="col-auto">
          <a href="#" className="fw-bold">
            {strings.signIn}
          </a>
        </Col>
      </Row>
    </Container>
  );
}

function LoginButton(props: ButtonProps & { icon: string; title: string }) {
  const { className, ...otherProps } = props;

  return (
    <Button
      className={`login-button w-100 ps-5 pe-5 pt-3 pb-3 ${className || ""}`}
      outline
      {...otherProps}
    >
      <Container className="w-100">
        <Row className="justify-content-center align-items-center">
          <Col className="col-auto">
            <img src={props.icon} width={20} height="auto" alt={props.title} />
          </Col>
          <Col className="text-nowrap">{props.title}</Col>
        </Row>
      </Container>
    </Button>
  );
}

const styles = {
  container: style({
    $nest: {
      ".privacy-notice": createResponsiveStyle(ScreenSize.ExtraSmall, {
        marginBottom: `${Spacing.xLarge}px !important`,
      }),
      ".login-button": {
        fontWeight: 700,
        color: Colors.ColorMarketingGray70,
        borderColor: Colors.ColorMarketingGray30,
        borderWidth: 2,
        $nest: {
          "&:hover": {
            backgroundColor: Colors.ColorMarketingGray20,
            color: Colors.ColorBlack,
          },
        },
      },
    },
  }),
};
