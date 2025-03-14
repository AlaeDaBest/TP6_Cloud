const express = require('express');
const router = express.Router();
const Course = require('../Model/CourseModel'); 
const verifyToken=require('../Middleware/auth');
const { verify } = require('jsonwebtoken');

router.get('/',verifyToken, async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add',verifyToken, async (req, res) => {
    const course = new Course(req.body);
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/update/:id',verifyToken, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/delete/:id',verifyToken, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/search',verifyToken, async (req, res) => {
    const {q} = req.query; 
    try {
        const courses = await Course.find({
            $or: [
                { title: { $regex: q, $options: 'i' } }, 
                { description: { $regex: q, $options: 'i' } },
                { instructor: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
            ],
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;