import React, { useState } from 'react';

const AddCompany = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyLocation: '',
    internLimit: '',
    type: '', // New field for type
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/organization/new-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save company');
      }

      // Optionally, you can handle the success case here
      const newCompany = await response.json();
      console.log('New Company:', newCompany);

      // Reset the form
      setFormData({
        companyName: '',
        companyLocation: '',
        internLimit: '',
        type: '', // Reset type field
      });
    } catch (error) {
      console.error('Error saving company:', error.message);
      // Optionally, you can set an error state to display an error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Company Name:
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Company Location:
        <input
          type="text"
          name="companyLocation"
          value={formData.companyLocation}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Intern Limit:
        <input
          type="number"
          name="internLimit"
          value={formData.internLimit}
          onChange={handleInputChange}
          required
        />
      </label>

      {/* New field for type */}
      <label>
        Type:
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Research">Research</option>
          <option value="Health">Health</option>
        </select>
      </label>

      <button type="submit">Save Company</button>
    </form>
  );
};

export default AddCompany;
