import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Advertisement.css';
import Footer from '../footer/Footer';
import instance from '../../axios';

const Advertisements = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const res = await axios.get('/api/advertisement/listAdverts');
        console.log(res.data, "hey");
        setAdvertisements(res.data);
      } catch (error) {
        console.error('Error fetching advertisements:', error);
      }
    };
  
    fetchAdvertisements();
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % advertisements.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [advertisements.length]);

  const handleToggle = async (id) => {
    await axios.patch(`/api/advertisement/advert/${id}/toggle`);
    setAdvertisements(
      advertisements.map((advertisement) =>
        advertisement._id === id ? { ...advertisement, isToggled: !advertisement.isToggled } : advertisement
      )
    );
  };

  const handleDisplay = async (id) => {
    await axios.patch(`/api/advertisement/advert/${id}/display`);
    setAdvertisements(
      advertisements.map((advertisement) =>
        advertisement._id === id ? { ...advertisement, isDisplayed: !advertisement.isDisplayed } : advertisement
      )
    );
  };

  const image_root = `${instance.defaults.baseURL}/adverts/`;
  

  if (advertisements.length === 0) {
    return null; // or you can render a loading state if desired
  }

  return (
    <div className="carousel-container">
      <ul className="image-list">
        {advertisements
          .filter((advertisement) => advertisement.isToggled && advertisement.isDisplayed)
          .map((advertisement, index) => (
            <div key={advertisement._id} style={{ display: index === currentIndex ? 'block' : 'none' }}>
              <h4>Advertisement</h4>
              <li className="image-item">
                <img className="advert-img" src={image_root+advertisement.imageUrl} alt={advertisement.title} />
                <div className="image-caption">
                  <h3>{advertisement.title}</h3>
                  <p>{advertisement.description}</p>
                </div>
              </li>
            </div>
          ))}
      </ul>
    </div>
  );
};

export default Advertisements;
