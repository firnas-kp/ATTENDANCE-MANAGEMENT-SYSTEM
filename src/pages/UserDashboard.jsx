import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Row, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  fetchStudents,
  selectStudents,
} from '../redux/studentSlice.js';
import { selectAttendanceState } from '../redux/attendanceSlice.js';
import { selectCurrentUser } from '../redux/authSlice.js';
import './Dashboard.css';

const formatToday = () => {
  const d = new Date();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const formatDateDisplay = () => {
  const d = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

const UserDashboard = () => {
  const dispatch = useDispatch();
  const students = useSelector(selectStudents);
  const attendanceRecords = useSelector(selectAttendanceState);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const today = formatToday();
  const todayAttendance = attendanceRecords[today] || {};

  const totalStudents = students.length;
  const presentToday = Object.values(todayAttendance).filter(
    (s) => s === 'present'
  ).length;
  const absentToday = Object.values(todayAttendance).filter(
    (s) => s === 'absent'
  ).length;
  const attendanceRate =
    totalStudents > 0
      ? Math.round((presentToday / totalStudents) * 100)
      : 0;

  // Get user's own attendance status if they are a student
  const userStudent = students.find((s) => s.email === currentUser?.email);
  const userAttendanceStatus = userStudent ? todayAttendance[userStudent.id] : null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header mb-4">
        <div>
          <h1 className="dashboard-title">Welcome, {currentUser?.name || 'User'}!</h1>
          <p className="dashboard-date mb-0">{formatDateDisplay()}</p>
        </div>
      </div>

      {userStudent && (
        <Alert variant={userAttendanceStatus === 'present' ? 'success' : userAttendanceStatus === 'absent' ? 'danger' : 'warning'} className="mb-4">
          <div className="d-flex align-items-center gap-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <strong>Your Attendance Today: </strong>
            <span className="text-capitalize">
              {userAttendanceStatus || 'Not Marked'}
            </span>
            {userAttendanceStatus && (
              <span className="ms-2">
                ({userAttendanceStatus === 'present' ? '✓' : '✗'})
              </span>
            )}
          </div>
        </Alert>
      )}

      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={4}>
          <Card className="stat-card stat-card-primary h-100">
            <Card.Body>
              <div className="stat-icon-wrapper">
                <svg
                  className="stat-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <Card.Title className="stat-label">Total Students</Card.Title>
              <Card.Text className="stat-value">{totalStudents}</Card.Text>
              <div className="stat-footer">
                <span className="stat-change">Registered students</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Card className="stat-card stat-card-success h-100">
            <Card.Body>
              <div className="stat-icon-wrapper">
                <svg
                  className="stat-icon"
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
              <Card.Title className="stat-label">Present Today</Card.Title>
              <Card.Text className="stat-value">{presentToday}</Card.Text>
              <div className="stat-footer">
                <span className="stat-change positive">
                  {attendanceRate}% attendance rate
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Card className="stat-card stat-card-info h-100">
            <Card.Body>
              <div className="stat-icon-wrapper">
                <svg
                  className="stat-icon"
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
              <Card.Title className="stat-label">Attendance Rate</Card.Title>
              <Card.Text className="stat-value">{attendanceRate}%</Card.Text>
              <div className="stat-footer">
                <span className="stat-change">
                  {presentToday} of {totalStudents} marked
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-3">View Attendance</Card.Title>
              <p className="text-muted mb-4">
                View attendance records for all students. You can see the current attendance status and history.
              </p>
              <div className="d-grid">
                <Link to="/user/attendance" className="btn btn-primary btn-lg">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View Attendance Records
                  </div>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-3">Student Directory</Card.Title>
              <p className="text-muted mb-4">
                Browse the list of registered students. View their profiles and information.
              </p>
              <div className="d-grid">
                <Link to="/user/students" className="btn btn-outline-primary btn-lg">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Student List
                  </div>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {totalStudents === 0 && (
        <Card className="empty-state-card mt-4">
          <Card.Body className="text-center py-5">
            <svg
              className="empty-state-icon mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h5 className="mb-2">No Students Registered Yet</h5>
            <p className="text-muted mb-0">
              Please contact the administrator to add students to the system.
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;

