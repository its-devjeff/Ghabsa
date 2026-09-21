import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import './Settings.css';
import axios from 'axios';

const Settings = () => {
  const [selectedProfileImage, setSelectedProfileImage] = useState(null); // State for storing the selected image
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedProfileImage(URL.createObjectURL(file)); // Create a temporary URL for the selected image
  };

  useEffect(() => {
    // Fetch user data from the database and populate the fields
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user/profile');

        if (response.status === 200) {
          const { username, email, phone, profilePic } = response.data;

          setUsername(username);
          setEmail(email);
          setPhone(phone);
          setProfilePic(profilePic); // Store the profilePic value in state
          if (profilePic) {
            setSelectedProfileImage(`${base_url}${profilePic}`);
          } else {
            setSelectedProfileImage(`${base_url}default-profile.png`);
          }
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('phone', phone);
      if (selectedProfileImage) {
        formData.append('profileImage', selectedProfileImage);
      }

      const response = await axios.put('/api/user/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        // Handle success
        console.log('User data updated successfully');
      } else {
        // Handle error if updating user data fails
        console.error('Failed to update user data');
      }
    } catch (error) {
      // Handle error if an exception occurs
      console.error(error);
    }
  };

  const base_url = "http://localhost:5001/profile/";

  return (
    <div className='settings'>
      <div className='settings-wrapper'>
        <div className='settingsTitle'>
          <span className='settingsUpdateTitle'>Update your account</span>
        </div>
        <form className='settingsForm' onSubmit={handleUpdate}>
          <label htmlFor=''>Profile Picture</label>
          <div className='settingsprofilePic'>

          {profilePic && <img src={base_url + profilePic} alt='' />}
        

            <label htmlFor='fileInput' className='profilelabel'>
              Click on icon to upload profile picture
              <FontAwesomeIcon icon={faUser} className='settingsProfileIcon' />
            </label>
            <input type='file' id='fileInput' style={{ display: 'none' }} onChange={handleImageChange} />
          </div>
          <label>Username</label>
          <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>Email</label>
          <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Phone</label>
          <input type='text' placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button className='settingsbtn' type='submit'>
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
