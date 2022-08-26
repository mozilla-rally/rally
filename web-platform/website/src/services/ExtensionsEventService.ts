import assert from "assert";

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

function onUserTokenRequested() {}

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
