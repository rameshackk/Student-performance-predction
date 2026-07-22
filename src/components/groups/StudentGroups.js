import React, { useState } from 'react';
import { groups, students } from '../../services/mockData';

const StudentGroups = () => {
  const [selectedMajor, setSelectedMajor] = useState('');
  const uniqueMajors = Object.keys(students[0].subjectScores || {}).sort();

  const getGroupForGpa = (gpa) => {
    if (gpa < 2.2) return 5;
    if (gpa < 2.6) return 4;
    if (gpa < 3.2) return 3;
    if (gpa < 3.7) return 2;
    return 1;
  };

  const getRiskForGpa = (gpa) => {
    if (gpa < 2.2) return 'critical';
    if (gpa < 2.6) return 'high';
    if (gpa < 3.2) return 'medium';
    return 'low';
  };

  // Calculate group statistics
  const groupStats = groups.map(group => {
    const groupStudentsRaw = students.filter(s => {
      const gpa = selectedMajor ? s.subjectScores[selectedMajor].gpa : s.gpa;
      const computedGroup = selectedMajor ? getGroupForGpa(gpa) : s.studentGroup;
      return computedGroup === group.id;
    });

    const groupStudents = groupStudentsRaw.map(s => {
      const gpa = selectedMajor ? s.subjectScores[selectedMajor].gpa : s.gpa;
      const risk = selectedMajor ? getRiskForGpa(gpa) : s.riskLevel;
      return { ...s, displayGpa: gpa, displayRisk: risk };
    });

    const avgGPA = groupStudents.reduce((sum, s) => sum + s.displayGpa, 0) / groupStudents.length || 0;
    const riskDistribution = {
      low: groupStudents.filter(s => s.displayRisk === 'low').length,
      medium: groupStudents.filter(s => s.displayRisk === 'medium').length,
      high: groupStudents.filter(s => s.displayRisk === 'high').length,
      critical: groupStudents.filter(s => s.displayRisk === 'critical').length
    };
    
    return {
      ...group,
      actualCount: groupStudents.length,
      actualAvgGPA: avgGPA.toFixed(1),
      students: groupStudents,
      riskDistribution
    };
  });

  return (
    <div className="student-groups">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1>Student Groups</h1>
          <p className="subtitle" style={{ marginTop: 0 }}>Behavioral Clustering Algorithm</p>
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

      <div className="groups-grid">
        {groupStats.map(group => (
          <div key={group.id} className="group-card" style={{ borderTopColor: group.color }}>
            <h3>{group.name}</h3>
            <p className="group-description">{group.description}</p>
            
            <div className="group-stats">
              <div className="stat">
                <span className="stat-label">Students</span>
                <span className="stat-value">{group.actualCount}/{group.studentCount}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Avg GPA</span>
                <span className="stat-value">{group.actualAvgGPA}</span>
              </div>
            </div>

            <div className="risk-distribution">
              <h4>Risk Distribution</h4>
              <div className="risk-bars">
                <div className="risk-bar">
                  <span className="risk-label">Low</span>
                  <div className="bar-container">
                    <div 
                      className="bar low" 
                      style={{ width: `${(group.riskDistribution.low / group.actualCount * 100) || 0}%` }}
                    ></div>
                  </div>
                  <span className="risk-count">{group.riskDistribution.low}</span>
                </div>
                <div className="risk-bar">
                  <span className="risk-label">Medium</span>
                  <div className="bar-container">
                    <div 
                      className="bar medium" 
                      style={{ width: `${(group.riskDistribution.medium / group.actualCount * 100) || 0}%` }}
                    ></div>
                  </div>
                  <span className="risk-count">{group.riskDistribution.medium}</span>
                </div>
                <div className="risk-bar">
                  <span className="risk-label">High</span>
                  <div className="bar-container">
                    <div 
                      className="bar high" 
                      style={{ width: `${(group.riskDistribution.high / group.actualCount * 100) || 0}%` }}
                    ></div>
                  </div>
                  <span className="risk-count">{group.riskDistribution.high}</span>
                </div>
                <div className="risk-bar">
                  <span className="risk-label">Critical</span>
                  <div className="bar-container">
                    <div 
                      className="bar critical" 
                      style={{ width: `${(group.riskDistribution.critical / group.actualCount * 100) || 0}%` }}
                    ></div>
                  </div>
                  <span className="risk-count">{group.riskDistribution.critical}</span>
                </div>
              </div>
            </div>

            <div className="group-students">
              <h4>Students in this group:</h4>
              <ul>
                {group.students.slice(0, 5).map(s => (
                  <li key={s.id}>
                    {s.name} - GPA: {s.displayGpa.toFixed(1)} ({s.displayRisk})
                  </li>
                ))}
                {group.students.length > 5 && (
                  <li className="more-students">+{group.students.length - 5} more</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentGroups;
