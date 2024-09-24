import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ASIDE_EN from "../locales/en/aside"
import BREADCRUM_EN from "../locales/en/breadcrumb"
import ASIDE_VI from "../locales/vi/aside"
import BREADCRUM_VI from "../locales/vi/breadcrumb"


const resources = {
  vi: {
    aside: ASIDE_EN,
    breadcrumb: BREADCRUM_EN
  },
  en: {
    aside: ASIDE_VI,
    breadcrumb: BREADCRUM_VI
  }
};

const defaultNS = {
  
}

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: "vi", 
    // ns: ["aside", "breadcrumb"],
    fallBackLng:"vi",
    // defaultNS,
    interpolation: {
      escapeValue: false 
    }
  });

  export default i18n;