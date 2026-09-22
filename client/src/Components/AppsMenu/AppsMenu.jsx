import { useEffect, useRef, useState } from 'react';
import './AppsMenu.css';

/* The separate GHABSA products, gathered behind one launcher in the header
   the way a suite of apps usually is. These are standalone deployments rather
   than routes in this app, so every one of them opens in a new tab. */
const APPS = [
  {
    name: 'Intern Buddy',
    blurb: 'Internship placements and applications',
    href: 'https://intern-buddy.ghabsa.com/',
    // No brand mark for this one yet: its favicon is still the stock Create
    // React App logo. Drop a file in and set `thumb` when there is one.
    initials: 'IB',
  },
  {
    name: 'Dinner',
    blurb: 'Astra Aurea, Eleganza 26',
    href: 'https://astra-aurea.vercel.app/',
    thumb: '/Images/events/astra-aurea-mark.png',
    // The star from the Astra Aurea design: the full wordmark is too wide to
    // read at this size. Gold on transparent, so it needs a dark tile.
    thumbDark: true,
  },
];

const AppsMenu = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on a click outside the launcher, and on Escape, which is what a
  // menu is expected to do however it was opened.
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        if (buttonRef.current) buttonRef.current.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className='AppsMenu' ref={wrapRef}>
      <button
        type='button'
        ref={buttonRef}
        className='AppsMenu-button'
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-label='GHABSA apps'
        aria-haspopup='menu'
        aria-expanded={open}
      >
        {/* Nine dots: the established shorthand for a launcher. */}
        <svg viewBox='0 0 20 20' width='20' height='20' aria-hidden='true' focusable='false'>
          {[3, 10, 17].map((cy) =>
            [3, 10, 17].map((cx) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r='1.7' fill='currentColor' />
            ))
          )}
        </svg>
      </button>

      {open && (
        <div className='AppsMenu-panel' role='menu'>
          <p className='AppsMenu-heading'>GHABSA apps</p>
          <ul className='AppsMenu-list'>
            {APPS.map((app) => (
              <li key={app.name}>
                <a
                  className='AppsMenu-item'
                  role='menuitem'
                  href={app.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => setOpen(false)}
                >
                  <span
                    className={`AppsMenu-thumb${app.thumbDark ? ' AppsMenu-thumb--dark' : ''}`}
                    aria-hidden='true'
                  >
                    {app.thumb
                      ? <img src={app.thumb} alt='' />
                      : <span className='AppsMenu-initials'>{app.initials}</span>}
                  </span>

                  <span className='AppsMenu-item-text'>
                    <span className='AppsMenu-item-name'>{app.name}</span>
                    <span className='AppsMenu-item-blurb'>{app.blurb}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AppsMenu;
