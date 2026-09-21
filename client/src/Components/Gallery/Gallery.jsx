import './Gallery.css';

/* The supplied photographs not used in the hero, plus a few existing shots
   from /public/Images so the wall reads as a set rather than three stragglers.
   Swap or extend freely — the layout is a masonry-style grid and adapts to
   however many entries are here. */
const PHOTOS = [
  { src: './Images/gallery/gallery-jerseys.jpg', alt: 'Two members in Ghana football jerseys', span: 'tall' },
  { src: './Images/IMG_0145.jpg', alt: 'Members together in the laboratory', span: 'wide' },
  { src: './Images/gallery/gallery-audience.jpg', alt: 'A member at an association event', span: 'tall' },
  { src: './Images/IMG_0200.jpg', alt: 'A student working at the laboratory bench', span: null },
  { src: './Images/gallery/gallery-seated.jpg', alt: 'A member seated at an association gathering', span: null },
  { src: './Images/IMG_0175.jpg', alt: 'Members at a departmental gathering', span: 'wide' },
];

const Gallery = () => (
  <section className='Gallery'>
    <div className='Gallery-head'>
      <span className='Gallery-eyebrow'>Life at GHABSA</span>
      <h2 className='Gallery-title'>Beyond the bench.</h2>
      <p className='Gallery-lead'>
        Field trips, congress, games and the everyday moments in between.
      </p>
    </div>

    <ul className='Gallery-grid' data-stagger>
      {PHOTOS.map((p) => (
        <li
          key={p.src}
          className={`Gallery-item${p.span ? ` Gallery-item--${p.span}` : ''}`}
        >
          <img src={p.src} alt={p.alt} />
        </li>
      ))}
    </ul>
  </section>
);

export default Gallery;
