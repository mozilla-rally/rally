import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { Colors } from "../../../styles";
import { Spacing } from "../../../styles";
import { ProductButton } from "../../../styles/Buttons";
import { CardStyles } from "../../../styles/Cards";
import { FontSize, Fonts } from "../../../styles/Fonts";

const strings = Strings.components.pages.studies.surveyCard;

export function SurveyCard() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { reloadUser } = useAuthentication();
  const { userDocument } = useUserDocument();

  useEffect(() => {
    reloadUser();
  }, []);

  useEffect(() => {
    setIsVisible((userDocument && !userDocument.onboared) ?? false);
  }, [userDocument]);

  return (
    <Container
      className={`${isVisible ? "d-block" : "d-none"} ${
        CardStyles.product.container
      } ${styles.container} `}
    >
      <Row className="mb-1">
        <Col className="d-flex flex-row-reverse">
          <img
            onClick={() => setIsVisible(false)}
            src={strings.closeIcon}
            alt="x icon"
            height="24px"
            width="24px"
            className="survey-close-icon"
          />
        </Col>
      </Row>
      <Row className="d-flex">
        <Col>
          <img src={strings.image} alt="people talking" />
        </Col>
        <Col>
          <h4 className="survey-card-title">{strings.title}</h4>
          <div
            className={`${Fonts.MediumBodySM} ${FontSize.Small} survey-card-text pb-4`}
          >
            {strings.text}
          </div>
          <Button className={`${ProductButton} w-100 mt-1 survey-card-btn`}>
            <Link href={strings.profile}>{strings.button}</Link>
          </Button>
        </Col>
      </Row>
      <Row></Row>
    </Container>
  );
}

const styles = {
  container: style({
    padding: "16px 20px 20px",
    margin: `${Spacing.Large + 4}px 0px`,
    $nest: {
      ".survey-close-icon": {
        cursor: "pointer",
      },
      ".survey-card-title": {
        color: Colors.ColorInk70,
        fontSize: Spacing.Large + 2,
        marginBottom: Spacing.Small,
        fontWeight: 600,
      },
      ".survey-card-text": {
        lineHeight: `${Spacing.Large + 4}px`,
        color: "#333333",
      },
      a: {
        textDecoration: "none",
      },
    },
  }),
};
