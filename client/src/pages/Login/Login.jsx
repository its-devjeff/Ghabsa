import React, { useState, useEffect, useRef } from 'react';
import LoginForm from '../../Components/LoginForm/LoginForm';
import './Login.css';
import LandingPageLoader from '../../Components/LandingPageLoader/Loader';
import PhageLoader from '../../Components/PhageLoader/PhageLoader';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectAnimation, setRedirectAnimation] = useState(false);
  const activityTimerRef = useRef(null); // Timer reference

  useEffect(() => {
    const token = localStorage.getItem('token');
    const lastActivityTimestamp = localStorage.getItem('lastActivityTimestamp');

    if (token && lastActivityTimestamp) {
      const now = Date.now();
      const expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds

      // Calculate the elapsed time since the last activity
      const elapsedTime = now - Number(lastActivityTimestamp);

      if (elapsedTime < expirationTime) {
        // If the elapsed time is less than the expiration time, start/reset the activity timer
        startOrResetActivityTimer();
        setRedirectAnimation(true);
        setTimeout(() => {
          window.location.href = '/HomePage'; // Replace with your desired URL
        }, 3000); // 3000 milliseconds = 3 seconds
      } else {
        // If the elapsed time is greater than or equal to the expiration time, clear the session
        clearSession();
      }
    }
  }, []);

  const startOrResetActivityTimer = () => {
    clearTimeout(activityTimerRef.current);
    activityTimerRef.current = setTimeout(() => {
      clearSession();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  };

  const clearSession = () => {
    clearTimeout(activityTimerRef.current);
    localStorage.clear();
  };

  const handleLogin = (studentId, password) => {
    setIsLoading(true); // Set isLoading to true before making the API request

    // Make an API request to authenticate the user
    fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ studentId, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false); // Set isLoading to false after receiving the response

        // Check the response from the server
        if (data.success) {
          // Successful login, store authentication token and user data
          const { token, user } = data;

          // Store the user data in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('userData', JSON.stringify(user));

          // Set the last activity timestamp to the current time
          localStorage.setItem('lastActivityTimestamp', Date.now());

          startOrResetActivityTimer();
          setRedirectAnimation(true);
          setTimeout(() => {
            setRedirectAnimation(false); // Stop the loader animation after 3 seconds
            window.location.href = '/HomePage'; // Replace with your desired URL
          }, 3000); // 3000 milliseconds = 3 seconds
        } else {
          // Authentication failed, display specific error message
          setErrorMessage(data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false); // Set isLoading to false in case of an error
        // Handle error
        console.error('Error:', error);
        setErrorMessage('An error occurred. Please try again later.');
      });
  };

  return (
    <div>
      {redirectAnimation ? (
        <div className="loading-animation-container">
          <PhageLoader />
        </div>
      ) : (
        <div className="login-container">
          <section className="l-left-container">
            {!isLoading && (
              <div>
                <img src="/Images/img-login.jpg" height="" alt="" />
              </div>
            )}
          </section>
          <section className="l-right-container">
            {!isLoading && (
              <React.Fragment>
                <img src="/Images/ghabsalogo.png" width="250px" height="150px" alt="" />
                <h2>Welcome back!</h2>
              </React.Fragment>
            )}

            {isLoading ? (
              <div className="loading-animation-container">
                <PhageLoader />
              </div>
            ) : (
              <LoginForm handleLogin={handleLogin} errorMessage={errorMessage} />
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Login;
