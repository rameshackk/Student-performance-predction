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
      atRisk: riskCounts.high,
      lowRisk: riskCounts.low,
      mediumRisk: riskCounts.medium,
      criticalRisk: riskCounts.critical
    });
  }, [selectedMajor]);

  const topPerformer = [...students].sort((a, b) => b.gpa - a.gpa)[0];
  const needsAttention = [...students].sort((a, b) => a.gpa - b.gpa)[0];
  
  // Find a student who has a better predicted GPA than current GPA (Simulating "Most Improved")
  const mostImprovedPred = predictions.find(p => p.predictedGPA > (students.find(s => s.id === p.studentId)?.gpa || 4.0));
  const mostImproved = mostImprovedPred ? students.find(s => s.id === mostImprovedPred.studentId) : students[Math.floor(Math.random() * students.length)];

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
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
          {topPerformer && (
             <div className="insight-card">
               <h4>Top Performer</h4>
               <p>{topPerformer.name} - GPA: {topPerformer.gpa}</p>
             </div>
          )}
          {needsAttention && (
             <div className="insight-card">
               <h4>Needs Attention</h4>
               <p>{needsAttention.name} - GPA: {needsAttention.gpa}</p>
             </div>
          )}
          {mostImproved && (
             <div className="insight-card">
               <h4>Most Improved</h4>
               <p>{mostImproved.name} - GPA: {mostImproved.gpa}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
