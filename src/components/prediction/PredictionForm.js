import React, { useState } from 'react';
import { students } from '../../services/mockData';
import { FaMagic, FaSpinner } from 'react-icons/fa';

const PredictionForm = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    currentGPA: '',
    attendance: '',
    assignments: '',
    projects: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    
    const student = students.find(s => s.id === parseInt(studentId));
    if (student) {
      setFormData({
        currentGPA: student.gpa,
        attendance: student.attendance,
        assignments: student.assignments,
        projects: student.projects
      });
    }
  };

  const handlePredict = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setPredicting(true);
    
    // Simulate API call
    setTimeout(() => {
      const student = students.find(s => s.id === parseInt(selectedStudent));
      
      // Simple prediction logic
      const avgScore = (parseFloat(formData.attendance) + 
                       parseFloat(formData.assignments) + 
                       parseFloat(formData.projects)) / 3;
      
      const predictedGPA = (avgScore / 25).toFixed(2); // Convert to 4.0 scale
      const baseRisk = 2.5;
      const riskScore = predictedGPA < baseRisk ? 'high' : 
                       predictedGPA < 3.0 ? 'medium' : 'low';
      
      const mockPrediction = {
        studentName: student.name,
        currentGPA: student.gpa,
        predictedGPA: predictedGPA,
        riskLevel: riskScore,
        confidence: (0.75 + Math.random() * 0.2).toFixed(2),
        recommendations: [
          predictedGPA < 2.5 ? 'Schedule meeting with academic advisor' : 'Continue current study habits',
          predictedGPA < 3.0 ? 'Join study group for core courses' : 'Consider advanced courses',
          'Participate in research opportunities',
          'Maintain regular attendance'
        ]
      };
      
      setPrediction(mockPrediction);
      setPredicting(false);
    }, 2000);
  };

  return (
    <div className="prediction-form">
      <h1>Predict Student Performance</h1>
      
      <form onSubmit={handlePredict} className="form-container">
        <div className="form-group">
          <label>Select Student:</label>
          <select
            value={selectedStudent}
            onChange={handleStudentChange}
            required
          >
            <option value="">Choose a student...</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} - {s.major} (GPA: {s.gpa})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <>
            <div className="form-group">
              <label>Current GPA:</label>
              <input
                type="number"
                name="currentGPA"
                step="0.1"
                min="0"
                max="4"
                value={formData.currentGPA}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Attendance (%):</label>
              <input
                type="number"
                name="attendance"
                min="0"
                max="100"
                value={formData.attendance}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Assignment Scores (%):</label>
              <input
                type="number"
                name="assignments"
                min="0"
                max="100"
                value={formData.assignments}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Project Scores (%):</label>
              <input
                type="number"
                name="projects"
                min="0"
                max="100"
                value={formData.projects}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={predicting || !selectedStudent} className="predict-btn">
          {predicting ? <FaSpinner className="spinning" /> : <FaMagic />}
          {predicting ? 'Predicting...' : 'Generate Prediction'}
        </button>
      </form>

      {prediction && (
        <div className="prediction-result">
          <h2>Prediction Result</h2>
          <div className="result-card">
            <div className="result-row">
              <span className="label">Student:</span>
              <span className="value">{prediction.studentName}</span>
            </div>
            <div className="result-row">
              <span className="label">Current GPA:</span>
              <span className="value">{prediction.currentGPA}</span>
            </div>
            <div className="result-row">
              <span className="label">Predicted GPA:</span>
              <span className="value gpa">{prediction.predictedGPA}</span>
            </div>
            <div className="result-row">
              <span className="label">Risk Level:</span>
              <span className={`badge ${prediction.riskLevel}`}>
                {prediction.riskLevel}
              </span>
            </div>
            <div className="result-row">
              <span className="label">Confidence:</span>
              <span className="value">{(prediction.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="recommendations">
              <h3>Recommendations:</h3>
              <ul>
                {prediction.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
