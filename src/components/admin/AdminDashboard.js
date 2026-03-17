import React, { useState, useEffect } from 'react';
import { students, predictions } from '../../services/mockData'; // replace with real data later
import { FaUsers, FaGraduationCap, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgGPA: 0,
    atRisk: 0,
    lowRisk: 0,
  });

  useEffect(() => {
    // Calculate statistics from mock data
    const total = students.length;
    const avg = students.reduce((sum, s) => sum + s.gpa, 0) / total;
    const risk = students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length;
    const low = students.filter(s => s.riskLevel === 'low').length;

    setStats({
      totalStudents: total,
      avgGPA: avg.toFixed(2),
      atRisk: risk,
      lowRisk: low,
    });
  }, []);

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! You have full access to all data.</p>

      <div className="stats-grid">
        <div className="stat-card blue">
          <h3>Total Students</h3>
          <p className="stat-value">{stats.totalStudents}</p>
        </div>
        <div className="stat-card green">
          <h3>Average GPA</h3>
          <p className="stat-value">{stats.avgGPA}</p>
        </div>
        <div className="stat-card red">
          <h3>At Risk</h3>
          <p className="stat-value">{stats.atRisk}</p>
        </div>
        <div className="stat-card purple">
          <h3>Low Risk</h3>
          <p className="stat-value">{stats.lowRisk}</p>
        </div>
      </div>

      <div className="recent-predictions">
        <h2>All Recent Predictions</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Predicted GPA</th>
              <th>Risk Level</th>
              <th>Confidence</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map(pred => (
              <tr key={pred.id}>
                <td>{pred.studentName}</td>
                <td>{pred.predictedGPA}</td>
                <td>
                  <span className={`badge ${pred.riskLevel}`}>
                    {pred.riskLevel}
                  </span>
                </td>
                <td>{(pred.confidence * 100).toFixed(0)}%</td>
                <td>{pred.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="quick-insights">
        <h2>System Overview</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Total Users</h4>
            <p>15 (8 students, 7 admins)</p>
          </div>
          <div className="insight-card">
            <h4>Pending Actions</h4>
            <p>3 students need intervention</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;