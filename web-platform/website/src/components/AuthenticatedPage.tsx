import { useRouter } from "next/router";

import { useAttribution } from "../services/AttributionService";
import { useAuthentication } from "../services/AuthenticationService";
import { useUserDocument } from "../services/UserDocumentService";

export function AuthenticatedPage(props: {
  children?: JSX.Element | (JSX.Element | undefined)[];
}) {
  const router = useRouter();
  const { isAttributionLoaded, getAttributionCodes } = useAttribution();

  const { isLoaded, user } = useAuthentication();
  const { isDocumentLoaded } = useUserDocument();

  if (!router.isReady || !isLoaded || !isDocumentLoaded) {
    return null;
  }

  if (!user && typeof window !== undefined) {
    let route = "/login";

    if (isAttributionLoaded) {
      const searchParams = getAttributionCodes();
      const search = searchParams.toString();

      if (search) {
        route += `?${search}`;
      }
    }

    router.replace(route);
    return null;
  }

  return <>{props.children}</>;
}
