import { faCalendarAlt, faCalendarCheck, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './SectionB.css';

/* How often the calendar and events refresh in the background. */
const REFRESH_MS = 5 * 60 * 1000;

const SectionB = () => {
  const [academicEvents, setAcademicEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const alive = useRef(true);

  const fetchData = useCallback(() => {
    axios.get('/api/event/listEvent')
      .then(res => {
        if (alive.current) setEvents(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    axios.get('/api/ghabsaevent/listEvent')
      .then(res => {
        if (alive.current) setAcademicEvents(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    alive.current = true;
    fetchData();

    // Auto-update: refresh on an interval, and again whenever the visitor
    // returns to the tab, so the cards stay current without a manual button.
    const timer = setInterval(fetchData, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchData();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      alive.current = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetchData]);

  return (
    <div className='SectionB-card-container'>
      <div className='SectionB-card-items' data-stagger>
        <div className='card'>
          <div className='card-header'>
            <h2><FontAwesomeIcon icon={faCalendarAlt}></FontAwesomeIcon> Academic Calendar</h2>
          </div>
          <div className='card-body'>
            <ul className='content-container'>
                      {academicEvents.map(event => (
            <li className='content-li' key={event._id}>
              <Link className='color-black' to={`/listAnEvent/${event._id}`}>
                {event.title} - {event.date}
              </Link>
            </li>
          ))}

            </ul>
          </div>
        </div>
        <div className='card'>
          <div className='card-header'>
            <h2><FontAwesomeIcon icon={faCalendarCheck}></FontAwesomeIcon> Events</h2>
          </div>
          <div className='card-body'>
            <ul className='content-container'>
              {events.map(event => (
                <li className='content-li' key={event._id}>
                  <Link className='color-black' to={`/listEvent/${event._id}`}>
                {event.title} - {event.date}
              </Link>
                  </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='card'>
          <div className='card-header'>
            <h2><FontAwesomeIcon icon={faNewspaper}></FontAwesomeIcon> Journals</h2>
          </div>
          <div className='card-body'>
            <ul className='content-container'>
              <li className='content-li'>Expression of Sars-Cov-2 Nucleocapsid</li>
              <li className='content-li'>Invasion Mechanism of Malaria Parasite</li>
              <li className='content-li'>Plasmodium Falciparum</li>
              <li className='content-li'>How to write a good CV</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionB;
