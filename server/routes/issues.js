const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all issues (public for now, but with user info)
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('reportedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific issue
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'username');
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new issue (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, location } = req.body;
    
    if (!title || !description || !location) {
      return res.status(400).json({ error: 'Title, description, and location are required' });
    }

    const newIssue = new Issue({ 
      title, 
      description, 
      location,
      reportedBy: req.user._id
    });
    
    await newIssue.save();
    await newIssue.populate('reportedBy', 'username');
    
    res.status(201).json(newIssue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update issue status (admin only)
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['New', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Issue.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    ).populate('reportedBy', 'username');
    
    if (!updated) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
