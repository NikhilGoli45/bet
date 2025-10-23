const express = require('express');
const router = express.Router();

// Get leaderboard for a group
router.get('/:groupId', async (req, res) => {
  try {
    const readDB = req.app.locals.readDB;
    const db = readDB();
    
    const leaderboard = db.leaderboards.find(l => l.groupId === req.params.groupId);
    if (!leaderboard) {
      return res.status(404).json({ success: false, error: 'Leaderboard not found' });
    }
    
    // Get user names for the scores
    const scoresWithNames = leaderboard.scores.map(score => {
      const user = db.users.find(u => u.id === score.userId);
      return {
        ...score,
        userName: user ? user.name : 'Unknown'
      };
    });
    
    // Sort by total points (descending)
    scoresWithNames.sort((a, b) => b.totalPoints - a.totalPoints);
    
    res.json({ success: true, leaderboard: scoresWithNames });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all leaderboards
router.get('/', async (req, res) => {
  try {
    const readDB = req.app.locals.readDB;
    const db = readDB();
    
    const leaderboards = db.leaderboards.map(leaderboard => {
      const scoresWithNames = leaderboard.scores.map(score => {
        const user = db.users.find(u => u.id === score.userId);
        return {
          ...score,
          userName: user ? user.name : 'Unknown'
        };
      });
      
      return {
        ...leaderboard,
        scores: scoresWithNames.sort((a, b) => b.totalPoints - a.totalPoints)
      };
    });
    
    res.json({ success: true, leaderboards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
