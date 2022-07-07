import { render } from "@testing-library/react";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { ProfilePageContent } from "../components/pages/profile/ProfilePageContent";
import { default as ProfilePage } from "../pages/profile";
import { Strings } from "../resources/Strings";

jest.mock("next/head");
jest.mock("../components/AuthenticatedPage");
jest.mock("../components/pages/profile/ProfilePageContent");

const strings = Strings.pages.profile;

describe("ProfilePage tests", () => {
  beforeEach(() => {
    (Head as jest.Mock).mockImplementation(({ children }) => children);
    (AuthenticatedPage as jest.Mock).mockImplementation(
      ({ children }) => children
    );
  });

  it("renders page correctly", () => {
    render(<ProfilePage />);

    expect(AuthenticatedPage).toHaveBeenCalled();
    expect(Head).toHaveBeenCalled();
    expect(ProfilePageContent).toHaveBeenCalled();

    expect(document.title).toBe(strings.title);
  });
});
