import PageShell from '../../Components/PageShell/PageShell';
import AlumniRegistrationForm from '../AlumniRegistrationForm/AlumniRegistrationForm';

const AlumniPage = () => (
  <PageShell
    title='Alumni registration'
    intro='For graduates and staff of Biochemistry, Cell and Molecular Biology at the University of Ghana.'
    wide
  >
    <AlumniRegistrationForm />
  </PageShell>
);

export default AlumniPage;
