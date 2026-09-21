import React from 'react';
import './Motto.css';

const Motto = () => {
  const links = [
    { text: 'Prepcon', url: '/prepcon' },
    { text: 'Annual Congress', url: '/annual-congress' },
    { text: 'Sport and Games', url: '/sport-games' }
  ];

  const handleClick = (event, url) => {
    event.preventDefault();
    window.location.href = url;
  };

  return (
    <div className='m-div'>
      <h2>For you</h2>
      <div className='motto-div' data-stagger>
        {links.map((link, index) => (
          <div className='m-card' key={index}>
            <a href={link.url} onClick={(event) => handleClick(event, link.url)}>
              <span >{link.text}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Motto;
