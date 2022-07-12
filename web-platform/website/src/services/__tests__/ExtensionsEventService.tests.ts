import {
  IExtensionEventHandler,
  dispose,
  initializeExtensionEvents,
} from "../ExtensionsEventService";

describe("ExtensionsEventService tests", () => {
  describe("initializeExtensionEvents tests", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      dispose();
    });

    it("throws when event handler is null", () => {
      expect(() =>
        initializeExtensionEvents(null as unknown as IExtensionEventHandler)
      ).toThrowError("Invalid event handler.");
    });

    it("throws when duplicate initialization is detected", () => {
      initializeExtensionEvents({} as unknown as IExtensionEventHandler);

      expect(() =>
        initializeExtensionEvents({} as unknown as IExtensionEventHandler)
      ).toThrow("Duplicate initialization detected.");
    });

    it("initializes successfully", () => {
      assertEventSubscriptionsAndWebCheck(
        {} as unknown as IExtensionEventHandler
      );
    });

    it("disposes correctly", () => {
      jest.spyOn(window, "removeEventListener");

      assertEventSubscriptionsAndWebCheck(
        {} as unknown as IExtensionEventHandler
      );

      dispose();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        "rally-sdk.complete-signup",
        expect.anything()
      );

      expect(window.removeEventListener).toHaveBeenCalledWith(
        "rally-sdk.web-check-response",
        expect.anything()
      );
    });

    describe("web check message tests", () => {
      it("throws when web check response is null or undefined", () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        [null, undefined].forEach((event) =>
          expect(() =>
            invokeWebCheckResponse(event as unknown as CustomEvent)
          ).toThrow("Invalid web check response event.")
        );
      });

      it("throws when details is null or undefined", () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        [null, undefined].forEach((details) =>
          expect(() =>
            invokeWebCheckResponse({
              type: "rally-sdk.web-check-response",
              details,
            } as unknown as CustomEvent)
          ).toThrow("Invalid web check response.")
        );
      });

      it("throws when studyId is null or undefined", () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        [null, undefined].forEach((studyId) =>
          expect(() =>
            invokeWebCheckResponse({
              type: "rally-sdk.web-check-response",
              details: { studyId },
            } as unknown as CustomEvent)
          ).toThrow("Invalid web check response.")
        );
      });

      it("throws when attribution is null or undefined", () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        [null, undefined].forEach((attribution) =>
          expect(() =>
            invokeWebCheckResponse({
              type: "rally-sdk.web-check-response",
              details: { studyId: "studyId", attribution },
            } as unknown as CustomEvent)
          ).toThrow("Invalid web check response.")
        );
      });

      it("invokes onStudyInstalled when web check response event is valid", () => {
        const onStudyInstalled = jest.fn();

        assertEventSubscriptionsAndWebCheck({
          onStudyInstalled,
        });

        const details = {
          studyId: "studyId",
          attribution: { key: "value" },
        };

        invokeWebCheckResponse({
          type: "rally-sdk.web-check-response",
          detail: JSON.stringify(details),
        } as CustomEvent);

        expect(onStudyInstalled).toHaveBeenCalledWith(
          details.studyId,
          details.attribution
        );
      });

      function invokeWebCheckResponse(e: CustomEvent) {
        const mockCall = (window.addEventListener as jest.Mock).mock.calls.find(
          (a) => a[0] === "rally-sdk.web-check-response"
        );

        expect(mockCall).toBeDefined();

        const onWebCheckResponse = mockCall[1];

        onWebCheckResponse(e);
      }
    });
  });

  function assertEventSubscriptionsAndWebCheck(
    handler: IExtensionEventHandler
  ) {
    jest.spyOn(window, "dispatchEvent");
    jest.spyOn(window, "addEventListener");

    initializeExtensionEvents(handler);

    const dispatchEvent = window.dispatchEvent as jest.Mock;

    expect(dispatchEvent).toHaveBeenCalled();

    expect(dispatchEvent.mock.calls[0][0].type).toBe("rally-sdk.web-check");

    expect(window.addEventListener).toHaveBeenCalledWith(
      "rally-sdk.complete-signup",
      expect.anything()
    );

    expect(window.addEventListener).toHaveBeenCalledWith(
      "rally-sdk.web-check-response",
      expect.anything()
    );
  }
});
