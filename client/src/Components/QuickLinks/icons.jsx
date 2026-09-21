/* Hand-drawn line icons for the quick-links band.
   Stroked rather than filled, sized in em so they follow the text, and
   coloured with currentColor so a single CSS rule controls them. */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

/* Past papers — a document with a turned corner and ruled lines. */
export const IconPapers = (props) => (
  <svg {...base} {...props}>
    <path d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7l-4-4Z" />
    <path d="M14 3v4h4" />
    <path d="M9 12.5h6M9 16h6" />
  </svg>
);

/* Internships — a briefcase. */
export const IconBriefcase = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="7.5" width="18" height="12" rx="1.75" />
    <path d="M9 7.5V6a1.75 1.75 0 0 1 1.75-1.75h2.5A1.75 1.75 0 0 1 15 6v1.5" />
    <path d="M3 12.5h18" />
  </svg>
);

/* Journals — an open book. */
export const IconBook = (props) => (
  <svg {...base} {...props}>
    <path d="M12 7.25C10.6 5.9 8.6 5.25 5.5 5.25a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1c3.1 0 5.1.65 6.5 2 1.4-1.35 3.4-2 6.5-2a1 1 0 0 0 1-1V6.25a1 1 0 0 0-1-1c-3.1 0-5.1.65-6.5 2Z" />
    <path d="M12 7.25v12.5" />
  </svg>
);

/* Congress — a small group of people. */
export const IconPeople = (props) => (
  <svg {...base} {...props}>
    <circle cx="9.5" cy="8" r="3" />
    <path d="M3 20v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1" />
    <path d="M16.5 5.3a3 3 0 0 1 0 5.4" />
    <path d="M18 14.2a4.5 4.5 0 0 1 3 4.3V20" />
  </svg>
);
