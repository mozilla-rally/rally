import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { Colors, Spacing } from "../../../styles";
import { LoginState, useLoginDataContext } from "./LoginDataContext";

const strings = Strings.components.pages.login.unverifiedEmailError;

export function UnverifiedEmailError() {
  const { sendEmailVerification, logout } = useAuthentication();
  const { setLoginState } = useLoginDataContext();

  return (
    <Container className={`${styles.container} d-flex p-3`}>
      <Row>
        <Col className="col-auto">
          <img width={20} height="auto" src={"img/error.svg"} alt="" />
        </Col>
        <Col className="p-0">
          <div className="mb-2">{strings.activateEmail}</div>
          <div>
            <span>{strings.cantFindEmail}</span>{" "}
            <a
              href="#"
              onClick={async () => {
                await sendEmailVerification();
                await logout();
                setLoginState(LoginState.Initial);
              }}
            >
              {strings.resendEmail}
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    backgroundColor: Colors.ColorRed05,
    borderRadius: Spacing.Micro,
  }),
};
