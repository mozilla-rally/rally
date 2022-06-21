import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { User } from "../../models/User";
import { Strings } from "../../resources/Strings";
import { useAuthentication } from "../../services/AuthenticationService";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../styles";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

const strings = Strings.components.navigationBar;

export function NavigationBar() {
  const { user } = useAuthentication();

  return (
    <Container className={`${styles.nav} ${user ? "" : "border-0"} ms-0 me-0`}>
      <Row className={"align-items-center gx-0 gy-0"}>
        <Col className="col-md-auto logo-col">
          <a href={user ? "/" : strings.rallyWebsiteUrl}>
            <img
              src="/img/moz-rally-logo.svg"
              className="logo-large"
              alt={strings.a11y.logo}
            />
          </a>
        </Col>

        <TopLinks user={user} />

        <DropdownMenus user={user} />
      </Row>
    </Container>
  );
}

function TopLinks(props: { user?: User }) {
  if (!props.user) {
    return null;
  }

  return (
    <>
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
    </>
  );
}

function DropdownMenus(props: { user?: User }) {
  if (!props.user) {
    return null;
  }

  return (
    <>
      <Col className="d-flex me-0 justify-content-end d-lg-none d-xl-none d-xxl-none">
        <MobileMenu />
      </Col>

      <Col className="d-flex me-0 justify-content-end d-none d-lg-flex d-xl-flex d-xxl-flex">
        <DesktopMenu />
      </Col>
    </>
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
          textDecoration: "none",
        },

        "> a:hover": {
          textDecoration: "underline",
        },
      },
    }
  ),
};
