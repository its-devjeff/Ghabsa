import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Executives.css';

/* The executive roster as supplied by GHABSA.
   Headshots live in /public/Images/executives, named after each person with
   a web-safe slug, so the photo path is derived from the name rather than
   maintained as a second list that can drift out of step.

   Seats still absent because they have not been supplied: President. */
export const EXECUTIVES = [
  { name: 'Godfred Fynn Acquah', office: 'Vice President' },
  { name: 'Clement Asidekah', office: 'General Secretary' },
  { name: 'Samuel Amoakoh', office: 'Deputy General Secretary' },
  { name: 'Adelaide Nyamekye', office: 'Financial Secretary' },
  { name: 'Jessica Asamoah Benefor', office: 'Deputy Financial Secretary' },
  { name: 'Kayla Kadiri', office: 'Academic Board Head' },
  { name: 'Kwaku Dankyi Boapeah', office: 'Deputy Academic Board Head' },
  { name: 'Victoria Asantewaa Owusu', office: 'Organizing Secretary' },
  { name: 'Nana Afriyie Owusu-Nimoh', office: 'Deputy Organizing Secretary' },
  { name: 'Keziah Naa Adjorkor Adjei', office: 'Welfare Secretary' },
  { name: 'Belvelyn Ampong', office: 'Deputy Welfare Secretary' },
  { name: 'Benson Owusu-Yeboah', office: 'Public Relations Officer' },
  { name: 'Ismail Mustapha Quansah', office: 'Deputy Public Relations Officer' },
  { name: 'Nicholas De-graft Kwafo', office: 'Sports Secretary' },
  { name: 'Richard Nyarkotey', office: 'Deputy Sports Secretary' },
  { name: 'Akua Pipim', office: 'IT Head' },
  { name: 'Frank Agbanu', office: 'Editor in Chief' },
  { name: 'Nyamedor Oswald Ayiku', office: 'Deputy Editor-in-Chief' },
  { name: 'Barbara Amegadzie', office: 'Electoral Commission Head' },
  { name: 'Asiamah Samuel Dwamena', office: 'Chaplaincy Head' },
  { name: 'Boateng Grace Boamah', office: 'Deputy Chaplaincy Head' },
];

/* "Godfred Fynn Acquah" -> "/Images/executives/godfred-fynn-acquah.jpg" */
export const photoFor = (name) =>
  `/Images/executives/${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`;

/* Shown only if a headshot is missing or fails to load. */
const initialsOf = (name) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
};

const Executives = () => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Arrows reflect real scroll position — the back arrow is muted at the
  // start and the forward arrow at the end, as in the reference.
  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    syncArrows();
    el.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows);
    return () => {
      el.removeEventListener('scroll', syncArrows);
      window.removeEventListener('resize', syncArrows);
    };
  }, [syncArrows]);

  const scrollBy = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    // Advance by one card plus its gap.
    const card = el.querySelector('.Exec');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section className='Execs'>
      <div className='Execs-head'>
        <span className='Execs-eyebrow'>Meet your executives</span>
        <h2 className='Execs-title'>The students leading the charge.</h2>
        <Link className='Execs-all' to='/executives'>View all executives</Link>
      </div>

      <div className='Execs-controls'>
        <button
          type='button'
          className='Execs-arrow'
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label='Previous executives'
        >
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75'
               strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
            <path d='M19 12H5' /><path d='M11 18 5 12l6-6' />
          </svg>
        </button>
        <button
          type='button'
          className='Execs-arrow'
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label='Next executives'
        >
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75'
               strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
            <path d='M5 12h14' /><path d='m13 6 6 6-6 6' />
          </svg>
        </button>
      </div>

      <ul className='Execs-track' ref={trackRef}>
        {EXECUTIVES.map((person) => (
          <li className='Exec' key={person.name}>
            <Link className='Exec-link' to='/executives'>
              <span className='Exec-photo'>
                <span className='Exec-monogram' aria-hidden='true'>{initialsOf(person.name)}</span>
                <img
                  src={photoFor(person.name)}
                  alt={`${person.name}, ${person.office}`}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className='Exec-plus' aria-hidden='true'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'
                       strokeLinecap='round'>
                    <path d='M12 5v14M5 12h14' />
                  </svg>
                </span>
              </span>
              <span className='Exec-text'>
                <span className='Exec-name'>{person.name}</span>
                <span className='Exec-office'>{person.office}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Executives;
