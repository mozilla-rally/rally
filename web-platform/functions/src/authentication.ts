import assert from "assert";
import admin from "firebase-admin";
import functions from "firebase-functions";

export type AuthenticatedFunction = (
  decodedToken: admin.auth.DecodedIdToken
) => void | Promise<void>;

export async function useAuthentication(
  request: functions.https.Request,
  response: functions.Response<any>, // eslint-disable-line @typescript-eslint/no-explicit-any,
  authFunc: AuthenticatedFunction
): Promise<void> {
  assert(request, "Invalid request.");
  assert(response, "Invalid response.");
  assert(authFunc && typeof authFunc === "function", "Invalid function.");

  let decodedToken: admin.auth.DecodedIdToken;

  try {
    decodedToken = await authenticateRequest(request);
    assert(decodedToken, "Invalid decoded token.");
  } catch (e) {
    response.status(401).send("Unauthorized access.");
    return;
  }

  await authFunc(decodedToken);
}

async function authenticateRequest(request: functions.https.Request) {
  const bearerToken = (request && request.headers["authorization"]) || "";
  const items = bearerToken.split(/[ ]+/);

  assert(
    items && items.length === 2 && items[0].trim() === "Bearer",
    "Invalid bearer token."
  );

  return await admin.auth().verifyIdToken(items[1].trim());
}
