import React, { useState } from 'react';
import '../AddResource/AddResource.css'

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [level, setLevel] = useState('');
  const [course, setCourse] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleCoverPhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
    setCoverPhoto(selectedPhoto);
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a FormData object to store the form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('coverPhoto', coverPhoto);
    formData.append('level', level);
    formData.append('course', course);
    formData.append('title', title);
    formData.append('category', category);

    // Send the form data to the backend API endpoint
    fetch('/api/file/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Handle the response from the server
        // Add your own logic here
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error
      });
  };

  return (
    <div className='page'>
      <h1 className='title'>Upload Form</h1>
      <form onSubmit={handleSubmit} className='formContainer' enctype="multipart/form-data" method="POST" >
        <div className='label'>
          <label htmlFor="file">File:</label>
          <input type="file" id="file" onChange={handleFileChange} className='upload' />
        </div>
        <div className='label'>
          <label htmlFor="coverPhoto">Cover Photo:</label>
          <input type="file" id="coverPhoto" onChange={handleCoverPhotoChange} className='upload' />
        </div>
        <div>
          <label htmlFor="level">Level:</label>
          <select id="level" value={level} onChange={handleLevelChange}>
            <option value="">Select Level</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
          </select>
        </div>
        <div className='label'>
          <label htmlFor="course">Course:</label>
          <input type="text" id="course" value={course} onChange={handleCourseChange} className='input-field'/>
        </div>
        <div className='label'>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={handleTitleChange} className='input-field'/>
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select id="category" value={category} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            <option value="Past Questions">Past Questions</option>
            <option value="Reports">Reports</option>
            <option value="Journals">Journals</option>
            </select>
            </div>
            <button type="submit" className='btn-submit'>Submit</button>
            </form>
            </div>
            );
            };

export default UploadForm;
