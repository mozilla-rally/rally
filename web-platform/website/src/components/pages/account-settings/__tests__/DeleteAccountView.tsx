import { RenderResult, act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { isValidElement } from "react";

import { Strings } from "../../../../resources/Strings";
import {
  UserType,
  useAuthentication,
} from "../../../../services/AuthenticationService";
import { getFirebaseErrorMessage } from "../../../../utils/FirebaseErrors";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "../AccountSettingsDataContext";
import { DeleteAccountConfirmation } from "../DeleteAccountConfirmation";
import { DeleteAccountView } from "../DeleteAccountView";

jest.mock("next/router");
jest.mock("../../../../utils/FirebaseErrors");
jest.mock("../../../../services/AuthenticationService");
jest.mock("../AccountSettingsDataContext");
jest.mock("../DeleteAccountConfirmation");

const strings = Strings.components.pages.accountSettings.deleteAccount;

describe("DeleteAccountView tests", () => {
  it("zero state", () => {
    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState: undefined,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      deleteGoogleUser: undefined,
      userType: undefined,
    });

    (useRouter as jest.Mock).mockReturnValue(undefined);

    const root = render(<DeleteAccountView />);

    assertComponentsRendered(root);

    expect(DeleteAccountConfirmation).not.toHaveBeenCalled();
  });

  it("cancel changes the state to account settings", async () => {
    const setAccountSettingsState = jest.fn();

    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState,
    });

    userEvent.setup();

    const root = render(<DeleteAccountView />);

    assertComponentsRendered(root);

    await act(async () => {
      await userEvent.click(root.getByText(strings.cancel));
    });

    expect(setAccountSettingsState).toHaveBeenCalledWith(
      AccountSettingsState.AccountSettings
    );

    expect(DeleteAccountConfirmation).not.toHaveBeenCalled();
  });

  it("displays the confirmation dialog when user clicks on delete and can toggle it", async () => {
    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState: undefined,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      deleteGoogleUser: undefined,
      userType: undefined,
    });

    (useRouter as jest.Mock).mockReturnValue(undefined);

    userEvent.setup();

    const root = render(<DeleteAccountView />);

    assertComponentsRendered(root);

    await act(async () => {
      await userEvent.click(root.getAllByText(strings.title)[1]);
    });

    expect(DeleteAccountConfirmation).toHaveBeenCalled();

    const { toggle } = (DeleteAccountConfirmation as jest.Mock).mock
      .calls[0][0];

    (DeleteAccountConfirmation as jest.Mock).mockReset();

    await act(async () => {
      toggle();
    });

    expect(DeleteAccountConfirmation).not.toHaveBeenCalled();
  });

  it("does not delete google user when user cancels the confirmation dialog", async () => {
    const setAccountSettingsState = jest.fn();

    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState,
    });

    const deleteGoogleUser = jest.fn().mockReturnValue(false);

    (useAuthentication as jest.Mock).mockReturnValue({
      deleteGoogleUser,
      userType: UserType.Google,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace });

    userEvent.setup();

    const root = render(<DeleteAccountView />);

    assertComponentsRendered(root);

    await act(async () => {
      await userEvent.click(root.getAllByText(strings.title)[1]);
    });

    expect(DeleteAccountConfirmation).toHaveBeenCalled();

    const { onDone } = (DeleteAccountConfirmation as jest.Mock).mock
      .calls[0][0];

    (DeleteAccountConfirmation as jest.Mock).mockReset();

    await act(async () => {
      onDone();
    });

    expect(setAccountSettingsState).not.toHaveBeenCalled();
    expect(deleteGoogleUser).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(DeleteAccountConfirmation).not.toHaveBeenCalled();
  });

  it("sets the error message when deletion of google user throws error", async () => {
    const setAccountSettingsState = jest.fn();

    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState,
    });

    const error = new Error("Some error");
    const deleteGoogleUser = jest.fn().mockImplementation(async () => {
      throw error;
    });

    (getFirebaseErrorMessage as jest.Mock).mockImplementation((error) => error);

    (useAuthentication as jest.Mock).mockReturnValue({
      deleteGoogleUser,
      userType: UserType.Google,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace });

    userEvent.setup();

    const root = render(<DeleteAccountView />);

    assertComponentsRendered(root);

    await act(async () => {
      await userEvent.click(root.getAllByText(strings.title)[1]);
    });

    expect(DeleteAccountConfirmation).toHaveBeenCalled();

    const { onDone } = (DeleteAccountConfirmation as jest.Mock).mock
      .calls[0][0];

    (DeleteAccountConfirmation as jest.Mock).mockReset();

    await act(async () => {
      onDone();
    });

    expect(setAccountSettingsState).not.toHaveBeenCalled();
    expect(deleteGoogleUser).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(DeleteAccountConfirmation).toHaveBeenCalledWith(
      { error, toggle: expect.anything(), onDone: expect.anything() },
      {}
    );
    expect(getFirebaseErrorMessage).toHaveBeenCalledWith(error);
  });

  it("invokes deletion correctly for google user", async () => {
    const setAccountSettingsState = jest.fn();

    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState,
    });

    const deleteGoogleUser = jest.fn().mockReturnValue(true);

    (useAuthentication as jest.Mock).mockReturnValue({
      deleteGoogleUser,
      userType: UserType.Google,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace });

    userEvent.setup();

    const root = render(<DeleteAccountView />);

    assertComponentsRendered(root);

    await act(async () => {
      await userEvent.click(root.getAllByText(strings.title)[1]);
    });

    expect(DeleteAccountConfirmation).toHaveBeenCalled();

    const { onDone } = (DeleteAccountConfirmation as jest.Mock).mock
      .calls[0][0];

    (DeleteAccountConfirmation as jest.Mock).mockReset();

    await act(async () => {
      onDone();
    });

    expect(setAccountSettingsState).not.toHaveBeenCalled();
    expect(deleteGoogleUser).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith(strings.deleteLandingPageUrl);
    expect(DeleteAccountConfirmation).not.toHaveBeenCalled();
  });

  it("does not delete email user when deleteEmailUser returns false", async () => {
    const setAccountSettingsState = jest.fn();

    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState,
    });

    const deleteEmailUser = jest.fn().mockReturnValue(false);

    (useAuthentication as jest.Mock).mockReturnValue({
      deleteEmailUser,
      userType: UserType.Email,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace });

    userEvent.setup();

    const root = render(<DeleteAccountView />);

    assertComponentsRendered(root);

    await act(async () => {
      await userEvent.click(root.getAllByText(strings.title)[1]);
    });

    expect(DeleteAccountConfirmation).toHaveBeenCalled();

    const { onDone } = (DeleteAccountConfirmation as jest.Mock).mock
      .calls[0][0];

    (DeleteAccountConfirmation as jest.Mock).mockReset();

    const password = "abc123";

    await act(async () => {
      onDone(password);
    });

    expect(setAccountSettingsState).not.toHaveBeenCalled();
    expect(deleteEmailUser).toHaveBeenCalledWith(password);
    expect(replace).not.toHaveBeenCalled();
  });

  it("sets the error message correctly when delete email user throws", async () => {
    const setAccountSettingsState = jest.fn();

    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState,
    });

    const error = new Error("some error");
    const deleteEmailUser = jest.fn().mockImplementation(async () => {
      throw error;
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      deleteEmailUser,
      userType: UserType.Email,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace });

    userEvent.setup();

    const root = render(<DeleteAccountView />);

    assertComponentsRendered(root);

    await act(async () => {
      await userEvent.click(root.getAllByText(strings.title)[1]);
    });

    expect(DeleteAccountConfirmation).toHaveBeenCalled();

    const { onDone } = (DeleteAccountConfirmation as jest.Mock).mock
      .calls[0][0];

    (DeleteAccountConfirmation as jest.Mock).mockReset();

    const password = "abc123";

    await act(async () => {
      onDone(password);
    });

    expect(setAccountSettingsState).not.toHaveBeenCalled();
    expect(deleteEmailUser).toHaveBeenCalledWith(password);
    expect(replace).not.toHaveBeenCalled();
    expect(DeleteAccountConfirmation).toHaveBeenCalledWith(
      { error, toggle: expect.anything(), onDone: expect.anything() },
      {}
    );
    expect(getFirebaseErrorMessage).toHaveBeenCalledWith(error);
  });

  it("invokes deletion correctly for email user", async () => {
    const setAccountSettingsState = jest.fn();

    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState,
    });

    const deleteEmailUser = jest.fn().mockReturnValue(true);

    (useAuthentication as jest.Mock).mockReturnValue({
      deleteEmailUser,
      userType: UserType.Email,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace });

    userEvent.setup();

    const root = render(<DeleteAccountView />);

    assertComponentsRendered(root);

    await act(async () => {
      await userEvent.click(root.getAllByText(strings.title)[1]);
    });

    expect(DeleteAccountConfirmation).toHaveBeenCalled();

    const { onDone } = (DeleteAccountConfirmation as jest.Mock).mock
      .calls[0][0];

    (DeleteAccountConfirmation as jest.Mock).mockReset();

    const password = "abc123";

    await act(async () => {
      onDone(password);
    });

    expect(setAccountSettingsState).not.toHaveBeenCalled();
    expect(deleteEmailUser).toHaveBeenCalledWith(password);
    expect(replace).toHaveBeenCalledWith(strings.deleteLandingPageUrl);
  });

  function assertComponentsRendered(root: RenderResult) {
    expect(useAccountSettingsDataContext).toHaveBeenCalled();
    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(root.getAllByText(strings.title).length).toBe(2); // title and button share the same text
    expect(isValidElement(strings.text)).toBeTruthy();

    expect(
      document.querySelector(`img[src="img/before-you-go.png"]`)
    ).toBeInTheDocument();

    expect(root.getByText(strings.cancel)).toBeInTheDocument();
  }
});
