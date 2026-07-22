import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    major: '',
    gpa: '',
    riskLevel: 'Low',
    studentGroup: '1',
    enrollmentYear: new Date().getFullYear(),
    attendance: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call to save student
    console.log('New Student Data:', formData);
    
    toast.success('Student added successfully!');
    
    // Reset form
    setFormData({
      name: '',
      major: '',
      gpa: '',
      riskLevel: 'Low',
      studentGroup: '1',
      enrollmentYear: new Date().getFullYear(),
      attendance: ''
    });
  };

  return (
    <div className="prediction-form">
      <h1>Add New Student</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="major">Major</label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="gpa">GPA</label>
              <input
                type="number"
                id="gpa"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                placeholder="0.0 - 4.0"
                step="0.1"
                min="0"
                max="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="attendance">Attendance (%)</label>
              <input
                type="number"
                id="attendance"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                placeholder="0 - 100"
                min="0"
                max="100"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="studentGroup">Student Group</label>
              <select
                id="studentGroup"
                name="studentGroup"
                value={formData.studentGroup}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map(group => (
                  <option key={group} value={group}>Group {group}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="enrollmentYear">Enrollment Year</label>
              <input
                type="number"
                id="enrollmentYear"
                name="enrollmentYear"
                value={formData.enrollmentYear}
                onChange={handleChange}
                min="2000"
                max="2030"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="riskLevel">Initial Risk Level</label>
            <select
              id="riskLevel"
              name="riskLevel"
              value={formData.riskLevel}
              onChange={handleChange}
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <button type="submit" className="predict-btn">
            Save Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
