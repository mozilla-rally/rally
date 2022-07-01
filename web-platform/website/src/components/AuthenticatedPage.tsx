import { useRouter } from "next/router";

import { useAuthentication } from "../services/AuthenticationService";
import { useUserDocument } from "../services/UserDocumentService";

export function AuthenticatedPage(props: {
  children?: JSX.Element | (JSX.Element | undefined)[];
}) {
  const router = useRouter();

  const { isLoaded, user } = useAuthentication();
  const { isDocumentLoaded, userDocument } = useUserDocument();

  if (!router.isReady || !isLoaded || !isDocumentLoaded) {
    return null;
  }

  if (!user) {
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

  return <>{props.children}</>;
}
