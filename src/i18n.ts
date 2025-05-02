import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import ko from '@locales/ko.json';
import en from '@locales/en.json';
import ja from '@locales/ja.json';
import zh from '@locales/zh.json';

i18n.use(initReactI18next).init({
  resources: {
    ko: {translation: ko},
    en: {translation: en},
    ja: {translation: ja},
    zh: {translation: zh},
  },
  lng: 'ko',
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
