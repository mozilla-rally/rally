import { useRouter } from "next/router";

import { Flags } from "../resources/Flags";
import { useAttribution } from "../services/AttributionService";
import { useAuthentication } from "../services/AuthenticationService";
import { useFlagService } from "../services/FlagService";
import { useUserDocument } from "../services/UserDocumentService";



export function AuthenticatedPage(props: {
  children?: JSX.Element | (JSX.Element | undefined)[];
}) {
  const router = useRouter();
  const { getAttributionCodes } = useAttribution();

  const { isLoaded, user } = useAuthentication();
  const { isDocumentLoaded, userDocument } = useUserDocument();
  const { isFlagActive } = useFlagService();

  if (!router.isReady || !isLoaded || !isDocumentLoaded) {
    return null;
  }

  if (!user) {
    const searchParams = getAttributionCodes();
    const search = searchParams.toString();

    let route = "/login";
    if (search) {
      route += `?${search}`;
    }

    router.replace(route);
    return null;
  }

  if (
    router.pathname !== "/privacy-policy" &&
    (!userDocument || !userDocument.enrolled) &&
    !isFlagActive(Flags.onboardingV2)
  ) {
    router.replace(`/privacy-policy`);
    return null;
  }

  if (
    router.pathname !== "/profile" &&
    userDocument &&
    userDocument.enrolled &&
    !userDocument.onboared &&
    !isFlagActive(Flags.onboardingV2)
  ) {
    router.replace("/profile");
    return null;
  }

  return <>{props.children}</>;
}
