import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '@/i18n/en.json';
import ko from '@/i18n/ko.json';
import ja from '@/i18n/ja.json';
import zh from '@/i18n/zh.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en,
    },
    ko: {
      translation: ko,
    },
    ja: {
      translation: ja,
    },
    zh: {
      translation: zh,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
