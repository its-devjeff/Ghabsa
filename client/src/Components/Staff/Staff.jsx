import PageShell from '../PageShell/PageShell';
import { EXECUTIVES, photoFor } from '../Executives/Executives';
import './Staff.css';

/* "View all executives" on the landing page lands here. It used to show six
   identical placeholder cards for a "Dr Abiola" with lorem ipsum beside them;
   it now shows the real roster, read from the same list the landing page
   carousel uses so the two can never disagree. */
const Staff = () => (
  <PageShell
    title='The students leading the charge.'
    intro={`The full GHABSA executive for the year, ${EXECUTIVES.length} seats in all.`}
    wide
  >
    <ul className='Staff-grid' data-stagger>
      {EXECUTIVES.map((person) => (
        <li className='Staff-card' key={person.name}>
          <div className='Staff-photo'>
            <img src={photoFor(person.name)} alt={person.name} loading='lazy' />
          </div>
          <div className='Staff-text'>
            <h2 className='Staff-name'>{person.name}</h2>
            <p className='Staff-office'>{person.office}</p>
          </div>
        </li>
      ))}
    </ul>
  </PageShell>
);

export default Staff;
