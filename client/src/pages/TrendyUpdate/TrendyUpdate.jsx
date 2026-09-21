import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import './TrendyUpdate.css'
const TrendyUpdate = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const handleImageChange = (event) => {
    // Handle image file change
    const file = event.target.files[0];
    setImage(file);
  };

  const handleTextChange = (event) => {
    // Handle text input change
    const value = event.target.value;
    setText(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object to send the image and text as multipart/form-data
    const formData = new FormData();
    formData.append('image', image);
    formData.append('text', text);

    try {
      // Make a POST request to the backend endpoint
      const response = await fetch('/api/trendy/trendyupdate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Update successful
        setMessage('Update successful');
      } else {
        // Handle update failure
        setMessage('Update failed');
      }
    } catch (error) {
      // Handle network or other errors
      setMessage('Error occurred');
      console.error('Error occurred', error);
    }
  };

  return (
    <div className='writeTrend-q'>
      <h2>Update Trendy</h2>
      {image && <img src={URL.createObjectURL(image)} alt='' className='Trendy-img-set' />}
      <form className='TrendyForm' onSubmit={handleSubmit}>
        <div className='writeFormGroup'>
          <label htmlFor='fileInput'>
            <FontAwesomeIcon className='writeicon' icon={faAdd} />
          </label>
          <input
            type='file'
            id='fileInput'
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <input
            type='text'
            placeholder='Enter Trendy Title..'
            className='writeTrendyTitle'
            autoFocus={true}
            onChange={handleTextChange}
          />
        </div>
        <div className='writeFormGroup'>
          <button type='submit' className='writeSubmit'>
            Publish
          </button>
        </div>
        {message && <p className='message'>{message}</p>}
      </form>
    </div>
  );
};

export default TrendyUpdate;
