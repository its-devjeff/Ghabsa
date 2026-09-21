import React, { useEffect } from 'react';
import './AnimatedShapes.css';

const AnimatedShapes = () => {
  useEffect(() => {
    const shapeCount = 60;
    const colors = [
      '#45ffdc',
      '#ffef96',
      '#ff94a1',
      '#cda1ff',
      '#31b4ff',
      '#4800c0',
      '#9300c9',
      '#FFA500',
      '#008000',
      '#FF0000',
    ];
    const shapes = [
      '\uf111', // square
      '\uf10c', // circle
      '\uf0d8', // triangle
    ];

    for (let i = 1; i <= shapeCount; i++) {
      const shapeSize = 0.7 + Math.random() * 10;
      const rotation = Math.random() * 360;
      const speed = 4 + Math.random() * 6; // Adjust the speed range as needed
      const colorKey = Math.floor(Math.random() * colors.length);
      const shapeColor = colors[colorKey];
      const shapeKey = Math.floor(Math.random() * shapes.length);
      const shapeType = shapes[shapeKey];
      const text = Math.random() * 10;

      const shapeContainer = document.createElement('div');
      shapeContainer.classList.add('shape-container');
      shapeContainer.classList.add(`shape-container--${i}`);
      shapeContainer.style.animation = `shape-animation-${i} ${speed}s linear infinite`;

      const randomShape = document.createElement('div');
      randomShape.classList.add('random-shape');
      randomShape.style.margin = `${shapeSize}rem`;
      randomShape.style.color = shapeColor;
      randomShape.style.fontSize = `${shapeSize * 0.2}rem`;
      randomShape.innerHTML = shapeType;

      shapeContainer.appendChild(randomShape);
      document.querySelector('.inner-container').appendChild(shapeContainer);

      const keyframes = `@keyframes shape-animation-${i} {
        0% {
          transform: translate3d(${getRandomValue()}, ${getRandomValue()}, 0) rotate(${rotation}deg);
        }
        50% {
          transform: translate3d(${getRandomValue()}, ${getRandomValue()}, 0) rotate(${rotation}deg);
        }
        100% {
          transform: translate3d(${getRandomValue()}, ${getRandomValue()}, 0) rotate(${rotation + 360}deg);
        }
      }`;

      const styleSheet = document.createElement('style');
      styleSheet.innerHTML = keyframes;
      document.head.appendChild(styleSheet);
    }
  }, []);

  const getRandomValue = () => {
    return `${Math.random() * 100 - 50}%`;
  };

  return (
    <div className="container">
      <div className="inner-container">
      <h1>Ghabsa Library</h1>
      <h3>Get access to numerous academic resources that will shapen your life</h3>
      </div>
    </div>
  );
};

export default AnimatedShapes;
