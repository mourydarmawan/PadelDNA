export interface NavItem {
  label: string;
  path: string;
  /** Key into the icons.svg sprite (public/icons.svg), added per-icon as pages are built. */
  icon?: string;
}

export const APP_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'My DNA', path: '/dna' },
  { label: 'Assessment', path: '/assessment' },
  { label: 'Matches', path: '/matches' },
  { label: 'Analysis', path: '/analysis' },
  { label: 'Training', path: '/training' },
  { label: 'Partners', path: '/partners' },
  { label: 'Community', path: '/community' },
  { label: 'Profile', path: '/profile' },
];
