# Bet. Server - Backend Documentation

Node.js backend server for the Bet. social gamification app with Express, Socket.io, and LowDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup
```bash
cd server
npm install
npm run dev
```

The server will run on `http://localhost:3000`

## 🏗️ Project Structure

```
server/
├── routes/
│   ├── groups.js      # Group management endpoints
│   ├── events.js      # Event submission and veto endpoints
│   └── leaderboard.js # Leaderboard endpoints
├── index.js           # Main server file
├── db.json           # LowDB database file (auto-generated)
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - Real-time communication
- **LowDB** - Lightweight JSON database
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## 🔌 API Endpoints

### Groups
- `POST /groups/create` - Create a new group
- `GET /groups` - Get all groups
- `GET /groups/:id` - Get group by ID
- `POST /groups/:id/members` - Add members to group

### Events
- `POST /events/submit` - Submit a new event
- `POST /events/veto` - Veto an event
- `GET /events/group/:groupId` - Get events for a group
- `GET /events/recent/:groupId` - Get recent events for veto screen

### Leaderboard
- `GET /leaderboard/:groupId` - Get leaderboard for a group
- `GET /leaderboard` - Get all leaderboards

## 🔌 Socket.io Events

### Server → Client
- `event_added` - New event submitted
- `veto_update` - Event veto status changed
- `leaderboard_update` - Leaderboard scores updated

### Client → Server
- `join_group` - Join a group room for real-time updates
- `disconnect` - User disconnected

## 💾 Data Models

### User
```json
{
  "id": "string",
  "name": "string"
}
```

### Group
```json
{
  "id": "string",
  "name": "string",
  "members": ["userId1", "userId2"],
  "rules": ["ruleId1", "ruleId2"]
}
```

### Rule
```json
{
  "id": "string",
  "description": "string",
  "points": "number",
  "vetoThreshold": "number"
}
```

### Event
```json
{
  "id": "string",
  "userId": "string",
  "ruleId": "string",
  "groupId": "string",
  "points": "number",
  "votes": ["userId1", "userId2"],
  "approved": "boolean",
  "createdAt": "string"
}
```

### Leaderboard
```json
{
  "groupId": "string",
  "scores": [
    {
      "userId": "string",
      "totalPoints": "number",
      "userName": "string"
    }
  ]
}
```

## 🧪 Mock Data

The server initializes with sample data:
- 5 mock users (Alex, Jordan, Sam, Taylor, Casey)
- 1 sample group "Fitness Challenge"
- 3 sample rules with different points and veto thresholds
- Empty leaderboard ready for events

## 🔄 MongoDB Migration

### Step 1: Install Dependencies
```bash
npm install mongoose
```

### Step 2: Create Models
Create `models/` directory with Mongoose schemas:

```javascript
// models/User.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
module.exports = mongoose.model('User', userSchema);
```

### Step 3: Update Database Connection
Replace LowDB initialization in `index.js`:

```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bet');
```

### Step 4: Replace LowDB Operations
Update all database operations to use Mongoose:

```javascript
// Before (LowDB)
await db.read();
db.data.users.push(newUser);
await db.write();

// After (Mongoose)
const user = new User(newUser);
await user.save();
```

### Step 5: Update Environment Variables
Add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bet
```

### Step 6: Verify Socket.io Events
Ensure all socket events still emit correctly after migration.

## 🚀 Deployment

### Environment Variables
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string (for production)

### Production Build
```bash
npm start
```

## 🧪 Testing

Test the API endpoints using tools like Postman or curl:

```bash
# Create a group
curl -X POST http://localhost:3000/groups/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Group", "members": ["1", "2"]}'

# Submit an event
curl -X POST http://localhost:3000/events/submit \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "ruleId": "1", "groupId": "1"}'
```

## 🔧 Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Database
- LowDB file: `db.json` (auto-generated)
- Backup recommended before major changes
- Reset: Delete `db.json` and restart server

## 🐛 Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT environment variable
2. **CORS errors**: Check client URL in CORS configuration
3. **Socket.io connection issues**: Verify client is connecting to correct URL
4. **Database errors**: Check `db.json` file permissions

### Logs
Server logs include:
- User connections/disconnections
- Socket.io room joins
- Database operations
- Error messages
