import { Page } from "@playwright/test";
import { UPDATE_RESUME_SELECTOR } from "../const";

export const upResume = async (page: Page) => {
  const updateButtons = await page
    .locator(UPDATE_RESUME_SELECTOR, {
      hasText: "Поднять в поиске",
    })
    .all();

  console.log("Кнопок поднять в поиске: ", updateButtons.length);

  let successUpCount = 0;
  for (let i = 0; i < updateButtons.length; i++) {
    try {
      await updateButtons[i].click();
      await page.waitForSelector("text=Поднять в поиске", { state: "hidden" });

      try {
        await page.getByRole("button", { name: "Закрыть" }).click();
      } catch (e) {}

      successUpCount++;
    } catch (e) {}
  }
  console.log("Поднято ", successUpCount, " резюме\n");
};
