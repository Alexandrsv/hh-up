import { Page } from "@playwright/test";

export const upResume = async (page: Page) => {
  await page.getByRole("button", { name: "Поднять в поиске" }).first().click();
  await page.getByRole("button", { name: "Закрыть" }).click();
  await page.getByRole("button", { name: "Поднять в поиске" }).first().click();
  await page.getByRole("button", { name: "Поднять в поиске" }).first().click();
};
