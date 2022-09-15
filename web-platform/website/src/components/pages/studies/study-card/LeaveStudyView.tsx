import { UserDocument } from "@mozilla/rally-shared-types";
import { logEvent } from "firebase/analytics";
import { Button, Col, Container, Modal, Row } from "reactstrap";
import { style } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

import { Strings } from "../../../../resources/Strings";
import { useFirebase } from "../../../../services/FirebaseService";
import { useUserDocument } from "../../../../services/UserDocumentService";
import { AccentButton, TertiaryButton } from "../../../../styles/Buttons";
import { Colors } from "../../../../styles/Colors";
import { ContainerStyles } from "../../../../styles/ContainerStyles";
import { FontsRaw } from "../../../../styles/Fonts";
import { createResponsiveStyle } from "../../../../styles/ResponsiveStyle";
import { ScreenSize } from "../../../../styles/ScreenSize";
import { Spacing } from "../../../../styles/Spacing";
import { useStudy } from "./StudyDataContext";

const strings = Strings.components.pages.studies.studyCard.leaveStudy;

export function LeaveStudyView() {
  const {
    endStudyEnrollmentToggle,
    isStudyEnrollmentInProgress,
    isUserEnrolled,
    isInstalledLocally,
    study,
  } = useStudy();

  const { analytics } = useFirebase();

  const { updateUserDocument } = useUserDocument();

  if (!(isStudyEnrollmentInProgress && isUserEnrolled && isInstalledLocally)) {
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
          <Col>{strings.text}</Col>
          <Col>
            <img
              src="/img/leave-this-study.png"
              className="leave-study"
              alt=""
            />
          </Col>
        </Row>
        <Row>
          <Col className="me-3 col-auto">
            <Button
              className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${TertiaryButton}`}
              outline
              onClick={() => {
                endStudyEnrollmentToggle();

                logEvent(analytics, "select_content", {
                  content_type: `canceled_leave_study`,
                });
              }}
            >
              {strings.cancel}
            </Button>
          </Col>
          <Col className="col-auto">
            <Button
              className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${AccentButton}`}
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

                logEvent(analytics, "select_content", {
                  content_type: `leave_study`,
                });
              }}
              outline
            >
              {strings.leaveStudy}
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
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      width: "unset",
    }),
    {
      width: 700,
      boxSizing: "content-box",
      maxWidth: "unset",
      padding: Spacing.xxLarge,
      marginLeft: "auto",
      marginRight: "auto",
    }
  ),
  container: style({
    maxWidth: "unset",
    color: Colors.ColorMarketingGray70,

    $nest: {
      h1: {
        ...FontsRaw.Headline,
        color: Colors.ColorBlack,
        fontSize: Spacing.xxxLarge,
      },

      p: {
        marginLeft: 0,
      },

      li: {
        marginBottom: Spacing.Large,
      },

      ".leave-study": {
        paddingTop: Spacing.Large,
        width: 316,
      },
    },
  }),
};
