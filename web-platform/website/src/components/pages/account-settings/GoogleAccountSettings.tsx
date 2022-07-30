import { Card, Col, Container, Row } from "reactstrap";

import { User } from "../../../models/User";
import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import { FontSize } from "../../../styles/Fonts";

const strings = Strings.components.pages.accountSettings.googleAccountSettings;

export function GoogleAccountSettings() {
  const { user } = useAuthentication();

  const validUser = user as User;

  const connectionTimestamp =
    validUser &&
    validUser.firebaseUser &&
    validUser.firebaseUser.metadata &&
    validUser.firebaseUser.metadata.creationTime;

  const createdOn = (
    connectionTimestamp ? new Date(connectionTimestamp) : new Date()
  ).toDateString();

  return (
    <Card className="flex-nowrap p-4">
      <Container className={`${ContainerStyles.NoSpacing} p-0`}>
        <Row>
          <Col>
            <h4 className="fw-bold mb-4">{strings.title}</h4>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <b>{strings.email}</b>
          </Col>
        </Row>
        <Row>
          <Col>{validUser.firebaseUser.email}</Col>
        </Row>
        <Row>
          <Col>
            <hr className="mt-4 mb-4" />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <b>{strings.connectedWithGoogle}</b>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>{strings.changeSettings}</Col>
        </Row>
        <Row>
          <Col>
            <Card className="flex-nowrap p-3">
              <Container className={`${ContainerStyles.NoSpacing} p-0`}>
                <Row className={`d-flex align-items-center`}>
                  <Col className="col-auto me-2">
                    <img
                      src="img/google-logo.svg"
                      className="w-100"
                      height="auto"
                      alt=""
                    />
                  </Col>
                  <Col className={`${FontSize.xSmall}`}>
                    {strings.connectedTimestampFormat
                      .replace("{email}", validUser.firebaseUser.email || "")
                      .replace("{date}", createdOn)}
                  </Col>
                  <Col className={`d-flex justify-content-end`}>
                    <a
                      href={strings.googleAccountLink}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {strings.manageAccount}{" "}
                      <img
                        src="img/open-external.svg"
                        className="ms-1 mb-1"
                        alt=""
                      />
                    </a>
                  </Col>
                </Row>
              </Container>
            </Card>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}
