import { UserDocument } from "@mozilla/rally-shared-types/dist";
import { Button, Col, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { SecondaryButton, TertiaryButton } from "../../../styles/Buttons";

const strings = Strings.components.pages.privacyPolicy.buttons;

export function PrivacyPolicyButtons() {
  const { logout } = useAuthentication();
  const { updateUserDocument, userDocument } = useUserDocument();

  return (
    <Row>
      <Col className="d-flex justify-content-center">
        <Button
          className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${SecondaryButton} me-3`}
          onClick={() =>
            updateUserDocument({
              ...((userDocument || {}) as UserDocument),
              enrolled: true,
            })
          }
        >
          {strings.acceptAndEnroll}
        </Button>
        <Button
          className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${TertiaryButton}`}
          outline
          onClick={() => logout()}
        >
          {strings.decline}
        </Button>
      </Col>
    </Row>
  );
}
