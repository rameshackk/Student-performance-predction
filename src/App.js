import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import StudentList from './components/students/StudentList';
import AddStudent from './components/students/AddStudent';
import PredictionForm from './components/prediction/PredictionForm';
import StudentGroups from './components/groups/StudentGroups';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import MCQTest from './components/assignments/MCQTest';
import { useAuth } from './context/AuthContext';
import './App.css';

const AppContent = () => {
  const { currentUser } = useAuth();

  return (
    <div className={currentUser ? "app" : ""}>
      {currentUser && <Navigation />}
      <main className={currentUser ? "main-content" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute allowedRoles={['admin', 'student']}><StudentList /></PrivateRoute>} />
          <Route path="/add-student" element={<PrivateRoute allowedRoles={['admin']}><AddStudent /></PrivateRoute>} />
          <Route path="/predict" element={<PrivateRoute><PredictionForm /></PrivateRoute>} />
          <Route path="/groups" element={<PrivateRoute allowedRoles={['admin', 'student']}><StudentGroups /></PrivateRoute>} />
          <Route path="/mcq-tests" element={<PrivateRoute allowedRoles={['admin', 'student']}><MCQTest /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
