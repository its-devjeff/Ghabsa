import React, { useEffect, useState } from 'react';
import axios from '../../axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AcaEventDetails.css';
import { useParams } from 'react-router-dom';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import AdvertisementForm from '../../pages/ManageAdvert/ManageAdvert';
import Advertisements from '../Advertisement/Advertisement';
import Footer from '../footer/Footer';

const AcaEventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = () => {
    axios
      .get(`/api/ghabsaevent/listAnEvent/${eventId}`)
      .then(res => {
        setEvent(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  if (!event) {
    return <p className=''>Loading event details...</p>;
  }

  const formatDate = date => {
    const parts = date.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);
  
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString(undefined, options);
  
    const formattedParts = formattedDate.split(' ');
    const formattedMonth = formattedParts[0];
    const formattedDay = parseInt(formattedParts[1]);
    const formattedYear = formattedParts[2];
  
    let daySuffix = 'th';
    if (formattedDay === 1 || formattedDay === 21 || formattedDay === 31) {
      daySuffix = 'st';
    } else if (formattedDay === 2 || formattedDay === 22) {
      daySuffix = 'nd';
    } else if (formattedDay === 3 || formattedDay === 23) {
      daySuffix = 'rd';
    }
  
    return `${formattedMonth} ${formattedDay}${daySuffix}, ${formattedYear}`;
  };
  

  return (
    <>
    <div className='s-event-container'>
      <div className='event-wrapper'>
        <h1>{event.title}</h1>
        <span className='event-date-container'>
          <FontAwesomeIcon classname='event-date' icon={faCalendar} />
          {formatDate(event.date)}
        </span>
        <p className='event-desc'>{event.description}</p>
      </div>
      <Advertisements/>
    </div>
      <Footer/>
    </>
  );
};

export default AcaEventDetails;
