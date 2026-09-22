
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reservation.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassCheers,faTimes } from '@fortawesome/free-solid-svg-icons';
import emailjs from '@emailjs/browser';
import CountDown from '../CountDown/CountDown';
import Navbar from '../Navbar/Navbar';


const Reservation = () => {
  const [reserveButtonDisabled, setReserveButtonDisabled] = useState(false);
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showGuestListModal, setShowGuestListModal] = useState(false);
  const [selectedTableReservations, setSelectedTableReservations] = useState([]);
  const [reservationList, setReservationList] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [timerImage, setTimerImage] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loadingGuestList, setLoadingGuestList] = useState(false); // Loading state for the guest list modal

  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    fetchTables();
    fetchTimerImage();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('/api/reservation/tables'); // Replace with your API endpoint
      const tableData = response.data;
      setTables(tableData);
  
      // Check if the maximum limit is reached for all tables
      const allTablesFullyBooked = tableData.every(table => table.currentOccupancy >= table.maxLimit);
      setReserveButtonDisabled(allTablesFullyBooked); // Set the disabled state of the reserve button
    } catch (error) {
      console.log(error);
    }
  };
  
  
  const fetchTimerImage = async () => {
    try {
      const response = await axios.get('/api/timer/get-countdownAndImage'); // Replace with your API endpoint for fetching the timer image
      setTimerImage(response.data);
     
    } catch (error) {
      console.log(error);
    }
  };

  
  
  const handleGlassCheersClick = async (tableName) => {
    try {
      const response = await fetch('/api/bookings/get-reservations');
      const data = await response.json();
  
      // Filter reservations for the selected table
      const reservationsForTable = data.filter(reservation => reservation.tableName === tableName);
  
      // Create an array to store the reservations
      const updatedReservationList = [];
  
      // Push each reservation to the array
      reservationsForTable.forEach((reservation, index) => {
        const reservationData = {
          reservationNumber: index + 1,
          tableName: reservation.tableName,
          names: [], // Array to store names (username and guest names)
        };
  
        // Add the username to the names array
        reservationData.names.push(reservation.username);
  
        // Add guest names to the names array (if present)
        if (reservation.additionalGuests && reservation.additionalGuests.length > 0) {
          reservation.additionalGuests.forEach(guest => {
            if (guest.guestName) {
              reservationData.names.push(guest.guestName);
            }
          });
        }
  
        updatedReservationList.push(reservationData);
      });
  
      // Update the reservation list in the component state
      setReservationList(updatedReservationList);
  
      // Set the selected table name
      setSelectedTable(tableName);
  
      // Show the guest list modal
      setShowGuestListModal(true);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };
  
  
  
  const increaseSeatsTaken = async (tableName) => {
    try {
      console.log(tableName+'this worked')
      const response = await axios.get('/api/reservation/tables');
      const tableData = response.data;
      
      const table = tableData.find((table) => table.tableName === tableName);
  
      if (table) {
        const tableId = table._id;
        let seatsTaken = table.seatsTaken;
  
        if (table.tableType === 'Single') {
          seatsTaken += 1;
        } else if (table.tableType === 'Couple') {
          seatsTaken += 2;
        } else if (table.tableType === 'Ten') {
          seatsTaken += 10;
        }
  
        await axios.put(`/api/reservation/tables/updateSeatsTaken/${tableId}`, { seatsTaken });
      } else {
        console.log(`Table with tableName: ${tableName} not found`);
      }
    } catch (error) {
      console.error('Failed to increase seats taken:', error);
    }
  };

  
  const handleTableClick = async (table) => {
    setSelectedTable(table);
    setShowModal(true);
    try {
      const response = await axios.get(`/api/bookings/table/${table.tableName}`);
      setReservations(response.data);
     
    } catch (error) {
      console.log(error);
    }
    
    
  };
  
  const [formData, setFormData] = useState({
    additionalGuests: [],
    reservationReference: '',
  });
  
  const [reservationReference, setReservationReference] = useState('');

  const handleReservationSubmit = async (formData, reference, tableName) => {
    try {
  
      // if (selectedTable.tableType === 'Single') {
      //   const templateParams = {
      //     subject: 'Ghabsa Dinner Reservation Confirmation',
      //     toMail: [userData.email],
      //     userBody: `Your reservation has been confirmed. Your reservation reference is: ${reference}`,
      //   };
      
      //   emailjs
      //     .send('service_c7ffowf', 'template_dj8755j', templateParams, 'uZ5aohdM6dChZzrW3')
      //     .then(function (response) {
      //       console.log('SUCCESS!', response.status, response.text);
      //     })
      //     .catch(function (error) {
      //       console.log('FAILED...', error);
      //     });
      
     
      // } else if (selectedTable.tableType === 'Couple') {
      //   const guestEmail = formData.additionalGuests[0]?.email;
      
      //   const templateParams = {
      //     subject: 'Ghabsa Dinner Reservation Confirmation',
      //     toMail: [guestEmail, userData.email],
      //     userBody: `Your reservation has been confirmed. Your reservation reference is: ${reference}`,
      //     guestBody: `Your reservation has been confirmed. Your reservation reference is: ${reference}`,
      //   };
      
      //   emailjs
      //     .send('service_c7ffowf', 'template_dj8755j', templateParams, 'uZ5aohdM6dChZzrW3')
      //     .then(function (response) {
      //       console.log('SUCCESS!', response.status, response.text);
      //     })
      //     .catch(function (error) {
      //       console.log('FAILED...', error);
      //     });
      // }else if(selectedTable.tableType ==='Ten'){
        
      //     const recipients = formData.additionalRecipients || [];
      //     recipients.push(userData.email);
      
      //     const additionalParams = {
      //       subject: 'Ghabsa Dinner Reservation Confirmation',
      //       toMail: recipients,
      //       userBody: `A table of type 10 has been reserved. The reservation reference is: ${reference}`,
      //     };
      
      //     emailjs
      //       .send('service_c7ffowf', 'template_dj8755j', additionalParams, 'uZ5aohdM6dChZzrW3')
      //       .then(function (response) {
      //         console.log('SUCCESS!', response.status, response.text);
      //       })
      //       .catch(function (error) {
      //         console.log('FAILED...', error);
      //       });
       
      // }
 
      await increaseSeatsTaken(selectedTable.tableName);
      const reservationData = {
        tableName: selectedTable.tableName,
        priceToBePaid: selectedTable.price + (userData.hasPaidDues ? 0 : 20),
        username: userData.firstname + ' ' + userData.lastname,
        contact: userData.phone,
        email: userData.email,
        reservationReference: reference,
        additionalGuests: formData.additionalGuests,
      };
  
      const response = await axios.post(
        '/api/bookings/reservation',
        reservationData
      );
      const reservationId = response.data.reservationId;
      alert(`Reservation submitted successfully. Reservation ID: ${reservationId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setShowModal(false);
      setSelectedTable(null);
    }
  };
  
  
 
  const image_url = "/Dinner/";
  const dinner_banner='/'

  return (
    <>
 
    <div className="dinner-wrapper">
   
      <div className='dinner-banner'>
      <img src={dinner_banner+timerImage.imagePath} alt="timer-img" />
        <div className='count-down'><CountDown />  <h2 className="dinner-msg"><span>NOTTE STELLATA</span> - Book Your Table and Create Lasting Memories!</h2></div>

      </div>
      {tables.map((table) => (
  <div className="table-dinner-container" key={table._id}>
    <div className="table-img">
      <img src={image_url + table.image} alt={table.tableName} />
    </div>
    <div className="table-info">
      <div className="table-name-wrapper">{table.tableName}</div>
      <div className="table-type">
        <span className="type-name">Type: </span>
        {table.tableType}
      </div>
      <div className="seats-left">
        {table.seatsTaken >= table.maxLimit ? (
          <span className='color-tomato'>Seat Status: <span className='color-black'>Full</span></span>
        ) : (
          <span className='color-tomato'>Seat Status: <span className='color-black'>{table.seatsTaken}/{table.maxLimit}</span></span>
        )}
      </div>
      <div className="table-description">{table.description}</div>
      <div className="glass-icon" onClick={() => handleGlassCheersClick(table.tableName)}>
        <FontAwesomeIcon icon={faGlassCheers} />
        <div className="people-list">
          <ul>
            {table.reservations && table.reservations.map((reservation) => (
              <li key={reservation._id}>{reservation.name}</li>
            ))}
          </ul>
        </div>
      </div>
      {table.seatsTaken < table.maxLimit && (
        <button
          onClick={() => handleTableClick(table)}
          className="reserve-btn"
        >
          <span>Reserve</span>
        </button>
      )}
      {table.seatsTaken >= table.maxLimit && (
        <div className="reserve-btn full">
          <span>Full</span>
        </div>
      )}
    </div>
  </div>
))}
 {showGuestListModal && selectedTable && (
        <div className="guest-list-modal">
          <div className="guest-list-modal-content">
            <span className="guest-list-modal-close" onClick={() => setShowGuestListModal(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <h3 className='tb-code'>Members at Table {selectedTable}</h3>
            {loadingGuestList ? ( // Display loading indicator while fetching the guest list
              <p>Fetching data...</p>
            ) : reservationList.length === 0 ? (
              <p>No one has reserved this table. We eagerly await you, be the first to reserve &#127863;</p>
            ) : (
              <div>
                <p>List of members at this table:</p>
                <ul>
                  {reservationList.map((reservation) => (
                    <li key={reservation.reservationNumber}>
                      {reservation.names.map((name, index) => (
                        <li key={index}>
                          {index + 1}. {name}
                        </li>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}





      {showModal && selectedTable && (
        <TableReservationModal
          tableName={selectedTable.tableName}
          table={selectedTable}
          userData={userData}
          onSubmit={handleReservationSubmit}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
    </>
  );
};



const TableReservationModal = ({ tableName, table, userData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    numGuests: '',
    additionalGuests: Array(table.tableType === 'Ten' ? 9 : 1).fill({}),
  });
  

  const [reservationReference, setReservationReference] = useState('');
  const [reservationReferenceGenerated, setReservationReferenceGenerated] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdditionalGuestChange = (e, index, field) => {
    const updatedGuests = [...formData.additionalGuests];
    updatedGuests[index] = {
      ...updatedGuests[index],
      [field]: e.target.value,
    };
    setFormData({ ...formData, additionalGuests: updatedGuests });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check if any form inputs are empty
    if (Object.values(formData).some(value => value === '')) {
      // Display an error message or handle the empty form inputs as desired
      alert('Please fill in all the form inputs');
      return;
    }
  
    // All form inputs are filled, proceed with form submission
    onSubmit(formData, tableName);
  };
  

  

  const handleProceedClick = () => {
    // Generate a random alphanumeric reference
    const reference = generateReference(6);
    setReservationReference(reference);

    // Calculate the total price with an additional fee if dues are unpaid
    const totalPrice = table.price + (userData.hasPaidDues ? 0 : 10);
    // Add the totalPrice and reservation reference to the form data or perform any other necessary action
    setFormData({ ...formData, totalPrice, reference });

    // Proceed with reservation or perform any other necessary action
    // You can call the onSubmit function here to submit the reservation

    // Set the reservationReferenceGenerated state
    setReservationReferenceGenerated(true);
  };

  const generateReference = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let reference = '';
    for (let i = 0; i < length; i++) {
      reference += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return reference;
  };

  const renderAdditionalGuestInputs = () => {
    if (table.tableType === 'Ten') {
      const additionalGuestInputs = [];
      for (let i = 0; i < 9; i++) {
        additionalGuestInputs.push(
          <div key={i}>
            <h4>Additional Guest {i + 1}</h4>
            <div>
              <label htmlFor={`guestName${i}`}>Name:</label>
              <input
                type="text"
                id={`guestName${i}`}
                name={`guestName${i}`}
                value={formData.additionalGuests[i]?.guestName || ''}
                onChange={(e) => handleAdditionalGuestChange(e, i, 'guestName')}
              />
            </div>
            <div>
              <label htmlFor={`contact${i}`}>Contact:</label>
              <input
                type="text"
                id={`contact${i}`}
                name={`contact${i}`}
                value={formData.additionalGuests[i]?.contact || ''}
                onChange={(e) => handleAdditionalGuestChange(e, i, 'contact')}
              />
            </div>
            <div>
              <label htmlFor={`email${i}`}>Email:</label>
              <input
                type="text"
                id={`email${i}`}
                name={`email${i}`}
                value={formData.additionalGuests[i]?.email || ''}
                onChange={(e) => handleAdditionalGuestChange(e, i, 'email')}
              />
            </div>
          </div>
        );
      }
      return additionalGuestInputs;
    } else if (table.tableType === 'Couple') {
      return (
        <div>
          <h4>Additional Guest</h4>
          <div>
          <label htmlFor="guestName">Name:</label>
            <input
              type="text"
              id="guestName"
              name="guestName"
              value={formData.additionalGuests[0]?.guestName || ''}
              onChange={(e) => handleAdditionalGuestChange(e, 0, 'guestName')}
            />
          </div>
          <div>
            <label htmlFor="contact">Contact:</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.additionalGuests[0]?.contact || ''}
              onChange={(e) => handleAdditionalGuestChange(e, 0, 'contact')}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.additionalGuests[0]?.email || ''}
              onChange={(e) => handleAdditionalGuestChange(e, 0, 'email')}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="modal">
      <div className="close-button-times" onClick={onCancel}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
      <div className="modal-content">
        <h2>Table Reservation</h2>
        
        <div>
          <h3>Table Name - {tableName}</h3>
        </div>
        <div>
          <label htmlFor="price">Table Price:</label>
          <p>{table.price + (userData.hasPaidDues ? 0 : 10)} GHC</p>
        </div>
        {reservationReference && (
          <div>
            <p>
              You will receive an email containing the reservation details and amount to pay. Click on save reservation to complete the process. 
              Please note, you only have 24 hrs to make payment or forfeit this reservation.
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {table.tableType === 'Single' ? (
            <div>
              <button type="button" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedClick}
                disabled={reservationReferenceGenerated}
              >
                Proceed to Make Reservation
              </button>
            </div>
          ) : (
            <div>
              {table.tableType === 'Ten' && <div>{renderAdditionalGuestInputs()}</div>}
              {table.tableType === 'Couple' && <div>{renderAdditionalGuestInputs()}</div>}
              <div>
                
                <button
                  type="button"
                  onClick={handleProceedClick}
                  disabled={reservationReferenceGenerated}
                >
                  Proceed to Make Reservation
                </button>
              </div>
            </div>
          )}
          {reservationReferenceGenerated && (
          <div>
            <button type="submit">Save Reservation</button>
          </div>
        )}
        </form>
        
      </div>
    </div>
    
  );
};

export default Reservation;