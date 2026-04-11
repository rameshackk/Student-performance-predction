const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');

// @route   GET api/groups
router.get('/', authMiddleware, async (req, res) => {
  try {
    const studentsList = await Student.find();
    
    // Base Groups Definition
    const baseGroups = [
      { id: 1, name: 'Group 1 - Excellent', color: '#4caf50', description: 'Top performers with excellent academic and practical skills' },
      { id: 2, name: 'Group 2 - Good', color: '#2196f3', description: 'Good academic performance with strong potential' },
      { id: 3, name: 'Group 3 - Average', color: '#ff9800', description: 'Average performers who need to strengthen fundamentals' },
      { id: 4, name: 'Group 4 - Below Average', color: '#f44336', description: 'Below average - need improvement in core courses' },
      { id: 5, name: 'Group 5 - At Risk', color: '#9c27b0', description: 'At risk - immediate intervention required' }
    ];

    const groupsData = {};
    
    // Group mapping compatible with frontend mock groupAPI format
    const aggregated = baseGroups.map(bg => {
      const groupStudents = studentsList.filter(s => s.studentGroup === bg.id);
      const count = groupStudents.length;
      const avgGPA = count > 0
        ? groupStudents.reduce((sum, s) => sum + s.gpa, 0) / count
        : 0;

      return {
        ...bg,
        studentCount: count,
        size: count, // Added size for the dashboard format
        avgGPA: parseFloat(avgGPA.toFixed(1))
      };
    });

    // Transform back to the frontend expected map structure: group id -> object
    aggregated.forEach(g => {
      groupsData[g.id] = { size: g.size, avgGPA: g.avgGPA, color: g.color };
    });

    res.json({ data: groupsData, fullData: aggregated });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
