require("dotenv").config();

export const LOGIN = process.env.LOGIN as string;
export const PASSWORD = process.env.PASSWORD as string;
export const HEADLESS = process.env.HEADLESS !== "false";

export const MY_RESUME_SELECTOR = "[data-qa=mainmenu_myResumes]";
export const UPDATE_RESUME_SELECTOR =
  "[data-qa=resume-update-button_actions].bloko-link";
