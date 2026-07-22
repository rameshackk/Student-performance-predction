import React, { useState } from 'react';
import { students } from '../../services/mockData';
import { FaSearch, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState('');

  const uniqueMajors = Object.keys(students[0].subjectScores || {}).sort();

  const computeRisk = (gpa) => {
    if (gpa < 2.2) return 'critical';
    if (gpa < 2.6) return 'high';
    if (gpa < 3.2) return 'medium';
    return 'low';
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getRiskBadgeClass = (risk) => {
    const classes = {
      low: 'badge low',
      medium: 'badge medium',
      high: 'badge high',
      critical: 'badge critical'
    };
    return classes[risk] || 'badge';
  };

  const filteredStudents = students.filter(student => {
    // Search filter
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Risk filter
    const currentRisk = selectedMajor ? computeRisk(student.subjectScores[selectedMajor].gpa) : student.riskLevel;
    const matchesRisk = filterRisk === 'all' || currentRisk === filterRisk;
    
    // Group filter
    const matchesGroup = filterGroup === 'all' || student.studentGroup.toString() === filterGroup;
    
    return matchesSearch && matchesRisk && matchesGroup;
  });

  return (
    <div className="student-list">
      <div className="header">
        <h1>Students</h1>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="filter-group">
          <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)}>
            <option value="all">All Groups</option>
            <option value="1">Group 1</option>
            <option value="2">Group 2</option>
            <option value="3">Group 3</option>
            <option value="4">Group 4</option>
            <option value="5">Group 5</option>
          </select>
        </div>

        <div className="filter-group">
          <select value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)}>
            <option value="">All Subjects</option>
            {uniqueMajors.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Major</th>
              <th>GPA</th>
              <th>Risk Level</th>
              <th>Group</th>
              <th>Year</th>
              <th>Attendance</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => {
              const displayGpa = selectedMajor ? student.subjectScores[selectedMajor].gpa : student.gpa;
              const displayAttendance = selectedMajor ? student.subjectScores[selectedMajor].attendance : student.attendance;
              const displayRisk = selectedMajor ? computeRisk(displayGpa) : student.riskLevel;
              const recs = selectedMajor ? student.recommendationDetails : student.recommendationDetails; // Already correctly formed
              // Need dynamic recs inside expanded view? We can just recompute it on the fly:
              const { getRecommendations } = require('../../services/recommendations');
              const dynamicRecs = getRecommendations(displayGpa, selectedMajor || 'General Sciences');

              return (
              <React.Fragment key={student.id}>
                <tr className={expandedRow === student.id ? 'active-row' : ''} onClick={() => toggleRow(student.id)} style={{ cursor: 'pointer' }}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{selectedMajor || 'All Subjects'}</td>
                <td>{displayGpa.toFixed(1)}</td>
                <td>
                  <span className={getRiskBadgeClass(displayRisk)}>
                    {displayRisk}
                  </span>
                </td>
                <td>
                  <span className="group-badge">Group {student.studentGroup}</span>
                </td>
                <td>{student.enrollmentYear}</td>
                <td>{displayAttendance}%</td>
                <td>
                  {expandedRow === student.id ? <FaChevronUp /> : <FaChevronDown />}
                </td>
              </tr>
              {expandedRow === student.id && (
                <tr className="expanded-details-row">
                  <td colSpan="9">
                    <div className="recommendations-panel" style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', margin: '0.5rem 0', borderLeft: '4px solid #4CAF50', textAlign: 'left' }}>
                      <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50', fontSize: '1.1rem' }}>
                        Personalized Study Plan (GPA: {displayGpa.toFixed(1)})
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div>
                          <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1976d2' }}>📚 Focus Areas</strong>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{dynamicRecs.studyConcepts}</p>
                        </div>
                        <div>
                          <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1976d2' }}>🧠 Methodology</strong>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{dynamicRecs.methodology}</p>
                        </div>
                        <div>
                          <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1976d2' }}>📈 Improvement Tip</strong>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{dynamicRecs.improvementTip}</p>
                        </div>
                        <div>
                          <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1976d2' }}>🎯 Focus Tip</strong>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{dynamicRecs.focusTip}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              </React.Fragment>
            )})}
          </tbody>
        </table>
        
        {filteredStudents.length === 0 && (
          <div className="no-results">
            <p>No students found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
