import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Table,
  Alert,
} from 'react-bootstrap';
import {
  fetchStudents,
  selectStudents,
} from '../redux/studentSlice.js';
import {
  markAttendance,
  selectAttendanceForDate,
} from '../redux/attendanceSlice.js';

const formatToday = () => {
  const d = new Date();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const Attendance = () => {
  const dispatch = useDispatch();//reduxleekk action ayakkunnu
  const students = useSelector(selectStudents);//redux storil ninn stdnt array edukkunnu
  const [selectedDate, setSelectedDate] = useState(formatToday());//current date attendance
  const attendanceForDate = useSelector(
    selectAttendanceForDate(selectedDate)//select date attendence
  );

  useEffect(() => {
    if (!students || students.length === 0) {
      dispatch(fetchStudents());
    }
  }, [dispatch, students]);

  const handleMark = (studentId, status) => {
    dispatch(
      markAttendance({
        date: selectedDate,
        studentId,
        status,
      })
    );
  };

  return (
    <Row>
      <Col xs={12}>
        <Card>
          <Card.Body>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
              <Card.Title className="mb-0">Attendance</Card.Title>
              <Form.Group
                className="mb-0 d-flex align-items-center gap-2"
                controlId="attendanceDate"
              >
                <Form.Label className="mb-0 fw-semibold">
                  Date:
                </Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ maxWidth: 200 }}
                />
              </Form.Group>
            </div>

            {students.length === 0 ? (
              <Alert variant="info">
                No students available. Please add students first.
              </Alert>
            ) : (
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <Table
                  striped
                  bordered
                  hover
                  responsive="sm"
                  className="align-middle mb-0"
                >
                  <thead>
                    <tr>
                      <th style={{ minWidth: '50px' }}>No.</th>
                      <th style={{ minWidth: '120px' }}>Name</th>
                      <th style={{ minWidth: '150px' }}>Email</th>
                      <th style={{ minWidth: '120px' }}>Roll Number</th>
                      <th style={{ minWidth: '100px' }}>Status</th>
                      <th style={{ minWidth: '160px' }}>Mark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => {
                      const status = attendanceForDate[student.id];
                      return (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td className="text-break">{student.name}</td>
                          <td className="text-break">
                            <small>{student.email}</small>
                          </td>
                          <td>{student.rollNumber}</td>
                          <td className="text-capitalize">
                            {status || 'Not Marked'}
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              <Button
                                size="sm"
                                variant={
                                  status === 'present'
                                    ? 'success'
                                    : 'outline-success'
                                }
                                onClick={() =>
                                  handleMark(student.id, 'present')
                                }
                                className="flex-fill flex-sm-grow-0"
                              >
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  status === 'absent'
                                    ? 'danger'
                                    : 'outline-danger'
                                }
                                onClick={() =>
                                  handleMark(student.id, 'absent')
                                }
                                className="flex-fill flex-sm-grow-0"
                              >
                                Absent
                              </Button>
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

export default Attendance;


