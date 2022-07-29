import { UserDocument } from "@mozilla/rally-shared-types";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Button, Col, Container, Modal, Row } from "reactstrap";
import { style } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

import { Strings } from "../../../../resources/Strings";
import { useUserDocument } from "../../../../services/UserDocumentService";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../../styles";
import { SecondaryButton, TertiaryButton } from "../../../../styles/Buttons";
import { FontSizeRaw, FontsRaw } from "../../../../styles/Fonts";
import { detectBrowser } from "../../../../utils/BrowserDetector";
import { BrowserType } from "../../../../utils/BrowserType";
import { useStudy } from "./StudyDataContext";
import { StudyTitle } from "./StudyTitle";

const strings = Strings.components.pages.studies.studyCard.addStudy;

export function AddStudyView() {
  const {
    endStudyEnrollmentToggle,
    isStudyEnrollmentInProgress,
    isUserEnrolled,
    study,
  } = useStudy();

  const [browserType] = useState(detectBrowser());

  const { updateUserDocument } = useUserDocument();

  if (!isStudyEnrollmentInProgress || isUserEnrolled) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      toggle={endStudyEnrollmentToggle}
      contentClassName={styles.modalContent}
      className={styles.modal}
    >
      <Container className={`p-0 g-0 m-0 ${styles.container}`}>
        <Row className="mb-4 m-0">
          <Col>
            <StudyTitle />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className={styles.modalText}>{strings.enrollText}</div>
          </Col>
        </Row>
        <Row>
          <Col className="me-3 col-auto">
            <Button
              className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${TertiaryButton}`}
              outline
              onClick={() => endStudyEnrollmentToggle()}
            >
              {strings.cancel}
            </Button>
          </Col>
          <Col className="col-auto">
            <Button
              className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${SecondaryButton}`}
              onClick={async () => {
                endStudyEnrollmentToggle();

                await updateUserDocument({
                  studies: {
                    [study.studyId]: {
                      studyId: study.studyId,
                      enrolled: true,
                      joinedOn: Timestamp.now(),
                    },
                  },
                } as Partial<UserDocument>);

                window.open(
                  browserType === BrowserType.Chrome
                    ? study.downloadLink.chrome
                    : study.downloadLink.firefox,
                  "_blank"
                );
              }}
            >
              {strings.addExtension}
            </Button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

const smallModalStyle: NestedCSSProperties = {
  width: "100%",
  margin: 0,
};

const styles = {
  modal: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, smallModalStyle),
    createResponsiveStyle(ScreenSize.Small, smallModalStyle),
    {
      maxWidth: "unset",
    }
  ),
  modalContent: style(
    createResponsiveStyle(ScreenSize.Small, {
      width: "unset",
    }),
    {
      width: 660,
      boxSizing: "content-box",
      maxWidth: "unset",
      padding: Spacing.xxLarge,
      marginLeft: "auto",
      marginRight: "auto",
    }
  ),
  modalText: style({
    color: Colors.ColorMarketingGray70,
    backgroundColor: Colors.ColorLightGray20,
    padding: Spacing.Large,
    marginBottom: Spacing.xLarge,
    $nest: {
      "h1, h2": {
        color: Colors.ColorMarketingGray70,
      },
      h1: {
        ...FontsRaw.Headline,
        fontSize: Spacing.xLarge,
        marginBottom: Spacing.xLarge,
      },
      h2: {
        fontSize: "1rem",
        fontWeight: 700,
        marginBottom: Spacing.Large,
      },
      p: {
        marginBottom: Spacing.Large,
        ...FontSizeRaw.Small,
      },
    },
  }),
  container: style({
    maxWidth: "unset",

    $nest: {
      ".row": {
        margin: 0,
      },

      ".col": {
        padding: 0,
      },
    },
  }),
};
