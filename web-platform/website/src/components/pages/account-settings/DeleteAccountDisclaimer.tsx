import { Card, Col, Container, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";

const strings =
  Strings.components.pages.accountSettings.deleteAccountDisclaimer;

export function DeleteAccountDisclaimer() {
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
          <Col>{strings.tagline}</Col>
          <Col className="col-auto">
            <a
              href="#"
              onClick={() =>
                setAccountSettingsState(AccountSettingsState.DeleteAccount)
              }
            >
              {strings.delete}
            </a>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}
