import React, { useState } from 'react';
import axios from 'axios';

const ManageReservation = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [showGuestListModal, setShowGuestListModal] = useState(false);
  const [reservations, setReservations] = useState([]);

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowGuestListModal(true);

    // Fetch reservations for the selected table
    axios.get(`/api/reservations/${table._id}`)
      .then((response) => {
        const reservationsForTable = response.data;
        // Update the reservations state with the fetched data
        setReservations(reservationsForTable);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      
      {showGuestListModal && (
        <div>
          <h2>Reservations for Table: {selectedTable.name}</h2>
          <ul>
            {reservations.map((reservation) => (
              <li key={reservation._id}>
                {reservation.name} - {reservation.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ManageReservation;
