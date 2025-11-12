import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationMK from './translation-mk.json';

i18n.use(initReactI18next).init({
  resources: {
    mk: {
      translations: translationMK,
    },
  },
  lng: 'mk',
  fallbackLng: 'mk',
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
