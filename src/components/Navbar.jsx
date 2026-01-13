import { Navbar as BsNavbar, Container, Nav, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuthenticated, selectUserRole, selectCurrentUser } from '../redux/authSlice.js';

const Navbar = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = userRole === 'admin';
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
              {isAdmin ? (
                <>
                  <Nav.Link as={Link} to="/admin/dashboard">
                    Admin Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/students">
                    Manage Students
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/attendance">
                    Mark Attendance
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/user/dashboard">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/user/students">
                    Students
                  </Nav.Link>
                  <Nav.Link as={Link} to="/user/attendance">
                    View Attendance
                  </Nav.Link>
                </>
              )}
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
              <>
                <Nav.Link className="d-flex align-items-center gap-2" disabled>
                  <span className="text-light">{currentUser?.name}</span>
                  <Badge bg={isAdmin ? 'danger' : 'info'} pill>
                    {isAdmin ? 'Admin' : 'User'}
                  </Badge>
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;


