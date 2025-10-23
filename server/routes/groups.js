const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Create a new group
router.post('/create', async (req, res) => {
  try {
    const { name, members, rules } = req.body;
    const readDB = req.app.locals.readDB;
    const writeDB = req.app.locals.writeDB;
    const io = req.app.locals.io;
    
    const db = readDB();
    
    const newGroup = {
      id: uuidv4(),
      name,
      members: members || [],
      rules: rules || []
    };
    
    db.groups.push(newGroup);
    
    // Initialize leaderboard for the group
    const leaderboard = {
      groupId: newGroup.id,
      scores: members.map(userId => ({ userId, totalPoints: 0 }))
    };
    db.leaderboards.push(leaderboard);
    
    writeDB(db);
    
    res.json({ success: true, group: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all groups
router.get('/', async (req, res) => {
  try {
    const readDB = req.app.locals.readDB;
    const db = readDB();
    res.json({ success: true, groups: db.groups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get group by ID
router.get('/:id', async (req, res) => {
  try {
    const readDB = req.app.locals.readDB;
    const db = readDB();
    
    const group = db.groups.find(g => g.id === req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }
    
    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add members to group
router.post('/:id/members', async (req, res) => {
  try {
    const { members } = req.body;
    const readDB = req.app.locals.readDB;
    const writeDB = req.app.locals.writeDB;
    
    const db = readDB();
    
    const group = db.groups.find(g => g.id === req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }
    
    group.members = [...new Set([...group.members, ...members])];
    
    // Update leaderboard
    const leaderboard = db.leaderboards.find(l => l.groupId === req.params.id);
    if (leaderboard) {
      members.forEach(userId => {
        if (!leaderboard.scores.find(s => s.userId === userId)) {
          leaderboard.scores.push({ userId, totalPoints: 0 });
        }
      });
    }
    
    writeDB(db);
    
    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
