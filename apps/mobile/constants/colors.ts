// Graft design tokens — single source of truth for programmatic color use.
// Tailwind class names are the primary API; use these only when className won't work
// (e.g. SVG fills, react-navigation theme objects, chart colors).

export const Colors = {
  // Surfaces
  page:     '#f4f7f4',
  card:     '#ffffff',
  elevated: '#fafcfa',
  border:   '#e6ede6', // sage-100

  // Text
  primary:   '#283729', // sage-900
  secondary: '#476847', // sage-600
  tertiary:  '#7fa07f', // sage-400
  inverse:   '#ffffff',

  // Brand
  brand:      '#5d825d', // sage-500
  brandDark:  '#476847', // sage-600
  brandLight: '#cddccd', // sage-200

  // Verdict (avoid / caution / safe) — never use for decoration
  safe:    '#5c9a5c',
  caution: '#d4a04c',
  danger:  '#b85450',

  // AI accent — only on AI pill tags and chat button
  ai: '#6b7fbf',
} as const;

export type ColorToken = keyof typeof Colors;

// Verdict → color mapping used by verdict pills and cards
export const verdictColor: Record<'avoid' | 'caution' | 'ok', string> = {
  avoid:   Colors.danger,
  caution: Colors.caution,
  ok:      Colors.safe,
};

export const verdictLabel: Record<'avoid' | 'caution' | 'ok', string> = {
  avoid:   'Avoid',
  caution: 'Caution',
  ok:      'Safe',
};
