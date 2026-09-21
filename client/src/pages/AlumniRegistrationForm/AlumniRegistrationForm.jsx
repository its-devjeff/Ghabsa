import './AlumniRegistrationForm.css'

const AlumniRegistrationForm =()=>{
   return(
    <div className='AlumniForm-container'>
        <div className='AlumniForm-wrapper'>
            <div className='Form-Group'>
                <div className='form-head'>
                <img src='/Images/department.png' alt=''></img>
                <h2>Alumni Registration/Update form</h2>
                </div>
                <span className='form-intro-text'>If you are a <b>Graduate or Staff</b> of Biochemistry Cell and Molecular Biology of the <b>University of Ghana,</b>we warmly welcome you as a member of our alumni community. Please complete the form below.</span>
                  
                
                <form>
                    <label htmlFor='firstname'>First name</label>
                    <input type='text' htmlFor='firstname' required></input>
                    <label htmlFor='lastname'>Last name</label>
                    <input type='text' htmlFor='lastname' required></input>
                    <label htmlFor='othername'>Other name(s)</label>
                    <input type='text' htmlFor='othername'></input>
                    <select>
                        <option value=''>Nature of programme of study</option>
                        <option value=''>bsc biochemistry (single)</option>
                        <option value=''>bsc biochemistry (combined major)</option>
                        <option value=''>Msc</option>
                        <option value=''>Mphil</option>
                        <option value=''>phD</option>
                    </select>
                    <label htmlFor='othername'>Please specify your programme of study(combined student only)</label>
                    <input type='text' htmlFor='postudy'></input>
                    <label htmlFor='othername'>year of enrollment and completion</label>
                    <span className='newline'>
                        Please specify the format as shown below;
                        <div className='newline'>
                        <span className='msgSpan'>year of enrollment</span> / <span className='msgSpan'>year of completion</span>
                        </div>
                       
                    </span>
                    <input type='text' htmlFor='yoE' required></input>
                    <img className='Profile'src='/Images/img-12.png' alt=''></img>
                    <label>Please upload a profile picture</label>
                    <input type='file' id='fileInput' style={{display:"none"}}></input>
                    <span>Having your address on record ensures we are sending you event and invitation information that is relevant to wherever you may be in the world.</span>
                    <label htmlFor='othername'>Current country of residence</label>
                    <input type='text' htmlFor='postudy' required></input>
                    <label htmlFor='othername'>Phone number</label>
                    <input type='text' htmlFor='postudy' required></input>
                    <label htmlFor='othername'>Occupation</label>
                    <input type='text' htmlFor='postudy' required></input>
                    <label htmlFor='othername'>Place of work</label>
                    <input type='text' htmlFor='postudy' required></input>
                    <label htmlFor='othername'>Current position at work</label>
                    <input type='text' htmlFor='postudy' required></input>
                    <button className='subbtn'>Submit</button>
                </form>
            </div>
        </div>

    </div>
   )
}

export default AlumniRegistrationForm