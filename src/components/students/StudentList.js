import React, { useState } from 'react';
import { students } from '../../services/mockData';
import { FaSearch, FaFilter } from 'react-icons/fa';

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');

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
    const matchesRisk = filterRisk === 'all' || student.riskLevel === filterRisk;
    
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
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.major}</td>
                <td>{student.gpa}</td>
                <td>
                  <span className={getRiskBadgeClass(student.riskLevel)}>
                    {student.riskLevel}
                  </span>
                </td>
                <td>
                  <span className="group-badge">Group {student.studentGroup}</span>
                </td>
                <td>{student.enrollmentYear}</td>
                <td>{student.attendance}%</td>
              </tr>
            ))}
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
