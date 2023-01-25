import { UserDocument } from "@mozilla/rally-shared-types/dist";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Button, Col, Container, Modal, ModalHeader, Row } from "reactstrap";
import { style } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

import { Strings } from "../../../resources/Strings";
import { useStudies } from "../../../services/StudiesService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { Spacing } from "../../../styles";
import { SecondaryButton, TertiaryButton } from "../../../styles/Buttons";
import { Colors } from "../../../styles/Colors";
import { FullscapePageContainer } from "../../../styles/DocumentStyles";
import { FontSizeRaw, Fonts } from "../../../styles/Fonts";
import { createResponsiveStyle } from "../../../styles/ResponsiveStyle";
import { ScreenSize } from "../../../styles/ScreenSize";
import { PrivacyPolicyDataCollectionTypes } from "./PrivacyPolicyDataCollectionTypes";
import { PrivacyPolicyHowDataIsUsed } from "./PrivacyPolicyHowDataIsUsed";
import { PrivacyPolicyInformationUse } from "./PrivacyPolicyInformationUse";
import { PrivacyPolicyIntroduction } from "./PrivacyPolicyIntroduction";
import { PrivacyPolicyManageData } from "./PrivacyPolicyManageData";
import { PrivacyPolicyReadyToRally } from "./PrivacyPolicyReadyToRally";
import { PrivacyPolicySharing } from "./PrivacyPolicySharing";
import { PrivacyPolicyYourContributions } from "./PrivacyPolicyYourContributions";

const strings = Strings.components.pages.privacyPolicy;
const btnStrings = Strings.components.pages.privacyPolicy.buttons;

export function PrivacyPolicyModal() {
  const { updateUserDocument } = useUserDocument();
  const [isOpen, setIsOpen] = useState(true);
  const { isLoaded, rallyExtensionStudy } = useStudies();

  if (!isLoaded) {
    return null;
  }

  return (
    <Modal
      className={styles.modal}
      contentClassName={styles.modalContent}
      isOpen={isOpen}
    >
      <ModalHeader className={Fonts.Title}>{strings.modalHeader}</ModalHeader>
      <Container
        className={`${FullscapePageContainer} ${styles.modalContainer}`}
      >
        <PrivacyPolicyIntroduction />
        <hr />
        <PrivacyPolicyHowDataIsUsed />
        <hr />
        <PrivacyPolicyYourContributions />
        <hr />
        <PrivacyPolicyDataCollectionTypes />
        <hr />
        <PrivacyPolicyInformationUse />
        <hr />
        <PrivacyPolicySharing />
        <hr />
        <PrivacyPolicyManageData />
        <hr />
        <PrivacyPolicyReadyToRally />
      </Container>

      <Row className="g-0 bottom-0 start-0 w-100 py-2">
        <Col className="d-flex justify-content-end flex-row-reverse align-items-center">
          <Button
            className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${SecondaryButton} me-3`}
            onClick={async () => {
              const newUserDoc: Partial<UserDocument> = {
                enrolled: true,
              };

              if (rallyExtensionStudy) {
                newUserDoc.studies = {
                  [rallyExtensionStudy.studyId]: {
                    studyId: rallyExtensionStudy.studyId,
                    version: rallyExtensionStudy.version,
                    enrolled: true,
                    joinedOn: Timestamp.now(),
                  },
                };
              }
              await updateUserDocument(newUserDoc);

              setIsOpen(false);
            }}
          >
            {btnStrings.v2.agree}
          </Button>
          <Button
            className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${TertiaryButton} ${styles.button}`}
            outline
            onClick={() => {
              setIsOpen(false);
            }}
          >
            {btnStrings.v2.back}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

const smallModalStyle: NestedCSSProperties = {
  width: "100%",
  margin: 0,
};

const styles = {
  button: style({
    marginRight: Spacing.Medium,
  }),
  modal: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, smallModalStyle),
    createResponsiveStyle(ScreenSize.Small, smallModalStyle),
    {
      maxWidth: "unset",
      $nest: {
        ".modal-header": {
          ...FontSizeRaw.xLarge,
          borderBottom: "none",
          lineHeight: Spacing.xLarge,
          paddingBottom: Spacing.xxLarge,
          color: Colors.ColorDarkGray90,
        },
        ".modal-title": {
          fontWeight: 700,
        },
      },
    }
  ),
  modalContainer: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, { padding: Spacing.Small }),
    {
      backgroundColor: "#f0f0f4",
      maxWidth: 860,
      padding: Spacing.xLarge,
      maxHeight: 495,
      overflow: "auto",
      marginBottom: Spacing.xLarge,
      $nest: {
        h2: {
          color: Colors.ColorMarketingGray70,
        },
        p: {
          color: Colors.ColorMarketingGray70,
        },
        ".image-section": {
          display: "none", // hide images within modal content
        },
      },
    }
  ),
  modalContent: style(
    createResponsiveStyle(ScreenSize.Small, {
      width: "unset",
    }),
    {
      maxWidth: 852,
      maxHeight: 635,
      padding: "20px 20px 48px",
      marginLeft: "auto",
      marginRight: "auto",
    }
  ),
};
