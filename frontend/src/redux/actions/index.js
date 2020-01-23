import { CHANGE_LANGUAGE } from "../constants/action-types.js";

export function changeLanguage(payload) {
    return { type: CHANGE_LANGUAGE, payload }
  };