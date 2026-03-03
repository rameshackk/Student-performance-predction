export const students = [
  {
    id: 1,
    name: 'John Doe',
    major: 'Computer Science',
    gpa: 3.8,
    riskLevel: 'low',
    studentGroup: 1,
    enrollmentYear: 2022,
    email: 'john.doe@university.edu',
    courses: ['CS101', 'CS201', 'MATH205'],
    attendance: 95,
    assignments: 92,
    projects: 88
  },
  {
    id: 2,
    name: 'Jane Smith',
    major: 'Electrical Engineering',
    gpa: 2.5,
    riskLevel: 'high',
    studentGroup: 4,
    enrollmentYear: 2021,
    email: 'jane.smith@university.edu',
    courses: ['EE101', 'EE202', 'PHYS210'],
    attendance: 72,
    assignments: 68,
    projects: 65
  },
  {
    id: 3,
    name: 'Bob Johnson',
    major: 'Mechanical Engineering',
    gpa: 3.2,
    riskLevel: 'medium',
    studentGroup: 2,
    enrollmentYear: 2023,
    email: 'bob.johnson@university.edu',
    courses: ['ME101', 'ME150', 'MATH201'],
    attendance: 85,
    assignments: 82,
    projects: 80
  },
  {
    id: 4,
    name: 'Alice Brown',
    major: 'Computer Science',
    gpa: 3.9,
    riskLevel: 'low',
    studentGroup: 1,
    enrollmentYear: 2022,
    email: 'alice.brown@university.edu',
    courses: ['CS101', 'CS250', 'CS300'],
    attendance: 98,
    assignments: 95,
    projects: 94
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    major: 'Physics',
    gpa: 2.1,
    riskLevel: 'critical',
    studentGroup: 5,
    enrollmentYear: 2021,
    email: 'charlie.wilson@university.edu',
    courses: ['PHYS101', 'PHYS205', 'MATH210'],
    attendance: 55,
    assignments: 60,
    projects: 58
  },
  {
    id: 6,
    name: 'Diana Prince',
    major: 'Mathematics',
    gpa: 3.5,
    riskLevel: 'low',
    studentGroup: 1,
    enrollmentYear: 2022,
    email: 'diana.prince@university.edu',
    courses: ['MATH201', 'MATH310', 'CS150'],
    attendance: 92,
    assignments: 90,
    projects: 88
  },
  {
    id: 7,
    name: 'Bruce Wayne',
    major: 'Business',
    gpa: 2.8,
    riskLevel: 'medium',
    studentGroup: 3,
    enrollmentYear: 2023,
    email: 'bruce.wayne@university.edu',
    courses: ['BUS101', 'BUS205', 'ECON101'],
    attendance: 78,
    assignments: 75,
    projects: 80
  },
  {
    id: 8,
    name: 'Clark Kent',
    major: 'Journalism',
    gpa: 3.4,
    riskLevel: 'low',
    studentGroup: 2,
    enrollmentYear: 2022,
    email: 'clark.kent@university.edu',
    courses: ['JOUR101', 'JOUR202', 'COMM150'],
    attendance: 88,
    assignments: 86,
    projects: 85
  }
];

export const predictions = [
  {
    id: 1,
    studentId: 1,
    studentName: 'John Doe',
    predictedGPA: 3.9,
    riskLevel: 'low',
    confidence: 0.93,
    date: '2024-03-15',
    factors: ['Strong academic performance', 'High attendance', 'Good project scores']
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Jane Smith',
    predictedGPA: 2.4,
    riskLevel: 'high',
    confidence: 0.88,
    date: '2024-03-15',
    factors: ['Declining grades', 'Low attendance', 'Missing assignments']
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Bob Johnson',
    predictedGPA: 3.1,
    riskLevel: 'medium',
    confidence: 0.91,
    date: '2024-03-14',
    factors: ['Inconsistent performance', 'Average attendance']
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Alice Brown',
    predictedGPA: 4.0,
    riskLevel: 'low',
    confidence: 0.95,
    date: '2024-03-14',
    factors: ['Excellent performance', 'Perfect attendance', 'Outstanding projects']
  },
  {
    id: 5,
    studentId: 5,
    studentName: 'Charlie Wilson',
    predictedGPA: 2.0,
    riskLevel: 'critical',
    confidence: 0.82,
    date: '2024-03-13',
    factors: ['Poor performance', 'Low attendance', 'Missing assignments']
  }
];

export const groups = [
  { 
    id: 1, 
    name: 'Group 1 - Excellent', 
    color: '#4caf50', 
    studentCount: 15, 
    avgGPA: 3.7,
    description: 'Top performers with excellent academic and practical skills'
  },
  { 
    id: 2, 
    name: 'Group 2 - Good', 
    color: '#2196f3', 
    studentCount: 12, 
    avgGPA: 3.3,
    description: 'Good academic performance with strong potential'
  },
  { 
    id: 3, 
    name: 'Group 3 - Average', 
    color: '#ff9800', 
    studentCount: 8, 
    avgGPA: 2.9,
    description: 'Average performers who need to strengthen fundamentals'
  },
  { 
    id: 4, 
    name: 'Group 4 - Below Average', 
    color: '#f44336', 
    studentCount: 6, 
    avgGPA: 2.4,
    description: 'Below average - need improvement in core courses'
  },
  { 
    id: 5, 
    name: 'Group 5 - At Risk', 
    color: '#9c27b0', 
    studentCount: 4, 
    avgGPA: 1.9,
    description: 'At risk - immediate intervention required'
  }
];

export const courseCategories = [
  { id: 1, name: 'Mathematics', courses: ['MATH101', 'MATH201', 'MATH301'] },
  { id: 2, name: 'Computer Science', courses: ['CS101', 'CS201', 'CS301'] },
  { id: 3, name: 'Sciences', courses: ['PHYS101', 'CHEM101', 'BIO101'] },
  { id: 4, name: 'Engineering', courses: ['ENG101', 'ENG201', 'ENG301'] },
  { id: 5, name: 'Humanities', courses: ['HIST101', 'ENGL101', 'PHIL101'] }
];
