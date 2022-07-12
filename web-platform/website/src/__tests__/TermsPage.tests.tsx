import { render } from "@testing-library/react";
import Head from "next/head";

import { Layout } from "../components/Layout";
import { PrivacyPolicyPageContent } from "../components/pages/privacy-policy/PrivacyPolicyPageContent";
import { default as TermsPage } from "../pages/terms";
import { Strings } from "../resources/Strings";

jest.mock("next/head");
jest.mock("../components/Layout");
jest.mock("../components/pages/privacy-policy/PrivacyPolicyPageContent");

const strings = Strings.pages.privacyPolicy;

describe("TermsPage tests", () => {
  beforeEach(() => {
    (Layout as jest.Mock).mockImplementation(({ children }) => children);
    (Head as jest.Mock).mockImplementation(({ children }) => children);
  });

  it("renders terms content", () => {
    render(<TermsPage />);

    expect(Layout).toHaveBeenCalled();
    expect(PrivacyPolicyPageContent).toHaveBeenCalledWith(
      { readOnly: true },
      expect.anything()
    );

    expect(document.title).toBe(strings.title);
  });
});
