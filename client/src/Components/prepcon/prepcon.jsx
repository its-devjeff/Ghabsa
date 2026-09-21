import PageShell from '../PageShell/PageShell';
import './prepcon.css';

/* The five rounds, in order. The previous version of this page listed all
   five as "Round 1", which is why they are numbered from the index here. */
const ROUNDS = [
  'General questions',
  'True or false',
  'Speed race',
  'Problem of the day',
  'Riddles',
];

const CAMPUSES = [
  { name: 'Main campus', halls: 'The traditional halls.' },
  { name: 'North campus', halls: 'Pent, TF, Bani, Evandy and non-residents.' },
  { name: 'South campus', halls: 'Diaspora and Vikings hostels.' },
];

const BENEFITS = [
  {
    title: 'A form of revision',
    body: 'The questions follow the courses covered over the semester, so preparing '
      + 'for the contest means going back through a semester of lecture notes before '
      + 'anyone else has started.',
  },
  {
    title: 'Socialising',
    body: 'The contest puts friendly competition between students who would not '
      + 'otherwise study together. Peers ask questions, share what they know and '
      + 'argue points out constructively.',
  },
  {
    title: 'Educative',
    body: 'Not every question covers familiar ground. Students routinely leave the '
      + 'contest knowing things they had not met in a lecture hall.',
  },
];

const Prepcon = () => (
  <PageShell
    title='Preparatory Contest'
    intro='An annual quiz contest at the Department of Biochemistry, Cell and Molecular Biology, held near the close of the second semester to get students ready for their examinations.'
  >
    <section className='Prose Prose-section' data-reveal>
      <h2>What Prepcon is</h2>
      <p>
        Prepcon runs among Level 200 and Level 300 students towards the end of the
        second semester, before examinations begin. It gives students a reason to
        review their notes well in advance of the papers, and it builds constructive
        academic competition across the campuses.
      </p>
      <p>
        Each level competes separately on its own day. Within a level, students are
        drawn from three campuses, with three students representing each.
      </p>

      <ul className='Prepcon-campuses'>
        {CAMPUSES.map((campus) => (
          <li className='Prepcon-campus' key={campus.name}>
            <span className='Prepcon-campus-name'>{campus.name}</span>
            <span className='Prepcon-campus-halls'>{campus.halls}</span>
          </li>
        ))}
      </ul>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>Who can contest</h2>
      <p>
        Any single major or combined major student is eligible. A campus should not
        field a team made up entirely of combined students, since some questions are
        set on core courses that combined students do not offer, which would put that
        campus at a disadvantage.
      </p>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>The questions</h2>
      <p>
        Questions are drawn from the courses taken during the semester. A quiz master
        reads them out, and three Level 400 students compile the results independently
        and then compare their sheets, so that the final scores are checked rather
        than taken on trust.
      </p>

      <h3>The five rounds</h3>
      <ol className='Prepcon-rounds'>
        {ROUNDS.map((round) => (
          <li key={round}>{round}</li>
        ))}
      </ol>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>Awards</h2>
      <p>
        Every contestant receives a medal and an official certificate. The first,
        second and third placed teams take gold, silver and bronze respectively, and
        the winning campus takes the trophy.
      </p>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>Why take part</h2>
      <div className='Prepcon-benefits' data-stagger>
        {BENEFITS.map((benefit) => (
          <div className='Prepcon-benefit' key={benefit.title}>
            <h3>{benefit.title}</h3>
            <p>{benefit.body}</p>
          </div>
        ))}
      </div>
    </section>

    <p className='Prose-note' data-reveal>
      Who will win this year&rsquo;s Prepcon?
    </p>
  </PageShell>
);

export default Prepcon;
