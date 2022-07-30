import { UserDocument } from "@mozilla/rally-shared-types";
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
import { ContainerStyles } from "../../../../styles/ContainerStyles";
import { FontSizeRaw, FontsRaw } from "../../../../styles/Fonts";
import { detectBrowser } from "../../../../utils/BrowserDetector";
import { BrowserType } from "../../../../utils/BrowserType";
import { useStudy } from "./StudyDataContext";

const strings = Strings.components.pages.studies.studyCard.dontJoinStudy;

export function DontJoinStudyView() {
  const {
    endStudyEnrollmentToggle,
    isInstalledLocally,
    isStudyEnrollmentInProgress,
    isUserEnrolled,
    study,
  } = useStudy();

  const [browserType] = useState(detectBrowser());

  const { updateUserDocument } = useUserDocument();

  if (!(isStudyEnrollmentInProgress && isUserEnrolled && !isInstalledLocally)) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      toggle={endStudyEnrollmentToggle}
      contentClassName={styles.modalContent}
      className={styles.modal}
    >
      <Container
        className={`p-0 g-0 m-0 ${styles.container} ${ContainerStyles.NoSpacing}`}
      >
        <Row>
          <Col>
            <h1>{strings.title}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{strings.tagline}</p>
          </Col>
        </Row>
        <Row>
          <Col className="me-3 col-auto">
            <a
              href={
                browserType === BrowserType.Chrome
                  ? study.downloadLink.chrome
                  : study.downloadLink.firefox
              }
              className="text-decoration-none"
              rel="noreferrer"
              target="_blank"
            >
              <Button
                className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${TertiaryButton}`}
                outline
                onClick={() => endStudyEnrollmentToggle()}
              >
                {strings.addStudyExtension}
              </Button>
            </a>
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
                      enrolled: false,
                    },
                  },
                } as Partial<UserDocument>);
              }}
            >
              {strings.dontJoinStudy}
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
      width: 442,
      boxSizing: "content-box",
      maxWidth: "unset",
      padding: Spacing.xxLarge,
      marginLeft: "auto",
      marginRight: "auto",
    }
  ),
  modalText: style({}),
  container: style({
    maxWidth: "unset",

    color: Colors.ColorMarketingGray70,
    padding: Spacing.Large,
    marginBottom: Spacing.xLarge,
    $nest: {
      h1: {
        ...FontsRaw.Headline,
        fontSize: Spacing.xxxLarge,
        marginBottom: Spacing.xLarge,
        color: Colors.ColorBlack,
      },
      p: {
        ...FontSizeRaw.Small,
        marginLeft: 0,
        marginBottom: Spacing.Large,
        lineHeight: `${Spacing.xLarge}px`,
      },
    },
  }),
};
