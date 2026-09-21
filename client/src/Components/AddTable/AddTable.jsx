import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import './AddTable.css'
const AddTable = () => {
  const [formData, setFormData] = useState({
    tableName: '',
    maxLimit: '',
    tableType: '',
    price: '',
    image: null,
    description: ''
  });
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setSelectedImage(URL.createObjectURL(file));
  };
  

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append('tableName', formData.tableName);
      form.append('maxLimit', formData.maxLimit);
      form.append('tableType', formData.tableType);
      form.append('price', formData.price);
      form.append('image', formData.image);
      form.append('description', formData.description);

      const response = await fetch('/api/reservation/createTable', {
        method: 'POST',
        body: form
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Table created successfully');
        setFormData({
          tableName: '',
          maxLimit: '',
          tableType: '',
          price: '',
          image: null,
          description: ''
        });
        setSelectedImage(null); 
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='AD_T'>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
  <label htmlFor="tableName">Table Name:</label>
  <input
    type="text"
    id="tableName"
    name="tableName"
    value={formData.tableName}
    onChange={handleChange}
    required
  />

  <label htmlFor="maxLimit">Max Limit:</label>
  <input
    type="number"
    id="maxLimit"
    name="maxLimit"
    value={formData.maxLimit}
    onChange={handleChange}
    required
  />

  <label htmlFor="tableType">Table Type:</label>
  <select
    id="tableType"
    name="tableType"
    value={formData.tableType}
    onChange={handleChange}
    required
  >
    <option value="">Select a type</option>
    <option value="Single">Single</option>
    <option value="Couple">Couple</option>
    <option value="Ten">Ten</option>
  </select>

  <label htmlFor="price">Price:</label>
  <input
    type="number"
    id="price"
    name="price"
    value={formData.price}
    onChange={handleChange}
    required
  />

{selectedImage && (
  <div>
    <img src={selectedImage} alt="Selected Image" />
  </div>
)}
<label htmlFor='Addimage'>
            <FontAwesomeIcon className='writeicon' icon={faAdd} />
           Attach dinner table Image
          </label>
  <input
    type="file"
    id="Addimage"
    style={{ display: 'none' }}
    name="image"
    onChange={handleImageChange}
    required
  />

  <label htmlFor="description">Description:</label>
  <textarea
    id="description"
    name="description"
    value={formData.description}
    onChange={handleChange}
    required
  ></textarea>

  <button className='cbtn black' type="submit">Create Table</button>

      </form>
    </div>
  );
};

export default AddTable;
