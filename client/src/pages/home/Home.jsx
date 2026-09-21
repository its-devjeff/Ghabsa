import { useState, useEffect } from 'react';
import Topbar from '../../Components/topbar/Topbar';
import SectionA from '../../Components/sectionA/SectionA';
import BG from '../../Components/bg/BG';
import './Home.css';
import SectionB from '../../Components/sectionB/SectionB';
import SectionC from '../../Components/SectionC/SectionC';
import Footer from '../../Components/footer/Footer';
import SearchContainer from '../../Components/search/Search';
import GoTop from '../../Components/Gotop/Gotop';
import Hero from '../../Components/Hero/Hero';
import { useRef } from 'react';
import MsgSlider from '../../Components/SectionD/SectionD';
import Motto from '../../Components/Motto/Motto';
import Advertisement from '../../Components/Advertisement/Advertisement';
import ContainerA from '../../Components/ContainerA/ContainerA';
import CookieConsent from "react-cookie-consent";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';
import Research from '../../Components/Research/Research';
import QuickLinks from '../../Components/QuickLinks/QuickLinks';
import Executives from '../../Components/Executives/Executives';
import Gallery from '../../Components/Gallery/Gallery';

const AnnouncementPopup = ({ message, onClose }) => {
  return (
    <div className="banner">
      <p>{message}</p>
      <button onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

const Home = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Fetch the image source and title from the backend
    fetch('/api/trendy/getTrendy') // Replace with your actual backend URL
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setImageSrc(data[0].imageUrl);
          setTitle(data[0].title);
        }
      })
      .catch((error) => {
        console.error('Error occurred', error);
      });
  }, []);

  const [showPopup, setShowPopup] = useState(true);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 3000); // Hide popup after 30 seconds (30000 milliseconds)

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [showGoTop, setshowGoTop] = useState('goTopHidden');

  const refScrollUp = useRef();

  const handleScrollUp = () => {
    refScrollUp.current.scrollIntoView({ behaviour: 'smooth' });
  };

  const handleVisibleButton = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (scrollPosition > 50) {
      return setshowGoTop('goTop');
    } else if (scrollPosition < 50) {
      return setshowGoTop('goTopHidden');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleVisibleButton);
  }, []);

  return (
    <div className='home-container'>
      <div ref={refScrollUp}></div>
      <Topbar />
      {showPopup && (
        <AnnouncementPopup message="Have you been harassed or violated, it's against our zero harassment policy. File all your complaints here" onClose={handleClosePopup} />
      )}
      <BG />
      <QuickLinks />
      <SectionA imageSrc={imageSrc} title={title} />
      <SearchContainer />
      <SectionB />
     <MsgSlider/>
      <SectionC />
      <Executives />
      <Gallery />
      <ContainerA />
      <Research/>
      <Motto />
      <GoTop showGoTop={showGoTop} scrollUp={handleScrollUp} />
      <Footer />
      <CookieConsent
        debug={false}
        style={{
          backgroundColor: "#fff",
          color: "#2E3c57",
          width: "100%",
          padding: "0.025em",
          display: "flex",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        }}
        buttonStyle={{
          color: "#fff",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          border: "1px solid #fff",
          marginRight: "0.5em",
          padding: "0.5em 1em",
        }}
        buttonText={"Got it"}
      >
        <span className="cookie" style={{ display: "flex", alignItems: "center" }}>
          <img src="/Images/cookie.png" style={{ width: "70px", height: "70px", objectFit: "cover" }} alt="cookie"></img>
          <h2 style={{ paddingLeft: "1em" }}>We'd love it if you can take a bite</h2>
        </span>
        We use cookies to give you the best possible website experience. By using this website, you agree to our
        <button style={{ display: "inline-flex", padding: "0.5em", backgroundColor: "#fff", color: "#000", fontWeight: "500", margin: "1em 0.5em" }}>Privacy Policy</button>
      </CookieConsent>
    </div>
  );
};

export default Home;
