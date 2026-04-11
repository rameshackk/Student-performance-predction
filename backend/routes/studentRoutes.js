const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');

// @route   GET api/students
router.get('/', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find().sort({ id: 1 });
    res.json({ data: students });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ data: student });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/students
// Create a new student (might need roleMiddleware('admin'))
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const student = await newStudent.save();
    res.json({ data: student });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/students/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    let student = await Student.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ data: student });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/students/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ id: req.params.id });
     if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
