import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchContainer = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    // Redirect to the results page with the search query
    window.location.href = `/results?query=${encodeURIComponent(searchQuery)}`;
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="Search-wrapper">
      <div className="row">
        <h3>Search for a course</h3>
        <form className="Search-box" onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            placeholder="Find Courses, Books, Past Questions..."
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button type="submit" className="search-submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchContainer;
