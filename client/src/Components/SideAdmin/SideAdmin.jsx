import { faAdd, faArrowTrendUp, faBook, faBookAtlas, faCalendarCheck, faCalendarPlus, faCog, faDashboard, faDatabase, faGears, faHamburger, faHomeAlt, faPallet, faPlugCircleCheck, faSignOut, faTicket, faTimeline, faUserCircle, faUtensilSpoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Home from '../ContainerA/ContainerA'
import Settings from "../../pages/Settings/Settings";
import Reservation from "../Reservation/Reservation";
import InternshipRequestForm from "../InternshipRequestForm/InternshipRequestForm";
import InternshipPage from "../../pages/InternshipPage/InternshipPage";
import { faBlogger, faBloggerB, faWpexplorer } from "@fortawesome/free-brands-svg-icons";
import DashUser from "../DashUser/DashUser";
import FileSearch from "../../pages/Library/Library";
import ManageBlog from "../../pages/ManageBlog/ManageBlog";
import ManageRequest from "../../pages/ManageRequest/ManageRequest";
import UploadForm from "../../pages/AddResource/AddResource";
import ManageReservation from "../manageReservation/manageReservation";
import AdvertisementForm from "../../pages/ManageAdvert/ManageAdvert";
import TrendyUpdate from "../../pages/TrendyUpdate/TrendyUpdate";
import UpdateAdvert from "../../pages/UpdateAdvert/UpdateAdvert";
import AddTable from "../AddTable/AddTable";
import Countdown from "../CountDown/CountDown";
import ReservationTimer from "../ReservationTimer/ReservationTimer";
import ListReservation from "../ListReservation/ListReservation";
import AdminHome from "../AdminHome/AdminHome";
import TicketGenerationForm from "../TicketGeneration/TicketGeneration";
import EventUpdate from "../../pages/EventUpdate/EventUpdate";
import EveEvent from "../EveEvent/EveEvent";
import AcademicCalendarUpdate from "../../pages/AcademicCalendarUpdate/AcademicCalendarUpdate";
import ManageTable from "../ManageTable/ManageTable";

const SideAdmin = () => {
  const [activeItem, setActiveItem] = useState("");
  const [userData, setUserData] = useState(null);
  const [page, setPage] = useState(null);
  const [navCollapse, setNavCollapse] = useState(false);
  const [smallNavCollapse, setSmallNavCollapse] = useState(false);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    setUserData(storedUserData);
    setActiveItem("home");
    setPage(<AdminHome />);
  }, []);

  const handlePageChange = (component, name) => {
    setActiveItem(name);
    setPage(component);
  };

  const page10 = () => {
    if (activeItem !== "home") {
      setActiveItem("home");
      setPage(<AdminHome />);
    }
  };

  const page11 = () => {
    setActiveItem("blog");
    setPage(<ManageBlog />);
  };

  const page12 = () => {
    setActiveItem("internship");
    setPage(<ManageRequest />);
  };

  const page13 = () => {
    setActiveItem("library");
    setPage(<UploadForm />);
  };

  const page14 = () => {
    setActiveItem("reservation");
    setPage(<AddTable />);
  };

  const page15 = () => {
    setActiveItem("advert");
    setPage(<AdvertisementForm />);
  };

  const page16 = () => {
    setActiveItem("trendy");
    setPage(<TrendyUpdate />);
  };

  const page17 = () => {
    setActiveItem("account");
    setPage(<div>Account</div>);
  };

  const page18 = () => {
    setActiveItem("timer");
    setPage(<ReservationTimer />);
  };

  const page19 = () => {
    setActiveItem("tickets");
    setPage(<TicketGenerationForm />);
  };

  const page20 = () => {
    setActiveItem("bookings");
    setPage(<ListReservation />);
  };

  const page21 = () => {
    setActiveItem("settings");
    setPage(<Settings />);
  };
  const page22 = () => {
    setActiveItem("Academic Event");
    setPage(<AcademicCalendarUpdate/>);
  };
  const page23 = () => {
    setActiveItem("Event");
    setPage(<EventUpdate/>);
  };
  const page24 = () => {
    setActiveItem("Ads Update");
    setPage(<UpdateAdvert/>);
  };
  const page25 = () => {
    setActiveItem("Add Table");
    setPage(<ManageTable/>);
  };

  const handleLogout = () => {
    // Clear the session
    localStorage.clear();

    // Redirect the user to the login page
    window.location.href = '/Login'; // Replace with your desired URL
  };
  return (
    <>
      <div className="nav-container">
        <nav className="nav">
          <div className="s2-logo">
            <h3>Administrator Dashboard</h3>
            <FontAwesomeIcon
              className="LargeDevice-icon"
              icon={faHamburger}
              onClick={(e) => setNavCollapse(!navCollapse)}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              className="smallDevice-icon"
              icon={faHamburger}
              onClick={(e) => setSmallNavCollapse(!smallNavCollapse)}
            ></FontAwesomeIcon>
          </div>
        </nav>
        <div className="pg-content">
          <div className="nav-sidebar-content">
            <div
              className={`${
                smallNavCollapse ? " smallNav " : ""
              } nav-sidebar-container ${navCollapse ? " navCollapse" : ""}`}
            >
              <div
                className={`nav-option option1 ${
                  activeItem === "home" ? "active" : ""
                }`}
                onClick={page10}
              >
                <FontAwesomeIcon icon={faHomeAlt}></FontAwesomeIcon>
                <h3>Home</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "blog" ? "active" : ""
                }`}
                onClick={page11}
              >
                <FontAwesomeIcon icon={faBloggerB}></FontAwesomeIcon>
                <h3>Blog</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "internship" ? "active" : ""
                }`}
                onClick={page12}
              >
                <FontAwesomeIcon icon={faWpexplorer}></FontAwesomeIcon>
                <h3>Internship</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "library" ? "active" : ""
                }`}
                onClick={page13}
              >
                <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
                <h3>Library</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "reservation" ? "active" : ""
                }`}
                onClick={page14}
              >
                <FontAwesomeIcon icon={faUtensilSpoon}></FontAwesomeIcon>
                <h3>Reservation</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "reservation" ? "active" : ""
                }`}
                onClick={page25}
              >
                <FontAwesomeIcon icon={faPallet}></FontAwesomeIcon>
                <h3>Edit Table</h3>
              </div>

              <div
                className={`nav-option option1 ${
                  activeItem === "advert" ? "active" : ""
                }`}
                onClick={page15}
              >
                <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
                <h3>Advert</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "trendy" ? "active" : ""
                }`}
                onClick={page16}
              >
                <FontAwesomeIcon icon={faArrowTrendUp}></FontAwesomeIcon>
                <h3>Trendy</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "Academic Event" ? "active" : ""
                }`}
                onClick={page22}
              >
                <FontAwesomeIcon icon={faCalendarCheck}></FontAwesomeIcon>
                <h3>Academic Event</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "Event" ? "active" : ""
                }`}
                onClick={page23}
              >
                <FontAwesomeIcon icon={faCalendarPlus}></FontAwesomeIcon>
                <h3>Event</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "Ads Update" ? "active" : ""
                }`}
                onClick={page24}
              >
                <FontAwesomeIcon icon={faPlugCircleCheck}></FontAwesomeIcon>
                <h3>Update Ads</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "account" ? "active" : ""
                }`}
                onClick={page17}
              >
                <FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon>
                <h3>Account</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "timer" ? "active" : ""
                }`}
                onClick={page18}
              >
                <FontAwesomeIcon icon={faTimeline}></FontAwesomeIcon>
                <h3>Timer</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "tickets" ? "active" : ""
                }`}
                onClick={page19}
              >
                <FontAwesomeIcon icon={faTicket}></FontAwesomeIcon>
                <h3>Tickets</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "bookings" ? "active" : ""
                }`}
                onClick={page20}
              >
                <FontAwesomeIcon icon={faDatabase}></FontAwesomeIcon>
                <h3>Bookings</h3>
              </div>
              <div
                className={`nav-option option1 ${
                  activeItem === "settings" ? "active" : ""
                }`}
                onClick={page21}
              >
                <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
                <h3>Settings</h3>
              </div>
              <div className="nav-option option1">
                <FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon>
                <h3>{userData && userData.username}</h3>
              </div>
              <div className="nav-option option1" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>
                <h3>Log out</h3>
              </div>
            </div>
          </div>
          <div className="page-content">{page}</div>
        </div>
      </div>
    </>
  );
};

export default SideAdmin;
