import { useRouter } from "next/router";
import { Button, Col, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { useUserDocument } from "../../../services/UserDocumentService";
import { SecondaryButton, TertiaryButton } from "../../../styles/Buttons";
import { useProfileData } from "./ProfileDataContext";

const strings = Strings.components.pages.profile.buttons;

export function ProfileButtons() {
  const { updateUserDocument } = useUserDocument();
  const { profileData, isValid } = useProfileData();
  const router = useRouter();

  return (
    <Row>
      <Col className="d-flex justify-content-center">
        <Button
          className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${
            !isValid ? "border-danger text-danger" : SecondaryButton
          } me-3`}
          outline={!isValid}
          disabled={!isValid}
          onClick={() => {
            updateUserDocument({
              demographicsData: profileData,
            });

            router.push("/");
          }}
        >
          {strings.saveChanges}
        </Button>

        <Button
          className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${TertiaryButton}`}
          outline
          onClick={() => {
            router.push("/");
          }}
        >
          {strings.cancel}
        </Button>
      </Col>
    </Row>
  );
}
