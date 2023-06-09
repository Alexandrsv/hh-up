import { Page } from "@playwright/test";

export const loadCookies = async (page: Page) => {
  const fs = require("fs");
  try {
    const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));
    if (cookies.length === 0) {
      console.log("Куки пусты");
      return;
    }
    await page.context().addCookies(cookies);
  } catch (e) {
    console.log("Неудалось загрузить куки");
  }
};
