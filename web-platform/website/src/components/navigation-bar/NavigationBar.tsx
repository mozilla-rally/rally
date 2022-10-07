import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../resources/Strings";
import { useAuthentication } from "../../services/AuthenticationService";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../styles";
import { ContainerSmallerStyles } from "../../styles/ContainerStyles";
import { LinkStyles } from "../../styles/LinkStyles";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

const strings = Strings.components.navigationBar;

export function NavigationBar(props: { className?: string }) {
  const { user } = useAuthentication();
  const [isExtensionView, setView] = useState(localStorage.getItem(""));

  useEffect(() => {
    setView(localStorage.getItem("isExtensionView"));
  }, [isExtensionView]);

  return (
    <Container
      className={`${ContainerSmallerStyles.TopLevelContainer} ${styles.nav} ${
        user && !isExtensionView ? "" : "border-0"
      } border-lg-1 ms-0 me-0 ${(props && props.className) || ""}`}
    >
      <Row className="align-items-center gx-0 gy-0">
        <Col className={`col-md-auto logo-col ${styles.logoCol}`}>
          <a href={user ? "/" : strings.rallyWebsiteUrl}>
            <img
              src="/img/moz-rally-logo.svg"
              className="logo-large"
              alt={strings.a11y.logo}
            />
          </a>
        </Col>

        {user && !isExtensionView && (
          <>
            <TopLinks />
            <DropdownMenus />
          </>
        )}
      </Row>
    </Container>
  );
}

function TopLinks() {
  return (
    <>
      {strings.topLinks.map((topLink, i) => (
        <Col
          className="col-md-auto d-none d-lg-block col-links"
          key={`${i}-topLink.href`}
        >
          <Link href={topLink.href}>
            <a
              target={topLink.external ? "_blank" : "_self"}
              className={`${LinkStyles.NoUnderline} top-link`}
            >
              {topLink.title}
            </a>
          </Link>
        </Col>
      ))}
    </>
  );
}

function DropdownMenus() {
  return (
    <>
      <Col className="d-flex d-lg-none me-0 justify-content-end">
        <MobileMenu />
      </Col>

      <Col className="d-none d-lg-flex me-0 justify-content-end">
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
            ".col-links": {
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

        ".top-link": {
          fontWeight: 700,
          fontSize: 18,
          textDecoration: "none",
        },
      },
    }
  ),
  logoCol: style(
    {
      marginRight: `0`,
    },
    createResponsiveStyle(
      ScreenSize.Medium,
      { marginRight: Spacing.xxxLarge },
      true
    )
  ),
};
