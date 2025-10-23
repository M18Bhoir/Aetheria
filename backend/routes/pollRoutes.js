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

// Vote on a poll
router.put('/vote/:pollId', protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });

    const optionIndex = poll.options.findIndex(o => o.text === req.body.option);
    if (optionIndex === -1) return res.status(400).json({ msg: 'Option not found' });

    poll.options[optionIndex].votes += 1;
    await poll.save();
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
