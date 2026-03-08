'use client';

import { useI18n } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="hidden md:flex items-center gap-2 px-3 py-2 rounded-3xl bg-zinc-800/50 hover:border-blue-500/50 hover:bg-zinc-800 transition-all duration-300 text-zinc-300 hover:text-white"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-mono">{locale === 'zh' ? 'CH' : 'EN'}</span>
    </button>
  );
}
