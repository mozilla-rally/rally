import { render } from "@testing-library/react";

import { Strings } from "../../resources/Strings";
import { Footer } from "../Footer";

const strings = Strings.components.footer;

describe("Footer tests", () => {
  it("renders all components correctly", () => {
    const root = render(<Footer />);

    expect(
      document.querySelector(`img[src="/img/moz-rally-logo-inverted.svg"]`)
    ).toBeInTheDocument();

    strings.sections.forEach((section) => {
      assertLinkExists(section.heading);

      section.links.forEach((link) => {
        assertLinkExists(link);
      });
    });

    expect(root.getByText(strings.copyright)).toBeInTheDocument();

    strings.bottomLinks.forEach((link) => assertLinkExists(link));

    const twitterLink = document.querySelector(
      `a[href="${strings.twitterLink}"]`
    ) as HTMLAnchorElement;
    expect(twitterLink).not.toBeNull();
    expect(twitterLink.target).toBe("_blank");

    expect(
      document.querySelector(`img[src="img/twitter.svg"]`)
    ).toBeInTheDocument();
  });

  function assertLinkExists(link: {
    text: string;
    link: string;
    external: boolean;
  }) {
    const anchorElement = document.querySelector(
      `a[href="${link.link}"]`
    ) as HTMLAnchorElement;

    expect(anchorElement).not.toBeNull();
    expect(anchorElement.innerHTML.replace("&amp;", "&")).toBe(link.text);
    expect(anchorElement.target).toBe(link.external ? "_blank" : "_self");
  }
});
