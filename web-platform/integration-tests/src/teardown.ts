import { getWebdriver } from "./test-driver";

afterEach(async () => {
  console.log("Stopping driver");
  await (await getWebdriver()).quit();
});
