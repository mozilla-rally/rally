import { logEvent } from "firebase/analytics";
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes } from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../resources/Strings";
import { useAuthentication } from "../../services/AuthenticationService";
import { useFirebase } from "../../services/FirebaseService";
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

export interface NavigationBarProps extends HTMLAttributes<HTMLDivElement> {
  displayInCollapsedMode?: boolean;
}

export function NavigationBar(props: NavigationBarProps) {
  const { user } = useAuthentication();

  const displayInCollapsedMode =
    props.displayInCollapsedMode !== undefined
      ? props.displayInCollapsedMode
      : false;

  return (
    <Container
      className={`${ContainerSmallerStyles.TopLevelContainer} ${styles.nav} ${
        user && !displayInCollapsedMode ? "" : "border-0"
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

        {user && !displayInCollapsedMode && (
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
  const router = useRouter();
  const { analytics } = useFirebase();

  function isLinkActive(url: string) {
    return router.isReady && router.asPath === url;
  }

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
              className={`top-link ${
                isLinkActive(topLink.href)
                  ? "text-decoration-underline"
                  : LinkStyles.NoUnderline
              }`}
              onClick={() => {
                if (topLink.external) {
                  logEvent(analytics, "external_link", {
                    title: topLink.title,
                    link_url: topLink.href,
                  });
                }
              }}
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
