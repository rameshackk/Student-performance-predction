import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { students, predictions } from '../../services/mockData'; // replace with real data later

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [myData, setMyData] = useState(null);
  const [myPredictions, setMyPredictions] = useState([]);

  useEffect(() => {
    // For demo, find the student with email matching current user
    // In a real app, you'd query Firestore using the user's uid
    const student = students.find(s => s.email === currentUser?.email);
    setMyData(student);

    // Find predictions for this student
    const preds = predictions.filter(p => p.studentId === student?.id);
    setMyPredictions(preds);
  }, [currentUser]);

  if (!myData) {
    return (
      <div className="dashboard">
        <h1>Student Dashboard</h1>
        <p>No student data found for your account. Please contact admin.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>
      <p>Welcome, {myData.name}!</p>

      <div className="stats-grid">
        <div className="stat-card blue">
          <h3>Your GPA</h3>
          <p className="stat-value">{myData.gpa}</p>
        </div>
        <div className="stat-card green">
          <h3>Attendance</h3>
          <p className="stat-value">{myData.attendance || 'N/A'}%</p>
        </div>
        <div className="stat-card purple">
          <h3>Risk Level</h3>
          <p className="stat-value">{myData.riskLevel}</p>
        </div>
      </div>

      <div className="recent-predictions">
        <h2>Your Prediction History</h2>
        {myPredictions.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Predicted GPA</th>
                <th>Risk Level</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {myPredictions.map(pred => (
                <tr key={pred.id}>
                  <td>{pred.date}</td>
                  <td>{pred.predictedGPA}</td>
                  <td>
                    <span className={`badge ${pred.riskLevel}`}>
                      {pred.riskLevel}
                    </span>
                  </td>
                  <td>{(pred.confidence * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No predictions yet.</p>
        )}
      </div>

      <div className="quick-insights">
        <h2>Recommendations</h2>
        <ul className="recommendations-list">
          {myData.riskLevel === 'high' && (
            <li className="recommendation-item priority-high">
              <strong>Urgent:</strong> Meet with your academic advisor.
            </li>
          )}
          <li>Continue attending classes regularly.</li>
          <li>Submit assignments on time.</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;