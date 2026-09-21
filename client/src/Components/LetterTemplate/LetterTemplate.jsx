import './LetterTemplate.css'
const LetterTemplate=({formData})=>{
  if (!formData || !formData.fullName) {
    return null; // Return null if formData or fullName is not available
  }


  function lowercase(text) {
    if (typeof text !== 'string' || text.length === 0) {
      return ''; // Return an empty string for invalid input
    }
  
    const lowercaseText = text.toLowerCase();
    return lowercaseText;
  }
  

  
  const getDayWithSuffix = (day) => {
    let suffix;
    if (day === 1 || day === 21 || day === 31) {
      suffix = 'st';
    } else if (day === 2 || day === 22) {
      suffix = 'nd';
    } else if (day === 3 || day === 23) {
      suffix = 'rd';
    } else {
      suffix = 'th';
    }

    return (
      <>
        {day}
        <sup>{suffix}</sup>
      </>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const dayWithSuffix = getDayWithSuffix(day);

    return (
      <span>
        {month} {dayWithSuffix}, {year}
      </span>
    );
  };

  const genderPronoun = formData.gender === 'male' ? 'him' : 'her';
  const NewgenderPronoun = formData.gender === 'male' ? 'his' : 'her';
  const currentDate = formatDate(new Date());

    return(
        <div className="A4-paper printable-content">
        <div className="A4-header">
        <img className='header-logo' src='../Images/ug-logo.jpg'></img>
        <div className="A4-header-text">
           <h2> UNIVERSITY OF GHANA</h2>
            <span className="header-bold">DEPARTMENT OF BIOCHEMISTRY, CELL AND 
            MOLECULAR BIOLOGY</span>
            SCHOOL OF BIOLOGICAL SCIENCES
        </div>
        
        </div>
        <div className='page-padd'>
        <hr className='header-hr'></hr>
        <div className="A4-middle-belt">
            <div className="Ref-recipient">
                <div className='flow-flex'>
                <span className="Ref-id">Ref. No.:<span className='non-bold'> .....................................................</span></span>
                <div className="Date-issued"> {currentDate}</div>
                </div>
                <span className="free-span">The Regional Head</span>
               <span className='free-span capitalize'>Food And Drugs Authority</span>
               <span className='free-span capitalize'> Cape Coast,Central Region</span> 
               
            </div>
            
        </div>
        <div className="salutation">  Dear Sir/Madam,</div>
        <div className="A4-title">    <b>VACATION ATTACHMENT FOR EMMANUELLA NATASHA AIKINS
                                          </b></div>
        <div className="A4-body">
          <span>
          As part of our training program, we place students at various institutions for vacation training. Over the years, the trainees have testified that the experiences gained from the exposure to research facilities at institutions like yours have improved their confidence and helped in refining their technical and research abilities. They have also found such opportunities challenging and rewarding.

          </span>
          <div className="body-div div-1">
          The time of the year has come again to place our students and <span className='bold capitalize'>EMMANUELLA NATASHA AIKINS</span> a level 200 student has expressed interest in working at the Food and Drugs Authority for {NewgenderPronoun} attachment during the vacation.
          </div>
          <div className="body-div">
          The Department would be grateful if you could kindly allow {genderPronoun} to work at your establishment from {formatDate((formData.commencementDate))}, to {formatDate((formData.completionDate))}.
          </div>
         <div className="body-div">Thank you in advance in anticipation of your continuous support and training of our undergraduate students.</div>
         
         <span className=''>Sincerely</span>
        </div>
        <div className="si134"></div>
        <div className="from-address">
            <img  className='embed-logo'src='../Images/ug-logo.jpg'></img>
        <span>Kwabena 'Koby' Sarpong, Ph.D., NRCC</span>

<span>Lecturer, Department of Biochemistry, Cell and Molecular Biology</span>
<span> Principal Investigator, West African Centre for Cell Biology of Infectious Pathogens</span>
<span>Training and Internship Coordinator</span>
<span>School of Biological Sciences</span>
<span>College of Basic and Applied Sciences</span>
<span> University of Ghana</span>
<span>E: kansarpong@ug.edu.gh</span>
<span>P: 0266723179</span>
        </div>
       <div className='A4-footer'>
       <div className="cbas">COLLEGE OF BASIC AND APPLIED SCIENCES</div>
        <hr className='footer-hr'></hr>
       </div>
       </div>
        </div>
    )

}
export default LetterTemplate;