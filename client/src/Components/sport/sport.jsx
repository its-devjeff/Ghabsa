import PageShell from '../PageShell/PageShell';
import './sport.css';

const INDOOR = [
  'Table tennis',
  'Puzzles',
  'Card games',
  'Video games',
];

const OUTDOOR = [
  'Football',
  'Basketball',
  'Track events for both men and women',
];

const Sport = () => (
  <PageShell
    title='Sport and Games'
    intro='Indoor and outdoor competition run through the year, so that every student finds something worth turning up for.'
  >
    <section className='Prose Prose-section' data-reveal>
      <h2>Indoor games</h2>
      <p>
        Indoor games hold a particular place here. Table tennis, puzzles, card games
        and video games entertain, but they also sharpen problem solving, critical
        thinking and logic. Just as importantly, they give students a reason to sit
        down together, meet people outside their own year and form connections that
        last past the fixture.
      </p>
      <ul className='Sport-list'>
        {INDOOR.map((game) => (
          <li className='Sport-item' key={game}>{game}</li>
        ))}
      </ul>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>Outdoor events</h2>
      <p>
        GHABSA sponsors field events for both men and women. Outdoor sport builds
        physical fitness, and it teaches teamwork, sportsmanship and resilience in a
        way that little else on the timetable does. The association takes the link
        between physical activity and general wellbeing seriously, and encourages
        students to stay active.
      </p>
      <ul className='Sport-list'>
        {OUTDOOR.map((game) => (
          <li className='Sport-item' key={game}>{game}</li>
        ))}
      </ul>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>Room for every preference</h2>
      <p>
        Some students are at their best in a mentally demanding indoor game, others
        want the exhilaration of a field. Offering both is deliberate. Every student
        should be able to find their own niche and enjoy the activity they actually
        want, which is what inclusivity means in practice rather than in principle.
      </p>
    </section>

    <section className='Prose Prose-section' data-reveal>
      <h2>More than entertainment</h2>
      <p>
        These events are catalysts for personal growth. They build creativity,
        critical thinking and physical development alongside the academic work. A
        well rounded education needs both excellence in the lecture hall and real
        opportunities to rest and recover, and the fixtures are where the second half
        of that happens.
      </p>
      <p>
        The aim is a department where fun, learning and personal growth run together:
        students who excel at the games they choose, memories that outlast the
        semester, and a community that feels like one.
      </p>
    </section>
  </PageShell>
);

export default Sport;
