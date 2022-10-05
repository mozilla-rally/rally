import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../resources/Strings";
import { Colors } from "../styles/Colors";
import { ContainerSmallerStyles } from "../styles/ContainerStyles";
import { FontSize } from "../styles/Fonts";
import { LinkStyles } from "../styles/LinkStyles";
import { Spacing } from "../styles/Spacing";

const strings = Strings.components.footer;

export function Footer(props: { className?: string }) {
  return (
    <Container
      className={`${ContainerSmallerStyles.TopLevelContainer} ${
        styles.container
      } g-0 ${(props && props.className) || ""}`}
    >
      <Row>
        <Col>
          <img
            src="/img/moz-rally-logo-inverted.svg"
            className="logo-large"
            alt=""
          />
        </Col>
      </Row>
      <Row>
        {strings.sections.map((section, i) => (
          <Col className="col-12 col-lg-4 col-md-6" key={i}>
            <a
              className={`${FontSize.Large} ${LinkStyles.NoUnderline} fw-bold mb-2`}
              href={section.heading.link}
              target={section.heading.external ? "_blank" : "_self"}
              rel="noreferrer"
            >
              {section.heading.text}
            </a>
            <ul className="list-unstyled mb-5">
              {section.links.map((l, i) => (
                <li key={i}>
                  <a
                    href={l.link}
                    target={l.external ? "_blank" : "_self"}
                    className={`${FontSize.Small} ${LinkStyles.NoUnderline}`}
                    rel="noreferrer"
                  >
                    {l.text}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>
      <Row>
        <Col>
          <hr className="" />
        </Col>
      </Row>
      <Row>
        <Col>
          <p className={`${FontSize.xSmall} ms-0`}>{strings.copyright}</p>
        </Col>
      </Row>
      <Row>
        {strings.bottomLinks.map((l, i) => (
          <Col className="col-auto" key={i}>
            <a
              href={l.link}
              target={l.external ? "_blank" : "_self"}
              className={`${FontSize.xSmall} ${LinkStyles.NoUnderline}`}
              rel="noreferrer"
            >
              {l.text}
            </a>
          </Col>
        ))}
        <Col>
          <a
            className="d-flex justify-content-end"
            target="_blank"
            href={strings.twitterLink}
            rel="noreferrer"
          >
            <img
              src="img/twitter.svg"
              width={Spacing.xLarge}
              height={Spacing.xLarge}
              alt=""
            />
          </a>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    backgroundColor: Colors.ColorBlack,
    color: Colors.ColorWhite,
    maxWidth: "unset",

    paddingTop: Spacing.xxxLarge,
    paddingBottom: Spacing.xxxLarge,

    $nest: {
      ".logo-large": {
        width: 200,
        marginRight: Spacing.xxLarge,
        paddingBottom: Spacing.Medium * 6,
      },
    },
  }),
};
