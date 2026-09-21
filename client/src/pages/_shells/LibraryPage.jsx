import PageShell from '../../Components/PageShell/PageShell';
import Library from '../Library/Library';

/* Library is also a dashboard tab; the shell lives here, not in the component. */
const LibraryPage = () => (
  <PageShell
    title='Library'
    intro='Past papers, journals and shared resources.'
    wide
  >
    <Library />
  </PageShell>
);

export default LibraryPage;
