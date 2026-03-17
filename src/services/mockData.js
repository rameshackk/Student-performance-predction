export const courseCategories = [
  { id: 1, name: 'Mathematics', courses: ['MATH101', 'MATH201', 'MATH301'] },
  { id: 2, name: 'Computer Science', courses: ['CS101', 'CS201', 'CS301'] },
  { id: 3, name: 'Sciences', courses: ['PHYS101', 'CHEM101', 'BIO101'] },
  { id: 4, name: 'Engineering', courses: ['ENG101', 'ENG201', 'ENG301'] },
  { id: 5, name: 'Humanities', courses: ['HIST101', 'ENGL101', 'PHIL101'] }
];

const generateStudents = (count) => {
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Bruce', 'Clark', 'Emily', 'Michael', 'Sarah', 'David', 'Jessica', 'James', 'Emma', 'William', 'Olivia', 'Daniel', 'Sophia', 'Matthew'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Wilson', 'Prince', 'Wayne', 'Kent', 'Davis', 'Miller', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez'];
  const majors = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Physics', 'Mathematics', 'Business', 'Journalism', 'Biology', 'Chemistry', 'Psychology'];

  const generatedStudents = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const major = majors[Math.floor(Math.random() * majors.length)];

    // Generate realistic correlation between attendance, projects, assignments and GPA
    const baseSkill = Math.random(); // 0 to 1

    // Convert base skill to stats
    const attendance = Math.floor(50 + (baseSkill * 50)); // 50 to 100
    const assignments = Math.floor(55 + ((baseSkill + (Math.random() * 0.2 - 0.1)) * 45)); // 55 to 100 with some noise
    const projects = Math.floor(50 + ((baseSkill + (Math.random() * 0.3 - 0.15)) * 50)); // 50 to 100 with more noise

    // Calculate GPA based on components
    let gpa = (attendance * 0.2 + assignments * 0.4 + projects * 0.4) / 100 * 4.0;
    gpa = Math.max(1.0, Math.min(4.0, gpa)); // clamp between 1.0 and 4.0

    // Determine risk level based on GPA
    let riskLevel = 'low';
    let studentGroup = 1;

    if (gpa < 2.2) {
      riskLevel = 'critical';
      studentGroup = 5;
    } else if (gpa < 2.6) {
      riskLevel = 'high';
      studentGroup = 4;
    } else if (gpa < 3.2) {
      riskLevel = 'medium';
      studentGroup = 3;
    } else if (gpa < 3.7) {
      riskLevel = 'low';
      studentGroup = 2;
    }

    const enrollmentYear = [2020, 2021, 2022, 2023][Math.floor(Math.random() * 4)];

    generatedStudents.push({
      id: i,
      name: `${firstName} ${lastName}`,
      major,
      gpa: parseFloat(gpa.toFixed(2)),
      riskLevel,
      studentGroup,
      enrollmentYear,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@university.edu`,
      courses: courseCategories[Math.floor(Math.random() * courseCategories.length)].courses,
      attendance: Math.min(100, Math.max(0, attendance)),
      assignments: Math.min(100, Math.max(0, assignments)),
      projects: Math.min(100, Math.max(0, projects))
    });
  }

  return generatedStudents;
};

export const students = generateStudents(50);

const generatePredictions = (studentsList) => {
  return studentsList.map(student => {
    // Prediction is usually close to current GPA but might trend slightly based on recent factors
    const trend = (Math.random() * 0.4) - 0.2; // -0.2 to +0.2 trend
    let predictedGPA = student.gpa + trend;
    predictedGPA = Math.max(1.0, Math.min(4.0, predictedGPA));

    let riskLevel = student.riskLevel;
    if (predictedGPA < 2.2) riskLevel = 'critical';
    else if (predictedGPA < 2.6) riskLevel = 'high';
    else if (predictedGPA < 3.2) riskLevel = 'medium';
    else riskLevel = 'low';

    const factors = [];
    if (student.attendance > 90) factors.push('Excellent attendance record');
    else if (student.attendance < 75) factors.push('Poor attendance trending negatively');

    if (student.gpa > 3.5) factors.push('Strong academic foundational performance');
    else if (student.gpa < 2.5) factors.push('Struggling with core concepts');

    if (student.assignments > student.projects + 15) factors.push('Strong in coursework but weaker in practical application');
    if (student.projects > student.assignments + 15) factors.push('Strong practical skills but missing fundamental coursework');

    if (factors.length === 0) factors.push('Stable performance across metrics');

    return {
      id: student.id,
      studentId: student.id,
      studentName: student.name,
      predictedGPA: parseFloat(predictedGPA.toFixed(2)),
      riskLevel,
      confidence: parseFloat((0.75 + Math.random() * 0.2).toFixed(2)),
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0],
      factors
    };
  });
};

export const predictions = generatePredictions(students);

const calculateGroups = (studentsList) => {
  const baseGroups = [
    { id: 1, name: 'Group 1 - Excellent', color: '#4caf50', description: 'Top performers with excellent academic and practical skills' },
    { id: 2, name: 'Group 2 - Good', color: '#2196f3', description: 'Good academic performance with strong potential' },
    { id: 3, name: 'Group 3 - Average', color: '#ff9800', description: 'Average performers who need to strengthen fundamentals' },
    { id: 4, name: 'Group 4 - Below Average', color: '#f44336', description: 'Below average - need improvement in core courses' },
    { id: 5, name: 'Group 5 - At Risk', color: '#9c27b0', description: 'At risk - immediate intervention required' }
  ];

  return baseGroups.map(bg => {
    const groupStudents = studentsList.filter(s => s.studentGroup === bg.id);
    const count = groupStudents.length;
    const avgGPA = count > 0
      ? groupStudents.reduce((sum, s) => sum + s.gpa, 0) / count
      : 0;

    return {
      ...bg,
      studentCount: count,
      avgGPA: parseFloat(avgGPA.toFixed(2))
    };
  });
};

export const groups = calculateGroups(students);

