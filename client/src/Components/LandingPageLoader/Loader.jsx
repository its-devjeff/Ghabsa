import React from 'react';
import './Loader.css'

const Loader = () => (
  <div className="container-loader">
    <svg viewBox="0 0 960 300" className='svg-loader'>
      <symbol id="s-text">
        <text textAnchor="middle" x="50%" y="80%">GHABSA</text>
      </symbol>

      <g className="g-ants">
        <use href="#s-text" className="text-copy"></use>
        <use href="#s-text" className="text-copy"></use>
        <use href="#s-text" className="text-copy"></use>
        <use href="#s-text" className="text-copy"></use>
        <use href="#s-text" className="text-copy"></use>
      </g>
    </svg>
  </div>
);

export default Loader;
