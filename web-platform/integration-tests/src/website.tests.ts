import { loginByGoogle } from "./pages/login-page";
import { openWebsite } from "./pages/navigator";

jest.setTimeout(30000);

describe("website tests", () => {
  beforeEach(async () => {
    await openWebsite();
  });

  it("can login using google", async () => {
    await loginByGoogle();
  });
});
