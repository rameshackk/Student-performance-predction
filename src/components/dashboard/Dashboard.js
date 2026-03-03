import React, { useState, useEffect } from 'react';
import { students, predictions } from '../../services/mockData';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgGPA: 0,
    atRisk: 0,
    lowRisk: 0,
    mediumRisk: 0,
    criticalRisk: 0
  });

  useEffect(() => {
    const total = students.length;
    const avg = students.reduce((sum, s) => sum + s.gpa, 0) / total;
    const risk = students.filter(s => s.riskLevel === 'high').length;
    const low = students.filter(s => s.riskLevel === 'low').length;
    const medium = students.filter(s => s.riskLevel === 'medium').length;
    const critical = students.filter(s => s.riskLevel === 'critical').length;

    setStats({
      totalStudents: total,
      avgGPA: avg.toFixed(2),
      atRisk: risk,
      lowRisk: low,
      mediumRisk: medium,
      criticalRisk: critical
    });
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
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
          <h3>High Risk</h3>
          <p className="stat-value">{stats.atRisk}</p>
        </div>
        <div className="stat-card purple">
          <h3>Critical</h3>
          <p className="stat-value">{stats.criticalRisk}</p>
        </div>
        <div className="stat-card orange">
          <h3>Medium Risk</h3>
          <p className="stat-value">{stats.mediumRisk}</p>
        </div>
        <div className="stat-card teal">
          <h3>Low Risk</h3>
          <p className="stat-value">{stats.lowRisk}</p>
        </div>
      </div>

      <div className="recent-predictions">
        <h2>Recent Predictions</h2>
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
            {predictions.slice(0, 5).map(pred => (
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
        <h2>Quick Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Top Performer</h4>
            <p>Alice Brown - GPA: 3.9</p>
          </div>
          <div className="insight-card">
            <h4>Needs Attention</h4>
            <p>Charlie Wilson - GPA: 2.1</p>
          </div>
          <div className="insight-card">
            <h4>Most Improved</h4>
            <p>Bob Johnson - GPA: 3.2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
