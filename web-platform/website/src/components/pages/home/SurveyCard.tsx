import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useUserDocument } from "../../../services/UserDocumentService";
import { Colors } from "../../../styles";
import { Spacing } from "../../../styles";
import { ProductButton } from "../../../styles/Buttons";
import { CardStyles } from "../../../styles/Cards";
import { FontSize, Fonts } from "../../../styles/Fonts";

const strings = Strings.components.pages.home.surveyCard;

export function SurveyCard() {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const { userDocument } = useUserDocument();

  useEffect(() => {
    setIsVisible((userDocument && !userDocument.onboared) ?? false);
  }, [userDocument]);

  return (
    <Container
      className={`${isVisible ? "d-block" : "d-none"} ${
        CardStyles.product.container
      } ${styles.container} mt-5 `}
    >
      <Row className="mb-1">
        <Col className="d-flex flex-row-reverse">
          <img
            onClick={() => setIsVisible(false)}
            src={strings.closeIcon}
            alt="x icon"
            height="24px"
            width="24px"
            className="survey-card-close-icon"
          />
        </Col>
      </Row>
      <Row className="d-flex">
        <Col className="d-flex justify-content-center">
          <img src={strings.image} alt="people talking" />
        </Col>
        <Col>
          <h4 className="survey-card-title">{strings.title}</h4>
          <div
            className={`${Fonts.MediumBodySM} ${FontSize.Small} survey-card-text pb-4`}
          >
            {strings.text}
          </div>
          <Link href={strings.profile}>
            <div className={`${ProductButton} py-1 px-3 btn btn-secondary`}>
              {strings.button}
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    padding: "16px 20px 20px",
    margin: "auto",
    maxWidth: "1116px",
    boxShadow: "none",
    $nest: {
      ".survey-card-img": {
        height: 200,
        width: 275,
        objectFit: "cover",
      },
      ".survey-card-close-icon": {
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
