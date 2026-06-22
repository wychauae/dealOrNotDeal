import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export function useLocale() {
  const locale = useSettingsStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  return locale;
}
