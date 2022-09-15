import assert from "assert";
import { logEvent } from "firebase/analytics";

import { getCurrentUser } from "./AuthenticationService";
import { useFirebase } from "./FirebaseService";

export interface IExtensionEventHandler {
  onStudyInstalled(studyId: string, attribution: Record<string, string>): void;
}

let _eventHandler: IExtensionEventHandler =
  null as unknown as IExtensionEventHandler;

export function initializeExtensionEvents(
  eventHandler: IExtensionEventHandler
) {
  assert(!_eventHandler, "Duplicate initialization detected.");
  assert(eventHandler, "Invalid event handler.");

  _eventHandler = eventHandler;

  subscribeToEvents();

  sendWebCheck();
}

export function dispose() {
  unsubscribeFromEvents();
  _eventHandler = null as unknown as IExtensionEventHandler;
}

function sendWebCheck() {
  window.dispatchEvent(new CustomEvent("rally-sdk.web-check", {}));
}

function subscribeToEvents() {
  window.addEventListener("rally-sdk.complete-signup", onUserTokenRequested);
  window.addEventListener(
    "rally-sdk.web-check-response",
    onWebCheckResponse as EventListenerOrEventListenerObject
  );
}

function unsubscribeFromEvents() {
  window.removeEventListener("rally-sdk.complete-signup", onUserTokenRequested);
  window.removeEventListener(
    "rally-sdk.web-check-response",
    onWebCheckResponse as EventListenerOrEventListenerObject
  );
}

async function onUserTokenRequested(e: Event) {
  const customEvent = e as CustomEvent;

  const detail =
    customEvent && customEvent.detail && JSON.parse(customEvent.detail);

  const error =
    (!customEvent && "Invalid complete signup event.") ||
    (!customEvent.type && "Invalid complete signup event type.") ||
    (!detail && "Invalid complete signup event detail.") ||
    (!detail.studyId && "Invalid complete signup event study id.") ||
    "";

  assert(!error, error);

  const { studyId } = JSON.parse(customEvent.detail);

  const rallyToken = await getRallyTokenForLoggedInUser(studyId);

  if (!rallyToken) {
    return;
  }

  window.dispatchEvent(
    // Each study needs its own token. Send to content script.
    new CustomEvent("rally-sdk.complete-signup-response", {
      detail: { studyId, rallyToken },
    })
  );

  const attribution = detail && detail.attribution;
  const eventParams: Record<string, string> = { studyId };

  if (attribution) {
    ["source", "medium", "campaign", "term", "content"].forEach((code) => {
      if (code in attribution) {
        eventParams[code] = attribution[code];
      }
    });
  }

  const { analytics } = useFirebase();
  logEvent(analytics, "activate_extension", eventParams);
}

async function getRallyTokenForLoggedInUser(studyId: string) {
  const { functionsHost } = useFirebase();

  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const idToken = await user.getIdToken();
  assert(idToken, "Invalid id token.");

  const body = JSON.stringify({ studyId });
  const result = await fetch(`${functionsHost}/rallytoken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body,
  });

  const rallyToken = (await result.json()).rallyToken;

  return rallyToken;
}

function onWebCheckResponse(e: CustomEvent) {
  assert(
    e && e.type === "rally-sdk.web-check-response",
    "Invalid web check response event."
  );

  const detail = JSON.parse(e.detail || "{}");

  assert(
    detail && detail.studyId && detail.attribution,
    "Invalid web check response."
  );

  const { studyId, attribution } = detail as {
    studyId: string;
    attribution: Record<string, string>;
  };

  _eventHandler.onStudyInstalled(studyId, attribution);
}
