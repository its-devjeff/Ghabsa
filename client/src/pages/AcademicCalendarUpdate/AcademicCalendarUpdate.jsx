import { useState, useEffect } from 'react';
import axios from 'axios';
import './AcademicCalendarUpdate.css';
const AcademicCalendarUpdate = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get('/api/event/listEvent')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleEdit = (event) => {
    // Find the index of the event being edited
    const eventIndex = events.findIndex((e) => e._id === event._id);
  
    // Create a copy of the event being edited
    const updatedEvent = { ...events[eventIndex] };
  
    // Set the updated values for the event
    updatedEvent.title = prompt('Enter the updated title:', updatedEvent.title) || updatedEvent.title;
    updatedEvent.description = prompt('Enter the updated description:', updatedEvent.description) || updatedEvent.description;
    updatedEvent.date = prompt('Enter the updated date:', updatedEvent.date) || updatedEvent.date;
  
    // Send a PUT request to `/api/events/${event._id}` with the updated data
    axios
      .put(`/api/event/updateEvents/${event._id}`, updatedEvent)
      .then((response) => {
        // Update the events list with the updated event
        const updatedEvents = [...events];
        updatedEvents[eventIndex] = response.data;
        setEvents(updatedEvents);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  
  const handleDelete = (event) => {
    // Implement deleting the event here
    // Send a DELETE request to `/api/events/${event._id}`
    // Example:
    axios.delete(`/api/event/deleteEvents/${event._id}`)
      .then(response => {
        // Remove the deleted event from the events list
        setEvents(prevEvents => prevEvents.filter(prevEvent => prevEvent._id !== event._id));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleNewEventChange = (event) => {
    const { name, value } = event.target;
    setNewEvent(prevEvent => ({
      ...prevEvent,
      [name]: value
    }));
  };

  const handleNewEventSubmit = (event) => {
    event.preventDefault();
    axios.post('/api/event/addEvent', newEvent)
      .then(response => {
        setEvents(prevEvents => [...prevEvents, response.data]);
        setNewEvent({
          title: '',
          description: '',
          date: ''
        });
        setShowForm(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className='Event-container'>
      <h2>Academic Event List</h2>
      <button className='Add-btn' onClick={() => setShowForm(prevState => !prevState)}>Add New Event</button>
      {showForm && (
        <form className='Event-wrapper' onSubmit={handleNewEventSubmit}>
          <label>
            Title:
            <input type="text" name="title" value={newEvent.title} onChange={handleNewEventChange} />
          </label>
          <label>
            Description:
            <input type="text" name="description" value={newEvent.description} onChange={handleNewEventChange} />
          </label>
          <label>
            Date:
            <input type="text" name="date" value={newEvent.date} onChange={handleNewEventChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th className='desc'>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
<tr key={event._id}>
<td>{event.title}</td>
<td>{event.description}</td>
<td>{event.date}</td>
<td>
<button className='edit-btn' onClick={() => handleEdit(event)}>Edit</button>
<button className='delete-btn' onClick={() => handleDelete(event)}>Delete</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
);
};

export default AcademicCalendarUpdate;






