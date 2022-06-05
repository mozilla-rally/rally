jest.mock("../DesktopMenu");
jest.mock("../MobileMenu");

import { render } from "@testing-library/react";
import React from "react";
import { Strings } from "../../../resources/Strings";
import { DesktopMenu } from "../DesktopMenu";
import { MobileMenu } from "../MobileMenu";
import { NavigationBar } from "../NavigationBar";

const strings = Strings.components.navigationBar;

describe("NavigationBar tests", () => {
  it("Renders the logo correctly", () => {
    const root = render(<NavigationBar />);

    const logoImg = root.getByAltText(strings.a11y.logo);
    expect(logoImg).toBeDefined();
    expect(logoImg.nodeName).toBe("IMG");
    expect(logoImg.getAttribute("src")).toBe("/img/moz-rally-logo.svg");
  });

  it("Renders top links correctly", () => {
    render(<NavigationBar />);

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
  });

  it("Correctly renders menus", () => {
    render(<NavigationBar />);

    expect(DesktopMenu).toHaveBeenCalled();
    expect(MobileMenu).toHaveBeenCalled();
  });
});
