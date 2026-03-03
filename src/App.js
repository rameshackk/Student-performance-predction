import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import StudentList from './components/students/StudentList';
import PredictionForm from './components/prediction/PredictionForm';
import StudentGroups from './components/groups/StudentGroups';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/predict" element={<PredictionForm />} />
            <Route path="/groups" element={<StudentGroups />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
