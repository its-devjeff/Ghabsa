import './LoginForm.css';
import React, { useState } from 'react';

const LoginForm = ({ handleLogin, errorMessage }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'studentId') {
      setStudentId(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLogin(studentId, password);
  };

  return (
    
    
    <div>
     {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleFormSubmit}>
        <div className='input-box'>
            <label htmlFor='studentId'>Student Id</label>
            <input type='text' placeholder='Student Id' id='studentId' name='studentId'  value={studentId} onChange={handleInputChange}/>
        </div>
        <div className='input-box'>
        <label htmlFor='password'>Password</label>
        <input type='password' placeholder='Password' id='password' name='password' value={password}
            onChange={handleInputChange}/>
        </div>
        
        <div className='submit-btn'>
            <button className='submit'>Login</button>
        </div>
       <a href='#'>Forgot Password</a>
       <p>
        Don't have an account? <a href='/Signup'>Register here</a>
       </p>
       
    </form>
       
    </div>
    
  );
};

export default LoginForm;
