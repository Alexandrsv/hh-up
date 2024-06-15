import { chromium } from "playwright";
import { upResume } from "./actions/upResume";
import { loadCookies } from "./actions/loadCookies";
import { HEADLESS, MY_RESUME_SELECTOR } from "./const";
import { logIn } from "./actions/logIn";

const main = async () => {
  const browser = await chromium.launch({ headless: HEADLESS, slowMo: 300 });
  const context = await browser.newContext({
    viewport: {
      width: 1920,
      height: 1080,
    },
  });

  await context.addInitScript(
    "Object.defineProperty(navigator, 'webdriver', {get: () => false})"
  );

  const page = await context.newPage();

  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
  });

  await loadCookies(page);
  await page.goto("https://hh.ru/", { waitUntil: "domcontentloaded" });
  await page.route("**/*.{png,jpg,jpeg}", (route) => {
    route.abort();
  });

  await page.route("https://yandex.ru/**", (route) => {
    route.abort();
  });

  await Promise.race([
    page.waitForSelector(MY_RESUME_SELECTOR),
    page.waitForSelector("text=Войти"),
  ]);

  if (!(await page.isVisible(MY_RESUME_SELECTOR))) {
    await logIn(page);
  } else {
    console.log("Авторизация по кукам");
  }

  await page.getByRole("link", { name: "Мои резюме" }).click();
  console.log("Перешел на страницу Мои резюме");

  await page.waitForLoadState("load", { timeout: 90000 });
  console.log("Дождался загрузки страницы");

  if (!(await page.isVisible("text=Поднять в поиске"))) {
    console.log("Нет кнопки поднять в поиске");
  } else {
    console.log("Есть кнопка поднять в поиске");
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
