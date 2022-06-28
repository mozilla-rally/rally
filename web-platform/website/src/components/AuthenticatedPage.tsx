import { useRouter } from "next/router";

import { useAuthentication } from "../services/AuthenticationService";

export function AuthenticatedPage(props: {
  children?: JSX.Element | (JSX.Element | undefined)[];
}) {
  const router = useRouter();

  const { isLoaded, user } = useAuthentication();

  if (!router.isReady || !isLoaded) {
    return null;
  }

  if (!user) {
    router.replace(`/login`);
    return null;
  }

  return <>{props.children}</>;
}
