import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import { Strings } from "../../../../resources/Strings";
import { useAuthentication } from "../../../../services/AuthenticationService";
import { useUserDocument } from "../../../../services/UserDocumentService";
import { PrivacyPolicyButtons } from "../PrivacyPolicyButtons";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../../../../services/UserDocumentService");

const strings = Strings.components.pages.privacyPolicy.buttons;

describe("PrivacyPolicyButtons tests", () => {
  it("clicking the decline button invokes logout", async () => {
    const logout = jest.fn();
    (useAuthentication as jest.Mock).mockReturnValue({ logout });

    const updateUserDocument = jest.fn();
    (useUserDocument as jest.Mock).mockReturnValue({
      updateUserDocument,
      userDocument: null,
    });

    const events = userEvent.setup();

    const root = render(<PrivacyPolicyButtons />);

    await act(async () => {
      await events.click(root.getByText(strings.initial.decline));
    });

    expect(logout).toHaveBeenCalled();
    expect(updateUserDocument).not.toHaveBeenCalled();
  });

  it("enrollment with null document", async () => {
    const logout = jest.fn();
    (useAuthentication as jest.Mock).mockReturnValue({ logout });

    const updateUserDocument = jest.fn();
    (useUserDocument as jest.Mock).mockReturnValue({
      updateUserDocument,
      userDocument: null,
    });

    const events = userEvent.setup();

    const root = render(<PrivacyPolicyButtons />);

    await act(async () => {
      await events.click(root.getByText(strings.initial.acceptAndEnroll));
    });

    expect(updateUserDocument).toHaveBeenCalledWith({ enrolled: true });
    expect(logout).not.toHaveBeenCalled();
  });

  it("enrollment with non null document", async () => {
    const logout = jest.fn();
    (useAuthentication as jest.Mock).mockReturnValue({ logout });

    const updateUserDocument = jest.fn();
    const userDocument = { uid: "uid" };
    (useUserDocument as jest.Mock).mockReturnValue({
      updateUserDocument,
      userDocument,
    });

    const events = userEvent.setup();

    const root = render(<PrivacyPolicyButtons />);

    await act(async () => {
      await events.click(root.getByText(strings.initial.acceptAndEnroll));
    });

    expect(updateUserDocument).toHaveBeenCalledWith({
      uid: "uid",
      enrolled: true,
    });
    expect(logout).not.toHaveBeenCalled();
  });
});
