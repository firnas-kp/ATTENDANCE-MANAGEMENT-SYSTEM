import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Table,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getDefaultAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=100&background=667eea&color=fff&bold=true`;
};
import {
  fetchStudents,
  addStudent,
  deleteStudent,
  selectStudents,
  selectStudentsLoading,
  selectStudentsError,
} from '../redux/studentSlice.js';
import { selectIsAdmin } from '../redux/authSlice.js';
import { useLocation } from 'react-router-dom';

const Students = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const students = useSelector(selectStudents);
  const loading = useSelector(selectStudentsLoading);
  const error = useSelector(selectStudentsError);
  const isAdmin = useSelector(selectIsAdmin);
  const isAdminRoute = location.pathname.includes('/admin/');

  const [form, setForm] = useState({ //Add student
    name: '',
    email: '',
    rollNumber: '',
    photo: '',
  });
  const [errors, setErrors] = useState({});//validation eroor
  const [submitError, setSubmitError] = useState('');//submit error

  useEffect(() => {
    dispatch(fetchStudents()); //student list load cheyyan
  }, [dispatch]);

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email format';
    if (!form.rollNumber) newErrors.rollNumber = 'Roll number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); //form value update cheyyan
    setErrors({ ...errors, [e.target.name]: '' });
    setSubmitError('');
  };

  const handleSubmit = async (e) => { //submit handler  
    e.preventDefault(); //default form submit action prevent cheyyan
    if (!validate()) return; //validation fail aakumpoo return cheyyan

    try {
      await dispatch(addStudent(form)).unwrap(); //add student
      setForm({ name: '', email: '', rollNumber: '', photo: '' }); //reset form
    } catch {
      setSubmitError('Failed to add student. Please try again.'); //error handling
    }
  };

  const handleDelete = async (id) => { // delete student
    if (!window.confirm('Are you sure you want to delete this student?')) { // confirmation
      return;
    }
    try {
      await dispatch(deleteStudent(id)).unwrap(); //delete
    } catch {
    }
  };

  const getProfilePath = (id) => {
    return isAdminRoute ? `/admin/students/profile/${id}` : `/user/students/profile/${id}`;
  };

  const getEditPath = (id) => {
    return isAdminRoute ? `/admin/students/edit/${id}` : `/admin/students/edit/${id}`;
  };

  return (
    <Row className="g-4">
      {isAdmin && (
        <Col xs={12} md={12} lg={4} xl={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-3">Add Student</Card.Title>
              {submitError && <Alert variant="danger">{submitError}</Alert>}
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="studentName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="Student name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="studentEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="Student email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="studentRoll">
                  <Form.Label>Roll Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="rollNumber"
                    value={form.rollNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.rollNumber}
                    placeholder="Roll number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rollNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="studentPhoto">
                  <Form.Label>Photo URL (Optional)</Form.Label>
                  <Form.Control
                    type="url"
                    name="photo"
                    value={form.photo}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                  />
                  <Form.Text className="text-muted">
                    Leave empty to use default avatar
                  </Form.Text>
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    Add Student
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      )}
      <Col xs={12} md={12} lg={isAdmin ? 8 : 12} xl={isAdmin ? 8 : 12}>
        <Card className="h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Card.Title className="mb-0">Students</Card.Title>
            </div>
            {loading && (
              <div className="text-center my-3">
                <Spinner animation="border" role="status" />
              </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && students.length === 0 && (
              <Alert variant="info" className="mb-0">
                {isAdmin ? 'No students found. Add a new student.' : 'No students registered yet.'}
              </Alert>
            )}
            {!loading && students.length > 0 && (
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <Table striped bordered hover responsive="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '50px' }}>No.</th>
                      <th style={{ minWidth: '100px' }}>Photo</th>
                      <th style={{ minWidth: '120px' }}>Name</th>
                      <th style={{ minWidth: '150px' }}>Email</th>
                      <th style={{ minWidth: '120px' }}>Roll Number</th>
                      <th style={{ minWidth: isAdmin ? '180px' : '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => {
                      const photoUrl =
                        student.photo || getDefaultAvatar(student.name);
                      return (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td>
                            <Link
                              to={getProfilePath(student.id)}
                              className="text-decoration-none"
                            >
                              <img
                                src={photoUrl}
                                alt={student.name}
                                className="student-thumbnail"
                                onError={(e) => {
                                  e.target.src = getDefaultAvatar(student.name);
                                }}
                              />
                            </Link>
                          </td>
                          <td className="text-break">
                            <Link
                              to={getProfilePath(student.id)}
                              className="text-decoration-none fw-semibold text-dark"
                            >
                              {student.name}
                            </Link>
                          </td>
                          <td className="text-break">
                            <small>{student.email}</small>
                          </td>
                          <td>{student.rollNumber}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              <Button
                                as={Link}
                                to={getProfilePath(student.id)}
                                size="sm"
                                variant="outline-info"
                                className="flex-fill flex-sm-grow-0"
                              >
                                View
                              </Button>
                              {isAdmin && (
                                <>
                                  <Button
                                    as={Link}
                                    to={getEditPath(student.id)}
                                    size="sm"
                                    variant="outline-primary"
                                    className="flex-fill flex-sm-grow-0"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDelete(student.id)}
                                    className="flex-fill flex-sm-grow-0"
                                  >
                                    Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Students;


