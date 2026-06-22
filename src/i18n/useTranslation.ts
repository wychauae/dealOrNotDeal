import { useSettingsStore } from '../store/settingsStore';
import {
  translate,
  type TranslationKey,
  type TranslationParams,
} from './translations';

export function useTranslation() {
  const locale = useSettingsStore((s) => s.locale);

  const t = (key: TranslationKey, params?: TranslationParams) =>
    translate(locale, key, params);

  return { t, locale };
}
