import { Link } from 'react-router-dom';
import { IconPapers, IconBriefcase, IconBook, IconPeople } from './icons';
import './QuickLinks.css';

/* The four things students most often arrive looking for. Routes match the
   definitions in App.js. */
const LINKS = [
  { to: '/Library', Icon: IconPapers, label: 'Past papers', body: 'Search the course archive' },
  { to: '/InternshipPage', Icon: IconBriefcase, label: 'Internships', body: 'Placements and applications' },
  { to: '/Blog', Icon: IconBook, label: 'Journals', body: 'Student research and writing' },
  { to: '/annual-congress', Icon: IconPeople, label: 'Congress', body: 'The annual gathering' },
];

const QuickLinks = () => (
  <nav className='QuickLinks' aria-label='Quick links'>
    <ul className='QuickLinks-grid' data-stagger>
      {LINKS.map(({ to, Icon, label, body }) => (
        <li key={to}>
          <Link className='QuickLink' to={to}>
            <Icon className='QuickLink__icon' />
            <span className='QuickLink__text'>
              <span className='QuickLink__label'>{label}</span>
              <span className='QuickLink__body'>{body}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default QuickLinks;
