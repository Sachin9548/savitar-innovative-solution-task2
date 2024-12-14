const express = require('express');
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// Add new feedback (Employee)
router.post('/', authMiddleware, async (req, res) => {
    const { feedbackText } = req.body;
    const employeeId = req.user.userId; // User ID from token

    try {
        const feedback = new Feedback({
            employeeId,
            feedbackText,
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get feedbacks of a specific employee (Employee)
router.get('/', authMiddleware, async (req, res) => {
    const employeeId = req.user.userId; // User ID from token
    console.log('Employee ID from token:', employeeId); // Debugging log

    if (!employeeId) {
        return res.status(400).json({ message: 'User ID is missing in token' });
    }

    try {
        // Find feedbacks associated with the logged-in employee
        const feedbacks = await Feedback.find({ employeeId })
            .populate('employeeId', 'username'); // Optional: Populate employee username

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedback found' });
        }

        res.status(200).json(feedbacks);
    } catch (err) {
        console.error('Error fetching feedback:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


// Edit feedback (Employee)
router.put('/:id', authMiddleware, async (req, res) => {
    const { feedbackText } = req.body;
    const employeeId = req.user.userId;
    const feedbackId = req.params.id;

    try {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Check if the feedback belongs to the logged-in employee
        if (feedback.employeeId.toString() !== employeeId) {
            return res.status(403).json({ message: 'You can only edit your own feedback' });
        }

        feedback.feedbackText = feedbackText;
        await feedback.save();

        res.json({ message: 'Feedback updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin - Get all feedbacks
router.get('/admin', authMiddleware, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const feedbacks = await Feedback.find().populate('employeeId', 'username');
        res.json(feedbacks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin - Delete feedback
router.delete('/admin/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        await feedback.remove();
        res.json({ message: 'Feedback deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
