require("dotenv").config();

export const LOGIN = process.env.LOGIN as string;
export const PASSWORD = process.env.PASSWORD as string;

export const MY_RESUME_SELECTOR =
  "[data-page-analytics-event=resume_list_header]";
export const UPDATE_RESUME_SELECTOR =
  "[data-qa=resume-update-button_actions].bloko-link";
