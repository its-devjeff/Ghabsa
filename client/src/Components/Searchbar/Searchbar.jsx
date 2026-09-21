import './Searchbar.css'
import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

const Searchbar=({placeholder,data})=>{
    const [filteredData,setFilteredData]=useState([]);
    const handleFilter=(event)=>{
        const searchparams=event.target.value
        
        const newFilter= data.filter((value)=>{
            return value.course_title.toLowerCase().includes(searchparams.toLowerCase())
        })
        if(searchparams ===''){
            setFilteredData([])
        }else{
            setFilteredData(newFilter)

        }
    

    }
    return(
        <>
       <div className='CustomSearchbar-container'>
         <div className='Searchbar-wrapper'>
        
                <div className=' Custom-search-box'>
                        <input className='searchbar'type='search' placeholder={placeholder} onChange={handleFilter}></input>
                        <span className='search-submit-btn'><FontAwesomeIcon className='searchbar-row search-submit' icon={faSearch}></FontAwesomeIcon></span>

                </div>
                      <div className="select">
                        <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
                            <select
                                onChange={(e) => {
                                    
                                }}
                                className="custom-select"
                                aria-label="Filter Countries By Region"
                            >
                                <option value="All">All</option>
                                <option value="Books">Books</option>
                                <option value="Articles">Articles</option>
                                <option value="Past Qurestions">Past Questions</option>
                                <option value="Course">Course</option>
                                <option value="Course Instructor">Course Instructor</option>
                            </select>
                           <span className="focus"></span>
                       </div>
          
            </div>
          
       </div>
       
       {filteredData.length !== 0 &&(
       <div className='ListResult'>
               {filteredData.slice(0,7).map((value,key)=>{
                return(
                    <a className="dataitem" href='' target='_blank'>
                        <p>{value.course_title}</p>
                    </a>
                )
                
               })}
        </div>
)}
     </>
    )
}
export default Searchbar;