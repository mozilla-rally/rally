import { EmailSignupView } from "./EmailSignupView";
import { GetExtensionView } from "./GetExtensionView";
import { InitialLoginView } from "./InitialLoginView";
import { LoginState, useLoginDataContext } from "./LoginDataContext";
import { LoginView } from "./LoginView";
import { ResetPasswordView } from "./ResetPasswordView";

export function LoginCardFactory() {
  const { loginState } = useLoginDataContext();

  switch (loginState) {
    case LoginState.GetExtension:
      return <GetExtensionView />;

    case LoginState.Initial:
      return <InitialLoginView />;

    case LoginState.Login:
      return <LoginView />;

    case LoginState.ResetPassword:
      return <ResetPasswordView />;

    case LoginState.SignupWithEmail:
      return <EmailSignupView />;

    default:
      throw new Error("Invalid card type.");
  }
}
