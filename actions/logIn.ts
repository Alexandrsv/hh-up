import { Page } from "@playwright/test";
import { LOGIN, MY_RESUME_SELECTOR, PASSWORD } from "../const";
import { saveCookies } from "./saveCookies";

export const logIn = async (page: Page) => {
  await page.getByRole("link", { name: "Войти" }).click();
  await page.waitForLoadState("load", { timeout: 90000 });
  const withPasswordButton = await page.waitForSelector(
    "button[data-qa=expand-login-by-password]"
  );

  await withPasswordButton?.click({ button: "left" });

  await page.getByPlaceholder("Электронная почта или телефон").click();
  await page.getByPlaceholder("Электронная почта или телефон").fill(LOGIN);

  await page.getByPlaceholder("Пароль").click();
  await page.getByPlaceholder("Пароль").fill(PASSWORD);
  await page.getByRole("button", { name: "Войти", exact: true }).click();

  const hasCaptcha = await page.isVisible("div[class*=hhcaptcha]").catch(() => {
    return false;
  });

  if (hasCaptcha) {
    throw Error(
      "Капча! Но я пока не написал обход, для капчи. Попробуй авторизоваться с этого ip из браузера, пройти капчу и повторить попытку"
    );
  }

  await page.waitForSelector(MY_RESUME_SELECTOR);

  if (await page.isVisible(MY_RESUME_SELECTOR)) {
    console.log("Успешная авторизация");
    await saveCookies(page);
  } else {
    throw Error("Не удалось авторизоваться, нет кнопки 'Мои резюме'");
  }
};
