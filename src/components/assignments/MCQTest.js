import React, { useState } from 'react';
import { students } from '../../services/mockData';
import { FaClipboardList, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const MCQTest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');

  const uniqueMajors = Object.keys(students[0].subjectScores || {}).sort();

  const filteredStudents = students.filter(student => {
    return student.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="mcq-test-page">
      <div className="page-header">
        <h1>MCQ Test Assignments Status</h1>
        <p>Review student performance in Multiple Choice Question tests</p>
      </div>

      <div className="controls-bar" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by student name or major..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
        />
        <select
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
          className="filter-select"
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Majors</option>
          {uniqueMajors.map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
        <button
          className="primary-btn"
          style={{ padding: '0.5rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
        >
          <FaClipboardList /> Schedule New Test
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Major</th>
              <th>Current MCQ Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => {
              const displayScore = selectedMajor ? student.subjectScores[selectedMajor].mcqScore : student.mcqScore;
              return (
              <tr key={student.id}>
                <td>STU-{student.id.toString().padStart(3, '0')}</td>
                <td>{student.name}</td>
                <td>{student.major}</td>
                <td>
                  <div className="score-container">
                    <div className="score-bar-bg">
                      <div
                        className={`score-bar-fill ${displayScore >= 75 ? 'good' : displayScore >= 60 ? 'average' : 'poor'}`}
                        style={{ width: `${displayScore}%` }}
                      ></div>
                    </div>
                    <span>{displayScore}%</span>
                  </div>
                </td>
                <td>
                  {displayScore >= 75 ? (
                    <span className="badge low"><FaCheckCircle /> Excellent</span>
                  ) : displayScore >= 60 ? (
                    <span className="badge medium">Good</span>
                  ) : (
                    <span className="badge critical"><FaExclamationTriangle /> Needs Review</span>
                  )}
                </td>
                <td>
                  <button className="action-btn view">View Details</button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="no-results">
            <p>No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQTest;
