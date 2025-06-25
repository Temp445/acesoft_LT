import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'de', 'es', 'it', 'ja', 'zh', 'hi', 'br', 'kr', 'be', 'ru'],
 
  defaultLocale: 'en',
  localePrefix: 'never'
});