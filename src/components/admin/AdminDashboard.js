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
  const [selectedMajor, setSelectedMajor] = useState('');
  const uniqueMajors = Object.keys(students[0].subjectScores || {}).sort();

  const computeRisk = (gpa) => {
    if (gpa < 2.2) return 'critical';
    if (gpa < 2.6) return 'high';
    if (gpa < 3.2) return 'medium';
    return 'low';
  };

  useEffect(() => {
    const total = students.length;
    let sumGpa = 0;
    const riskCounts = { high: 0, low: 0, medium: 0, critical: 0 };

    students.forEach(s => {
      const gpa = selectedMajor ? s.subjectScores[selectedMajor].gpa : s.gpa;
      const risk = selectedMajor ? computeRisk(gpa) : s.riskLevel;
      sumGpa += gpa;
      if (riskCounts[risk] !== undefined) riskCounts[risk]++;
    });

    setStats({
      totalStudents: total,
      avgGPA: (sumGpa / total).toFixed(1),
      atRisk: riskCounts.high + riskCounts.critical,
      lowRisk: riskCounts.low,
    });
  }, [selectedMajor]);

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, Admin! You have full access to all data.</p>
        </div>
        <select 
          value={selectedMajor} 
          onChange={(e) => setSelectedMajor(e.target.value)}
          className="filter-select"
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
        >
          <option value="">All Subjects</option>
          {uniqueMajors.map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
      </div>

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