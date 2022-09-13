import { logEvent } from "firebase/analytics";

import { getCurrentUser } from "../AuthenticationService";
import {
  IExtensionEventHandler,
  dispose,
  initializeExtensionEvents,
} from "../ExtensionsEventService";
import { useFirebase } from "../FirebaseService";

jest.mock("firebase/analytics");
jest.mock("../AuthenticationService");
jest.mock("../FirebaseService");

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

    describe("complete signup message tests", () => {
      it("throws when complete signup message is null or undefined", async () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        expect(
          async () => await invokeCompleteSignup(null as unknown as CustomEvent)
        ).rejects.toThrow("Invalid complete signup event.");

        expect(
          async () =>
            await invokeCompleteSignup(undefined as unknown as CustomEvent)
        ).rejects.toThrow("Invalid complete signup event.");
      });

      it("throws when type is missing", async () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        expect(
          async () => await invokeCompleteSignup({} as unknown as CustomEvent)
        ).rejects.toThrow("Invalid complete signup event type.");
      });

      it("throws when detail is missing", async () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        expect(
          async () =>
            await invokeCompleteSignup({
              type: "rally-sdk.complete-signup",
            } as unknown as CustomEvent)
        ).rejects.toThrow("Invalid complete signup event detail.");
      });

      it("throws when studyId is missing", async () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        expect(
          async () =>
            await invokeCompleteSignup({
              type: "rally-sdk.complete-signup",
              detail: JSON.stringify({}),
            } as unknown as CustomEvent)
        ).rejects.toThrow("Invalid complete signup event study id.");
      });

      it("fails when user is invalid", async () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        (useFirebase as jest.Mock).mockReturnValue({});

        await expect(
          async () =>
            await invokeCompleteSignup({
              type: "rally-sdk.complete-signup",
              detail: JSON.stringify({ studyId: "studyId" }),
            } as unknown as CustomEvent)
        ).rejects.toThrow("Invalid user.");

        (getCurrentUser as jest.Mock).mockImplementation(async () => null);

        await expect(
          async () =>
            await invokeCompleteSignup({
              type: "rally-sdk.complete-signup",
              detail: JSON.stringify({ studyId: "studyId" }),
            } as unknown as CustomEvent)
        ).rejects.toThrow("Invalid user.");
      });

      it("fails when user id token is invalid", async () => {
        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        (getCurrentUser as jest.Mock).mockImplementation(async () => ({
          getIdToken: () => null,
        }));

        (useFirebase as jest.Mock).mockReturnValue({
          functionsHost: "functionsHost",
        });

        await expect(
          async () =>
            await invokeCompleteSignup({
              type: "rally-sdk.complete-signup",
              detail: JSON.stringify({ studyId: "studyId" }),
            } as unknown as CustomEvent)
        ).rejects.toThrow("Invalid id token.");
      });

      it("fails when rally token fails", async () => {
        global.fetch = jest.fn().mockImplementation(async () => {
          throw new Error("Fetch error.");
        });

        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        (getCurrentUser as jest.Mock).mockImplementation(async () => ({
          getIdToken: () => "id token",
        }));

        (useFirebase as jest.Mock).mockReturnValue({
          analytics: "analytics",
          functionsHost: "functionsHost",
        });

        await expect(
          async () =>
            await invokeCompleteSignup({
              type: "rally-sdk.complete-signup",
              detail: JSON.stringify({ studyId: "studyId" }),
            } as unknown as CustomEvent)
        ).rejects.toThrow("Fetch error.");

        expect(global.fetch).toHaveBeenCalledWith("functionsHost/rallytoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer id token",
          },
          body: JSON.stringify({ studyId: "studyId" }),
        });
      });

      it("successful call", async () => {
        global.fetch = jest.fn().mockImplementation(async () => {
          return {
            json: async () => ({ rallyToken: "rally token" }),
          };
        });

        assertEventSubscriptionsAndWebCheck(
          {} as unknown as IExtensionEventHandler
        );

        (getCurrentUser as jest.Mock).mockImplementation(async () => ({
          getIdToken: () => "id token",
        }));

        (useFirebase as jest.Mock).mockReturnValue({
          analytics: "analytics",
          functionsHost: "functionsHost",
        });

        const attribution = {
          source: "source",
          medium: "medium",
          campaign: "campaign",
          term: "term",
          content: "content",
        };

        await invokeCompleteSignup({
          type: "rally-sdk.complete-signup",
          detail: JSON.stringify({
            studyId: "studyId",
            attribution,
          }),
        } as unknown as CustomEvent);

        expect(global.fetch).toHaveBeenCalledWith("functionsHost/rallytoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer id token",
          },
          body: JSON.stringify({ studyId: "studyId" }),
        });

        expect(logEvent).toHaveBeenCalledWith(
          "analytics",
          "activate_extension",
          { studyId: "studyId", ...attribution }
        );

        expect(window.dispatchEvent).toHaveBeenCalledWith(
          new CustomEvent("rally-sdk.complete-signup-response", {
            detail: { studyId: "studyId", rallyToken: "rallyToken" },
          })
        );
      });

      async function invokeCompleteSignup(e: CustomEvent) {
        const mockCall = (window.addEventListener as jest.Mock).mock.calls.find(
          (a) => a[0] === "rally-sdk.complete-signup"
        );

        expect(mockCall).toBeDefined();

        const onWebCheckResponse = mockCall[1];

        await onWebCheckResponse(e);
      }
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
