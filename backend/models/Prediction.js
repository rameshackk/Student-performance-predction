const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Matches front-end PREBxxxx format
  studentId: { type: Number, required: true },
  studentName: { type: String },
  predictedGPA: { type: Number },
  riskScore: { type: Number },
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  confidence: { type: Number },
  predictionDate: { type: Date, default: Date.now },
  date: { type: String }, // For historical predictions from mock
  factors: [{ type: String }],
  keyFactors: [{
    factor: String,
    impact: String,
    weight: Number
  }],
  recommendations: [{
    type: { type: String },
    description: String,
    priority: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
