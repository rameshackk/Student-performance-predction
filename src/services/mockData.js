import { getRecommendations } from './recommendations';

export const courseCategories = [
  { id: 1, name: 'Mathematics', courses: ['MATH101', 'MATH201', 'MATH301'] },
  { id: 2, name: 'Computer Science', courses: ['CS101', 'CS201', 'CS301'] },
  { id: 3, name: 'Sciences', courses: ['PHYS101', 'CHEM101', 'BIO101'] },
  { id: 4, name: 'Engineering', courses: ['ENG101', 'ENG201', 'ENG301'] },
  { id: 5, name: 'Humanities', courses: ['HIST101', 'ENGL101', 'PHIL101'] }
];

const generateStudents = (count) => {
  const firstNames = ['Karthik', 'Vignesh', 'Surya', 'Ramesh', 'Sanjay', 'Pragathishwaran', 'Raghu', 'Tharun', 'Rushil', 'Sudharshan', 'Sivadasan', 'Sivaselvam', 'Arun', 'Prakash', 'Balaji', 'Nithya', 'Priyanka', 'Divya', 'Aishwarya', 'Swathi'];
  const lastNames = ['Rajan', 'Krishnan', 'Kumar', 'Natarajan', 'Swaminathan', 'Iyer', 'Pillai', 'Raman', 'Srinivasan', 'Venkatesan', 'Gounder', 'Naidu', 'Chettiar', 'Reddy', 'Bharathi', 'Chandran', 'Muralidharan', 'Rajagopal', 'Sekar', 'Ramasamy'];
  const majors = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Physics', 'Mathematics', 'Business', 'Journalism', 'Biology', 'Chemistry', 'Psychology'];

  const generatedStudents = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Generate scores for all majors
    const subjectScores = {};
    let totalAttendance = 0, totalAssignments = 0, totalProjects = 0, totalMcq = 0, totalGpa = 0;
    const baseStudentSkill = Math.random(); // Base aptitude for the student
    
    majors.forEach(subject => {
      // Add slight variance per subject
      const subjectSkill = Math.max(0, Math.min(1, baseStudentSkill + (Math.random() * 0.4 - 0.2)));
      
      const attendance = Math.floor(50 + (subjectSkill * 50));
      const assignments = Math.floor(55 + ((subjectSkill + (Math.random() * 0.2 - 0.1)) * 45));
      const projects = Math.floor(50 + ((subjectSkill + (Math.random() * 0.3 - 0.15)) * 50));
      const mcqScore = Math.floor(50 + ((subjectSkill + (Math.random() * 0.25 - 0.1)) * 50));
      
      let gpa = (attendance * 0.2 + assignments * 0.3 + projects * 0.3 + mcqScore * 0.2) / 100 * 4.0;
      gpa = Math.max(1.0, Math.min(4.0, gpa));
      
      subjectScores[subject] = {
        attendance: Math.min(100, Math.max(0, attendance)),
        assignments: Math.min(100, Math.max(0, assignments)),
        projects: Math.min(100, Math.max(0, projects)),
        mcqScore: Math.min(100, Math.max(0, mcqScore)),
        gpa: parseFloat(gpa.toFixed(1))
      };
      
      totalAttendance += subjectScores[subject].attendance;
      totalAssignments += subjectScores[subject].assignments;
      totalProjects += subjectScores[subject].projects;
      totalMcq += subjectScores[subject].mcqScore;
      totalGpa += subjectScores[subject].gpa;
    });

    const mCount = majors.length;
    const avgAttendance = Math.round(totalAttendance / mCount);
    const avgAssignments = Math.round(totalAssignments / mCount);
    const avgProjects = Math.round(totalProjects / mCount);
    const avgMcqScore = Math.round(totalMcq / mCount);
    let avgGpa = totalGpa / mCount;

    // Determine risk level based on GPA
    let riskLevel = 'low';
    let studentGroup = 1;

    if (avgGpa < 2.2) {
      riskLevel = 'critical';
      studentGroup = 5;
    } else if (avgGpa < 2.6) {
      riskLevel = 'high';
      studentGroup = 4;
    } else if (avgGpa < 3.2) {
      riskLevel = 'medium';
      studentGroup = 3;
    } else if (avgGpa < 3.7) {
      riskLevel = 'low';
      studentGroup = 2;
    }

    const enrollmentYear = [2020, 2021, 2022, 2023][Math.floor(Math.random() * 4)];

    generatedStudents.push({
      id: i,
      name: `${firstName} ${lastName}`,
      major: 'All Subjects',
      subjectScores,
      gpa: parseFloat(avgGpa.toFixed(1)),
      riskLevel,
      studentGroup,
      enrollmentYear,
      email: `${firstName.toLocaleLowerCase()}.${lastName.toLocaleLowerCase()}${i}@university.edu`,
      courses: courseCategories[Math.floor(Math.random() * courseCategories.length)].courses,
      attendance: avgAttendance,
      assignments: avgAssignments,
      projects: avgProjects,
      mcqScore: avgMcqScore,
      recommendationDetails: getRecommendations(parseFloat(avgGpa.toFixed(1)), 'General Sciences')
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
      predictedGPA: parseFloat(predictedGPA.toFixed(1)),
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
      avgGPA: parseFloat(avgGPA.toFixed(1))
    };
  });
};

export const groups = calculateGroups(students);

