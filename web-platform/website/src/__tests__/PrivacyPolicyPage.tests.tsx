import { render } from "@testing-library/react";
import Head from "next/head";
import { useRouter } from "next/router";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { PrivacyPolicyPageContent } from "../components/pages/privacy-policy/PrivacyPolicyPageContent";
import { default as PrivacyPolicyPage } from "../pages/privacy-policy";
import { Strings } from "../resources/Strings";
import { useUserDocument } from "../services/UserDocumentService";

jest.mock("next/head");
jest.mock("next/router");
jest.mock("../components/AuthenticatedPage");
jest.mock("../components/pages/privacy-policy/PrivacyPolicyPageContent");
jest.mock("../services/UserDocumentService");

describe("privacy policy page tests", () => {
  beforeEach(() => {
    (Head as jest.Mock).mockImplementation(({ children }) => children);
    (AuthenticatedPage as jest.Mock).mockImplementation(
      ({ children }) => children
    );
  });

  it("renders null when router is not ready", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: { enrolled: true },
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, isReady: false });

    const root = render(<PrivacyPolicyPage />);

    expect(root.container.firstChild).toBeNull();

    expect(replace).not.toHaveBeenCalled();

    expect(useUserDocument).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
  });

  it("routes to home page when user is already enrolled", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: { enrolled: true },
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, isReady: true });

    const root = render(<PrivacyPolicyPage />);

    expect(root.container.firstChild).toBeNull();

    expect(replace).toHaveBeenCalledWith("/");

    expect(useUserDocument).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
  });

  it("renders content when user document does not exist", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: undefined,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, isReady: true });

    render(<PrivacyPolicyPage />);

    expect(PrivacyPolicyPageContent).toHaveBeenCalled();

    expect(replace).not.toHaveBeenCalled();

    expect(useUserDocument).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(document.title).toBe(Strings.pages.privacyPolicy.title);
  });

  it("renders content when user is not enrolled", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: { enrolled: false },
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, isReady: true });

    render(<PrivacyPolicyPage />);

    expect(PrivacyPolicyPageContent).toHaveBeenCalledWith(
      { readOnly: false },
      expect.anything()
    );

    expect(replace).not.toHaveBeenCalled();

    expect(useUserDocument).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(document.title).toBe(Strings.pages.privacyPolicy.title);
  });
});
