import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  fetchStudents,
  selectStudents,
} from '../redux/studentSlice.js';
import { selectAttendanceState } from '../redux/attendanceSlice.js';
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

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const students = useSelector(selectStudents);
  const attendanceRecords = useSelector(selectAttendanceState);

  useEffect(() => {
    if (!students || students.length === 0) {
      dispatch(fetchStudents());
    }
  }, [dispatch, students]);

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-date mb-0">{formatDateDisplay()}</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Button as={Link} to="/admin/students" variant="primary" size="lg">
              Manage Students
            </Button>
            <Button as={Link} to="/admin/attendance" variant="success" size="lg">
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
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
                <span className="stat-change">All registered</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
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

        <Col xs={12} md={6} lg={3}>
          <Card className="stat-card stat-card-danger h-100">
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Card.Title className="stat-label">Absent Today</Card.Title>
              <Card.Text className="stat-value">{absentToday}</Card.Text>
              <div className="stat-footer">
                <span className="stat-change">
                  {totalStudents > 0
                    ? Math.round((absentToday / totalStudents) * 100)
                    : 0}
                  % of total
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
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

      {totalStudents === 0 ? (
        <Card className="empty-state-card">
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
            <h5 className="mb-2">No Students Yet</h5>
            <p className="text-muted mb-4">
              Start by adding students to track their attendance.
            </p>
            <Button as={Link} to="/admin/students" variant="primary" size="lg">
              Add First Student
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          <Col xs={12} lg={6}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Quick Actions</span>
                  </div>
                </Card.Title>
                <div className="d-grid gap-2">
                  <Button as={Link} to="/admin/students" variant="primary" size="lg" className="text-start">
                    <div className="d-flex align-items-center gap-3">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <div>
                        <div className="fw-bold">Add New Student</div>
                        <small className="text-muted">Register a new student</small>
                      </div>
                    </div>
                  </Button>
                  <Button as={Link} to="/admin/attendance" variant="success" size="lg" className="text-start">
                    <div className="d-flex align-items-center gap-3">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <div>
                        <div className="fw-bold">Mark Attendance</div>
                        <small className="text-muted">Mark today&apos;s attendance</small>
                      </div>
                    </div>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} lg={6}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="mb-3">Today&apos;s Summary</Card.Title>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <span className="fw-semibold">Total Students:</span>
                    <span className="fs-5 fw-bold text-primary">{totalStudents}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <span className="fw-semibold">Marked Attendance:</span>
                    <span className="fs-5 fw-bold text-success">{presentToday + absentToday}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <span className="fw-semibold">Pending:</span>
                    <span className="fs-5 fw-bold text-warning">
                      {totalStudents - (presentToday + absentToday)}
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AdminDashboard;

