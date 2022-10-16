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

  if (!router.isReady || !isLoaded || !isDocumentLoaded || !isAttributionLoaded) {
    return null;
  }

  if (!user && typeof window !== undefined) {
    const pathname = "/login";

    const params = getAttributionCodes();
    const query = (params && params.toString()) || "";

    router.replace({ pathname, query });
    return null;
  }

  return <>{props.children}</>;
}
