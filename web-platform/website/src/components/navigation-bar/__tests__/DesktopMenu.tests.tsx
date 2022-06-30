import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import { act } from "react-dom/test-utils";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { DesktopMenu } from "../DesktopMenu";

jest.mock("reactstrap", () => ({
  DropdownItem: jest.fn(),
  DropdownMenu: jest.fn(),
  DropdownToggle: jest.fn(),
  UncontrolledDropdown: jest.fn(),
}));
jest.mock("../../../services/AuthenticationService");

const strings = Strings.components.navigationBar;

describe("DesktopMenu tests", () => {
  const logout = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

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

    (useAuthentication as jest.Mock).mockReturnValue({
      user: { firebaseUser: { email: "joe@doe.com" } },
      logout,
    });
  });

  it("Renders menu icon correctly", () => {
    render(<DesktopMenu />);
    expect(UncontrolledDropdown).toHaveBeenCalled();
    expect(DropdownToggle).toHaveBeenCalled();

    const menuButton: ReactElement = (DropdownToggle as jest.Mock).mock
      .calls[0][0].children;

    expect(menuButton.type).toBe("img");
    expect(menuButton.props).toEqual({
      className: "menu-icon",
      src: "/img/icon-profile.svg",
      alt: "Menu Button",
    });
  });

  it("Renders menu items correctly", () => {
    render(<DesktopMenu />);

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
        expect(element.children.props.children).toBe("joe@doe.com");
        isUserEmailDisplayed = true;
        return;
      }

      if (i === calls.length - 1) {
        expect(element).toEqual({
          className: "text-center text-secondary",
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

        expect(element).toEqual(
          expect.objectContaining({
            href: link.href,
            target: link.external ? "_blank" : "_self",
            children: link.text,
          })
        );

        expect(!link.command || element.onClick).toBeTruthy();

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

  it("logout works correctly", async () => {
    userEvent.setup();

    const root = render(<DesktopMenu />);

    await act(async () => {
      await userEvent.click(root.getByText("Sign Out"));
    });

    expect(logout).toHaveBeenCalled();
  });
});
