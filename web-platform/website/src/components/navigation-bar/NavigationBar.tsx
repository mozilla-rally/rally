import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";
import { Strings } from "../../resources/Strings";
import {
  Colors,
  createResponsiveStyle,
  ScreenSize,
  Spacing,
} from "../../styles";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

const strings = Strings.components.navigationBar;

export function NavigationBar() {
  return (
    <Container className={`${styles.nav} ms-0 me-0`}>
      <Row className={"align-items-center gx-0 gy-0"}>
        <Col className="col-md-auto logo-col">
          <img
            src="/img/moz-rally-logo.svg"
            className="logo-large"
            alt={strings.a11y.logo}
          />
        </Col>
        {strings.topLinks.map((topLink, i) => (
          <Col
            className="col-md-auto d-none d-lg-block"
            key={`${i}-topLink.href`}
          >
            <Link href={topLink.href}>
              <a target={topLink.external ? "_blank" : "_self"}>
                {topLink.title}
              </a>
            </Link>
          </Col>
        ))}
        <Col className="d-flex me-0 justify-content-end d-lg-none d-xl-none d-xxl-none">
          <MobileMenu />
        </Col>
        <Col className="d-flex me-0 justify-content-end d-none d-lg-flex d-xl-flex d-xxl-flex">
          <DesktopMenu />
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  nav: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, { border: "none" }),
    createResponsiveStyle(ScreenSize.Small, { border: "none" }),
    createResponsiveStyle(ScreenSize.Medium, { border: "none" }),
    {
      paddingLeft: Spacing.xxxLarge,
      paddingRight: Spacing.xxxLarge,
      paddingTop: Spacing.xLarge,
      paddingBottom: Spacing.xLarge,
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: Colors.ColorMarketingGray30,
      maxWidth: "unset",
      lineHeight: `${Spacing.xxLarge}px`,

      $nest: {
        ".row": {
          flexWrap: "nowrap",
          maxWidth: "unset",
          margin: 0,

          $nest: {
            ".col": {
              marginRight: Spacing.xxxLarge,
            },

            ".logo-col": {
              height: Spacing.xxLarge,
            },
          },
        },

        ".logo-large": {
          width: 200,
          marginRight: Spacing.xxLarge,
        },

        "> a": {
          fontWeight: 700,
          fontSize: 18,
        },

        "> a:hover": {
          textDecoration: "underline",
        },
      },
    }
  ),
};
