import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Badge,
} from 'react-bootstrap';
import {
  fetchStudents,
  selectStudents,
} from '../redux/studentSlice.js';
import {
  selectAttendanceState,
  selectAttendanceForDate,
} from '../redux/attendanceSlice.js';
import { selectIsAdmin } from '../redux/authSlice.js';
import { useLocation } from 'react-router-dom';
import './StudentProfile.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getDefaultAvatar = (name) => {
  const initials = getInitials(name);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=200&background=667eea&color=fff&bold=true`;
};

const StudentProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const students = useSelector(selectStudents);
  const attendanceRecords = useSelector(selectAttendanceState);
  const isAdmin = useSelector(selectIsAdmin);
  const isAdminRoute = location.pathname.includes('/admin/');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!students || students.length === 0) {
        await dispatch(fetchStudents());
      }
      setLoading(false);
    };
    load();
  }, [dispatch]);

  const student = students.find((s) => s.id === id); //match cheyyunna student

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!student) {
    return (
      <Alert variant="warning">
        Student not found.{' '}
        <Link to={isAdminRoute ? '/admin/students' : '/user/students'}>Go back to Students</Link>
      </Alert>
    );
  }

  // Calculate attendance statistics
  const attendanceDates = Object.keys(attendanceRecords);
  const studentAttendance = attendanceDates
    .map((date) => ({
      date,
      status: attendanceRecords[date][student.id],
    }))
    .filter((a) => a.status)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const presentCount = studentAttendance.filter(
    (a) => a.status === 'present'
  ).length;
  const absentCount = studentAttendance.filter(
    (a) => a.status === 'absent'
  ).length;
  const totalMarked = presentCount + absentCount;
  const attendanceRate =
    totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

  const recentAttendance = studentAttendance.slice(0, 7);

  const photoUrl =
    student.photo ||
    getDefaultAvatar(student.name);

  const getStudentsPath = () => {
    return isAdminRoute ? '/admin/students' : '/user/students';
  };

  const getEditPath = () => {
    return isAdminRoute ? `/admin/students/edit/${id}` : `/admin/students/edit/${id}`;
  };

  return (
    <div className="student-profile-container">
      <Button
        variant="outline-secondary"
        onClick={() => navigate(getStudentsPath())}
        className="mb-4"
      >
        ← Back to Students
      </Button>

      <Row className="g-4">
        {/* Profile Header Card */}
        <Col xs={12}>
          <Card className="profile-header-card">
            <Card.Body className="profile-header-body">
              <div className="profile-photo-wrapper">
                <img
                  src={photoUrl}
                  alt={student.name}
                  className="profile-photo"
                  onError={(e) => {
                    e.target.src = getDefaultAvatar(student.name);
                  }}
                />
                <div className="profile-status-badge">
                  <span className="status-dot"></span>
                  Active
                </div>
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{student.name}</h1>
                <p className="profile-email">{student.email}</p>
                <div className="profile-badges">
                  <Badge bg="primary" className="profile-badge">
                    Roll: {student.rollNumber}
                  </Badge>
                  <Badge bg="success" className="profile-badge">
                    {attendanceRate}% Attendance
                  </Badge>
                </div>
              </div>
              {isAdmin && (
                <div className="profile-actions">
                  <Button
                    as={Link}
                    to={getEditPath()}
                    variant="primary"
                    className="me-2"
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Statistics Cards */}
        <Col xs={12} md={4}>
          <Card className="stat-card-profile">
            <Card.Body>
              <div className="stat-icon-profile">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="stat-number-profile">{presentCount}</h3>
              <p className="stat-label-profile">Days Present</p>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="stat-card-profile">
            <Card.Body>
              <div className="stat-icon-profile stat-icon-absent">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="stat-number-profile">{absentCount}</h3>
              <p className="stat-label-profile">Days Absent</p>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="stat-card-profile">
            <Card.Body>
              <div className="stat-icon-profile stat-icon-total">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="stat-number-profile">{totalMarked}</h3>
              <p className="stat-label-profile">Total Days Marked</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Attendance */}
        <Col xs={12} lg={8}>
          <Card className="attendance-history-card">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Recent Attendance</h5>
            </Card.Header>
            <Card.Body>
              {recentAttendance.length === 0 ? (
                <p className="text-muted text-center py-3">
                  No attendance records yet.
                </p>
              ) : (
                <div className="attendance-list">
                  {recentAttendance.map((record) => (
                    <div key={record.date} className="attendance-item">
                      <div className="attendance-date">
                        {formatDate(record.date)}
                      </div>
                      <Badge
                        bg={record.status === 'present' ? 'success' : 'danger'}
                        className="attendance-badge"
                      >
                        {record.status === 'present' ? '✓ Present' : '✗ Absent'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Student Details */}
        <Col xs={12} lg={4}>
          <Card className="details-card">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Student Details</h5>
            </Card.Header>
            <Card.Body>
              <div className="detail-item">
                <span className="detail-label">Student ID</span>
                <span className="detail-value">{student.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Roll Number</span>
                <span className="detail-value">{student.rollNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{student.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Attendance Rate</span>
                <span className="detail-value">{attendanceRate}%</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentProfile;

