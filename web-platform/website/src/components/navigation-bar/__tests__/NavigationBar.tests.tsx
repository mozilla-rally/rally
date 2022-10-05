import { RenderResult, render } from "@testing-library/react";
import React from "react";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { DesktopMenu } from "../DesktopMenu";
import { MobileMenu } from "../MobileMenu";
import { NavigationBar } from "../NavigationBar";

jest.mock("../../../services/AuthenticationService");
jest.mock("../DesktopMenu");
jest.mock("../MobileMenu");

const strings = Strings.components.navigationBar;

describe("NavigationBar tests", () => {
  it("Renders correctly for unauthenticated user", () => {
    (useAuthentication as jest.Mock).mockImplementation(() => ({
      user: null,
    }));

    const root = render(<NavigationBar />);

    assertLogoPresent(root, false);

    expect(DesktopMenu).not.toHaveBeenCalled();
    expect(MobileMenu).not.toHaveBeenCalled();
  });

  it("Renders top links correctly when user is authenticated", () => {
    (useAuthentication as jest.Mock).mockImplementation(() => ({
      user: { uid: 123 },
    }));

    const root = render(<NavigationBar />);

    assertLogoPresent(root, true);

    const hrefToElement: Record<string, HTMLAnchorElement> = {};
    document.querySelectorAll("a").forEach((link) => {
      hrefToElement[link.getAttribute("href") || ""] = link;
    });

    strings.topLinks.forEach((topLink) => {
      const link = hrefToElement[topLink.href];
      expect(link).toBeDefined();
      expect(link.getAttribute("href")).toBe(topLink.href);

      if (typeof topLink.title === "string") {
        expect(link.text).toBe(topLink.title);
      } else {
        expect(topLink.title.props.children).toContain(link.text);
      }

      expect(link.getAttribute("target")).toBe(
        topLink.external ? "_blank" : "_self"
      );
    });

    expect(DesktopMenu).toHaveBeenCalled();
    expect(MobileMenu).toHaveBeenCalled();
  });

  it("renders the custom class for the navigation bar", () => {
    render(<NavigationBar className="custom-class" />);
    expect(document.querySelector(".custom-class")).toBeInTheDocument();
  });

  function assertLogoPresent(root: RenderResult, isUserLoggedIn: boolean) {
    const logoImg = root.getByAltText(strings.a11y.logo);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg.nodeName).toBe("IMG");
    expect(logoImg.getAttribute("src")).toBe("/img/moz-rally-logo.svg");

    const link = logoImg.parentElement as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.nodeName).toBe("A");
    expect(link.href).toBe(
      isUserLoggedIn ? root.container.baseURI : strings.rallyWebsiteUrl
    );
  }
});
