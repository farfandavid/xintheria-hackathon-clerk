import { FOOTER_EN, FOOTER_ES } from "./footerInter";
import { INDEX_EN, INDEX_ES } from "./indexInter";

export const languages = {
  en: "English",
  es: "Español",
};

export const defaultLang = "en";


export const uiIndex = {
  en: INDEX_EN,
  es: INDEX_ES,
} as const;

export const uiFooter = {
  en: FOOTER_EN,
  es: FOOTER_ES
}