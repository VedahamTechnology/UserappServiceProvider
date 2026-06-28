/**
 * Centralized color tokens.
 *
 * Most colors live in tailwind.config.js (`text-primary`, `bg-primary`, etc.).
 * This file exposes:
 *   - `COLORS`      : semantic tokens for use in `style={{}}` props (icons,
 *                     vector icons, animated styles) and JS-side decisions.
 *   - `DARK_COLORS` : same tokens, dark-mode variants.
 *
 * Hex literals should never appear in screens/components. Import from here.
 */

export const primaryColor = '#043A75';

export const COLORS = {
  primary: primaryColor,
  primaryRgb: '4, 58, 117',
  primaryBg: 'rgba(4, 58, 117, 0.1)',
  primaryBgStrong: 'rgba(4, 58, 117, 0.3)',

  // Status
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
  info: '#3B82F6',
  infoBg: 'rgba(59, 130, 246, 0.1)',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  text: '#111827',
  textMuted: '#6B7280',
  textSubtle: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  surface: '#FFFFFF',
  background: '#F8F9FA',
  placeholder: '#9CA3AF',
};

export const DARK_COLORS = {
  ...COLORS,
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  textSubtle: '#9CA3AF',
  border: '#1e293b',
  borderLight: '#1e293b',
  surface: '#0f172a',
  background: '#020617',
};

export const STATUS_COLORS = {
  pending: { fg: '#F59E0B', bg: '#FEF3C7' },
  accepted: { fg: '#3B82F6', bg: '#DBEAFE' },
  confirmed: { fg: '#3B82F6', bg: '#DBEAFE' },
  in_progress: { fg: '#F97316', bg: '#FFEDD5' },
  completed: { fg: '#10B981', bg: '#D1FAE5' },
  cancelled: { fg: '#EF4444', bg: '#FEE2E2' },
  rejected: { fg: '#EF4444', bg: '#FEE2E2' },
  default: { fg: '#6B7280', bg: '#F3F4F6' },
};

/**
 * Get color tokens for current color scheme.
 * Pass `isDark = true` to get dark variants.
 */
export const getColors = (isDark = false) => (isDark ? DARK_COLORS : COLORS);
