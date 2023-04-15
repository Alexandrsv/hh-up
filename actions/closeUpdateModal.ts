import { Page } from "@playwright/test";

export const closeUpdateModal = async (page: Page) => {
  if (await page.isVisible("[data-qa=bot-update-resume-modal__close-button]")) {
    try {
      await page.getByRole("button", { name: "Закрыть" }).click();
      console.log("Закрыл модалку");
    } catch (e) {}
  }
};
