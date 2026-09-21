import { Link } from 'react-router-dom';
import PageShell from '../../Components/PageShell/PageShell';
import './NotFound.css';

/* The app had no catch-all, so a mistyped or retired address rendered an
   entirely blank document: no header, no footer, no way back. */

const ELSEWHERE = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/Blog' },
  { label: 'Library', to: '/Library' },
  { label: 'Executives', to: '/executives' },
  { label: 'About the association', to: '/AboutUs' },
  { label: 'Frequently asked questions', to: '/Frequently-asked-questions' },
];

const NotFound = () => (
  <PageShell
    title='That page is not here'
    intro='The address may have changed, or it may never have existed. Nothing is broken on your end.'
  >
    <div className='NotFound' data-reveal>
      <p className='NotFound-lead'>Try one of these instead.</p>
      <ul className='NotFound-list'>
        {ELSEWHERE.map((item) => (
          <li key={item.to}>
            <Link className='NotFound-link' to={item.to}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  </PageShell>
);

export default NotFound;
