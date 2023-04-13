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

  while (await page.isVisible("text=Поднять в поиске")) {
    await page.click("text=Поднять в поиске");
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
  }
  console.log("Поднято ", successUpCount, " резюме\n");
};
