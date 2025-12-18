import { useState } from 'react';
import { Button, Card, Col, Form, Row, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  loginSuccess,
  selectRegisteredUsers,
} from '../redux/authSlice.js';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setAuthError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const users = selectRegisteredUsers();
    const found = users.find(
      (u) => u.email === form.email && u.password === form.password
    );
    if (!found) {
      setAuthError('Invalid email or password');
      return;
    }
    dispatch(loginSuccess({ email: found.email, name: found.name }));
    navigate('/dashboard');
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={6} lg={5}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 text-center">
              Login
            </Card.Title>
            {authError && <Alert variant="danger">{authError}</Alert>}
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="loginEmail">
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
              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="Enter your password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-grid mb-3">
                <Button type="submit" variant="primary">
                  Login
                </Button>
              </div>
            </Form>
            <div className="text-center">
              <span>Don&apos;t have an account? </span>
              <Link to="/register">Register</Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;


