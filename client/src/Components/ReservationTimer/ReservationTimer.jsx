import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationTimer = () => {
  const [formImage, setFormImage] = useState(null);
  const [formDate, setFormDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timers, setTimers] = useState([]);

  const fetchTimersData = async () => {
    try {
      const response = await axios.get('/api/timer/all-timers');
      setTimers(response.data);
    } catch (error) {
      setError('Error retrieving timers data');
    }
  };

  useEffect(() => {
    fetchTimersData();
  }, []);

  const handleImageChange = (event) => {
    setFormImage(event.target.files[0]);
  };

  const handleDateChange = (event) => {
    setFormDate(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!formImage || !formDate) {
      setError('Please provide both an image and a date.');
      return;
    }

    const formData = new FormData();
    formData.append('image', formImage);
    formData.append('countdownDate', formDate);

    try {
      // Create a new timer
      await axios.post('/api/timer/create-newTimer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Timer created successfully');
      setFormImage(null);
      setFormDate('');
      fetchTimersData();
    } catch (error) {
      setError('Error saving timer');
    }
  };

  const handleDeleteTimer = async (timerId) => {
    try {
      // Delete the timer
      await axios.delete(`/api/timer/delete-timer/${timerId}`);
      setMessage('Timer deleted successfully');
      fetchTimersData();
    } catch (error) {
      setError('Error deleting timer');
    }
  };

  return (
    <div>
      {timers.map((timer) => (
        <div key={timer._id}>
          <img src={`http://localhost:5001/${timer.imagePath}`} alt="Timer" />
          <p>Countdown Date: {timer.countdownDate}</p>
          <button>Edit</button> {/* Add your edit logic here */}
          <button onClick={() => handleDeleteTimer(timer._id)}>Delete</button>
        </div>
      ))}
      <form onSubmit={handleFormSubmit}>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
        <label>
          Image:
          <input type="file" onChange={handleImageChange} />
        </label>
        <label>
          Event Date:
          <input type="date" value={formDate} onChange={handleDateChange} />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default ReservationTimer;
