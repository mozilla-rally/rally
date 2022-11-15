import { render } from "@testing-library/react";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { StudiesPageContent } from "../components/pages/studies/StudiesPageContent";
import { default as IndexPage } from "../pages/index";
import { Strings } from "../resources/Strings";
import { useFlagService } from "../services/FlagService";

jest.mock("next/head");
jest.mock("../components/AuthenticatedPage");
jest.mock("../components/Layout");
jest.mock("../components/pages/studies/StudiesPageContent");
jest.mock("../services/FlagService");

const strings = Strings.pages.index;

describe("IndexPage tests", () => {
  beforeEach(() => {
    (useFlagService as jest.Mock).mockReturnValue({
      isFlagActive: () => false,
    });

    (Head as jest.Mock).mockImplementation(({ children }) => children);
    (AuthenticatedPage as jest.Mock).mockImplementation(
      ({ children }) => children
    );
  });

  it("renders studies content", () => {
    render(<IndexPage />);

    expect(AuthenticatedPage).toHaveBeenCalled();
    expect(StudiesPageContent).toHaveBeenCalled();

    expect(document.title).toBe(strings.title);
  });
});
