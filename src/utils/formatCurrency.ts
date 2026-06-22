import type { Locale } from '../i18n/translations';

export function formatCurrency(value: number, locale: Locale = 'en'): string {
  const intlLocale = locale === 'zh' ? 'zh-CN' : 'en-US';

  if (value < 1) {
    return locale === 'zh'
      ? `$${value.toFixed(2)}`
      : `$${value.toFixed(2)}`;
  }

  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

/** Compact format for small briefcase tiles — prevents overflow on large values */
export function formatBriefcaseCurrency(
  value: number,
  locale: Locale = 'en',
): string {
  if (locale === 'zh') {
    if (value >= 10_000) {
      const wan = value / 10_000;
      const formatted =
        wan >= 100
          ? wan.toFixed(0)
          : wan % 1 === 0
            ? wan.toFixed(0)
            : wan.toFixed(1).replace(/\.0$/, '');
      return `$${formatted}万`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}千`;
    }
    if (value < 1) {
      return `$${value.toFixed(2)}`;
    }
    return formatCurrency(value, locale);
  }

  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return m % 1 === 0 ? `$${m}M` : `$${m.toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 10_000) {
    const k = value / 1_000;
    return k % 1 === 0 ? `$${k}K` : `$${k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  if (value < 1) {
    return `$${value.toFixed(2)}`;
  }
  return formatCurrency(value, locale);
}
