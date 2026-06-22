import type { Locale } from '../i18n/translations';

/** Normalizes to `$` (no US prefix) with a space before the amount */
export function withCurrencySpacing(formatted: string): string {
  return formatted
    .replace(/^US\$(?=\S)/, '$ ')
    .replace(/^\$(?=\S)/, '$ ');
}

function formatNumber(value: number, locale: Locale): string {
  const intlLocale = locale === 'zh' ? 'zh-CN' : 'en-US';
  const decimals = value % 1 === 0 ? 0 : 2;
  return new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value: number, locale: Locale = 'en'): string {
  if (value < 1) {
    return withCurrencySpacing(`$${value.toFixed(2)}`);
  }

  return withCurrencySpacing(`$${formatNumber(value, locale)}`);
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
      return withCurrencySpacing(`$${formatted}万`);
    }
    if (value >= 1_000) {
      return withCurrencySpacing(`$${(value / 1_000).toFixed(0)}千`);
    }
    if (value < 1) {
      return withCurrencySpacing(`$${value.toFixed(2)}`);
    }
    return formatCurrency(value, locale);
  }

  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    const amount = m % 1 === 0 ? `${m}M` : `${m.toFixed(1).replace(/\.0$/, '')}M`;
    return withCurrencySpacing(`$${amount}`);
  }
  if (value >= 10_000) {
    const k = value / 1_000;
    const amount = k % 1 === 0 ? `${k}K` : `${k.toFixed(1).replace(/\.0$/, '')}K`;
    return withCurrencySpacing(`$${amount}`);
  }
  if (value >= 1_000) {
    return withCurrencySpacing(`$${(value / 1_000).toFixed(0)}K`);
  }
  if (value < 1) {
    return withCurrencySpacing(`$${value.toFixed(2)}`);
  }

  return withCurrencySpacing(`$${formatNumber(value, locale)}`);
}
