import './PublishBlogPost.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
const PublishBlogPost=()=>{
    return(
        <div className='write'>
            <img src='/Images/img-2.jpg' alt='' className='writeImg'></img>
            <form className='writeForm'>
                <div className='writeFormGroup'>
                    <label htmlFor='fileinput'></label>
                    <FontAwesomeIcon className='writeicon'icon={faAdd}></FontAwesomeIcon>
                    <input type='file' id='fileInput' style={{display:'none'}}></input>
                    <input type='text' placeholder='Title..' className='writeInput' autoFocus={true}></input>
                </div>
                <div className='writeFormGroup'>
                    <textarea placeholder='Share your experience with us..'type='text' className='writeInput writeText'></textarea>
                    <button className='writeSubmit'>Publish</button>
                </div>
            </form>

        </div>
    )
  
}
export default PublishBlogPost;