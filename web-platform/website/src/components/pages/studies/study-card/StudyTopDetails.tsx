import { Button, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";
import { createResponsiveStyle } from "../../../../styles";
import { Strings } from "../../../../resources/Strings";
import { Colors, Spacing, ScreenSize } from "../../../../styles";
import { FontSize } from "../../../../styles/Fonts";
import { useStudy } from "./StudyDataContext";
import { StudyTitle } from "./StudyTitle";

const strings = Strings.components.pages.studies.studyCard.topDetails;

export function StudyTopDetails() {
  const { isUserEnrolled, startStudyEnrollmentToggle } = useStudy();

  return (
    <Container className={`${styles.container}`}>
      <Row className={`${styles.row}`}>
        <Col>
          <StudyTitle />
        </Col>
        <Col className="col-auto g-0">
          {!isUserEnrolled ? (
            <Col className="col-12 mt-4 col-md-auto mt-md-0 p-0">
              <Button
                className={`join-button fw-bold ${FontSize.Small} w-100`}
                onClick={() => startStudyEnrollmentToggle()}
              >
                {strings.joinStudy}
              </Button>
            </Col>
          ) : null}
        </Col>
      </Row>
      <Row className="py-3">
        <hr className="m-0" />
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    $nest: {
      ".study-name": {
        fontSize: 20,
      },

      ".join-button": {
        borderRadius: Spacing.Micro,
        backgroundColor: Colors.ColorLink,
        paddingLeft: Spacing.xLarge,
        paddingRight: Spacing.xLarge,

        $nest: {
          "&:hover": {
            backgroundColor: Colors.ColorLinkHover,
          },
        },
      },
    },
  }),
  row: style({
    flexDirection: "row"
  },
    createResponsiveStyle(
      ScreenSize.ExtraSmall, {
      flexDirection: "column"
    }
    )
  )
};
