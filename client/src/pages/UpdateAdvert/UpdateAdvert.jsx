import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateAdvert.css'

function UpdateAdvert() {
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    async function fetchAdvertisements() {
      try {
        const response = await axios.get('/api/advertisement/listAdverts');
        setAdvertisements(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchAdvertisements();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/advertisement/deleteadvert/${id}`);
      setAdvertisements(advertisements.filter((advertisement) => advertisement._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
 const img_root = "/api/advertisement/adverts/"
  return (
    
    
    <table className='table-main'>
      <thead>
        <tr>
          <th className='th-text'>Title</th>
          <th className='th-text'>Description</th>
          <th className='th-text'>Image</th>
          <th className='th-text'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {advertisements.map((advertisement) => (
          <tr key={advertisement._id}>
            <td className='td-title'>{advertisement.title}</td>
            <td className='td-description'>{advertisement.description}</td>
            <td className='td-img'> {advertisement.imageUrl && <img src={img_root + advertisement.imageUrl} alt={advertisement.title} />}</td>
            <td className='td-btn'>
              <button className='edit'>Edit</button>
              <button onClick={() => handleDelete(advertisement._id)} className='delete'>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  );
}

export default UpdateAdvert;
