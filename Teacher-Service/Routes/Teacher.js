const express = require('express');
const router = express.Router();
const Teacher = require('../Model/TeacherModel');
const Course = require('../Model/CourseModel');
const Student = require('../Model/StudentModel'); 

router.get('/',verifyToken, async (req, res) => {
    try {
        const teachers=await Teacher.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add',verifyToken, async (req, res) => {
    const teacher = new Teacher(req.body);
    try {
        const newTeacher = await teacher.save();
        res.status(201).json(newTeacher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/assign/:professeur_id/:cours_id',verifyToken, async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.professeur_id);
        const course = await Course.findById(req.params.cours_id);

        if (!teacher || !course) {
            return res.status(404).json({ message: 'Teacher or Course not found' });
        }

        if (course.teacher) {
            return res.status(400).json({ message: 'Course already assigned to a teacher' });
        }

        teacher.assignedCourses.push(course._id);
        course.teacher = teacher._id;

        await teacher.save();
        await course.save();

        res.json({ message: 'Course assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/enrolledStudents/:cours_id',verifyToken, async (req, res) => {
    try {
        const course = await Course.findById(req.params.cours_id).populate('enrolledStudents');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course.enrolledStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;