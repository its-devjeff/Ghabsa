import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="image-slider">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index + 1}`}
          className={index === currentSlide ? 'active' : ''}
        />
      ))}
    </div>
  );
};

export default ImageSlider;
