const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Keeping custom ID for backward compatibility with mock data
  name: { type: String, required: true },
  major: { type: String },
  enrollmentYear: { type: Number },
  email: { type: String },
  courses: [{ type: String }],
  
  // Overall aggregated scores
  attendance: { type: Number },
  assignments: { type: Number },
  projects: { type: Number },
  mcqScore: { type: Number },
  gpa: { type: Number },
  
  // Risk and Groups
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  studentGroup: { type: Number },
  
  // Detailed subjects
  subjectScores: {
    type: Map,
    of: new mongoose.Schema({
      attendance: Number,
      assignments: Number,
      projects: Number,
      mcqScore: Number,
      gpa: Number
    }, { _id: false })
  },
  
  // Array of recommendation texts or objects
  recommendationDetails: [{ type: mongoose.Schema.Types.Mixed }]
  
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
