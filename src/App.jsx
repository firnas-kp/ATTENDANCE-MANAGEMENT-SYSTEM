import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Students from './pages/Students.jsx';
import EditStudent from './pages/EditStudent.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import Attendance from './pages/Attendance.jsx';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<Students />} />
            <Route path="/admin/students/profile/:id" element={<StudentProfile />} />
            <Route path="/admin/students/edit/:id" element={<EditStudent />} />
            <Route path="/admin/attendance" element={<Attendance />} />
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/students" element={<Students />} />
            <Route path="/user/students/profile/:id" element={<StudentProfile />} />
            <Route path="/user/attendance" element={<Attendance />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
