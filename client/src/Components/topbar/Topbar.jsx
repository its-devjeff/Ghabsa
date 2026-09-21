import { useState, useEffect } from 'react';
import Hamburger from '../hamburger/hamburger';
import AppsMenu from '../AppsMenu/AppsMenu';
import './Topbar.css';

const Topbar = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage or any other authentication state
    // Update the value of isLoggedIn based on the authentication status
    // For example, you can use a token stored in localStorage as a simple check
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Header is see-through over the hero and gains a solid ground once the
  // page scrolls, so navigation stays readable over light content below.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  return (
    <div className={`top ${scrolled ? 'is-scrolled' : ''}`}>
      <div className='topbar-Container'>
        {/* The whole brand block is the way home, which is what people
            expect of a masthead. */}
        <a className='top-left' href='/' aria-label='GHABSA home'>
          <img src='/ghabsalogo.png' alt='' />
          <span className='orgo-title'>
            <span className='orgo-acronym'>GHABSA</span>
            <span className='orgo-full'>GHANA BIOCHEMISTRY STUDENTS' ASSOCIATION</span>
          </span>
        </a>

        <div className='Login'>
          {isLoggedIn ? (
            // Render nothing if user is logged in
            null
          ) : (
            // Render the login button if user is not logged in
            <span className='Login-btn'>
              <a href='/Login'>Login</a>
            </span>
          )}
        </div>

        <div className='Nav-list-a'>
          <ul className='top-right-bottom'>
          <li className='top-right-bottom-li'>
              <a href='/HomePage'>
                Home
              </a>
            </li>
            <li className='top-right-bottom-li'>
              <a href='/Library'>
                <i className='fa-solid fa-books'></i>Library
              </a>
            </li>
            <li className='top-right-bottom-li'>
              <a
                href='https://intern-buddy-five.vercel.app/'
                target='_blank'
                rel='noopener noreferrer'
              >
                Internships
              </a>
            </li>
            <li className='top-right-bottom-li'>
              <a href='/Blog'>Blog</a>
            </li>
          </ul>
          <AppsMenu />

          <button
            className='Hamburger'
            onClick={toggleHamburger}
            aria-label={hamburgerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={hamburgerOpen}
          >
            <Hamburger isOpen={hamburgerOpen} />
          </button>
        </div>
      </div>


      <style jsx="true">{`
          .Nav-list-a{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            position: static;
            width: auto;
            height: auto;
            padding: 0;
            gap: var(--space-2);
        }


        .Nav-list-a .top-right-bottom{
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--space-5);
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .top-right-bottom li a{
            position: relative;
            display: inline-block;
            padding: var(--space-2) 0;
            text-decoration: none;
            color: var(--white);
            font-family: var(--font-heading);
            font-size: var(--text-sm);
            font-weight: 500;
            letter-spacing: var(--tracking-wide);
            transition: color 180ms ease;
          }
          /* Gold underline grows from the left on hover. */
          .top-right-bottom li a::after{
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0;
            height: 2px;
            border-radius: 2px;
            background-color: var(--color-accent);
            transition: width 180ms ease;
          }
          .top-right-bottom li a:hover::after{
            width: 100%;
          }
          .top-right-bottom li a:hover{
            color: var(--white);
          }

          /* Hamburger is desktop-hidden; the inline list is enough there. */
          .Hamburger{
            display: none;
            align-items: center;
            justify-content: center;
            padding: var(--space-2);
            background: transparent;
            border: none;
            color: var(--white);
            cursor: pointer;
          }

          @media (max-width:767px){
            .Hamburger{
              display: flex;
            }
            .Nav-list-a{
              width: auto;
              height: auto;
              flex-direction: row;
              margin: 0;
              padding: 0;
            }
            .Nav-list-a .top-right-bottom{
              display: ${hamburgerOpen ? 'flex' : 'none'};
              position: absolute;
              top: var(--header-h);
              left: 0;
              right: 0;
              width: 100%;
              margin: 0;
              padding: var(--space-3);
              flex-direction: column;
              align-items: stretch;
              gap: var(--space-1);
              background-color: var(--color-surface);
              border-top: 1px solid var(--color-border);
              box-shadow: var(--shadow-lg);
              opacity: 1;
              z-index: var(--z-header);
            }
            .top-right-bottom li {
              width: 100%;
              text-align: left;
              margin: 0;
            }
            .top-right-bottom li a{
              display: block;
              width: 100%;
              padding: var(--space-3) var(--space-4);
              color: var(--color-text);
              border-radius: var(--radius-md);
              font-size: var(--text-base);
            }
            .top-right-bottom li a::after{
              display: none;
            }
            .top-right-bottom li a:hover{
              color: var(--color-primary);
              background-color: var(--brand-050);
            }
          }
          `}</style>

    </div>
  );
};

export default Topbar;
