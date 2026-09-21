import PageShell from '../../Components/PageShell/PageShell';
import InternshipPage from '../InternshipPage/InternshipPage';

const InternshipPageShell = () => (
  <PageShell
    title='Internships'
    intro='Placements and applications for GHABSA members.'
    wide
  >
    <InternshipPage />
  </PageShell>
);

export default InternshipPageShell;
