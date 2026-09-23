import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchSkeleton from '../../Components/Skeleton/Skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import PageShell from '../../Components/PageShell/PageShell';
import './Result.css'
const Result = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('query') || '';
  /* The old code searched whichever single field 'searchBy' named, and that
     defaulted to the title, so typing a course name matched nothing even when
     the library held records for it. The endpoint already ORs title against
     course, so the one box now feeds both. */
  const searchBy = params.get('searchBy');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState(searchQuery);
  /* Nothing has been asked for yet, which is a different state from having
     asked and found nothing. Without this the page opened on "No results
     found" before the visitor had typed a thing. */
  const [hasSearched, setHasSearched] = useState(false);
  const [failed, setFailed] = useState(false);
  const resultsPerPage = 6;

  const fetchSearchResults = (term) => {
    const trimmed = (term || '').trim();
    if (!trimmed) return;

    setIsLoading(true);
    setFailed(false);
    setHasSearched(true);
    setCurrentPage(1);

    axios
      .get(`/api/file/search`, {
        params: searchBy
          ? { [searchBy]: trimmed }
          : { title: trimmed, course: trimmed },
      })
      .then((response) => {
        setSearchResults((response.data && response.data.results) || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error searching files:', error);
        setSearchResults([]);
        setFailed(true);
        setIsLoading(false);
      });
  };

  /* Only run on arrival if the address actually carried a search, which is
     how the library search box hands off to this page. */
  useEffect(() => {
    if (searchQuery.trim()) fetchSearchResults(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = (e, result) => {
    e.preventDefault();

    const fileId = result._id;

    axios({
      url: `/api/file/download/${fileId}`,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${result.title}.pdf`);
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  const img_url = '/';

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSearchResults(query);
  };

  return (
    <PageShell
      title='Search the library'
      intro='Past papers, lab reports and handouts shared by members.'
    >
      <div className="Result-wrapper">
        <form className="Search-form" onSubmit={handleSearch}>
          <div className="Search-wrapper">
            <div className="search-custom">
              <label htmlFor="searchQuery"></label>
              <input
                type="text"
                id="searchQuery"
                placeholder="Search for past papers and lab reports..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="cs-search">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </form>

        {hasSearched && !isLoading && !failed && (
          <p className='ic Result-count'>
            {searchResults.length === 1
              ? '1 result found'
              : `${searchResults.length} results found`}
          </p>
        )}

        {isLoading ? (
          <SearchSkeleton type="Result" />
        ) : currentResults.length > 0 ? (
          <div className="result-item ic">
            {currentResults.map((result) => (
              <div className='result-item-container' key={result._id}>
                
                {result.coverPhoto && (
                  <img
                    src={img_url + result.coverPhoto}
                    alt="coverPhoto"
                  />
                )}
                <div className='result-item-flex'>
                <h3>{result.title}</h3>
                <p>Course: {result.course}</p>
                <p>Level: {result.level}</p>
                <button className='btn-none' onClick={(e) => handleDownload(e, result)}>
                 <FontAwesomeIcon className='btn-download' icon={faArrowAltCircleDown}></FontAwesomeIcon>
                </button>
                </div>
              </div>
            ))}

            <div>
              {currentPage > 1 && (
                <button className='nav-btn black' onClick={() => handlePagination(currentPage - 1)}>
                  Previous
                </button>
              )}
              {currentPage < totalPages && (
                <button className='nav-btn black' onClick={() => handlePagination(currentPage + 1)}>
                  Next
                </button>
              )}
            </div>
          </div>
        ) : failed ? (
          <div className='ic Result-state'>
            <p className='Result-state-title'>The search could not be completed</p>
            <p className='Result-state-note'>
              The library service did not respond. Try again in a moment.
            </p>
          </div>
        ) : hasSearched ? (
          <div className='ic Result-state'>
            <p className='Result-state-title'>No results found</p>
            <p className='Result-state-note'>
              Nothing in the library matches that. Try the course name, such as
              cell biology, or a shorter phrase.
            </p>
          </div>
        ) : (
          <div className='ic Result-state'>
            <p className='Result-state-title'>Search the library</p>
            <p className='Result-state-note'>
              Enter a course name or the title of a paper to see what members
              have shared.
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Result;
