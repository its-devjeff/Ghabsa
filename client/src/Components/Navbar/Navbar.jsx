import { faBars, faBook, faCog, faHomeAlt, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faBloggerB } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import axios from 'axios';

import './Navbar.css';
import Topbar from '../topbar/Topbar';
import Settings from '../../pages/Settings/Settings';
import DashUser from '../DashUser/DashUser';
import FileSearch from '../../pages/Library/Library';
import Blog from '../../pages/Blog/Blog';

/* The signed-in dashboard. Internships and dinner reservations used to live
   here as tabs; internships is now its own product reached from the header
   launcher, and reservations has moved off the dashboard entirely. */
const SECTIONS = [
  { id: 'home', label: 'Home', icon: faHomeAlt },
  { id: 'blog', label: 'Blog', icon: faBloggerB },
  { id: 'library', label: 'Library', icon: faBook },
  { id: 'settings', label: 'Settings', icon: faCog },
];

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [academicEvents, setAcademicEvents] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [latestTrendy, setLatestTrendy] = useState(null);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    setUserData(storedUserData);

    axios.get('/api/ghabsaevent/listEvent')
      .then((res) => setAcademicEvents(res.data))
      .catch((err) => console.log(err));

    axios.get('/api/post/listPosts')
      .then((res) => setLatestBlogs(res.data.slice(0, 4)))
      .catch((err) => console.log(err));

    axios.get('/api/trendy/getTrendy')
      .then((res) => {
        if (res.data.length > 0) setLatestTrendy(res.data[res.data.length - 1]);
      })
      .catch((err) => console.log('Failed to fetch trendy data', err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/Login';
  };

  const select = (id) => {
    setActiveItem(id);
    setSidebarOpen(false);
  };

  return (
    <div className='Dash'>
      <Topbar />

      <div className='Dash-body'>
        <button
          type='button'
          className='Dash-toggle'
          onClick={() => setSidebarOpen((open) => !open)}
          aria-expanded={sidebarOpen}
          aria-controls='dashboard-sidebar'
        >
          <FontAwesomeIcon icon={faBars} />
          <span>Menu</span>
        </button>

        <aside
          id='dashboard-sidebar'
          className={`Dash-sidebar${sidebarOpen ? ' is-open' : ''}`}
        >
          <nav className='Dash-nav'>
            {SECTIONS.map((section) => (
              <button
                type='button'
                key={section.id}
                className={`Dash-item${activeItem === section.id ? ' is-active' : ''}`}
                onClick={() => select(section.id)}
                aria-current={activeItem === section.id ? 'page' : undefined}
              >
                <FontAwesomeIcon className='Dash-item-icon' icon={section.icon} />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>

          <button type='button' className='Dash-item Dash-logout' onClick={handleLogout}>
            <FontAwesomeIcon className='Dash-item-icon' icon={faSignOut} />
            <span>Log out</span>
          </button>
        </aside>

        <main className='Dash-content'>
          {activeItem === 'home' && (
            <DashUser
              userData={userData}
              academicEvents={academicEvents}
              latestBlogs={latestBlogs}
              latestTrendy={latestTrendy}
            />
          )}
          {activeItem === 'library' && <FileSearch />}
          {activeItem === 'settings' && <Settings />}
          {activeItem === 'blog' && <Blog />}
        </main>
      </div>
    </div>
  );
};

export default Navbar;
