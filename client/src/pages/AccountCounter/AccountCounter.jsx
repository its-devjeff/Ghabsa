import React, { useState, useEffect } from 'react';
import '../AccountCounter/AccountCounter.css'
const AccountDashboard = () => {
  const [accountCount, setAccountCount] = useState(0);

  useEffect(() => {
    // Fetch the account count from the database
    const fetchAccountCount = async () => {
      try {
        const response = await fetch('/api/accounts'); // Replace with your API endpoint
        const data = await response.json();
        setAccountCount(data.count);
      } catch (error) {
        console.error('Error fetching account count:', error);
      }
    };

    fetchAccountCount();
  }, []);

  return (
    <div>
      <h2 className='h-text'>Active Accounts</h2>
      <p className='P-text'>Total Accounts: {accountCount}</p>
    </div>
  );
};

export default AccountDashboard;
