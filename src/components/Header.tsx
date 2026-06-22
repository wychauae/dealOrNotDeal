import { motion } from 'framer-motion';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../i18n/useTranslation';
import styles from './Header.module.css';

export function Header() {
  const { theme, toggleTheme, locale, toggleLocale, soundEnabled, toggleSound } =
    useSettingsStore();
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <motion.div
        className={styles.logo}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.logoIcon} aria-hidden="true">
          💼
        </span>
        <div>
          <h1 className={styles.title}>{t('appTitle')}</h1>
          <p className={styles.subtitle}>{t('appSubtitle')}</p>
        </div>
      </motion.div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.langBtn}
          onClick={toggleLocale}
          aria-label={locale === 'en' ? t('switchToChinese') : t('switchToEnglish')}
        >
          {locale === 'en' ? '中' : 'EN'}
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={toggleSound}
          aria-label={soundEnabled ? t('muteSound') : t('enableSound')}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
