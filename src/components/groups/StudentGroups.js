import React from 'react';
import { groups, students } from '../../services/mockData';

const StudentGroups = () => {
  // Calculate group statistics
  const groupStats = groups.map(group => {
    const groupStudents = students.filter(s => s.studentGroup === group.id);
    const avgGPA = groupStudents.reduce((sum, s) => sum + s.gpa, 0) / groupStudents.length || 0;
    const riskDistribution = {
      low: groupStudents.filter(s => s.riskLevel === 'low').length,
      medium: groupStudents.filter(s => s.riskLevel === 'medium').length,
      high: groupStudents.filter(s => s.riskLevel === 'high').length,
      critical: groupStudents.filter(s => s.riskLevel === 'critical').length
    };
    
    return {
      ...group,
      actualCount: groupStudents.length,
      actualAvgGPA: avgGPA.toFixed(2),
      students: groupStudents,
      riskDistribution
    };
  });

  return (
    <div className="student-groups">
      <h1>Student Groups</h1>
      <p className="subtitle">Based on Louvain Clustering Algorithm</p>

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
                    {s.name} - GPA: {s.gpa} ({s.riskLevel})
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
