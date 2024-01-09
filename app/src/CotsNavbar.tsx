import {
  Container,
  Navbar
} from 'react-bootstrap';

export default function CotsNavbar() {
  return (
    <Navbar className="bg-primary mb-3" variant="dark">
      <Container>
        <Navbar.Brand className="ml-3" href="/">Check Out the Score!</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
