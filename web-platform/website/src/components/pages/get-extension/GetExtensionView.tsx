import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useStudies } from "../../../services/StudiesService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { Colors, Spacing } from "../../../styles";
import { LinkButton, PrimaryButton } from "../../../styles/Buttons";
import { FontSizeRaw, Fonts } from "../../../styles/Fonts";
import { LinkStyles } from "../../../styles/LinkStyles";
import { detectBrowser } from "../../../utils/BrowserDetector";
import { BrowserType } from "../../../utils/BrowserType";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "../login/LoginButton";
import { PrivacyPolicyModal } from "../privacy-policy/PrivacyPolicyModal";

const strings = Strings.components.pages.login.getExtensionView;

export function GetExtensionView() {
  const router = useRouter();
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(true);
  const [chromeLink, setChromelink] = useState("");
  const [fxLink, setFxlink] = useState("");
  const { userDocument } = useUserDocument();
  const browserType = detectBrowser();
  const { allStudies } = useStudies();

  useEffect(() => {
    allStudies.forEach((study) => {
      if (study.authors.name === "Mozilla Rally") {
        setChromelink(study.downloadLink.chrome);
        setFxlink(study.downloadLink.firefox);
      }
    });
  }, [allStudies]);

  useEffect(() => {
    if (userDocument && userDocument.enrolled) {
      setShowPrivacyDialog(false);
    }
  }, [userDocument]);

  return (
    <Container className="p-0">
      <Row className="mb-3">
        <Col className="d-flex justify-content-center">
          <Highlighter className={`w-100 text-left ${styles.v2Highlighter}`}>
            <h1 className={Fonts.Headline}>{strings.title}</h1>
          </Highlighter>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <h5 className={`${Fonts.MediumBodySM} ${styles.subTitle} text-left`}>
            {strings.subTitle}
          </h5>
        </Col>
      </Row>
      <Row className={`mb-3 ${styles.bulletWrapper}`}>
        <Col>
          <h5 className={`${Fonts.Title} bullet-title text-left`}>
            {strings.bulletTitle}
          </h5>
          <ul className="bullet-list">
            {strings.bullets.map((text, index) => {
              return <li key={index}>{text}</li>;
            })}
          </ul>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <LoginButton
            onClick={() => {
              allStudies &&
                window.open(
                  browserType === BrowserType.Chrome ? chromeLink : fxLink,
                  "_blank",
                  "noreferrer"
                );
              router.push("/");
            }}
            className={PrimaryButton}
          >
            {strings.getExt}
          </LoginButton>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <LoginButton
            onClick={() => {
              router.push("/");
            }}
            className={LinkButton}
          >
            {strings.skip}
          </LoginButton>
        </Col>
      </Row>
      {showPrivacyDialog && <PrivacyPolicyModal />}
    </Container>
  );
}

const styles = {
  subTitle: style({
    ...FontSizeRaw.Large,
    lineHeight: `${Spacing.Micro * 7}px`,
  }),

  bulletWrapper: style({
    $nest: {
      ".bullet-title": {
        ...FontSizeRaw.Large,
        color: Colors.ColorMarketingGray70,
      },
      ".bullet-list": {
        paddingLeft: "17px",
      },
    },
  }),

  v2Highlighter: style({
    $nest: {
      ".highlight": {
        width: "40%",
        top: "50%",
        height: `${Spacing.Large + 4}px`,
        left: "59%",
      },
    },
  }),
};
