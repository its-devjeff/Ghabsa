import {
  BrowserRouter,
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import Home from './pages/home/Home';
import BlogPage from './pages/_shells/BlogPage';
import LibraryPage from './pages/_shells/LibraryPage';
import SettingsPage from './pages/_shells/SettingsPage';
import InternshipPageShell from './pages/_shells/InternshipPageShell';
import AlumniPage from './pages/_shells/AlumniPage';
import useReveal from './useReveal';
import Library from "./pages/Library/Library";
import Blog from "./pages/Blog/Blog";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import CoursesForRegistration from "./pages/CoursesForRegistration/CoursesForRegistration";
import InternshipPage from "./pages/InternshipPage/InternshipPage";
import SinglePosts from "./pages/SinglePosts/SinglePosts";
import Settings from "./pages/Settings/Settings";
import TrendyUpdate from "./pages/TrendyUpdate/TrendyUpdate";
import AcademicCalendarUpdate from "./pages/AcademicCalendarUpdate/AcademicCalendarUpdate";
import AlumniRegistrationForm from "./pages/AlumniRegistrationForm/AlumniRegistrationForm";
import EventUpdate from "./pages/EventUpdate/EventUpdate";
import BlogPost from "./pages/BlogPost/BlogPost";
import Staff from "./pages/StaffPage/StaffPage";
import Administrator from "./pages/Administrator/Administrator";
import ManageBlog from "./pages/ManageBlog/ManageBlog"
import ManageRequest from "./pages/ManageRequest/ManageRequest";
import AdvertisementForm from "./pages/ManageAdvert/ManageAdvert";
import UpdateAdvert from "./pages/UpdateAdvert/UpdateAdvert";
import AddTable from "./Components/AddTable/AddTable";
import SideAdmin from "./Components/SideAdmin/SideAdmin";
import Loader from "./Components/LandingPageLoader/Loader";
import Result from "./pages/Results/Result";
import NotFound from "./pages/NotFound/NotFound";
import PrivacyPolicy from "./Components/PrivacyPolicy/PrivacyPolicy";
import AboutUs from "./pages/AboutUs/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";
import Faqs from "./pages/Faqs/Faqs";
import AcaEventDetails from "./Components/AcaEventDetails/AcaEventDetails";
import EveEvent from "./Components/EveEvent/EveEvent";
import Prepcon from "./Components/prepcon/prepcon";
import Congress from "./Components/congress/congress";
import Sport from "./Components/sport/sport";
import Navbar from "./Components/Navbar/Navbar";
import NotHome from "./Components/notHome/notHome";
import AddCompany from "./Components/AddCompany/AddCompany";
function App() {
  // Scroll-reveal is wired once here rather than per page, so every route
  // animates rather than only the landing page.
  useReveal();

  return (
    
  <BrowserRouter>

  <Routes>
  <Route exact path='/starry'element={<NotHome/>}/>
  <Route exact path='/Blog'element={<BlogPage/>}/>
  <Route path='/'element={<Home/>}/>
    <Route exact path='/Homepage'element={<Navbar/>}/>
      <Route exact path='/Library'element={<LibraryPage/>}/>
      <Route exact path='/Login'element={<Login/>}/>
      
      <Route exact path='/Signup'element={<Signup/>}/>
      <Route exact path='/executives'element={<Staff/>}/>
      <Route exact path="/AboutUs" element={<AboutUs/>} />
      <Route exact path="/results" element={<Result/>} />
      <Route exact path='/CoursesForRegistration'element={<CoursesForRegistration/>}/>
      <Route exact path='/InternshipPage'element={<InternshipPageShell/>}/>
      <Route exact path='/posts/:id'element={<SinglePosts/>}/>
      <Route exact path='/listAnEvent/:eventId' element={<AcaEventDetails/>}/>
      <Route exact path='/listEvent/:eventId' element={<EveEvent/>}/>
      <Route exact path='/Settings'element={<SettingsPage/>}/>
      <Route exact path='/prepcon'element={<Prepcon/>}/>
      <Route exact path='/annual-congress'element={<Congress/>}/>
      <Route exact path='/Contact-us'element={<ContactUs/>}/>
      <Route exact path='/sport-games'element={<Sport/>}/>
      <Route exact path='/admin/TrendyUpdate'element={<TrendyUpdate/>}/>
      <Route exact path='/Admin/AcademicCalendarUpdate'element={<AcademicCalendarUpdate/>}/>
      <Route exact path='/AlumniRegistrationForm'element={<AlumniPage/>}/>
      <Route exact path='/admin/EventUpdate'element={<EventUpdate/>}/>
      <Route exact path='/admin/ResourceUpload'element={<Administrator/>}/>
      <Route exact path='/admin/BlogPost'element={<BlogPost/>}/>
      <Route exact path='/admin/ManageBlog'element={<ManageBlog/>}/>
      <Route exact path='/admin/ManageRequest'element={<ManageRequest/>}/>
      <Route exact path='/admin/ManageAdvert'element={<AdvertisementForm/>}/>
      <Route exact path='/admin/UpdateAdvert'element={<UpdateAdvert/>}/>
      <Route exact path='/admin/create-reservation-table'element={<AddTable/>}/>
      <Route path="/admin/Dashboard" element={<SideAdmin />} />
      <Route exact path="/loader" element={<Loader/>}/>
      <Route exact path='/Frequently-asked-questions' element={<Faqs/>}/>
      <Route exact path="/admin/add-company" element={<AddCompany/>}/>
        <Route exact path='/privacy-policy' element={<PrivacyPolicy/>}/>
      <Route path='*' element={<NotFound/>}/>
  </Routes>
 
    
   </BrowserRouter>
   
  );
}

export default App;
