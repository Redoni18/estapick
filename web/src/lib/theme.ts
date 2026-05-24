export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'estapick-theme';

export function parseTheme(value: string | undefined): Theme {
  return value === 'dark' ? 'dark' : 'light';
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return parseTheme(stored ?? undefined);
  } catch {
    return 'light';
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function persistTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.cookie = `${THEME_STORAGE_KEY}=${theme};path=/;max-age=31536000;SameSite=Lax`;
  } catch {
    // Ignore storage failures in private browsing, etc.
  }
}
