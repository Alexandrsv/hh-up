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
  for (const button of updateButtons) {
    try {
      await button.click();
      await page.waitForSelector("text=Поднять в поиске", { state: "hidden" });

      if (
        await page.isVisible("[data-qa=bot-update-resume-modal__close-button]")
      ) {
        try {
          await page.getByRole("button", { name: "Закрыть" }).click();
        } catch (e) {
          console.log("Не смог закрыть модалку, нет кнопки Закрыть");
        }
      }
      successUpCount++;
    } catch (e) {}
  }
  console.log("Поднято ", successUpCount, " резюме\n");
};
