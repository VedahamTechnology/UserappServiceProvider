/**
 * Typography presets — drop the 132 repeated `font-black` / `font-extrabold`
 * class strings into a single source of truth.
 *
 * NativeWind dark mode still works: compose with `dark:` overrides when needed.
 */

export const TEXT = {
  display: 'text-4xl font-black tracking-tight',
  h1: 'text-3xl font-extrabold',
  h2: 'text-2xl font-bold',
  h3: 'text-xl font-bold',
  h4: 'text-lg font-bold',

  subtitle: 'text-lg font-medium',
  body: 'text-base font-normal',
  bodyMedium: 'text-sm font-medium',
  bodyMuted: 'text-sm text-gray-500 dark:text-gray-400 font-medium',
  bodySubtle: 'text-xs text-gray-500 dark:text-gray-400',

  caption: 'text-[10px] font-bold uppercase',
  captionTight: 'text-[10px] font-bold uppercase tracking-widest',
  label: 'text-sm font-bold uppercase tracking-widest',
  tiny: 'text-[10px] font-medium',

  link: 'text-primary font-bold',
  linkMuted: 'text-primary font-medium',

  price: 'text-primary font-black',
  priceMuted: 'text-gray-400 text-[10px] font-bold line-through',

  button: 'text-white font-bold text-base',
};

export const DARK_TEXT = {
  h1: 'text-3xl font-extrabold text-white',
  h2: 'text-2xl font-bold text-white',
  h3: 'text-xl font-bold text-white',
  h4: 'text-lg font-bold text-white',
  body: 'text-base font-normal text-white',
  bodyMedium: 'text-sm font-medium text-white',
  bodyMuted: 'text-sm text-gray-400 font-medium',
};
