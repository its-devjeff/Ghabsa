import Topbar from '../topbar/Topbar';
import Footer from '../footer/Footer';
import GoTop from '../Gotop/Gotop';
import './PageShell.css';

/* The frame every content page sits in. Before this each page rendered its
   own body with no header and, at best, a footer, so moving between the
   landing page and a content page dropped the navigation entirely.

   `title` and `intro` render the page header. `intro` is optional; pages that
   open straight into their own layout can leave it out. `wide` releases the
   reading-measure cap for pages that lay out in more than one column. */
const PageShell = ({ title, intro, wide = false, children }) => (
  <>
    <Topbar />

    <main className='PageShell'>
      {title && (
        <header className='PageShell-head' data-reveal>
          <h1 className='PageShell-title'>{title}</h1>
          {intro && <p className='PageShell-intro'>{intro}</p>}
        </header>
      )}

      <div className={`PageShell-body${wide ? ' PageShell-body--wide' : ''}`}>{children}</div>
    </main>

    <GoTop />
    <Footer />
  </>
);

export default PageShell;
