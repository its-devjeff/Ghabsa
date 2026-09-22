import './Library.css';
import './AnimatedShapes.css';
import AnimatedShapes from './AnimatedShapes';
import React, { useState, useEffect } from 'react';
import SearchSkeleton from '../../Components/Skeleton/Skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown, faSearch } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import ReferenceShelf from '../../Components/ReferenceShelf/ReferenceShelf';

const FileSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  /* Asking for nothing is not the same as finding nothing. Without this the
     page opened on "No results found" before anyone had typed. */
  const [hasSearched, setHasSearched] = useState(false);

  const fetchSearchResults = () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    setIsLoading(true);

    // Calculate the starting index and ending index for pagination
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    // Make the API request to search for files based on the search query, search by criteria, and pagination parameters
    // Pass the search query, search by criteria, starting index, and results per page as parameters in the API request
    // Update the searchResults state with the retrieved results

    // Example:
    fetch(
      `/api/file/search?${searchBy}=${searchQuery}&startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error searching files:', error);
        setIsLoading(false);
        // Handle error
      });
  };

  /* Paging is a refetch, but only once a search has actually been made. */
  useEffect(() => {
    if (hasSearched) fetchSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset current page to 1 when performing a new search
    fetchSearchResults(); // Fetch search results on search submit
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages based on the number of search results
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const handleDownload = (e, result) => {
    e.preventDefault();

    // Get the file ID from the result object
    const fileId = result._id;

    // Make the API request to download the file
    axios({
      url: `/api/file/download/${fileId}`,
      method: 'GET',
      responseType: 'blob', // Set the response type to 'blob' to handle binary data
    })
      .then((response) => {
        // Create a URL object from the blob data
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a temporary <a> element to initiate the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${result.title}.pdf`); // Set the desired file name
        document.body.appendChild(link);
        link.click();

        // Cleanup the temporary URL object
        window.URL.revokeObjectURL(url);

        // Remove the temporary <a> element
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
        // Handle error
      });
  };

  const img_url = "/";

  return (
    <div className="Library-container">
      <div className="Library-main">
        <div className="shape-bg">
          {/* <AnimatedShapes/> */}
        </div>
        <form className="Search-form" onSubmit={handleSearch}>
          {/* Form inputs */}
          <div className="Search-wrapper">
            <div className="search-custom">
              <label htmlFor="searchQuery"></label>
              <input
                type="text"
                id="searchQuery"
                placeholder="Search past questions, Lab reports and journals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="cs-search">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="Search-form-filter">
            <label htmlFor="searchBy">Filter:</label>
            <select
              id="searchBy"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="course">Course</option>
            </select>
          </div>
        </form>

        <div className="Result">
          {hasSearched && !isLoading && (
            <p className='Library-count'>
              {searchResults.length === 1 ? '1 result' : `${searchResults.length} results`}
              {' for '}
              <strong>{searchQuery}</strong>
            </p>
          )}
          {isLoading ? (
            <SearchSkeleton key="skeleton-result" type="Result" />
          ) : searchResults.length > 0 ? (
            <div className="result-item">
              {/* Display search results */}
              {searchResults.map((result) => (
                <div key={result._id} className='result-item-container'>
                  
                  {result.coverPhoto && (
                    <img
                      src={img_url + result.coverPhoto}
                      alt="coverPhoto"
                    />
                  )}
                  <div  className='result-item-flex'>
                  <h3>{result.title}</h3>
                  <p  className='result-item-course'>Course: {result.course}</p>
                  <p  className='result-item-level'>Level: {result.level}</p>
                  <button className='btn-none' onClick={(e) => handleDownload(e, result)}>
                   
                    <FontAwesomeIcon className='btn-download' icon={faArrowAltCircleDown}></FontAwesomeIcon>
                  </button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div>
                {currentPage > 1 && (
                  <button onClick={() => handlePagination(currentPage - 1)}>
                    Previous
                  </button>
                )}
                {currentPage < totalPages && (
                  <button onClick={() => handlePagination(currentPage + 1)}>
                    Next
                  </button>
                )}
              </div>
            </div>
          ) : hasSearched ? (
            <div className='Library-state'>
              <p className='Library-state-title'>No results found</p>
              <p className='Library-state-note'>
                Nothing shared by members matches that yet. Try the course name,
                such as cell biology, or a shorter phrase.
              </p>
            </div>
          ) : null}
        </div>

        {/* Shown until a search is made, so the page opens on something
            useful rather than on an empty result panel. */}
        {!hasSearched && <ReferenceShelf />}
      </div>
    </div>
  );
};

export default FileSearch;
