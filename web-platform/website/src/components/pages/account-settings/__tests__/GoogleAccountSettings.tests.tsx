import { RenderResult, render } from "@testing-library/react";

import { User } from "../../../../models/User";
import { Strings } from "../../../../resources/Strings";
import { useAuthentication } from "../../../../services/AuthenticationService";
import { GoogleAccountSettings } from "../GoogleAccountSettings";

jest.mock("../../../../services/AuthenticationService");

const strings = Strings.components.pages.accountSettings.googleAccountSettings;

describe("GoogleAccountSettings tests", () => {
  it("timestamp does not exist", () => {
    const email = "joe@doe.com";

    const user = {
      firebaseUser: {
        email,
      },
    } as User;

    (useAuthentication as jest.Mock).mockReturnValue({
      user,
    });

    const root = render(<GoogleAccountSettings />);
    validateContent(root, user);

    const timestamp = new Date().toDateString();
    expect(root.getByText((id) => id.includes(timestamp))).toBeInTheDocument();
  });

  it("timestamp exists", () => {
    const email = "joe@doe.com";

    const now = new Date().toDateString();

    const user = {
      firebaseUser: {
        email,
        metadata: {
          creationTime: now,
        },
      },
    } as User;

    (useAuthentication as jest.Mock).mockReturnValue({
      user,
    });

    const root = render(<GoogleAccountSettings />);
    validateContent(root, user);

    expect(root.getByText((id) => id.includes(now))).toBeInTheDocument();
  });

  function validateContent(root: RenderResult, user: User) {
    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.email)).toBeInTheDocument();
    expect(
      root.getByText(user.firebaseUser.email as string)
    ).toBeInTheDocument();
    expect(root.getByText(strings.connectedWithGoogle)).toBeInTheDocument();
    expect(root.getByText(strings.changeSettings)).toBeInTheDocument();
    expect(
      document.querySelector(`img[src="img/google-logo.svg"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`a[href="${strings.googleAccountLink}"]`)
    ).toBeInTheDocument();
    expect(
      root.getByText((id) => id.includes(strings.manageAccount))
    ).toBeInTheDocument();
    expect(
      document.querySelector(`img[src="img/open-external.svg"]`)
    ).toBeInTheDocument();
  }
});
