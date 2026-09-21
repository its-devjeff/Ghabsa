import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Search.css';

const SearchContainer = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    // Redirect to the results page with the search query and search by criteria
    navigate(`/results?query=${encodeURIComponent(searchQuery)}&searchBy=course`);
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="PaperSearch">
      <div className="row" data-reveal>
        <h3>Search for Past Papers</h3>
        <form className="Search-box-i" onSubmit={handleSearch}>
          <input
            className="Search-box-i input"
            type="text"
            placeholder="Enter a course title Eg. Cell Biology"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button type="submit" className="s-submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchContainer;
