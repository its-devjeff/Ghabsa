import CourseTable from '../../Components/CourseTable/CourseTable';
import Footer from '../../Components/footer/Footer';
import Searchbar from '../../Components/Searchbar/Searchbar';
import Topbar from '../../Components/topbar/Topbar';
import './CoursesForRegistration.css'
const CoursesForRegistration=()=>{
  return(
    <div>
        <Topbar/>
        <CourseTable/>
        <Footer/>
    </div>
  )
}
export default CoursesForRegistration;