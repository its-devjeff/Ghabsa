import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faYoutube,faTwitter,faInstagram, faLinkedinIn} from '@fortawesome/free-brands-svg-icons'

import './Footer.css'


const Footer = ()=>{
    return(
        <div className='Footer-container'>
            <div className='footer-wrapper'>
                <div className='row'>
                    <div className='footer-col'>
                        <h4>Community</h4>
                        <ul>
                            <li className='footer-copy'>© 2026, Ghana Biochemistry Students&rsquo; Association</li>
                            <li><a href='/AboutUs'>About us</a></li>
                            <li><a href='/Contact-us'>Contact us</a></li>
                            <li><a href='/privacy-policy'>Privacy policy</a></li>
                        </ul>
                    </div>
                    <div className='footer-col'>
                        <h4>get help</h4>
                        <ul>
                            <li><a href='/annual-congress'>Annual congress</a></li>
                            <li><a href='/prepcon'>prepcon</a></li>
                            <li><a href='/sport-games'>GHABSA Games</a></li>
                            <li><a href='/Frequently-asked-questions'>FAQ's</a></li>
                            
                        </ul>
                    </div>
                    <div className='footer-col'>
                        <h4>Shortcuts</h4>
                        <ul>
                            <li><a href='#'>Write an article</a></li>
                            {/*<li><a href='#'>Alumni</a></li>*/}
                           
                        </ul>
                    </div>
                    <div className='footer-col'>
                        <h4>follow us</h4>
                        <div className='social-links'>
                            <a href='https://youtube.com/@GHABSAUG-li4bd' target='_blank' rel='noopener noreferrer'><FontAwesomeIcon icon={faYoutube}></FontAwesomeIcon></a>
                            <a href='https://twitter.com/GHABSA_UG?s=09' target='_blank' rel='noopener noreferrer'><FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon></a>
                            <a href='https://instagram.com/ghabsa_ug?igshid=NTc4MTIwNjQ2YQ==' target='_blank' rel='noopener noreferrer'><FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon></a>
                            <a href='https://www.linkedin.com/company/ghana-biochemistry-students-association-ghabsa-ug/' target='_blank' rel='noopener noreferrer'><FontAwesomeIcon icon={faLinkedinIn}></FontAwesomeIcon></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Footer;