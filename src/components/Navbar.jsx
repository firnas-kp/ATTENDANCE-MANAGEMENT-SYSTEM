import { Navbar as BsNavbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuthenticated } from '../redux/authSlice.js';

const Navbar = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          Attendance Manager
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-navbar" />
        <BsNavbar.Collapse id="main-navbar">
          {isAuthenticated && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/students">
                Students
              </Nav.Link>
              <Nav.Link as={Link} to="/attendance">
                Attendance
              </Nav.Link>
            </Nav>
          )}
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;


