export const SITE = {
  name: 'Eran Yadin',
  title: 'Eran Yadin',
  description: 'Hardware, firmware and software projects — and notes written along the way.',
  url: 'https://eran-yadin.github.io',
  github: 'https://github.com/eran-yadin',
  linkedin: 'https://www.linkedin.com/in/eran-yadin-b64a34270/',
  // Shown in the footer, the About page and the home page buttons
  links: [
    { label: 'GitHub', href: 'https://github.com/eran-yadin' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/eran-yadin-b64a34270/' },
  ],
};

export const NAV = [
  { label: 'Projects', href: '/projects/' },
  { label: 'Notes', href: '/notes/' },
  { label: 'About', href: '/about/' },
];

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}
