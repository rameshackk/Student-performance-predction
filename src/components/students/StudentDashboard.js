import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { students, predictions } from '../../services/mockData';
import { getRecommendations } from '../../services/recommendations';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [myData, setMyData] = useState(null);
  const [myPredictions, setMyPredictions] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState('');

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

  const uniqueMajors = myData?.subjectScores ? Object.keys(myData.subjectScores).sort() : [];

  const displayStats = selectedMajor && myData.subjectScores 
    ? {
        gpa: myData.subjectScores[selectedMajor].gpa,
        attendance: myData.subjectScores[selectedMajor].attendance,
        riskLevel: 'N/A' // Sub-level risk not defined natively
      }
    : {
        gpa: myData.gpa,
        attendance: myData.attendance,
        riskLevel: myData.riskLevel
      };

  const currentRecs = selectedMajor && myData.subjectScores
    ? getRecommendations(displayStats.gpa, selectedMajor)
    : myData.recommendationDetails;

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Student Dashboard</h1>
          <p>Welcome, {myData.name}!</p>
        </div>
        
        {uniqueMajors.length > 0 && (
          <select 
            value={selectedMajor} 
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="filter-select"
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
          >
            <option value="">All Subjects (Overall Average)</option>
            {uniqueMajors.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <h3>{selectedMajor ? `${selectedMajor} GPA` : 'Your GPA'}</h3>
          <p className="stat-value">{displayStats.gpa}</p>
        </div>
        <div className="stat-card green">
          <h3>Attendance</h3>
          <p className="stat-value">{displayStats.attendance || 'N/A'}%</p>
        </div>
        <div className="stat-card purple">
          <h3>Risk Level</h3>
          <p className="stat-value">{displayStats.riskLevel}</p>
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
        <h2>{selectedMajor ? `${selectedMajor} Personalized Plan` : 'Overall Recommendations'}</h2>
        {currentRecs ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left', backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #4CAF50' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1976d2' }}>📚 Focus Areas</strong>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{currentRecs.studyConcepts}</p>
            </div>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1976d2' }}>🧠 Methodology</strong>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{currentRecs.methodology}</p>
            </div>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1976d2' }}>📈 Improvement Tip</strong>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{currentRecs.improvementTip}</p>
            </div>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1976d2' }}>🎯 Focus Tip</strong>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{currentRecs.focusTip}</p>
            </div>
          </div>
        ) : (
          <ul className="recommendations-list">
            {myData.riskLevel === 'high' && (
              <li className="recommendation-item priority-high">
                <strong>Urgent:</strong> Meet with your academic advisor.
              </li>
            )}
            <li>Continue attending classes regularly.</li>
            <li>Submit assignments on time.</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;