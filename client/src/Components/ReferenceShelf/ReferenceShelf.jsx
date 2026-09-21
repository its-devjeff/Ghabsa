import './ReferenceShelf.css';

/* Open textbooks members can legally read and keep.

   Every title here is either openly licensed (Creative Commons) or published
   free to read by the rights holder, and every link goes to the publisher's
   own page rather than to a mirror. Commercial textbooks are deliberately
   absent: the copies of those circulating as free PDFs are unauthorised, and
   linking to them from the association's site would put GHABSA's name on it.

   'access' says what the reader actually gets, because it is not the same
   everywhere: most of these download as a PDF, one is read-online only. */

const BOOKS = [
  {
    id: 'fundamentals-of-biochemistry',
    title: 'Fundamentals of Biochemistry',
    authors: 'Jakubowski and Flatt',
    publisher: 'LibreTexts',
    note: 'Full undergraduate biochemistry course text. The closest open equivalent to the standard recommended textbooks.',
    licence: 'CC BY-NC-SA',
    access: 'Read online or download',
    href: 'https://bio.libretexts.org/Bookshelves/Biochemistry/Fundamentals_of_Biochemistry_(Jakubowski_and_Flatt)',
    tone: 'a',
    plateTitle: 'Fundamentals of Biochemistry',
  },
  {
    id: 'biochemistry-free-for-all',
    title: 'Biochemistry Free For All',
    authors: 'Ahern, Rajagopal and Tan',
    publisher: 'Oregon State University',
    note: 'Written as a first course in biochemistry, with the metabolism chapters set out clearly.',
    licence: 'CC BY-NC',
    access: 'Free PDF download',
    href: 'https://open.oregonstate.education/biochemfreeforall',
    cover: '/Images/books/biochemistry-free-for-all.jpg',
  },
  {
    id: 'molecular-biology-of-the-cell',
    title: 'Molecular Biology of the Cell',
    authors: 'Alberts and others, 4th edition',
    publisher: 'NCBI Bookshelf',
    note: 'The fourth edition released free by the publisher. Later editions are not free.',
    licence: 'Free to read',
    access: 'Read online only',
    href: 'https://www.ncbi.nlm.nih.gov/books/NBK21054/',
    cover: '/Images/books/molecular-biology-of-the-cell.png',
    /* NCBI publish this one only as a 160px thumbnail. Scaling it to fill the
       tile would crop the edition line and blur what is left, so it is shown
       whole at close to its own size instead. */
    coverFit: 'contain',
  },
  {
    id: 'organic-chemistry-biological',
    title: 'Organic Chemistry with a Biological Emphasis',
    authors: 'Soderberg',
    publisher: 'LibreTexts',
    note: 'Organic mechanisms taught through the reactions that actually occur in cells.',
    licence: 'CC BY-NC-SA',
    access: 'Read online or download',
    href: 'https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Book%3A_Organic_Chemistry_with_a_Biological_Emphasis_v2.0_(Soderberg)',
    tone: 'd',
    plateTitle: 'Organic Chemistry with a Biological Emphasis',
  },
  {
    id: 'biology-2e',
    title: 'Biology 2e',
    authors: 'Clark, Douglas and Choi',
    publisher: 'OpenStax',
    note: 'The general biology grounding assumed by most first-year courses.',
    licence: 'CC BY',
    access: 'Free PDF download',
    href: 'https://openstax.org/details/books/biology-2e',
    cover: '/Images/books/biology-2e.svg',
  },
  {
    id: 'chemistry-2e',
    title: 'Chemistry 2e',
    authors: 'Flowers, Theopold and Langley',
    publisher: 'OpenStax',
    note: 'General chemistry, including the thermodynamics and equilibrium needed later.',
    licence: 'CC BY',
    access: 'Free PDF download',
    href: 'https://openstax.org/details/books/chemistry-2e',
    cover: '/Images/books/chemistry-2e.svg',
  },
  {
    id: 'organic-chemistry',
    title: 'Organic Chemistry',
    authors: 'Clark and Douglas',
    publisher: 'OpenStax',
    note: 'A full organic chemistry course, useful alongside the biochemistry texts.',
    licence: 'CC BY',
    access: 'Free PDF download',
    href: 'https://openstax.org/details/books/organic-chemistry',
    cover: '/Images/books/organic-chemistry.svg',
  },
  {
    id: 'microbiology',
    title: 'Microbiology',
    authors: 'Parker, Schneegurt and Thi Tu',
    publisher: 'OpenStax',
    note: 'Microbial structure, genetics and metabolism.',
    licence: 'CC BY',
    access: 'Free PDF download',
    href: 'https://openstax.org/details/books/microbiology',
    cover: '/Images/books/microbiology.svg',
  },
  {
    id: 'anatomy-and-physiology-2e',
    title: 'Anatomy and Physiology 2e',
    authors: 'Betts and others',
    publisher: 'OpenStax',
    note: 'Systems physiology, for the clinical biochemistry courses.',
    licence: 'CC BY',
    access: 'Free PDF download',
    href: 'https://openstax.org/details/books/anatomy-and-physiology-2e',
    cover: '/Images/books/anatomy-and-physiology-2e.svg',
  },
];


const ReferenceShelf = () => (
  <section className='Shelf' data-reveal>
    <div className='Shelf-head'>
      <h2 className='Shelf-title'>Open textbooks</h2>
      <p className='Shelf-intro'>
        Full textbooks the association can point you to legally, free to read
        and free to keep. Each one opens on the publisher&rsquo;s own page.
      </p>
    </div>

    <ul className='Shelf-grid' data-stagger>
      {BOOKS.map((book) => (
        <li className='Shelf-item' key={book.id}>
          <a
            className='Shelf-card'
            href={book.href}
            target='_blank'
            rel='noopener noreferrer'
          >
            <span className={`Shelf-cover${book.coverFit === 'contain' ? ' Shelf-cover--whole' : ''}`}>
              {book.cover ? (
                <img src={book.cover} alt='' loading='lazy' />
              ) : (
                /* These two are wiki-published texts with no cover art in
                   existence, so the plate is the cover, set like one. */
                <span className={`Shelf-plate Shelf-plate--${book.tone}`}>
                  <span className='Shelf-plate-rule' aria-hidden='true' />
                  <span className='Shelf-plate-main'>
                    <span className='Shelf-plate-title'>{book.plateTitle || book.title}</span>
                    <span className='Shelf-plate-authors'>{book.authors}</span>
                  </span>
                  <span className='Shelf-plate-publisher'>{book.publisher}</span>
                </span>
              )}
            </span>

            <span className='Shelf-body'>
              <span className='Shelf-book-title'>{book.title}</span>
              <span className='Shelf-authors'>{book.authors}</span>
              <span className='Shelf-note'>{book.note}</span>
              <span className='Shelf-meta'>
                <span className='Shelf-access'>{book.access}</span>
                <span className='Shelf-licence'>{book.publisher} &middot; {book.licence}</span>
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  </section>
);

export default ReferenceShelf;
