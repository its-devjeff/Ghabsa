import { Link } from 'react-router-dom';
import Hero from '../Hero/Hero';
import './BG.css'


/* Standing commitments rather than invented statistics — no fabricated
   member counts. Copy is placeholder and should be reviewed by GHABSA. */
const PILLARS = [
  { title: 'Research', body: 'Laboratory work alongside practising scientists.' },
  { title: 'Academics', body: 'Past papers, journals and a shared calendar.' },
  { title: 'Community', body: 'Congress, games and a lasting professional network.' },
];

const BG = () => {

    return (
       <section className='BG-container'>
        <div className='BG-wrapper'>

          <div className='BG-T-container'>
            <span className='gh-label'>Ghana Biochemistry Students' Association</span>

            <h1 className='Sub gh-display'>
              Sustaining <span className='gh-accent-word'>life</span>
            </h1>

            <p className='BG-lead'>
              A community of biochemistry students at the University of Ghana —
              advancing research, academic excellence and professional growth.
            </p>

            <div className='BG-actions'>
              <Link className='gh-btn gh-btn--primary' to='/InternshipPage'>Explore internships</Link>
              <Link className='gh-btn gh-btn--ghost' to='/AboutUs'>About the association</Link>
            </div>

            <ul className='BG-pillars'>
              {PILLARS.map((p) => (
                <li className='BG-pillar' key={p.title}>
                  <h2 className='BG-pillar__title'>{p.title}</h2>
                  <p className='BG-pillar__body'>{p.body}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Rotating photography, framed rather than used as a backdrop, so
              the headline sits on a clean ground and stays legible. */}
          <div className='BG-figure'>
            <div className='BG-figure__frame'>
              <Hero />
            </div>
          </div>

        </div>
       </section>
    )

}

export default BG;
