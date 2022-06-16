import { render } from "@testing-library/react";
import { ReactElement } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { MobileMenu } from "../MobileMenu";

jest.mock("reactstrap", () => ({
  DropdownItem: jest.fn(),
  DropdownMenu: jest.fn(),
  DropdownToggle: jest.fn(),
  UncontrolledDropdown: jest.fn(),
}));

const strings = Strings.components.navigationBar;

describe("MobileMenu tests", () => {
  beforeEach(() => {
    (UncontrolledDropdown as jest.Mock).mockImplementation((props) => (
      <div {...props} />
    ));
    (DropdownToggle as jest.Mock).mockImplementation((props) => (
      <div {...props} />
    ));
    (DropdownMenu as jest.Mock).mockImplementation((props) => (
      <div {...props} />
    ));
    (DropdownItem as jest.Mock).mockImplementation((props) => (
      <div {...props} />
    ));
  });

  it("Renders menu icon correctly", () => {
    render(<MobileMenu />);
    expect(UncontrolledDropdown).toHaveBeenCalled();
    expect(DropdownToggle).toHaveBeenCalled();

    const menuButton: ReactElement = (DropdownToggle as jest.Mock).mock
      .calls[0][0].children;

    expect(menuButton.props.className).toBe("mobile-menu-icon");
  });

  it("Renders menu items correctly", () => {
    render(<MobileMenu />);

    const calls = (DropdownItem as jest.Mock).mock.calls;
    let sectionIndex = 0;
    let section = strings.sections[0];
    let linkIndex = 0;
    let isUserEmailDisplayed = false;
    let isDataPrivacyDisplayed = false;
    let sectionCountDisplayed = 0;
    let linkCountDisplayed = 0;

    calls.forEach((call, i) => {
      const element = call[0];

      if (i == 0) {
        expect(element.children.props.children).toBe("User Email Goes Here...");
        isUserEmailDisplayed = true;
        return;
      }

      if (i === calls.length - 1) {
        expect(element).toEqual({
          className: "text-center",
          href: strings.dataAndPrivacy.link,
          target: "_blank",
          children: strings.dataAndPrivacy.text,
        });
        isDataPrivacyDisplayed = true;
        return;
      }

      if (element.header) {
        expect(element.children).toBe(strings.sections[sectionIndex].heading);
        section = strings.sections[sectionIndex++];
        linkIndex = 0;
        sectionCountDisplayed++;
      } else {
        const link = section.links[linkIndex++];
        expect(element).toEqual({
          href: link.href,
          target: link.external ? "_blank" : "_self",
          children: link.text,
        });
        linkCountDisplayed++;
      }
    });

    expect(isUserEmailDisplayed).toBeTruthy();
    expect(isDataPrivacyDisplayed).toBeTruthy();
    expect(sectionCountDisplayed).toBe(strings.sections.length);
    expect(linkCountDisplayed).toBe(
      strings.sections.reduce(
        (prevValue, section) => prevValue + section.links.length,
        0
      )
    );

    expect(document.querySelectorAll("hr").length).toBe(
      strings.sections.length + 1
    );
  });
});
