import { Card, Col, Container, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";

const strings = Strings.components.pages.accountSettings.editAccountSettings;

export function EmailAccountSettings() {
  const { user } = useAuthentication();
  const { setAccountSettingsState } = useAccountSettingsDataContext();

  return (
    <Card className="flex-nowrap p-4">
      <Container className={`${ContainerStyles.NoSpacing} p-0`}>
        <Row>
          <Col>
            <h4 className="fw-bold mb-4">{strings.title}</h4>
          </Col>
        </Row>
        <Row>
          <Col className="fw-bold mb-2">{strings.email}</Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <div className={"text-nowrap"}>
              {user && user.firebaseUser && user.firebaseUser.email}
            </div>
          </Col>
          <Col className="col-auto">
            <a
              href="#"
              onClick={() =>
                setAccountSettingsState(AccountSettingsState.EditEmail)
              }
            >
              {strings.edit}
            </a>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col className="fw-bold mb-2">{strings.password}</Col>
        </Row>

        <Row>
          <Col>•••••••••••••••••</Col>
          <Col className="col-auto">
            <a
              href="#"
              onClick={() =>
                setAccountSettingsState(AccountSettingsState.EditPassword)
              }
            >
              {strings.edit}
            </a>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}
