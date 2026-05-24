import type { Theme } from '@/lib/theme';

export const CARTO_LIGHT_TILES_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export const CARTO_DARK_TILES_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export const CARTO_TILES_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export function getCartoTilesUrl(theme: Theme) {
  return theme === 'dark' ? CARTO_DARK_TILES_URL : CARTO_LIGHT_TILES_URL;
}
