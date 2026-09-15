export interface NavItem {
  label: string;
  path: string;
  /** Key into the icons.svg sprite (public/icons.svg), added per-icon as pages are built. */
  icon?: string;
}

export const APP_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/app/dashboard' },
  { label: 'My DNA', path: '/app/dna' },
  { label: 'Assessment', path: '/app/assessment' },
  { label: 'Matches', path: '/app/matches' },
  { label: 'Analysis', path: '/app/analysis' },
  { label: 'Training', path: '/app/training' },
  { label: 'Partners', path: '/app/partners' },
  { label: 'Community', path: '/app/community' },
  { label: 'Profile', path: '/app/profile' },
];
