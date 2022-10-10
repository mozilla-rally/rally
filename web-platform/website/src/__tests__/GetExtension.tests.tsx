import { render } from "@testing-library/react";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { GetExtensionContent } from "../components/pages/get-extension/GetExtensionContent";
import { default as ExtensionPage } from "../pages/get-extension";
import { Strings } from "../resources/Strings";

jest.mock("next/head");
jest.mock("../components/AuthenticatedPage");
jest.mock("../components/pages/get-extension/GetExtensionContent");
jest.mock("../services/FlagService");

const strings = Strings.pages.getExtension;

describe("ExtensionPage tests", () => {
  beforeEach(() => {
    (Head as jest.Mock).mockImplementation(({ children }) => children);
    (AuthenticatedPage as jest.Mock).mockImplementation(
      ({ children }) => children
    );
    (GetExtensionContent as jest.Mock).mockImplementation(
      ({ children }) => children
    );
  });

  it("renders page correctly", () => {
    render(<ExtensionPage />);

    expect(AuthenticatedPage).toHaveBeenCalled();
    expect(GetExtensionContent).toHaveBeenCalled();
    expect(Head).toHaveBeenCalled();

    expect(document.title).toBe(strings.title);
  });
});
