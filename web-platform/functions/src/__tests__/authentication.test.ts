import { jest } from "@jest/globals";

import admin from "firebase-admin";
import functions from "firebase-functions";
import { AuthenticatedFunction, useAuthentication } from "../authentication";

describe("useAuthentication", () => {

  const request = {
    headers: {
      authorization: "Bearer abc123",
    },
  } as functions.https.Request;

  const sendFn = { send: jest.fn() };

  const response = ({
    status: jest.fn(),
  } as unknown) as functions.Response<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  const fakeAuth = {
    verifyIdToken: jest.fn<any>(),
    createCustomToken: jest.fn(),
  };

  Object.defineProperty(admin, "auth", {
    get: function () {
      return () => fakeAuth;
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
    (response.status as jest.Mock).mockReturnValue(sendFn);
  });

  it("throws when request is null", async () => {
    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();

    await expect(() =>
      useAuthentication(
        (null as unknown) as functions.https.Request,
        response,
        fn
      )
    ).rejects.toThrow("Invalid request.");

    expect(fn).not.toBeCalled();
  });

  it("throws when request is undefined", async () => {
    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();

    await expect(() =>
      useAuthentication(
        (undefined as unknown) as functions.https.Request,
        response,
        fn
      )
    ).rejects.toThrow("Invalid request.");

    expect(fn).not.toBeCalled();
  });

  it("throws when response is null", async () => {
    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();

    await expect(() =>
      useAuthentication(
        request,
        (null as unknown) as functions.Response<unknown>,
        fn
      )
    ).rejects.toThrow("Invalid response.");

    expect(fn).not.toBeCalled();
  });

  it("throws when response is undefined", async () => {
    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();

    await expect(() =>
      useAuthentication(
        request,
        (undefined as unknown) as functions.Response<unknown>,
        fn
      )
    ).rejects.toThrow("Invalid response.");

    expect(fn).not.toBeCalled();
  });

  it("throws when function is null", async () => {
    await expect(() =>
      useAuthentication(
        request,
        response,
        (null as unknown) as AuthenticatedFunction
      )
    ).rejects.toThrow("Invalid function.");
  });

  it("throws when function is undefined", async () => {
    await expect(() =>
      useAuthentication(
        request,
        response,
        (undefined as unknown) as AuthenticatedFunction
      )
    ).rejects.toThrow("Invalid function.");
  });

  it("throws when function is non-function", async () => {
    await expect(() =>
      useAuthentication(
        request,
        response,
        ("random value" as unknown) as AuthenticatedFunction
      )
    ).rejects.toThrow("Invalid function.");
  });

  it("throws http error 401 when request is missing", async () => {
    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();

    await useAuthentication(
      ({} as unknown) as functions.https.Request,
      response,
      fn
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(sendFn.send).toHaveBeenCalledWith("Unauthorized access.");
    expect(fn).not.toBeCalled();
  });

  it("throws http error 401 when request authorization header is missing", async () => {
    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();

    await useAuthentication(
      { ...request, headers: {} } as functions.https.Request,
      response,
      fn
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(sendFn.send).toHaveBeenCalledWith("Unauthorized access.");
    expect(fn).not.toBeCalled();
  });

  it("throws http error 401 when bearer prefix is missing", async () => {
    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();

    await useAuthentication(
      {
        ...request,
        headers: { authorization: "123" },
      } as functions.https.Request,
      response,
      fn
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(sendFn.send).toHaveBeenCalledWith("Unauthorized access.");
    expect(fn).not.toBeCalled();
  });

  it("throws http error 401 when bearer prefix is not pascal cased", async () => {
    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();

    await useAuthentication(
      {
        ...request,
        headers: { authorization: "bearer 123" },
      } as functions.https.Request,
      response,
      fn
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(sendFn.send).toHaveBeenCalledWith("Unauthorized access.");
    expect(fn).not.toBeCalled();
  });

  it("throws http error 401 when auth header has more than 2 parts", async () => {
    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();

    await useAuthentication(
      {
        ...request,
        headers: { authorization: "bearer 123 abc" },
      } as functions.https.Request,
      response,
      fn
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(sendFn.send).toHaveBeenCalledWith("Unauthorized access.");
    expect(fn).not.toBeCalled();
  });

  it("throws http error 401 when token is invalid", async () => {
    fakeAuth.verifyIdToken.mockRejectedValue("Invalid token");

    const fn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();
    await useAuthentication(request, response, fn);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(sendFn.send).toHaveBeenCalledWith("Unauthorized access.");
    expect(fakeAuth.verifyIdToken).toHaveBeenCalledWith("abc123");
    expect(fn).not.toBeCalled();
  });

  it("successfully invokes authenticated function", async () => {
    const decryptedToken: admin.auth.DecodedIdToken = {
      uid: "abc123",
    } as admin.auth.DecodedIdToken;

    fakeAuth.verifyIdToken.mockReturnValue(decryptedToken);

    const innerFn: AuthenticatedFunction = jest.fn<AuthenticatedFunction>();
    await useAuthentication(request, response, innerFn);

    expect(innerFn).toHaveBeenCalledWith(decryptedToken);
  });
});
