import { Page } from "@playwright/test";

export const saveCookies = async (page: Page) => {
  const cookies = await page.context().cookies();
  const fs = require("fs");
  fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));
};
