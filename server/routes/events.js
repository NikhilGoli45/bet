const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Submit a new event
router.post('/submit', async (req, res) => {
  try {
    const { userId, ruleId, groupId } = req.body;
    const readDB = req.app.locals.readDB;
    const writeDB = req.app.locals.writeDB;
    const io = req.app.locals.io;
    
    const db = readDB();
    
    // Find the rule to get points
    const rule = db.rules.find(r => r.id === ruleId);
    if (!rule) {
      return res.status(404).json({ success: false, error: 'Rule not found' });
    }
    
    const newEvent = {
      id: uuidv4(),
      userId,
      ruleId,
      groupId,
      points: rule.points,
      votes: [],
      approved: true,
      createdAt: new Date().toISOString()
    };
    
    db.events.push(newEvent);
    
    // Update leaderboard
    const leaderboard = db.leaderboards.find(l => l.groupId === groupId);
    if (leaderboard) {
      const userScore = leaderboard.scores.find(s => s.userId === userId);
      if (userScore) {
        userScore.totalPoints += rule.points;
      }
    }
    
    writeDB(db);
    
    // Emit socket events
    io.to(`group_${groupId}`).emit('event_added', newEvent);
    io.to(`group_${groupId}`).emit('leaderboard_update', leaderboard);
    
    res.json({ success: true, event: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Veto an event
router.post('/veto', async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    const readDB = req.app.locals.readDB;
    const writeDB = req.app.locals.writeDB;
    const io = req.app.locals.io;
    
    const db = readDB();
    
    const event = db.events.find(e => e.id === eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    
    // Add vote if not already voted
    if (!event.votes.includes(userId)) {
      event.votes.push(userId);
    }
    
    // Find the rule to get veto threshold
    const rule = db.rules.find(r => r.id === event.ruleId);
    if (!rule) {
      return res.status(404).json({ success: false, error: 'Rule not found' });
    }
    
    // Check if veto threshold is met
    if (event.votes.length >= rule.vetoThreshold) {
      event.approved = false;
      
      // Update leaderboard (remove points)
      const leaderboard = db.leaderboards.find(l => l.groupId === event.groupId);
      if (leaderboard) {
        const userScore = leaderboard.scores.find(s => s.userId === event.userId);
        if (userScore) {
          userScore.totalPoints -= event.points;
        }
      }
      
      writeDB(db);
      
      // Emit socket events
      io.to(`group_${event.groupId}`).emit('veto_update', event);
      io.to(`group_${event.groupId}`).emit('leaderboard_update', leaderboard);
    }
    
    writeDB(db);
    
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get events for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    const readDB = req.app.locals.readDB;
    const db = readDB();
    
    const events = db.events.filter(e => e.groupId === req.params.groupId);
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recent events for veto screen
router.get('/recent/:groupId', async (req, res) => {
  try {
    const readDB = req.app.locals.readDB;
    const db = readDB();
    
    const recentEvents = db.events
      .filter(e => e.groupId === req.params.groupId && e.approved)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    
    res.json({ success: true, events: recentEvents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
