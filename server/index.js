const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Import routes
const groupRoutes = require('./routes/groups');
const eventRoutes = require('./routes/events');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Simple file-based database
const dbPath = path.join(__dirname, 'db.json');

// Initialize database with mock data
function initializeDB() {
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      users: [
        { id: '1', name: 'Alex' },
        { id: '2', name: 'Jordan' },
        { id: '3', name: 'Sam' },
        { id: '4', name: 'Taylor' },
        { id: '5', name: 'Casey' }
      ],
      groups: [
        {
          id: '1',
          name: 'Fitness Challenge',
          members: ['1', '2', '3'],
          rules: ['1', '2', '3']
        }
      ],
      rules: [
        {
          id: '1',
          description: 'Run 1 mile',
          points: 10,
          vetoThreshold: 2
        },
        {
          id: '2',
          description: 'Do 50 push-ups',
          points: 15,
          vetoThreshold: 1
        },
        {
          id: '3',
          description: 'Meditate for 10 minutes',
          points: 5,
          vetoThreshold: 3
        }
      ],
      events: [],
      leaderboards: [
        {
          groupId: '1',
          scores: [
            { userId: '1', totalPoints: 0 },
            { userId: '2', totalPoints: 0 },
            { userId: '3', totalPoints: 0 }
          ]
        }
      ]
    };
    
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
}

// Database helper functions
function readDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], groups: [], rules: [], events: [], leaderboards: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bet. Server is running!', 
    endpoints: {
      groups: '/groups',
      events: '/events', 
      leaderboard: '/leaderboard'
    }
  });
});

app.use('/groups', groupRoutes);
app.use('/events', eventRoutes);
app.use('/leaderboard', leaderboardRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_group', (groupId) => {
    socket.join(`group_${groupId}`);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make db functions and io available to routes
app.locals.readDB = readDB;
app.locals.writeDB = writeDB;
app.locals.io = io;

const PORT = process.env.PORT || 3000;

// Start server
function startServer() {
  initializeDB();
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Socket.io server ready for connections`);
  });
}

startServer();
