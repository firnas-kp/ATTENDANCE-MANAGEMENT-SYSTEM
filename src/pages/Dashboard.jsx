import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Row } from 'react-bootstrap';
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

const Dashboard = () => {
  const dispatch = useDispatch();//redux action trigger cheyyan
  const students = useSelector(selectStudents);// student list array
  const attendanceRecords = useSelector(selectAttendanceState);//full attendance object 

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
  ).length; //present count edukkum
  const absentToday = Object.values(todayAttendance).filter(
    (s) => s === 'absent'
  ).length; //absent count edukkum
  const attendanceRate =
    totalStudents > 0
      ? Math.round((presentToday / totalStudents) * 100) //rate calculate cheyyunnu
      : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header mb-4">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-date">{formatDateDisplay()}</p>
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

      {totalStudents === 0 && (       // students onnum illel empty msg show cheyym
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
            <p className="text-muted mb-0">
              Start by adding students to track their attendance.
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;


