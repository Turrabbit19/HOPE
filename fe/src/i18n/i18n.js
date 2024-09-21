import i18n from "i18next";
import { initReactI18next } from "react-i18next";


const resources = {
  vi: {
    translation: {
      "hello": "chào"
    }
  },
  en: {
    translation: {
      "hello": "hello"
    }
  }
};

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: "vi", 
    // fallBackLng:"vi",
    interpolation: {
      escapeValue: false 
    }
  });

  export default i18n;