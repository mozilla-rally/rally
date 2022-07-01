import { render } from "@testing-library/react";
import { useRouter } from "next/router";

import { useUserDocument } from "../../../../services/UserDocumentService";
import { PrivacyPolicyButtons } from "../PrivacyPolicyButtons";
import { PrivacyPolicyDataCollectionTypes } from "../PrivacyPolicyDataCollectionTypes";
import { PrivacyPolicyInformationUse } from "../PrivacyPolicyInformationUse";
import { PrivacyPolicyIntroduction } from "../PrivacyPolicyIntroduction";
import { PrivacyPolicyManageData } from "../PrivacyPolicyManageData";
import { PrivacyPolicyPageContainer } from "../PrivacyPolicyPageContainer";
import { PrivacyPolicySharing } from "../PrivacyPolicySharing";
import { PrivacyPolicyTitle } from "../PrivacyPolicyTitle";

jest.mock("next/router");
jest.mock("../../../../services/UserDocumentService");
jest.mock("../PrivacyPolicyButtons");
jest.mock("../PrivacyPolicyDataCollectionTypes");
jest.mock("../PrivacyPolicyInformationUse");
jest.mock("../PrivacyPolicyIntroduction");
jest.mock("../PrivacyPolicyManageData");
jest.mock("../PrivacyPolicySharing");
jest.mock("../PrivacyPolicyTitle");

describe("PrivacyPolicyPageContainer tests", () => {
  it("renders null when router is not ready", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: { enrolled: true },
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, isReady: false });

    assertRendersNull();

    expect(replace).not.toHaveBeenCalled();
  });

  it("routes to home page when user is already enrolled", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: { enrolled: true },
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, isReady: true });

    assertRendersNull();

    expect(replace).toHaveBeenCalledWith("/");
  });

  it("renders content when user document does not exist", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: undefined,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, isReady: true });

    assertRendersContent();

    expect(replace).not.toHaveBeenCalled();
  });

  it("renders content when user is not enrolled", () => {
    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: { enrolled: false },
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, isReady: true });

    assertRendersContent();

    expect(replace).not.toHaveBeenCalled();
  });

  function assertRendersNull() {
    const { container } = render(<PrivacyPolicyPageContainer />);

    expect(container.firstChild).toBeNull();

    expect(useRouter).toHaveBeenCalled();
    expect(useUserDocument).toHaveBeenCalled();

    expect(PrivacyPolicyButtons).not.toHaveBeenCalled();
    expect(PrivacyPolicyDataCollectionTypes).not.toHaveBeenCalled();
    expect(PrivacyPolicyInformationUse).not.toHaveBeenCalled();
    expect(PrivacyPolicyIntroduction).not.toHaveBeenCalled();
    expect(PrivacyPolicyManageData).not.toHaveBeenCalled();
    expect(PrivacyPolicySharing).not.toHaveBeenCalled();
    expect(PrivacyPolicyTitle).not.toHaveBeenCalled();
  }

  function assertRendersContent() {
    const { container } = render(<PrivacyPolicyPageContainer />);

    expect(container.firstChild).not.toBeNull();

    expect(useRouter).toHaveBeenCalled();
    expect(useUserDocument).toHaveBeenCalled();

    expect(PrivacyPolicyButtons).toHaveBeenCalled();
    expect(PrivacyPolicyDataCollectionTypes).toHaveBeenCalled();
    expect(PrivacyPolicyInformationUse).toHaveBeenCalled();
    expect(PrivacyPolicyIntroduction).toHaveBeenCalled();
    expect(PrivacyPolicyManageData).toHaveBeenCalled();
    expect(PrivacyPolicySharing).toHaveBeenCalled();
    expect(PrivacyPolicyTitle).toHaveBeenCalled();
  }
});
