import { RenderResult, act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isValidElement } from "react";

import { Strings } from "../../../../resources/Strings";
import {
  UserType,
  useAuthentication,
} from "../../../../services/AuthenticationService";
import { DeleteAccountConfirmation } from "../DeleteAccountConfirmation";

const strings =
  Strings.components.pages.accountSettings.deleteAccountConfirmation;

jest.mock("../../../../services/AuthenticationService");

describe("DeleteAccountConfirmation tests", () => {
  it("renders google user correctly", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Google,
    });

    const root = render(<DeleteAccountConfirmation onDone={() => {}} />); //eslint-disable-line @typescript-eslint/no-empty-function

    assertDeleteState(root, true);

    assertComponentRendering(root, UserType.Google);
  });

  it("renders email user correctly", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Email,
    });

    const root = render(<DeleteAccountConfirmation onDone={() => {}} />); //eslint-disable-line @typescript-eslint/no-empty-function

    assertDeleteState(root, false);

    assertComponentRendering(root, UserType.Email);
  });

  it("renders error text correctly", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Email,
    });

    const error = "Some error text";
    const root = render(
      <DeleteAccountConfirmation onDone={() => {}} error={error} /> //eslint-disable-line @typescript-eslint/no-empty-function
    );

    expect(root.getByText(error)).toBeInTheDocument();

    assertDeleteState(root, false);

    assertComponentRendering(root, UserType.Email);
  });

  it("invokes toggle correctly", async () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Google,
    });

    const toggle = jest.fn();

    userEvent.setup();
    const root = render(
      <DeleteAccountConfirmation onDone={() => {}} toggle={toggle} /> //eslint-disable-line @typescript-eslint/no-empty-function
    );

    assertComponentRendering(root, UserType.Google);

    await act(async () => {
      await userEvent.click(root.getByText(strings.cancel));
    });

    expect(toggle).toHaveBeenCalled();
  });

  it("invokes onDone correctly for google user", async () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Google,
    });

    const onDone = jest.fn();

    userEvent.setup();
    const root = render(<DeleteAccountConfirmation onDone={onDone} />);

    assertComponentRendering(root, UserType.Google);

    await act(async () => {
      await userEvent.click(root.getByText(strings.deleteAccount));
    });

    expect(onDone).toHaveBeenCalled();
  });

  it("invokes onDone correctly for email user", async () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Email,
    });

    const onDone = jest.fn();

    userEvent.setup();
    const root = render(<DeleteAccountConfirmation onDone={onDone} />);

    assertDeleteState(root, false);

    const password = "abc123";

    await setPassword(password);

    assertDeleteState(root, true);

    await act(async () => {
      await userEvent.click(root.getByText(strings.deleteAccount));
    });

    expect(onDone).toHaveBeenCalledWith(password);
  });

  function assertComponentRendering(root: RenderResult, userType: UserType) {
    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.cancel)).toBeInTheDocument();
    expect(root.getByText(strings.deleteAccount)).toBeInTheDocument();

    if (userType === UserType.Google) {
      expect(isValidElement(strings.googleText)).toBeTruthy();
    } else {
      expect(root.getByText(strings.emailText)).toBeInTheDocument();
      expect(root.getByText(strings.password)).toBeInTheDocument();
      expect(document.getElementById("password")).toBeInTheDocument();
    }
  }

  function assertDeleteState(root: RenderResult, isEnabled: boolean) {
    const deleteButton = getDeleteButton(root);

    const disabledAttribute = deleteButton
      .getAttributeNames()
      .find((value) => value === "disabled");

    expect(disabledAttribute).toBe(isEnabled ? undefined : "disabled");
  }

  function getDeleteButton(root: RenderResult) {
    const deleteButton = root.getByText(strings.deleteAccount);
    expect(deleteButton).toBeInTheDocument();
    return deleteButton;
  }

  async function setPassword(password: string) {
    const passwordTextbox = document.getElementById(
      "password"
    ) as HTMLInputElement;
    await userEvent.type(passwordTextbox, password);
  }
});
