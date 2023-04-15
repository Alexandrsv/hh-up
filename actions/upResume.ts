import { Page } from "@playwright/test";
import { UPDATE_RESUME_SELECTOR } from "../const";
import { closeUpdateModal } from "./closeUpdateModal";

export const upResume = async (page: Page) => {
  const updateButtons = await page
    .locator(UPDATE_RESUME_SELECTOR, {
      hasText: "Поднять в поиске",
    })
    .all();

  console.log("Кнопок поднять в поиске: ", updateButtons.length);

  let successUpCount = 0;

  while (await page.isVisible("text=Поднять в поиске")) {
    await closeUpdateModal(page);
    await page.click("text=Поднять в поиске");
    await closeUpdateModal(page);
    successUpCount++;
  }
  console.log("Поднято ", successUpCount, " резюме\n");
};
