export type Locale = 'zh' | 'en';

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
}

export const locales: LocaleConfig[] = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export const defaultLocale: Locale = 'zh';
