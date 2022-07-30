import { Col, Container, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import {
  UserType,
  useAuthentication,
} from "../../../services/AuthenticationService";
import { Fonts } from "../../../styles/Fonts";
import { DeleteAccountDisclaimer } from "./DeleteAccountDisclaimer";
import { EmailAccountSettings } from "./EmailAccountSettings";
import { GoogleAccountSettings } from "./GoogleAccountSettings";

const strings = Strings.components.pages.accountSettings.accountSettings;

export function AccountSettingsView() {
  const { userType } = useAuthentication();

  return (
    <Container className="p-0">
      <Row>
        <Col>
          <h1 className={Fonts.Headline}>{strings.title}</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <p>{strings.tagline}</p>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          {userType === UserType.Google ? (
            <GoogleAccountSettings />
          ) : (
            <EmailAccountSettings />
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <DeleteAccountDisclaimer />
        </Col>
      </Row>
    </Container>
  );
}
