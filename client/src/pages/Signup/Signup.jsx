import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Signup.css';

const SignupForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    studentId: '',
    password: '',
    confirmpassword: '',
    dob: '',
    level: '',
    programme: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'level') {
      setFormData((prevData) => ({
        ...prevData,
        level: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 3) {
      if (formData.level === 'Select') {
        // Set the validation error and prevent advancing to the next step
        setValidationErrors(['Please select a valid level']);
        return;
      }
    }
   
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform form validation
    const errors = validateForm(formData, currentStep);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear validation errors if there are none
    setValidationErrors([]);

    try {
      // Send form data to the server
      const response = await axios.post('/api/user/register', formData);

      // Handle the response from the server
      console.log(response.data); // Success message or other response data

      // Reset the form data if needed
      setFormData({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        studentId: '',
        password: '',
        confirmpassword: '',
        dob: '',
        level: '',
        programme: '',
      });

      // Perform any other actions

      // Set success state to true to show the success message
      setSuccess(true);

      // Redirect to the desired URL after a delay of 2 seconds
      setTimeout(() => {
        window.location.href ='/Login'; // Replace with your desired URL
      }, 2000);
    } catch (error) {
      // Handle error response from the server
      console.error(error);

      if (error.response && error.response.data) {
        const { error: serverError, field } = error.response.data;
        if (serverError && field) {
          setServerError(`${serverError}`);
        }
      } else {
        setServerError('An error occurred. Please try again later.');
      }
     
    }
  };

  useEffect(() => {
    if (success) {
      // Automatically hide the success message after 3 seconds
      const hideSuccessMessage = setTimeout(() => {
        setSuccess(false);
      }, 3000);

      return () => clearTimeout(hideSuccessMessage);
    }
  }, [success]);

  const validateForm = (formData, step) => {
    const errors = [];

    // Perform form validation based on your requirements
    if (step === 0) {
      if (!formData.username) {
        errors.push('Username is required');
      }
      if (!formData.firstname) {
        errors.push('First Name is required');
      }
            if (!formData.lastname) {
        errors.push('Last Name is required');
      }
      // Add more validation rules for step 1 as needed
    } else if (step === 1) {
      if (!formData.email) {
        errors.push('Email is required');
      }
      if (!formData.phone) {
        errors.push('Phone is required');
      }
      // Add more validation rules for step 2 as needed
    } else if (step === 2) {
      if (!formData.studentId) {
        errors.push('Student ID is required');
      }
      if (!formData.password||formData.password.length < 8) {
        errors.push('Minimum of 8 characters with togglecase,special characters and numbers');
      }
      if (!formData.confirmpassword) {
        errors.push('Confirm Password is required');
      }
      // Add more validation rules for step 3 as needed
    } else if (step === 3) {
      if (!formData.dob) {
        errors.push('Date of Birth is required');
      }
      if (!formData.level) {
        errors.push('Level is required');
      }
      if (!formData.programme) {
        errors.push('Programme of Study is required');
      }
      // Add more validation rules for step 4 as needed
    }

    return errors;
  };

  const formSteps = [
    {
      label: 'Step 1',
      fields: [
        { name: 'username', label: 'Username', type: 'text' },
        { name: 'firstname', label: 'First Name', type: 'text' },
        { name: 'lastname', label: 'Last Name', type: 'text' },
      ],
    },
    {
      label: 'Step 2',
      fields: [
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'phone', label: 'Phone', type: 'text' },
      ],
    },
    {
      label: 'Step 3',
      fields: [
        { name: 'studentId', label: 'Student ID', type: 'text' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'confirmpassword', label: 'Confirm Password', type: 'password' },
      ],
    },
    {
      label: 'Step 4',
      fields: [
        { name: 'dob', label: 'Date of Birth', type: 'date' },
        { name: 'level', label: 'Level', type: 'select', options: ['Select', 'Level 200', 'Level 300', 'Level 400'] },
        { name: 'programme', label: 'Programme of Study', type: 'text' },
      ],
    },
  ];

  const renderFormFields = (step) => {
    return formSteps[step].fields.map((field) => {
      const { name, label, type, options } = field;
      const value = formData[name];

      return (
        <div key={name} className="input-group form-step">
          <label htmlFor={name}>{label}</label>
          {type === 'select' ? (
            <select name={name} value={value} onChange={handleInputChange}>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input type={type} name={name} value={value} onChange={handleInputChange} />
          )}
        </div>
      );
    });
  };


  return (
    <div className="main-container">
      <img className="s-logo" id='logo'src='/Images/ghabsalogo.png' width='' height=''  alt=''></img>
    {!success && (
     <>
     
           <section className='S-right'>
            
        <form className="form" onSubmit={handleSubmit}>
        <h1 className="text-center">CREATE YOUR ACCOUNT</h1>
        {serverError && <div className="error">{serverError}</div>}
        {validationErrors.length > 0 && (
              <div className="error-message">
                {validationErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
        <div className="Progressbar">
          {formSteps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${currentStep === index ? 'progress-step-active' : ''}`}
            />
          ))}
        </div>
         
        <div className="form-step">
          <div className="form-fields">{renderFormFields(currentStep)}</div>

          <div className="btns-group">
            

            {currentStep > 0 && (
              <button type="button" className="btn btn-prev" onClick={handlePreviousStep}>
                Previous
              </button>
            )}

            {currentStep < formSteps.length - 1 ? (
              <button type="button" className="btn btn-next" onClick={handleNextStep}>
                Next
              </button>
            ) : (
              <input type="submit" value="Submit" className="btn" />
            )}
          </div>
        </div>
      </form>
      </section>
     </>
      
    )}
      {success && (
        <>
       
        <section className='S-right'>
        <div className="success-message">
          <div className="success-circle">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="110" height="110">
            <circle class="circle-background" cx="26" cy="26" r="25" />
            <path
              class="checkmark"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 27l7 7 16-16"
            />
          </svg>
          </div>
          <div className="success-text">Success!</div>
        </div>
        </section>
        </>
      )}
   
    </div>
  );
};

export default SignupForm;