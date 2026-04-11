const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');

// @route   POST api/predictions/:studentId
router.post('/:studentId', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ported Mock Logic for Prediction
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

    if (student.gpa > 3.5) factors.push('Strong academic foundational performance');
    else if (student.gpa < 2.5) factors.push('Struggling with core concepts');

    if (student.assignments > student.projects + 15) factors.push('Strong in coursework but weaker in practical application');
    if (student.projects > student.assignments + 15) factors.push('Strong practical skills but missing fundamental coursework');

    if (factors.length === 0) factors.push('Stable performance across metrics');

    const newPrediction = new Prediction({
      id: `PRED${Math.random().toString(36).substr(2, 9)}`,
      studentId: student.id,
      studentName: student.name,
      predictedGPA: parseFloat(predictedGPA.toFixed(1)),
      riskScore: Math.floor(Math.random() * 60), 
      riskLevel,
      confidence: parseFloat((0.75 + Math.random() * 0.2).toFixed(2)),
      factors,
      keyFactors: [
        { factor: 'academic_performance', impact: 'positive', weight: 0.4 },
        { factor: 'practical_engagement', impact: 'positive', weight: 0.3 }
      ],
      recommendations: [
        { type: 'maintain', description: 'Continue current study habits', priority: 'low' }
      ]
    });

    const prediction = await newPrediction.save();
    res.json({ data: prediction });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/predictions/recent
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const predictions = await Prediction.find().sort({ predictionDate: -1 }).limit(limit);
    res.json({ data: predictions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
