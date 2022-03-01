// sets the initial configuration for i18n

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { englishTranslationObject } from "./locales/en";
import { portugueseTranslatorObject } from "./locales/pt";
import { spanishTranslatorObject } from "./locales/es";
import moment from "moment";

export default i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          ...englishTranslationObject, // Translation object below
          key: "hello world",
          "Welcome to React": "Welcome to React and react-i18next",
          capitalize: "{{text, capitalize}}",
          lowercase: "{{text, lowercase}}",
        },
      },
      pt: {
        translation: {
          ...portugueseTranslatorObject,
          key: "Olá mundo",
          "Welcome to React": "Bem-vindo a React e react-i18next",
          capitalize: "{{text, capitalize}}",
          lowercase: "{{text, lowercase}}",
        },
      },
      es: {
        translation: {
          ...spanishTranslatorObject,
          key: "hola mundo",
          "Welcome to React": "Bienvenido a React y react-i18next",
          capitalize: "{{text, capitalize}}",
          lowercase: "{{text, lowercase}}",
        },
      },
    },
    lng: "es",
    fallbackLng: "es",

    interpolation: {
      escapeValue: false,
      format: function (value, format, lng) {
        if (value && format === "uppercase") {
          return value.toUpperCase();
        }
        if (value && format === "lowercase") {
          return value.toLowerCase();
        }
        if (value && format === "capitalize") {
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
        // moment corresponds to a function that moment.js gives us. consult if it is necessary
        if (value && value instanceof Date) {
          return moment(value).format(format);
        }
        return value;
      },
    },
  });

// triggers when the language is changed.
i18n.on("languageChanged", () => {
  console.log("callback log that triggers when language change");
});
