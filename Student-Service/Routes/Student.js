const express = require('express');
const router = express.Router();
const Student = require('../Model/StudentModel');
const Course = require('../Model/CourseModel');
const verifyToken=require('../Middleware/auth');

router.get('/',verifyToken, async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add',verifyToken, async (req, res) => {
    const student = new Student(req.body);
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/enroll/:etudiant_id/:cours_id',verifyToken, async (req, res) => {
    try {
        const student = await Student.findById(req.params.etudiant_id);
        const course = await Course.findById(req.params.cours_id);
        if (!student || !course) {
            return res.status(404).json({ message: 'Student or Course not found' });
        }
        if (course.enrolledStudents.length >= course.capacity) {
            return res.status(400).json({ message: 'Course is full' });
        }
        student.enrolledCourses.push(course._id);
        course.enrolledStudents.push(student._id);
        await student.save();
        await course.save();
        res.json({ message: 'Student enrolled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/enrolledCourses/:etudiant_id',verifyTokenv, async (req, res) => {
    try {
        const student = await Student.findById(req.params.etudiant_id).populate('enrolledCourses');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const enrolledCourses = student.enrolledCourses.filter(course => course !== null);
        res.json(enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports=router;