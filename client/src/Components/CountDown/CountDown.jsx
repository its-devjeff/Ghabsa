import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CountDown.css'

const Countdown = () => {
  const [countdownTime, setCountdownTime] = useState('');

  useEffect(() => {
    fetchCountdownTime();
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      updateCountdownTime();
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  const fetchCountdownTime = async () => {
    try {
      const response = await axios.get('/api/timer/get-countdownAndImage');
      const countdownDate = new Date(response.data.countdownDate);
      const remainingTime = countdownDate.getTime() - Date.now();
      setCountdownTime(remainingTime);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCountdownTime = () => {
    setCountdownTime(prevCountdownTime => {
      if (prevCountdownTime > 0) {
        return prevCountdownTime - 1000;
      }
      return 0;
    });
  };

  const formatCountdownTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  };

  return (
    <div className="countdown-wrapper">
      {countdownTime > 0 ? (
        <div className="countdown-timer">
          <div className="countdown-item">
            <div className="countdown-value">{formatCountdownTime(countdownTime).days}</div>
            <div className="countdown-label">days</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-value">{formatCountdownTime(countdownTime).hours}</div>
            <div className="countdown-label">hours</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-value">{formatCountdownTime(countdownTime).minutes}</div>
            <div className="countdown-label">minutes</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-value">{formatCountdownTime(countdownTime).seconds}</div>
            <div className="countdown-label">seconds</div>
          </div>
        </div>
      ) : (
        <div className="countdown-complete">The Day is finally here</div>
      )}
    </div>
  );
};

export default Countdown;
