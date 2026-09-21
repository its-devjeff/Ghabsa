import PageShell from '../PageShell/PageShell';
import './PrivacyPolicy.css';

/* The previous version was one loose block of text with its own Footer and
   no header, held together by repeated <span className="newline"> wrappers,
   and it named a domain the site does not use. This is the same ground
   covered as an ordinary structured document. */

const UPDATED = 'August 2026';

const SECTIONS = [
  {
    id: 'what-we-collect',
    title: 'Information we collect',
    body: [
      'We collect information you give us directly. That includes your name, email address and any other details you enter when you create an account, register for an event, submit the contact form, upload a resource to the library, or write to us.',
      'We also collect a limited amount of information automatically when you visit. That includes your IP address, browser type and version, operating system, the pages you opened, the site that referred you, and the dates and times of your visit. This is ordinary web server activity and it is not used to identify you personally.',
    ],
  },
  {
    id: 'how-we-use-it',
    title: 'How we use your information',
    body: [
      'We use the information you give us to answer your enquiries, to run the services you asked for, to administer membership and event registration, and to tell you about association activities.',
      'We use the automatically collected information to keep the site working, to understand which pages are useful, and to investigate faults and abuse.',
      'We do not sell your personal information, and we do not rent or trade it.',
    ],
  },
  {
    id: 'legal-basis',
    title: 'Why we are allowed to hold it',
    body: [
      'We process your information because you have given it to us for a stated purpose, because it is necessary to provide a service you requested, or because we have a legitimate interest in running the association and keeping this site secure. Where we rely on your consent, you may withdraw it at any time.',
    ],
  },
  {
    id: 'sharing',
    title: 'Who we share it with',
    body: [
      'We share personal information with service providers who operate parts of this site on our behalf, such as hosting, database and email delivery providers. They may use it only to provide that service to us.',
      'We may disclose information where the law requires it, or in response to a valid legal request.',
      'If the association transfers the running of this site to a future executive committee, your information passes with it under this same policy.',
    ],
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    body: [
      'We keep personal information only for as long as it serves the purpose it was collected for, or for as long as we are required to keep it. Account details are held while the account is active. Contact form messages are held while the matter is open and for a reasonable period afterwards.',
    ],
  },
  {
    id: 'security',
    title: 'How we protect it',
    body: [
      'We take reasonable measures to protect personal information from loss, misuse and unauthorised access. No method of transmission over the internet and no method of electronic storage is completely secure, so we cannot guarantee absolute security.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    body: [
      'This site uses cookies and similar browser storage to keep you signed in and to remember your preferences between visits. You can block or delete cookies through your browser settings, but parts of the site that depend on being signed in will stop working if you do.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    body: [
      'You may ask us for a copy of the personal information we hold about you, ask us to correct it if it is wrong, or ask us to delete it. You may also object to how we are using it, or ask us to restrict that use.',
      'You may opt out of association announcements at any time by following the instructions in the message or by writing to us.',
      'To exercise any of these, use the contact details below. We will respond within a reasonable period.',
    ],
  },
  {
    id: 'children',
    title: 'Children',
    body: [
      'This site is intended for university students and staff. We do not knowingly collect personal information from children. If you believe a child has given us personal information, write to us and we will remove it.',
    ],
  },
  {
    id: 'external-links',
    title: 'Links to other sites',
    body: [
      'Some pages link to sites the association does not run, including social media accounts, university pages and open textbook repositories. We are not responsible for their content or their privacy practices, and this policy does not cover them. Read their policies before giving them your information.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: [
      'We may update this policy from time to time. The current version is always the one on this page, and the date it was last revised is shown at the top. Where a change materially affects how we handle your information, we will say so on the site.',
    ],
  },
];

const PrivacyPolicy = () => (
  <PageShell
    title='Privacy policy'
    intro='How this site collects, uses and protects your information.'
  >
    <div className='Policy'>
      <p className='Policy-updated'>Last updated {UPDATED}</p>

      <p className='Policy-lead'>
        This policy explains how the Ghana Biochemistry Students&rsquo;
        Association handles personal information collected through this
        website. By using the site, you agree to what is described here.
      </p>

      <nav className='Policy-toc' aria-label='Sections'>
        <ul>
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      {SECTIONS.map((section) => (
        <section className='Policy-section' id={section.id} key={section.id} data-reveal>
          <h2 className='Policy-title'>{section.title}</h2>
          {section.body.map((paragraph) => (
            <p className='Policy-text' key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </section>
      ))}

      <section className='Policy-section' id='contact' data-reveal>
        <h2 className='Policy-title'>Contact us</h2>
        <p className='Policy-text'>
          For any question about this policy, or to exercise any of the rights
          described above, write to{' '}
          <a href='mailto:ug.ghabsa@gmail.com'>ug.ghabsa@gmail.com</a>, or use
          the <a href='/Contact-us'>contact form</a>.
        </p>
        <p className='Policy-text'>
          Ghana Biochemistry Students&rsquo; Association, Department of
          Biochemistry, Cell and Molecular Biology, University of Ghana, Legon,
          Accra.
        </p>
      </section>
    </div>
  </PageShell>
);

export default PrivacyPolicy;
