import { useRouter } from "next/router";

import { useAuthentication } from "../services/AuthenticationService";
import { useUserDocument } from "../services/UserDocumentService";

export function AuthenticatedPage(props: {
  children?: JSX.Element | (JSX.Element | undefined)[];
}) {
  const router = useRouter();

  const { isLoaded, user, isUserVerified } = useAuthentication();
  const { isDocumentLoaded, userDocument } = useUserDocument();

  if (!router.isReady || !isLoaded || !isDocumentLoaded) {
    return null;
  }

  if (!user || !isUserVerified) {
    router.replace(`/login`);
    return null;
  }

  if (
    router.pathname !== "/privacy-policy" &&
    (!userDocument || !userDocument.enrolled)
  ) {
    router.replace(`/privacy-policy`);
    return null;
  }

  if (
    router.pathname !== "/profile" &&
    userDocument &&
    userDocument.enrolled &&
    !userDocument.onboared
  ) {
    router.replace("/profile");
    return null;
  }

  return <>{props.children}</>;
}
