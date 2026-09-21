import React from 'react';
import PageShell from '../../Components/PageShell/PageShell';
import './AboutUs.css';

/* Served from /public, so it is applied as an inline background rather than
   through the stylesheet, which webpack would try to resolve at build time. */
const PANEL = {
  backgroundImage:
    'linear-gradient(rgba(6, 13, 22, 0.72), rgba(6, 13, 22, 0.72)), '
    + "url('/Images/lab/lab1.jpg')",
};

/* Members at work in the department teaching and research labs. Kept in the
   order they read best down the wall rather than the order they were shot. */
const LAB = [
  { src: '/Images/lab/lab4.jpg', alt: 'A member drawing a sample with a micropipette' },
  { src: '/Images/lab/lab5.jpg', alt: 'A member reading slides under a microscope' },
  { src: '/Images/lab/lab6.jpg', alt: 'A member pipetting at the bench' },
  { src: '/Images/lab/lab2.jpg', alt: 'A member working inside a biosafety cabinet' },
  { src: '/Images/lab/lab7.jpg', alt: 'A member filtering a preparation at the fume bench' },
];

const AboutUs = () => (
  <PageShell
    title='About the association'
    intro='The Ghana Biochemistry Students&rsquo; Association at the University of Ghana.'
  >
    <div className='about-container'>

      {/* Photograph with the statement over it. */}
      <section className='about-content-1' style={PANEL} data-reveal>
        <div className='blur'>
          <h2 className='abt-cnt1'>
            We build bridges between
            <span className='abt-clr'> students and the research world.</span>
          </h2>
          <p className='abt-cnt2'>
            To build stronger relations between our students and research fellows,
            we provide intensive training that equips the student with the
            information the research world actually asks for.
          </p>
        </div>
      </section>

      <section className='about-content-2' data-reveal>
        <h2 className='abt-cnt3'>Together we are strong</h2>
        <div className='about-content-flex'>
          <div className='abt-cnt4'>
            <p>
              We believe in the power of unity and collaboration. Our community of
              aspiring biochemists is driven by a shared aim: to do well in the
              world of biochemical exploration. Bringing bright minds together and
              keeping the environment supportive is how each of us gets further
              than we would alone.
            </p>
            <p className='cnt-p'>
              Discover your potential with GHABSA, where passion meets excellence.
              Together, let us unlock the secrets of life&rsquo;s molecules and
              make a lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* The training the paragraph above describes, as it actually looks. */}
      <section className='about-lab' data-reveal>
        <h2 className='abt-cnt3'>Where the work happens</h2>
        <p className='about-lab-intro'>
          Benchwork is the heart of the programme. Members spend their afternoons
          across the teaching and research labs of the Department of Biochemistry,
          Cell and Molecular Biology.
        </p>
        <div className='about-lab-wall' data-stagger>
          {LAB.map((shot) => (
            <figure className='about-lab-shot' key={shot.src}>
              <img src={shot.src} alt={shot.alt} loading='lazy' />
            </figure>
          ))}
        </div>
      </section>

    </div>
  </PageShell>
);

export default AboutUs;
