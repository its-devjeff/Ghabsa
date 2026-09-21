import React, { useState, useEffect } from 'react';
import './ListReservation.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
const ListReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReservations, setFilteredReservations] = useState([]);

  useEffect(() => {
    // Fetch reservations data when the component mounts
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/bookings/get-reservations');
      const data = await response.json();
      setReservations(data);
      setFilteredReservations(data); // Set the initial filtered reservations to the full list
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSearch = () => {
    const filtered = reservations.filter((reservation) => {
      const username = reservation.username || '';
      const tablename = reservation.tableName || '';

      const lowercaseUsername = username.toLowerCase();
      const lowercaseTablename = tablename.toLowerCase();
      const lowercaseSearchTerm = searchTerm.toLowerCase();

      return (
        lowercaseUsername.includes(lowercaseSearchTerm) ||
        lowercaseTablename.includes(lowercaseSearchTerm)
      );
    });

    setFilteredReservations(filtered);
  };

  const handleEdit = async (reservationId) => {
    // Find the reservation with the matching reservationId
    const reservationToUpdate = reservations.find((reservation) => reservation._id === reservationId);
  
    // Check if the reservation exists and hasPaid is false
    if (reservationToUpdate && !reservationToUpdate.hasPaid) {
      // Set hasPaid to true
      reservationToUpdate.hasPaid = true;
  
      try {
        // Send a PUT request to update the reservation
        const response = await fetch(`/api/bookings/reservation/${reservationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationToUpdate),
        });
  
        if (response.ok) {
          console.log(`Reservation with ID ${reservationId} has been updated.`);
          // Fetch updated reservations data
          fetchReservations();
        } else {
          console.log(`Failed to update reservation with ID ${reservationId}.`);
        }
      } catch (error) {
        console.error('Error updating reservation:', error);
      }
    } else {
      console.log(`Reservation with ID: ${reservationId} cannot be edited as it has already been paid.`);
    }
  };
  

  const handleDelete = async (reservationId) => {
    try {
      const reservationToDelete = reservations.find((reservation) => reservation._id === reservationId);
  
      if (reservationToDelete && !reservationToDelete.hasPaid) {
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const currentDate = new Date();
        const createdDate = new Date(reservationToDelete.dateCreated);
        const timeDifference = currentDate - createdDate;
  
        if (timeDifference > twentyFourHours) {
          const response = await fetch(`/api/bookings/reservation/${reservationId}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            // Reservation deleted successfully
            // You can update the reservations state or refetch the reservations
            console.log(`Reservation with ID: ${reservationId} has been deleted`);
          } else {
            // Error deleting reservation
            console.error(`Failed to delete reservation with ID: ${reservationId}`);
          }
        } else {
          console.log(`Reservation with ID: ${reservationId} cannot be deleted as less than 24 hours have passed.`);
        }
      } else {
        console.log(`Reservation with ID: ${reservationId} cannot be deleted as it has already been paid.`);
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const isMoreThan24Hours = (dateCreated) => {
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const currentDate = new Date();
    const createdDate = new Date(dateCreated);
    const timeDifference = currentDate - createdDate;
    return timeDifference > twentyFourHours;
  };

  const toggleGuestList = (reservationId) => {
    setFilteredReservations((prevReservations) =>
      prevReservations.map((reservation) => {
        if (reservation._id === reservationId) {
          return {
            ...reservation,
            showGuestList: !reservation.showGuestList,
          };
        }
        return reservation;
      })
    );
  };

  return (
    <div className='R-wrapper'>
      <h1>Reservations</h1>
      <div className="reserve-search">
        <input
          type="text"
          placeholder="Search by username or tablename"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="reserve-flex">
      <ul>
          {filteredReservations.map((reservation) => (
            <li className="reserve-item" key={reservation._id}>
              <p><span className="bold">Name: </span>{reservation.username}</p>
              <p><span className="bold">Table Name:</span> {reservation.tableName}</p>
              <p><span className="bold">Price to Pay:</span> GH₵ {reservation.priceToBePaid}.00</p>
              <p><span className="bold">Contact:</span> {reservation.contact}</p>
              <p><span className="bold">Email: </span>{reservation.email}</p>
              {reservation.additionalGuests && reservation.additionalGuests.length > 0 && (
                <>
                  <button className="guest-reveal"onClick={() => toggleGuestList(reservation._id)}>
                    <FontAwesomeIcon className="padding-right"icon={faChevronDown}></FontAwesomeIcon>
                    {reservation.showGuestList ? 'Hide Guests' : 'Show Guests'}
                  </button>
                  {reservation.showGuestList && (
                    <ul>
                      {reservation.additionalGuests.map((guest, index) => (
                        <li key={index}>
                          <span className="bold">Guest Name:</span> {guest.guestName} <span className="bold">Guest Email:</span> {guest.email}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
              {!reservation.additionalGuests || reservation.additionalGuests.length === 0 ? (
                <p>No guests to show</p>
              ) : (
                <>
                  {reservation.hasPaid ? (
                    <p><span className="bold">Has Paid:</span> Yes</p>
                  ) : (
                    <>
                      <p><span className="bold">Has Paid:</span> No</p>
                      {isMoreThan24Hours(reservation.dateCreated) ? (
                        <button onClick={() => handleDelete(reservation._id)}>Delete</button>
                      ) : (
                        <button onClick={() => handleEdit(reservation._id)}>Edit</button>
                      )}
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default ListReservation;
