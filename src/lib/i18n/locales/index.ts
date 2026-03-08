export { zh } from './zh';
export { en } from './en';
export type { Locale } from '../config';
import { zh } from './zh';
import { en } from './en';
import { Locale } from '../config';

export const translations = {
  zh,
  en,
} as const;

export type Translations = typeof translations;
export type TranslationKey = keyof typeof zh;
