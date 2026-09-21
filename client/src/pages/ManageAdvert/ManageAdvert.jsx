import React, { useState } from 'react';
import axios from 'axios';
import './ManageAdvert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';

function AdvertisementForm() {
  const [advertisement, setAdvertisement] = useState({
    title: '',
    description: '',
    image: null,
    isToggled: true,
    isDisplayed: true
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', advertisement.title);
    formData.append('description', advertisement.description);
    formData.append('image', advertisement.image);
    formData.append('isToggled', advertisement.isToggled);
    formData.append('isDisplayed', advertisement.isDisplayed);
    try {
      const response = await axios.post('/api/advertisement/Newadvert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setFormSubmitted(true);
      setAdvertisement({
        title: '',
        description: '',
        image: null,
        isToggled: true,
        isDisplayed: true
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'file') {
      setAdvertisement({ ...advertisement, image: event.target.files[0] });
    } else if (type === 'checkbox') {
      setAdvertisement({ ...advertisement, [name]: checked });
    } else {
      setAdvertisement({ ...advertisement, [name]: value });
    }
  };

  const handleToggle = () => {
    setAdvertisement({ ...advertisement, isToggled: !advertisement.isToggled });
  };

  const toggleClass = advertisement.isToggled ? 'toggle-right' : 'toggle-left';

  return (
    <form onSubmit={handleSubmit} className='form-body'>
      {formSubmitted && <p>Advertisement created successfully!</p>}

        <h4 className="form-text">Manage Adverts Here</h4>
        <p>Make a powerful impression: Upload your Ad now!</p>
     
      <div className='form-label'>
        <label htmlFor="title" className='description'>Title</label>
        <input type="text" name="title" value={advertisement.title} onChange={handleChange} className='text-area'/>
      </div>
      <div className='form-label'>
        <label htmlFor="description" className='description'>Description</label>
        <textarea name="description" value={advertisement.description} onChange={handleChange} className='text-area'/>
      </div>
      <div className='form-label'>
        <label htmlFor="image" className='description icon'>
 <FontAwesomeIcon icon={faCloudUpload} className='fa-upload'></FontAwesomeIcon>
        
        </label>
        <input type="file" id='image' name="image" onChange={handleChange} style={{display:'none'}} className='area'/>
      </div>
      <div className="toggle-container" onClick={handleToggle}>
        <div className={`toggle-switch ${toggleClass}`}></div>
        <label htmlFor="isToggled" className='toggle'>Toggle</label>
      </div>
      <button type="submit" className='cbtn black submit-btn'>Create Advertisement</button>
    </form>
  );
}

export default AdvertisementForm;
