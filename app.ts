import { chromium } from "playwright";
import { Page } from "@playwright/test";
require("dotenv").config();

const saveCookies = async (page: Page) => {
  const cookies = await page.context().cookies();
  const fs = require("fs");
  fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));
};

const upResume = async (page: Page) => {
  await page.getByRole("button", { name: "Поднять в поиске" }).first().click();
  await page.getByRole("button", { name: "Закрыть" }).click();
  await page.getByRole("button", { name: "Поднять в поиске" }).first().click();
  await page.getByRole("button", { name: "Закрыть" }).click();
  await page.getByRole("button", { name: "Поднять в поиске" }).first().click();
};

const MY_RESUME_SELECTOR = "[data-page-analytics-event=resume_list_header]";
const LOGIN = process.env.LOGIN as string;
const PASSWORD = process.env.PASSWORD as string;

const loadCookies = async (page: Page) => {
  const fs = require("fs");
  try {
    const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));
    await page.context().addCookies(cookies);
  } catch (e) {
    console.log("Не удалось загрузить куки");
  }
};

const main = async () => {
  // Setup
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    viewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await context.newPage();
  await loadCookies(page);
  await page.goto("https://hh.ru/");
  await page.route("**/*.{png,jpg,jpeg}", (route) => {
    route.abort();
  });

  await page.route("https://yandex.ru/**", (route) => {
    route.abort();
  });

  await Promise.race([
    page.waitForSelector(MY_RESUME_SELECTOR),
    page.waitForSelector("text=Войти с паролем"),
  ]);

  if (!(await page.isVisible(MY_RESUME_SELECTOR))) {
    await page.getByRole("link", { name: "Войти" }).click();
    await page.waitForSelector("text=Войти с паролем");
    await page.getByRole("button", { name: "Войти с паролем" }).click();

    await page.getByPlaceholder("Электронная почта или телефон").click();
    await page.getByPlaceholder("Электронная почта или телефон").fill(LOGIN);

    await page.getByPlaceholder("Пароль").click();
    await page.getByPlaceholder("Пароль").fill(PASSWORD);
    await page.getByRole("button", { name: "Войти", exact: true }).click();
    await page.waitForSelector(MY_RESUME_SELECTOR);

    if (await page.isVisible(MY_RESUME_SELECTOR)) {
      console.log("Успешная авторизация");
      await saveCookies(page);
    } else {
      throw Error("Не удалось авторизоваться, нет кнопки 'Мои резюме'");
    }
  } else {
    console.log("Авторизация по кукам");
  }

  await page.getByRole("link", { name: "Мои резюме •" }).click();

  await page.waitForSelector("[data-qa=resume-update-button_actions]");

  if (!(await page.isVisible("text=Поднять в поиске"))) {
    console.log("Нет кнопки поднять в поиске");
  } else {
    await upResume(page);
  }
  // Teardown
  await context.close();
  await browser.close();
};

void main().then(() => {
  console.log("Ушел спать\n");
});

setInterval(() => {
  void main().then(() => {
    console.log("Ушел спать\n");
  });
}, (3600 * 4 + 200) * 1000);
