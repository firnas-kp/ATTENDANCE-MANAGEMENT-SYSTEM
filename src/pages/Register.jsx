import { useState } from 'react';
import { Button, Card, Col, Form, Row, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, selectRegisteredUsers } from '../redux/authSlice.js';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const users = selectRegisteredUsers();
    if (users.some((u) => u.email === form.email)) {
      setSubmitError('A user with this email already exists');
      return;
    }

    dispatch(registerUser(form));
    setSubmitSuccess('Registration successful. You can now login.');
    setTimeout(() => navigate('/login'), 800);
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={6} lg={5}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 text-center">
              Register
            </Card.Title>
            {submitError && <Alert variant="danger">{submitError}</Alert>}
            {submitSuccess && (
              <Alert variant="success">{submitSuccess}</Alert>
            )}
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="registerName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  placeholder="Enter your name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="Enter your email"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="Enter a strong password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerRole">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Select your role. Admin has full access to manage students and attendance.
                </Form.Text>
              </Form.Group>
              <div className="d-grid mb-3">
                <Button type="submit" variant="primary">
                  Register
                </Button>
              </div>
            </Form>
            <div className="text-center">
              <span>Already have an account? </span>
              <Link to="/login">Login</Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;


