import PageShell from '../PageShell/PageShell';
import './congress.css';

/* The five member universities, in the order GHABSA lists them. */
const UNIVERSITIES = [
  { name: 'University of Ghana', city: 'Accra' },
  { name: 'University of Cape Coast', city: 'Cape Coast' },
  { name: 'Kwame Nkrumah University of Science and Technology', city: 'Kumasi' },
  { name: 'University of Health and Allied Sciences', city: 'Ho' },
  { name: 'University for Development Studies', city: 'Tamale' },
];

const REASONS = [
  {
    title: 'A break in the semester',
    body: 'The congress falls during the semester and gives students a chance to step '
      + 'out, recover their energy and come back to the rest of the term revitalised.',
  },
  {
    title: 'Exposure',
    body: 'Travelling to a different part of the country shows students what life is '
      + 'like there. Most of them see parts of Ghana they would not otherwise visit.',
  },
  {
    title: 'Connections and networks',
    body: 'Students meet peers from the other four universities and start the kind of '
      + 'connections that matter later, long after the trip is over.',
  },
  {
    title: 'Knowledge and ideas',
    body: 'Debates and quiz competitions run through the congress, so students both '
      + 'share what they know and pick up ideas they arrived without.',
  },
  {
    title: 'Fun',
    body: 'Sports and recreational activities run alongside the programme. Competitive '
      + 'fixtures raise the stakes and create a healthy appetite for bragging rights.',
  },
  {
    title: 'Career guidance',
    body: 'Senior figures in the field are invited to counsel the students, which helps '
      + 'answer the question of what comes after the undergraduate degree.',
  },
];

const REQUIREMENTS = [
  'A fee covering transportation, feeding and the other essentials of the trip.',
  'Consent from a parent or guardian for the student to travel.',
  'Consent from the university for its members to take part in that year’s congress.',
  'The personal belongings needed for the trip.',
];

const Congress = () => (
  <PageShell
    title='GHABSA Annual Congress'
    intro='The largest gathering of biochemistry students in Ghana, drawing the five member universities together each year to interact, learn and compete.'
  >
    <section className='Prose Prose-section' data-reveal>
      <h2>What the congress is</h2>
      <p>
        The annual congress brings biochemistry students from five universities into
        one place to interact, be educated and have fun. That happens through career
        talks, debates, quiz competitions and sports fixtures organised across the
        event, among several others.
      </p>
      <p>
        It is hosted at one of the member universities, with the others conveying
        their students to the host campus. The hosting duty rotates every year.
      </p>

      <ul className='Congress-universities'>
        {UNIVERSITIES.map((uni) => (
          <li className='Congress-university' key={uni.name}>
            <span className='Congress-university-name'>{uni.name}</span>
            <span className='Congress-university-city'>{uni.city}</span>
          </li>
        ))}
      </ul>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>Aims and achievements</h2>
      <p>
        The congress takes a holistic approach to inspiring biochemistry students
        across the country to aim higher. The programme is put together to show the
        academic, the commercial and the enjoyable sides of biochemistry, so that
        students treat the sky as a starting point rather than a limit.
      </p>
      <p>
        It also works as a platform for building networks. Students meet peers from
        other universities and start connections they carry forward. Senior figures
        and veterans of the field attend, updating students on what goes on beyond
        the confines of the university and bringing the outside world to bear.
      </p>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>Reasons to take part</h2>
      <div className='Congress-reasons' data-stagger>
        {REASONS.map((reason) => (
          <div className='Congress-reason' key={reason.title}>
            <h3>{reason.title}</h3>
            <p>{reason.body}</p>
          </div>
        ))}
      </div>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>Requirements</h2>
      <p>Taking part means meeting a few conditions first.</p>
      <ul>
        {REQUIREMENTS.map((requirement) => (
          <li key={requirement}>{requirement}</li>
        ))}
      </ul>
      <p>
        Once those are settled, the student is free to enjoy the event in full.
      </p>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>Items on sale</h2>
      <p>
        To help raise funds for the event, congress merchandise is put up for sale.
        T-shirts, stickers, caps, shirts and other materials are available to anyone
        who wants them, and buying one supports the programme directly.
      </p>
    </section>

    <p className='Prose-note' data-reveal>
      GHABSA. Sustaining life.
    </p>
  </PageShell>
);

export default Congress;
