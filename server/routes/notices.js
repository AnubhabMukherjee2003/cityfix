const express = require('express');
const Notice = require('../models/Notice');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all active notices (public)
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// Get all notices (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(notices);
  } catch (error) {
    console.error('Error fetching all notices:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// Create new notice (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const notice = new Notice({
      title,
      description,
      createdBy: req.user._id
    });

    await notice.save();
    await notice.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Notice created successfully',
      notice
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// Update notice (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isActive } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      id,
      { title, description, isActive },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.json({
      message: 'Notice updated successfully',
      notice
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ error: 'Failed to update notice' });
  }
});

// Delete notice (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

module.exports = router;
