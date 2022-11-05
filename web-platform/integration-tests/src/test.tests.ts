import { getWebdriver } from "./test-driver";

describe("hello", () => {
  it("world", async () => {
    const driver = await getWebdriver();
    console.log(typeof driver);
  });
});
