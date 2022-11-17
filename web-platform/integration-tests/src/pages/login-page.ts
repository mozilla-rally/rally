import { until } from "selenium-webdriver";
import {
  clickElementById,
  clickElementByText,
  getWebdriver,
  WAIT_FOR_PROPERTY,
} from "../test-driver";

export async function loginByGoogle() {
  await clickElementByText("Sign up with Google");
  await clickElementById("add-account-button");
  await clickElementById("autogen-button");
  await clickElementById("sign-in");

  const driver = await getWebdriver();

  await driver.wait(
    until.urlIs("http://localhost:3000/get-extension"),
    WAIT_FOR_PROPERTY
  );

  await driver.wait(
    until.titleIs("Get Extension | Mozilla Rally"),
    WAIT_FOR_PROPERTY
  );
}
