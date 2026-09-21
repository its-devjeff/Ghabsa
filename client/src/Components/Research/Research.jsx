import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Research.css'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

const Research=()=>{
return(
    <div className="Research-wrapper" data-reveal>
    <div className="R-con">
  
        <h2>Xperience the future with us </h2>
        <div className="R-info">
           <span className='R-list'><FontAwesomeIcon className='faCheckCircle'  icon={faCheckCircle}></FontAwesomeIcon>Research oriented and offer the best research experience.</span>
        </div>
        <div className="R-info">
           <span className='R-list'><FontAwesomeIcon className='faCheckCircle' icon={faCheckCircle}></FontAwesomeIcon>Collaborate with exceptional Research fellows.</span>
        </div>
        <div className="R-info">
           <span className='R-list'><FontAwesomeIcon className='faCheckCircle'  icon={faCheckCircle}></FontAwesomeIcon>Training the next generation of young scientist.</span>
        </div>

  
    </div>
    <div className="flex-container-img">
      <img src='/IMG-9656.jpg' alt='research-img'></img>
    </div>
    </div>
)
}

export default Research