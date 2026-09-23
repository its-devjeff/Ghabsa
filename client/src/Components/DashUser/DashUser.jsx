import { Link } from 'react-router-dom';
import './DashUser.css';

/* The dashboard landing panel.

   This used to list the latest blog posts, which is exactly what the Blog tab
   next to it already does. Home is now the thing neither of the other tabs
   is: what is coming up, and the way in to everything else. The blog appears
   only as a single most-recent teaser, as a pointer rather than a duplicate
   of the list. */

const IMG_URL = '/uploads/';

const DINNER = {
  name: 'Astra Aurea',
  tagline: 'Eleganza 26',
  detail: 'Dinner, awards and handing over night',
  date: '22 September 2026',
  design: '/Images/events/astra-aurea-logo.png',
  photo: '/Images/events/dinner-astra-aurea.jpg',
  href: 'https://astra-aurea.vercel.app/',
};

const SHORTCUTS = [
  { label: 'Executives', detail: 'Who is leading the association', to: '/executives' },
  { label: 'Annual Congress', detail: 'The five universities, one week', to: '/annual-congress' },
  { label: 'Prepcon', detail: 'The inter-hall quiz', to: '/prepcon' },
  { label: 'Sport and Games', detail: 'Indoor and outdoor fixtures', to: '/sport-games' },
];

const excerptOf = (content, limit = 180) => {
  if (!content) return '';
  const flat = content.replace(/\s+/g, ' ').trim();
  return flat.length > limit ? `${flat.slice(0, limit).trimEnd()}...` : flat;
};

const DashUser = ({ userData, academicEvents = [], latestBlogs = [] }) => {
  const firstName = userData && userData.firstname;
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const featured = latestBlogs[0];

  return (
    <div className='Dash-panel'>
      <header className='Dash-greeting'>
        <h1 className='Dash-greeting-title'>
          {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
        </h1>
        <p className='Dash-greeting-date'>{today}</p>
      </header>

      {/* The one thing the association is actually pushing right now. */}
      <a
        className='Dash-feature'
        href={DINNER.href}
        target='_blank'
        rel='noopener noreferrer'
      >
        <img className='Dash-feature-photo' src={DINNER.photo} alt='' />
        <span className='Dash-feature-body'>
          <img className='Dash-feature-design' src={DINNER.design} alt={DINNER.name} />
          <span className='Dash-feature-detail'>{DINNER.detail}</span>
          <span className='Dash-feature-date'>{DINNER.date}</span>
          <span className='Dash-feature-cta'>Get a ticket</span>
        </span>
      </a>

      <div className='Dash-grid'>
        <section className='Dash-main'>
          <div className='Dash-section-head'>
            <h2 className='Dash-section-title'>Around the association</h2>
          </div>

          <ul className='Dash-shortcuts'>
            {SHORTCUTS.map((item) => (
              <li key={item.to}>
                <Link className='Dash-shortcut' to={item.to}>
                  <span className='Dash-shortcut-label'>{item.label}</span>
                  <span className='Dash-shortcut-detail'>{item.detail}</span>
                </Link>
              </li>
            ))}
          </ul>

          {featured && (
            <div className='Dash-teaser-wrap'>
              <div className='Dash-section-head'>
                <h2 className='Dash-section-title'>Latest post</h2>
                <Link className='Dash-section-link' to='/Blog'>Read the blog</Link>
              </div>

              <Link className='Dash-teaser' to={`/posts/${featured._id}`}>
                {featured.image && (
                  <img
                    className='Dash-teaser-thumb'
                    src={IMG_URL + featured.image}
                    alt=''
                    loading='lazy'
                  />
                )}
                <span className='Dash-teaser-text'>
                  <span className='Dash-teaser-title'>{featured.title}</span>
                  <span className='Dash-teaser-excerpt'>{excerptOf(featured.content)}</span>
                </span>
              </Link>
            </div>
          )}
        </section>

        <aside className='Dash-next'>
          <div className='Dash-section-head'>
            <h2 className='Dash-section-title'>Up next</h2>
          </div>

          {academicEvents.length === 0 ? (
            <p className='Dash-empty'>Nothing on the calendar.</p>
          ) : (
            <ul className='Dash-events'>
              {academicEvents.map((event) => (
                <li className='Dash-event' key={event._id}>
                  <Link className='Dash-event-link' to={`/listAnEvent/${event._id}`}>
                    <span className='Dash-event-date'>{event.date}</span>
                    <span className='Dash-event-title'>{event.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DashUser;
