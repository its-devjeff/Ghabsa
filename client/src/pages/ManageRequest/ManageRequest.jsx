import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LetterTemplate from '../../Components/LetterTemplate/LetterTemplate';
import { useReactToPrint } from 'react-to-print';
import Modal from 'react-modal';

import './ManageRequest.css';

const ManageRequest = () => {
  const [requests, setRequests] = useState([]);
  const componentRef = useRef();
  const [currentFullName, setCurrentFullName] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/internshipRequest/listRequest');
      setRequests(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/internshipRequest/deleteRequest/${id}`);
      fetchRequests(); // Refresh the list after deleting
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: currentFullName || 'Letter',
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    let dayWithSuffix;
    if (day === 1 || day === 21 || day === 31) {
      dayWithSuffix = `${day}st`;
    } else if (day === 2 || day === 22) {
      dayWithSuffix = `${day}nd`;
    } else if (day === 3 || day === 23) {
      dayWithSuffix = `${day}rd`;
    } else {
      dayWithSuffix = `${day}th`;
    }

    return `${dayWithSuffix} ${month}, ${year}`;
  };

  const handleFullNameChange = (event) => {
    setCurrentFullName(event.target.value);
  };

  return (
    <div className='new-padding-q'>
      <h1>Internship Request Forms</h1>

      {requests.length > 0 ? (
        requests.map((request) => (
          <div key={request._id}>
            <div ref={componentRef}>
              <LetterTemplate formData={request} formatDate={formatDate} />
            </div>
            <div>
              <button className='btn black' onClick={() => handleDelete(request._id)}>
                Delete
              </button>
              <button className='btn blue' onClick={handlePrint}>
                Print
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className='no-intern-data'>No internship request forms to be displayed.</p>
      )}

      {/* Modal */}
      <Modal
        isOpen={false} // Set the initial state as false
        onRequestClose={() => {}} // Add the close modal function
        contentLabel='Modal'
        className='modal'
        overlayClassName='overlay'
      >
        {/* Modal content goes here */}
      </Modal>
    </div>
  );
};

export default ManageRequest;


