import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Alert,
} from 'react-bootstrap';
import {
  fetchStudents,
  selectStudents,
  updateStudent,
} from '../redux/studentSlice.js';
import { selectIsAdmin } from '../redux/authSlice.js';
import { useLocation } from 'react-router-dom';

const EditStudent = () => {
  const { id } = useParams(); //url ninnu dynamic value edullaan(id)
  const studentId = id; // json server db.jsonl ID string aanengil string aayi thanne use cheyyunnu
  const dispatch = useDispatch(); //redux action ayakkunnu
  const navigate = useNavigate(); //page navigate cheyyan
  const location = useLocation();
  const students = useSelector(selectStudents);// redux storil ninn stdnt array edukkunnu
  const isAdmin = useSelector(selectIsAdmin);

  const [form, setForm] = useState({
    name: '',
    email: '',
    rollNumber: '',
    photo: '',
  }); //form values edit cheyyaan
  const [errors, setErrors] = useState({}); //field validation errors
  const [loading, setLoading] = useState(true); //spinner show cheyyaan
  const [submitError, setSubmitError] = useState(''); //API update fail aakumpool error show 

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!students || students.length === 0) {
        await dispatch(fetchStudents()); //async thunk finish wait cheyyunnu
      }
      setLoading(false);
    };
    load();
  }, [dispatch]);
// existing student formleekk load cheyyal
  useEffect(() => {
    const existing = students.find((s) => s.id === studentId);
    if (existing) {
      setForm({
        name: existing.name,
        email: existing.email,
        rollNumber: existing.rollNumber,
        photo: existing.photo || '',
      });
    }
  }, [students, studentId]);

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
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(
        updateStudent({
          id: studentId,
          data: form,
        })
      ).unwrap();
      const redirectPath = location.pathname.includes('/admin/') ? '/admin/students' : '/user/students';
      navigate(redirectPath);
    } catch {
      setSubmitError('Failed to update student. Please try again.');
    }
  };

  const existing = students.find((s) => s.id === studentId);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!existing) {
    return <Alert variant="warning">Student not found.</Alert>;
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">Edit Student</Card.Title>
            {submitError && <Alert variant="danger">{submitError}</Alert>}
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="editStudentName">
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
              <Form.Group className="mb-3" controlId="editStudentEmail">
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
              <Form.Group className="mb-3" controlId="editStudentRoll">
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
              <Form.Group className="mb-3" controlId="editStudentPhoto">
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
              <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    const redirectPath = location.pathname.includes('/admin/') ? '/admin/students' : '/user/students';
                    navigate(redirectPath);
                  }}
                  className="w-100 w-sm-auto"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="w-100 w-sm-auto">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EditStudent;


