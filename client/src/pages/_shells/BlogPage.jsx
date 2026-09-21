import PageShell from '../../Components/PageShell/PageShell';
import Blog from '../Blog/Blog';

/* Blog is also rendered inside the dashboard, so the header and footer are
   added here rather than inside the component itself. */
const BlogPage = () => (
  <PageShell
    title='Blog'
    intro='Writing from the association: research notes, guides and what members are working on.'
    wide
  >
    <Blog />
  </PageShell>
);

export default BlogPage;
