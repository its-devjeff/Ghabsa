import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import './InternshipRequestForm.css';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOtherChecked, setOtherChecked] = useState(false);
  const [isDataModalOpen, setDataModalOpen] = useState(false);
  const [isOtherModalOpen, setOtherModalOpen] = useState(false);

  const [selectedData, setSelectedData] = useState([]);
  const [otherFormData, setOtherFormData] = useState({
    fullName: '',
    gender: '',
    level: '',
    companyName: '',
    companyLocation: '',
    commencementDate: '',
    completionDate: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    fullName: '',
    gender: '',
    level: '',
    companyName: '',
    companyLocation: '',
    commencementDate: '',
    completionDate: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/organization/companies?type=${selectedCategory}`);
        if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort((a, b) => a.companyName.localeCompare(b.companyName));
          setSelectedData(sortedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (selectedCategory && selectedCategory !== 'Other') {
      fetchData();
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedItem(null);

    if (category === 'Other') {
      setOtherChecked(true);
      setOtherModalOpen(true);
    } else {
      setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
      setOtherChecked(false);
      setOtherModalOpen(false);
    }

    setDataModalOpen(false);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setDataModalOpen(true);
  };

  const closeModal = () => {
    setDataModalOpen(false);
    setOtherModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name !== 'commencementDate' && name !== 'completionDate') {
      sanitizedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
    }

    setOtherFormData({
      ...otherFormData,
      [name]: sanitizedValue,
    });

    setErrorMessages({
      ...errorMessages,
      [name]: '',
    });
  };

  const submitForm = async () => {
    if (!otherFormData || typeof otherFormData !== 'object') {
      console.error('Form data is invalid.');
      return;
    }
  
    let requestData;
  
    if (selectedCategory === 'Other') {
      requestData = {
        fullName: otherFormData.fullName || '',
        gender: (otherFormData.gender || '').toLowerCase(),
        classYear: otherFormData.level || '',
        companyName: otherFormData.companyName || '',
        Location: otherFormData.companyLocation || '',
        commencementDate: otherFormData.commencementDate || '',
        completionDate: otherFormData.completionDate || '',
      };
    } else if (selectedItem) {
      requestData = {
        fullName: otherFormData.fullName || '',
        gender: (otherFormData.gender || '').toLowerCase(),
        classYear: otherFormData.level || '',
        companyName: selectedItem.companyName || '',
        Location: selectedItem.companyLocation || '',
        commencementDate: otherFormData.commencementDate || '',
        completionDate: otherFormData.completionDate || '',
      };
    }else {
      // Handle the case when selectedItem is not defined
      console.error('No selectedItem defined for the current category.');
      return;
    }
    const newErrorMessages = {
      fullName: '',
      gender: '',
      level: '',
      companyName: '',
      companyLocation: '',
      commencementDate: '',
      completionDate: '',
    };

    if (!requestData.fullName) {
      newErrorMessages.fullName = 'Please enter your full name.';
    }

    if (!requestData.gender) {
      newErrorMessages.gender = 'Please select your gender.';
    }

    if (!requestData.classYear) {
      newErrorMessages.level = 'Please select your level.';
    }

    if (!requestData.companyName) {
      newErrorMessages.companyName = 'Please enter the company name.';
    }

    if (!requestData.Location) {
      newErrorMessages.companyLocation = 'Please enter the company location.';
    }

    if (!requestData.commencementDate) {
      newErrorMessages.commencementDate = 'Please enter the commencement date.';
    }

    if (!requestData.completionDate) {
      newErrorMessages.completionDate = 'Please enter the completion date.';
    }

  // Check for any validation errors
if (Object.values(newErrorMessages).some((message) => message !== '')) {
  setErrorMessages(newErrorMessages);
  return;
}

// Clear previous error messages
setErrorMessages({
  fullName: '',
  gender: '',
  level: '',
  companyName: '',
  companyLocation: '',
  commencementDate: '',
  completionDate: '',
});

const today = new Date();
const commencementDate = new Date(requestData.commencementDate);
const completionDate = new Date(requestData.completionDate);

// Check if the commencement date is not in the past
if (commencementDate < today) {
  newErrorMessages.commencementDate = "Commencement date cannot be today's date or a past date.";
}

// Check if the difference between commencement and completion dates is less than two weeks
const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;
if (completionDate - commencementDate < twoWeeksInMilliseconds) {
  newErrorMessages.completionDate = 'The internship duration must be at least two weeks.';
}

// Update the error messages state
setErrorMessages(newErrorMessages);

// Check for any validation errors again
if (Object.values(newErrorMessages).some((message) => message !== '')) {
  return;
}

// ...

    try {
      const response = await fetch('/api/internshipRequest/requestForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Form submitted successfully:', responseData);
        setOtherModalOpen(false);
        setDataModalOpen(false);
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='intern-div'>
      <div className='intern-main-container'>
        <h1>Intern Buddy</h1>
        <h4>Welcome to Intern Buddy! Are you ready to embark on a journey of exciting internship opportunities?</h4>
        <p>Intern Buddy opens the door to thrilling internship possibilities across diverse industries. Explore and kickstart your career journey with us.</p>

        <div className='intern-div-form-card'>
          <div className={`accordion ${selectedCategory === 'Research' ? 'open' : ''}`}>
            <h2 onClick={() => handleCategoryClick('Research')}>Research</h2>
            {selectedCategory === 'Research' && (
              <ul>
                {selectedData.map((item) => (
                  <li key={item._id} onClick={() => handleItemClick(item)}>
                    <div className='li-flex'>
                      <div className='li-container'>
                        <p className='company-name'>
                          <strong>Institution:</strong> {item.companyName}
                        </p>
                        <div className='li-divider'>
                          <span>
                            <strong>Company Location:</strong> {item.companyLocation}
                          </span>
                          <span>
                            <strong>Intern Limit:</strong> {item.internLimit}
                          </span>
                        </div>
                      </div>
                      <span className=''>
                        <FontAwesomeIcon icon={faPlus} className='plus-xl'></FontAwesomeIcon>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`accordion ${selectedCategory === 'Health' ? 'open' : ''}`}>
            <h2 onClick={() => handleCategoryClick('Health')}>Health</h2>
            {selectedCategory === 'Health' && (
              <ul>
                {selectedData.map((item) => (
                  <li key={item._id} onClick={() => handleItemClick(item)}>
                    <div className='li-flex'>
                      <div className='li-container'>
                        <span className='company-name'>
                          <strong>Institution:</strong> {item.companyName}
                        </span>
                        <div className='li-divider'>
                          <span>
                            <strong> Location:</strong> {item.companyLocation}
                          </span>
                          <span>
                            <strong>Intern Limit:</strong> {item.internLimit}
                          </span>
                        </div>
                        <span className='plus'>
                          <FontAwesomeIcon icon={faPlus} className='plus-xl'></FontAwesomeIcon>
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="other-category">
            <label>
              <input
                type="radio"
                value="Other"
                checked={isOtherChecked}
                onChange={() => handleCategoryClick('Other')}
              />
              Other
            </label>
          </div>
        </div>

        {isDataModalOpen && (
          <div className="modal-o">
            <div className='icon-box'>
              <FontAwesomeIcon icon={faClose} className='close-button' onClick={closeModal}></FontAwesomeIcon>
            </div>
            <div className='form-flow'>
              <span className='center bold margin'>Company Information</span>

              <div className='company-info-div'>
                <p className='modal-company-name'>
                  <strong>Company Name:</strong> {selectedItem.companyName}
                </p>
                <p className='modal-company-location'>
                  <strong>Location:</strong> {selectedItem.companyLocation}
                </p>
              </div>
              <span className='center bold margin'>Personal Information</span>

              <label>
                <span className='label'>Full Name </span>
                <input
                  type="text"
                  name="fullName"
                  placeholder='John Doe'
                  value={otherFormData.fullName}
                  onChange={handleInputChange}
                />
                <span className="error-message">{errorMessages.fullName}</span>
              </label>
              <label>
                <span className='label'> Gender</span>
                <select name="gender" value={otherFormData.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <span className="error-message">{errorMessages.gender}</span>
              </label>
              <label>
                <span className='label'> Level</span>
                <select name="level" value={otherFormData.level} onChange={handleInputChange}>
                  <option value="">Select Level</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                </select>
                <span className="error-message">{errorMessages.level}</span>
              </label>

              <label>
                <span className='label'> Commencement Date</span>
                <input
                  type="date"
                  name="commencementDate"
                  value={otherFormData.commencementDate}
                  onChange={handleInputChange}
                />
                <span className="error-message">{errorMessages.commencementDate}</span>
              </label>
              <label>
                <span className='label'>Completion Date</span>
                <input
                  type="date"
                  name="completionDate"
                  value={otherFormData.completionDate}
                  onChange={handleInputChange}
                />
                <span className="error-message">{errorMessages.completionDate}</span>
              </label>
              <div className='btn'>
                <button type="button" onClick={submitForm}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {isOtherModalOpen && (
          <div className="modal-o">
            <div className='icon-box'>
              <FontAwesomeIcon icon={faClose} className='close-button' onClick={closeModal}></FontAwesomeIcon>
            </div>
            <div className='form-flow'>
              <label>
                <span className='label'>Full Name</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder='John Doe'
                  value={otherFormData.fullName}
                  onChange={handleInputChange}
                />
                <span className="error-message">{errorMessages.fullName}</span>
              </label>
              <label>
                <span className='label'>Gender</span>
                <select name="gender" value={otherFormData.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <span className="error-message">{errorMessages.gender}</span>
                {console.log('Render - errorMessages:', errorMessages)}

              </label>
              <label>
                <span className='label'>Level</span>
                <select name="level" value={otherFormData.level} onChange={handleInputChange}>
                  <option value="">Select Level</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                </select>
                <span className="error-message">{errorMessages.level}</span>
              </label>
              <label>
                <span className='label'>Company Name</span>
                <input
                  type="text"
                  name="companyName"
                  placeholder='Nestle Ghana Limited'
                  value={otherFormData.companyName}
                  onChange={handleInputChange}
                />
                <span className="error-message">{errorMessages.companyName}</span>
              </label>
              <label>
                <span className='label'>Company's Location</span>
                <input
                  type="text"
                  placeholder='Abelemkpe-Accra'
                  name="companyLocation"
                  value={otherFormData.companyLocation}
                  onChange={handleInputChange}
                />
                <span className="error-message">{errorMessages.companyLocation}</span>
              </label>
              <label>
                <span className='label'>Commencement Date</span>
                <input
                  type="date"
                  name="commencementDate"
                  value={otherFormData.commencementDate}
                  onChange={handleInputChange}
                />
                <span className="error-message">{errorMessages.commencementDate}</span>
              </label>
      <label>
      <span className='label'>Completion Date</span>
        <input
          type="date"
          name="completionDate"
          value={otherFormData.completionDate}
          onChange={handleInputChange}
        />
        <span className="error-message"> {errorMessages.completionDate}</span>
      </label>
      <div className='btn'>
          <button type="button" onClick={submitForm}>
            Submit
          </button>
          </div>
          </div>
        </div>
      )}

      
    </div>
    </div>
  );
};

export default App;
