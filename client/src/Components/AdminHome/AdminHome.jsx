import './AdminHome.css';
import { useEffect, useState } from 'react';
import axios from '../../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar, faUserAstronaut, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { faDashcube, faStackpath } from '@fortawesome/free-brands-svg-icons';
import ListReservation from '../ListReservation/ListReservation';

const AdminHome = () => {
  const [internshipRequestCount, setInternshipRequestCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0); // State to store the total dues paid
  const [dataPercentage, setDataPercentage] = useState(0);
  const [hostingPercentage, setHostingPercentage] = useState(0);
  const [sales, setSales] = useState(0);
  const [miscellaneous, setMiscellaneous] = useState(0);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/bookings/get-reservations');
      const data = await response.json();

      // Filter reservations with hasPaid set to true
      const paidReservations = data.filter((reservation) => reservation.hasPaid);

      // Calculate the total dues paid
      const amtPaid = paidReservations.reduce(
        (total, reservation) => total + reservation.priceToBePaid,
        0
      );

      // Calculate the values
      let dataPercentage = 0;
      let hostingPercentage = 0;

      paidReservations.forEach((reservation) => {
        dataPercentage += 1;
        hostingPercentage += 2;
      });

      const sales = amtPaid;
      const miscellaneous = sales - (dataPercentage + hostingPercentage);

      setReservationCount(paidReservations.length);
      setTotalAmountPaid(amtPaid);
      setDataPercentage(dataPercentage);
      setHostingPercentage(hostingPercentage);
      setSales(sales);
      setMiscellaneous(miscellaneous);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/user/accounts');
      const data = await response.json();
      setUserCount(data.accounts.length);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  useEffect(() => {
    axios
      .get('/api/internshipRequest/listRequest')
      .then((response) => {
        const count = response.data.length;
        setInternshipRequestCount(count);
        fetchReservations();
        fetchUserCount();
      })
      .catch((error) => {
        console.error('Error fetching internship requests', error);
      });
  }, []);

  return (
    <div className="Admin-home-container">
      <div className="Admin-home-wrapper">
        <div className="home-card">
          <div className='box-flow purple'><FontAwesomeIcon className='big' icon={faUserAstronaut}></FontAwesomeIcon></div>
          Number of User Accounts: <span className="tomato">{userCount}</span>
        </div>
        <div className="home-card">
          <div className='box-flow orange'><FontAwesomeIcon className='big' icon={faUserGraduate}></FontAwesomeIcon></div>
          Number of Internship Request: <span className="tomato">{internshipRequestCount}</span>
        </div>
        <div className="home-card">
          <div className='box-flow green-i'><FontAwesomeIcon className='big' icon={faSackDollar}></FontAwesomeIcon></div>
          {/* Number of Tickets Sold: <span className="tomato">{reservationCount}</span> */}
        </div>
        <div className="home-card">
          <div className='box-flow indigo'><FontAwesomeIcon className='big' icon={faDashcube}></FontAwesomeIcon></div>
          Dues paid over the year: <span className="tomato"></span>
        </div>
      </div>
      <div className="dash-flex">
        <div className="home-card flex-3">
          <div className='box-flow teal'><FontAwesomeIcon className='big' icon={faStackpath}></FontAwesomeIcon></div>
          Statistics 
          <div className="dash-block">Sales: GH₵<span className="tomato">{sales}.00</span></div>
          <div className="dash-block">Data Percentage: GH₵ <span className="tomato">{dataPercentage}.00</span></div>
          <div className='dash-block'>Hosting Percentage: GH₵ <span className="tomato">{hostingPercentage}.00</span></div>
          <div className="dash-block">Miscellaneous: GH₵ <span className="tomato">{miscellaneous}.00</span></div>
        </div>
        <div className="latest-transactions">
          <h2>Latest Transactions</h2>
          <ListReservation />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
