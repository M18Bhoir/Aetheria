import express from 'express';
import Poll from '../models/Poll.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Create Poll
router.post('/', protect, async (req, res) => {
  try {
    const poll = await Poll.create({ ...req.body, createdBy: req.user._id });
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().populate('createdBy', 'name userId');
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- UPDATED SECTION ---

// @route   POST /api/polls/:pollId/vote
// @desc    Vote on a poll
// @access  Private
router.post('/vote/:pollId', protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) {
      return res.status(404).json({ msg: 'Poll not found' });
    }

    // Use optionIndex directly from the request body
    const { optionIndex } = req.body;

    // Validate the index
    if (optionIndex === null || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ msg: 'Invalid option selected.' });
    }
    
    // --- (Optional) Add logic to prevent double voting here if needed ---
    // e.g., check if req.user._id is already in a 'votedBy' array.

    // Increment the vote
    poll.options[optionIndex].votes += 1;
    
    await poll.save();
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});
// --- END OF UPDATED SECTION ---

export default router;