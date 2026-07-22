import React, { useState, useEffect } from 'react';
import { students } from '../../services/mockData';
import { getRecommendations } from '../../services/recommendations';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { FaBullseye, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaUserGraduate } from 'react-icons/fa';

const PredictionForm = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [predictedGPA, setPredictedGPA] = useState(0);
  const [riskScore, setRiskScore] = useState('low');
  const [targetGPA, setTargetGPA] = useState('');
  const [formData, setFormData] = useState({
    attendance: 50,
    assignments: 50,
    projects: 50,
    mcqScore: 50
  });

  const student = selectedStudent ? students.find(s => s.id === parseInt(selectedStudent)) : null;

  // Compute class averages for benchmarking
  const classAvgs = {
    attendance: students.reduce((sum, s) => sum + s.attendance, 0) / students.length,
    assignments: students.reduce((sum, s) => sum + s.assignments, 0) / students.length,
    projects: students.reduce((sum, s) => sum + s.projects, 0) / students.length,
    mcqScore: students.reduce((sum, s) => sum + s.mcqScore, 0) / students.length,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    
    const s = students.find(st => st.id === parseInt(studentId));
    if (s) {
      setFormData({
        attendance: s.attendance,
        assignments: s.assignments,
        projects: s.projects,
        mcqScore: s.mcqScore
      });
      setTargetGPA((s.gpa + 0.4 > 4.0 ? 4.0 : s.gpa + 0.4).toFixed(1)); // Default target
    }
  };

  useEffect(() => {
    if (!student) return;
    const avgScore = (formData.attendance + formData.assignments + formData.projects + formData.mcqScore) / 4;
    const newGpa = Math.max(1.0, Math.min(4.0, avgScore / 25));
    setPredictedGPA(parseFloat(newGpa.toFixed(1)));
    setRiskScore(newGpa < 2.2 ? 'critical' : newGpa < 2.6 ? 'high' : newGpa < 3.2 ? 'medium' : 'low');
  }, [formData, student]);

  const getNudge = () => {
    if (!targetGPA || !student) return null;
    const target = parseFloat(targetGPA);
    if (predictedGPA >= target) {
      return { text: "You're on track to hit or exceed your target! Great job!", type: 'success', icon: <FaCheckCircle /> };
    }
    
    const gapGPA = target - predictedGPA;
    const metrics = [
       { name: 'Attendance', val: formData.attendance, key: 'attendance' },
       { name: 'Assignments', val: formData.assignments, key: 'assignments' },
       { name: 'Projects', val: formData.projects, key: 'projects' },
       { name: 'MCQ Scores', val: formData.mcqScore, key: 'mcqScore' },
    ].sort((a,b) => a.val - b.val);

    const weakest = metrics[0];
    const totalPointsNeeded = gapGPA * 100; // Formula: 0.1 GPA = 2.5 average points = 10 total specific points
    
    if (weakest.val + totalPointsNeeded <= 100) {
        return { text: `Target Missed: Boost your weakest link (${weakest.name}) by +${Math.ceil(totalPointsNeeded)}% to hit your ${target} goal.`, type: 'warning', icon: <FaBullseye /> };
    } else {
        return { text: `Target Missed: Your goal requires a massive +${Math.ceil(totalPointsNeeded)}% aggregate boost across all scoring categories.`, type: 'critical', icon: <FaExclamationTriangle /> };
    }
  };

  const nudge = getNudge();
  const dynamicRecs = student ? getRecommendations(predictedGPA, student.major || 'General Studies') : null;

  const radarData = student ? [
    { subject: 'Attendance', Student: formData.attendance, ClassAverage: Math.round(classAvgs.attendance), fullMark: 100 },
    { subject: 'Assignments', Student: formData.assignments, ClassAverage: Math.round(classAvgs.assignments), fullMark: 100 },
    { subject: 'Projects', Student: formData.projects, ClassAverage: Math.round(classAvgs.projects), fullMark: 100 },
    { subject: 'MCQ Score', Student: formData.mcqScore, ClassAverage: Math.round(classAvgs.mcqScore), fullMark: 100 },
  ] : [];

  const trajectoryData = student ? [
    { timeline: 'Start', GPA: Math.max(1.0, student.gpa - 0.6).toFixed(1) },
    { timeline: 'Midterm', GPA: Math.max(1.0, student.gpa - 0.2).toFixed(1) },
    { timeline: 'Current', GPA: student.gpa.toFixed(1) },
    { timeline: 'Predicted', GPA: predictedGPA.toFixed(1) }
  ] : [];

  return (
    <div className="prediction-form" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1><FaChartLine style={{ marginRight: '10px', color: '#1976d2' }}/> Performance Predictor</h1>
        <div style={{ minWidth: '300px' }}>
          <select value={selectedStudent} onChange={handleStudentChange} required className="filter-select" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '2px solid #1976d2', fontSize: '1rem' }}>
            <option value="">Choose a student profile to load...</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} (Current GPA: {s.gpa})</option>
            ))}
          </select>
        </div>
      </div>

      {!student ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#f8f9fa', borderRadius: '8px', color: '#666' }}>
          <FaUserGraduate style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ccc' }}/>
          <h2>Select a student to begin interactive predictions.</h2>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* LEFT PANEL: INTERACTIVE CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem', color: '#333' }}>"What-If" Scenario Sliders</h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label><strong>Attendance</strong></label>
                  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{formData.attendance}%</span>
                </div>
                <input type="range" name="attendance" min="0" max="100" value={formData.attendance} onChange={handleInputChange} style={{ width: '100%', cursor: 'pointer' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label><strong>Assignments</strong></label>
                  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{formData.assignments}%</span>
                </div>
                <input type="range" name="assignments" min="0" max="100" value={formData.assignments} onChange={handleInputChange} style={{ width: '100%', cursor: 'pointer' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label><strong>Projects</strong></label>
                  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{formData.projects}%</span>
                </div>
                <input type="range" name="projects" min="0" max="100" value={formData.projects} onChange={handleInputChange} style={{ width: '100%', cursor: 'pointer' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label><strong>MCQ Score</strong></label>
                  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{formData.mcqScore}%</span>
                </div>
                <input type="range" name="mcqScore" min="0" max="100" value={formData.mcqScore} onChange={handleInputChange} style={{ width: '100%', cursor: 'pointer' }} />
              </div>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>Target GPA Reverse-Calculator</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ whiteSpace: 'nowrap' }}><strong>My Goal GPA:</strong></label>
                <input type="number" step="0.1" min="1.0" max="4.0" value={targetGPA} onChange={(e) => setTargetGPA(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1.1rem' }} />
              </div>
              {nudge && (
                <div className={`badge ${nudge.type}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem', width: '100%', boxSizing: 'border-box', whiteSpace: 'normal', textAlign: 'left', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.2rem' }}>{nudge.icon}</div>
                  <div style={{ lineHeight: '1.3' }}>{nudge.text}</div>
                </div>
              )}
            </div>
            
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>Peer Benchmarking</h2>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Student (Interactive)" dataKey="Student" stroke="#1976d2" fill="#1976d2" fillOpacity={0.5} />
                    <Radar name="Class Average" dataKey="ClassAverage" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: VISUALIZATIONS & PLAN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* BIG PREDICTION WIDGET */}
            <div style={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', padding: '2rem', borderRadius: '8px', color: 'white', textAlign: 'center', boxShadow: '0 6px 12px rgba(0,0,0,0.1)' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>Live Calculated Future GPA</h2>
              <div style={{ fontSize: '4.5rem', fontWeight: 'bold', margin: '0.5rem 0', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                {predictedGPA.toFixed(1)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <span style={{ background: 'white', color: '#1976d2', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
                  Risk Level: {riskScore.toUpperCase()}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '20px' }}>
                  Current GPA: {student.gpa.toFixed(1)}
                </span>
              </div>
            </div>

            {/* TRAJECTORY WIDGET */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>Performance Trajectory</h2>
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer>
                  <LineChart data={trajectoryData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="timeline" />
                    <YAxis domain={[1.0, 4.0]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="GPA" stroke="#1976d2" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PERSONALIZED RECOMMENDATIONS */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee', borderTop: '4px solid #4CAF50' }}>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem', color: '#333' }}>Actionable Study Plan (For {predictedGPA.toFixed(1)})</h2>
              {dynamicRecs && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '6px' }}>
                    <strong style={{ color: '#1976d2', display: 'flex', alignItems: 'center', gap: '8px' }}>📚 Focus Concepts</strong>
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.95rem' }}>{dynamicRecs.studyConcepts}</p>
                  </div>
                  <div style={{ background: '#fdf3f0', padding: '1rem', borderRadius: '6px' }}>
                    <strong style={{ color: '#e64a19', display: 'flex', alignItems: 'center', gap: '8px' }}>🧠 Study Methodology</strong>
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.95rem' }}>{dynamicRecs.methodology}</p>
                  </div>
                  <div style={{ background: '#f1f8e9', padding: '1rem', borderRadius: '6px' }}>
                    <strong style={{ color: '#388e3c', display: 'flex', alignItems: 'center', gap: '8px' }}>🚀 Highest Impact Fix</strong>
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.95rem' }}>{dynamicRecs.improvementTip}</p>
                  </div>
                  <div style={{ background: '#f3e5f5', padding: '1rem', borderRadius: '6px' }}>
                    <strong style={{ color: '#7b1fa2', display: 'flex', alignItems: 'center', gap: '8px' }}>🎯 Quick Win Focus</strong>
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.95rem' }}>{dynamicRecs.focusTip}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
