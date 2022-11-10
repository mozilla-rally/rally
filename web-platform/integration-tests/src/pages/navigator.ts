import { until } from "selenium-webdriver";
import { getWebdriver, WAIT_FOR_PROPERTY } from "../test-driver";

export async function openWebsite() {
  const driver = await getWebdriver();
  await driver.get("http://localhost:3000");

  await driver.wait(
    until.titleIs("Sign Up | Mozilla Rally"),
    WAIT_FOR_PROPERTY
  );
}
