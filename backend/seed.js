require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Student = require('./models/Student');
const Prediction = require('./models/Prediction');

// Just statically pasting the mock generator locally to seed
const courseCategories = [
  { id: 1, name: 'Mathematics', courses: ['MATH101', 'MATH201', 'MATH301'] },
  { id: 2, name: 'Computer Science', courses: ['CS101', 'CS201', 'CS301'] },
  { id: 3, name: 'Sciences', courses: ['PHYS101', 'CHEM101', 'BIO101'] },
  { id: 4, name: 'Engineering', courses: ['ENG101', 'ENG201', 'ENG301'] },
  { id: 5, name: 'Humanities', courses: ['HIST101', 'ENGL101', 'PHIL101'] }
];

const specificNames = [
  "DHARUN M", "MEDA ESWAR", "MOHAMED IRFAN A", "MOHAMED RUSHIL M Y",
  "MOHAMED SHALIK K", "MOHAMMED ANEES M", "MOHAMMED SAMEER", "MOTHIL S",
  "NAGABABU K V", "NAVEEN KUMAR D", "NIRANJAN REDDY P R", "NITHISH KUMAR S",
  "PAUL PRAJEET WILLIAM HENTRY", "PAVEEN D", "PRAGADEESH K", "PRAGATHISWARAN Y",
  "PRAJESH V", "PRANESH R", "PRASANNA D G", "PRASANNA R", "PUNITHAN J",
  "PURUSHOTH N", "RAGHU R", "RAGHULT G", "RAHUL V S", "RAHUL VISHWA V",
  "RAJESH B", "RAMESH V", "RAVI KRISHNA S", "ROHAN A", "ROHIT M", "ROHITH M",
  "RUDHRAN SAI C", "RUPESH N", "RUSHILRAJ M.G", "SABARI BALAN S", "SAILESH K",
  "SAIVIGNESH P", "SAMUEL MANASSEH MARTIN.J", "SANJAY KUMAR A", "SANJAY M",
  "SANJAY R", "SANJAY R", "SANJAYKRISHNAN", "SANJAYRAJ", "SANTHOSH M", "SANTHOSH S",
  "SARVESH MARIPPAN S", "SHARUN SANJAY S", "SHIVASELVAM S", "SHREE KAMALESH V",
  "SIMON IGNATIUS K", "SIVADHASAN A", "SRI NANTHAN N P", "SRIRAM S", "SUBHASH G",
  "SUDARSHAN K", "SUDHARSAN R", "TEJ ADITYA K", "THARUN ADITHIYA V S", "THARUN I",
  "THARUN R"
];

const generateStudents = (namesList) => {
  const majors = [
    'Cloud Computing',
    'Human Resource Management',
    'Compiler Design',
    'Full Stack Development',
    'Business Analytics',
    'Artificial Intelligence and Machine Learning'
  ];

  const generatedStudents = [];

  namesList.forEach((fullName, idx) => {
    const i = idx + 1;
    
    const subjectScores = {};
    let totalAttendance = 0, totalAssignments = 0, totalProjects = 0, totalMcq = 0, totalGpa = 0;
    const baseStudentSkill = Math.random(); 
    
    majors.forEach(subject => {
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
    let avgGpa = totalGpa / mCount;

    let riskLevel = 'low';
    let studentGroup = 1;
    if (avgGpa < 2.2) { riskLevel = 'critical'; studentGroup = 5; }
    else if (avgGpa < 2.6) { riskLevel = 'high'; studentGroup = 4; }
    else if (avgGpa < 3.2) { riskLevel = 'medium'; studentGroup = 3; }
    else if (avgGpa < 3.7) { riskLevel = 'low'; studentGroup = 2; }

    const firstNameParts = fullName.split(' ');
    const emailPrefix = firstNameParts[0].toLowerCase() + i;

    generatedStudents.push({
      id: i,
      name: fullName,
      major: 'All Subjects',
      subjectScores,
      gpa: parseFloat(avgGpa.toFixed(1)),
      riskLevel,
      studentGroup,
      enrollmentYear: [2020, 2021, 2022, 2023][Math.floor(Math.random() * 4)],
      email: `${emailPrefix}@university.edu`,
      courses: courseCategories[Math.floor(Math.random() * courseCategories.length)].courses,
      attendance: Math.round(totalAttendance / mCount),
      assignments: Math.round(totalAssignments / mCount),
      projects: Math.round(totalProjects / mCount),
      mcqScore: Math.round(totalMcq / mCount)
    });
  });
  return generatedStudents;
};

const generatePredictions = (studentsList) => {
  return studentsList.map(student => {
    const trend = (Math.random() * 0.4) - 0.2;
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

    return {
      id: `PRED${Math.random().toString(36).substr(2, 9)}`,
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

const seedDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-performance';
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    await User.deleteMany();
    await Student.deleteMany();
    await Prediction.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    await User.create([
      { email: 'admin@example.com', password: adminPassword, role: 'admin' },
      { email: 'student@csbs.in', password: studentPassword, role: 'student' }
    ]);

    const students = generateStudents(specificNames);
    await Student.insertMany(students);
    
    const predictions = generatePredictions(students);
    await Prediction.insertMany(predictions);

    console.log(`Data successfully seeded with ${students.length} specific students!`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
