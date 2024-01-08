import {
  Container,
  Navbar
} from 'react-bootstrap';

export default function CotsNavbar() {
  return (
    <Navbar className="bg-primary" variant="dark">
      <Container>
        <Navbar.Brand className="ml-3">Check Out the Score!</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
