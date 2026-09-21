import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileSearch = () => {
  const [query, setQuery] = useState('');
  const [fileType, setFileType] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/search?query=${query}&fileType=${fileType}&page=${currentPage}`);
      setResults(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error searching documents', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  return (
    <div>
      <input type="text" value={query} onChange={handleInputChange} placeholder="Search query" />
      <input type="text" value={fileType} onChange={handleFileTypeChange} placeholder="File type" />
      <button onClick={handleSearch}>Search</button>
      {results.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          {results.map((result) => (
            <div key={result._id}>
              <p>Title: {result.title}</p>
              <p>Level: {result.level}</p>
              <p>Type: {result.type}</p>
              <p>Size: {result.size}</p>
              <p>Date Created: {result.dateCreated}</p>
            </div>
          ))}
          {totalPages > 1 && (
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileSearch;
