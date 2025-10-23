# Bet. - Social Gamification App MVP

A customizable social gamification app that lets groups create point-based games to motivate each other through friendly competition.

## 🏗️ Project Structure

```
bet/
├── client/           # React Native frontend (Expo)
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── store/
│   │   └── services/
│   ├── App.js
│   ├── package.json
│   └── README.md
│
├── server/           # Node.js backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── socket/
│   ├── index.js
│   ├── db.json (mock data)
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### 1. Start the Backend
```bash
cd server
npm install
npm run dev
```
The server will run on `http://localhost:3000`

### 2. Start the Frontend
```bash
cd client
npm install
npx expo start
```
Follow the Expo instructions to run on your device or simulator.

## 🎮 Core Features

- **Game Setup**: Create groups, add members, and define rules with points
- **Event Submission**: Log actions and earn points
- **Veto System**: Members can veto events if threshold is met
- **Real-time Leaderboard**: Live updates of scores and rankings
- **Mock Users**: No authentication required for demo purposes

## 🛠️ Tech Stack

**Frontend:**
- React Native (Expo)
- React Navigation
- React Native Paper (UI components)
- Zustand (state management)
- Axios (API calls)
- Socket.io-client (real-time updates)

**Backend:**
- Node.js + Express
- Socket.io (real-time communication)
- LowDB (temporary JSON DB)
- CORS, Nodemon for development

## 📱 Screens

- **Home**: Choose or create a group
- **Create Game**: Add rules and points
- **Submit Event**: Log new actions
- **Veto**: Review and veto recent events
- **Leaderboard**: View rankings and scores

## 🔌 API Endpoints

**REST (Express):**
- `POST /groups/create` - Create a new group
- `POST /rules/add` - Add a rule to a group
- `POST /events/submit` - Submit a new event
- `POST /events/veto` - Veto an event
- `GET /leaderboard/:groupId` - Get group leaderboard

**Socket.io Events:**
- `event_added` - New event submitted
- `veto_update` - Event veto status changed
- `leaderboard_update` - Leaderboard scores updated

## 🧪 Testing the App

1. Start both backend and frontend
2. Create a new group with some rules
3. Add mock users to the group
4. Submit events and watch real-time updates
5. Test the veto system
6. Check leaderboard updates

## 🚀 Future Enhancements

- MongoDB integration (see server/README.md)
- User authentication
- Push notifications
- Advanced game mechanics
- Social features

## 📚 Documentation

- [Client Documentation](./client/README.md)
- [Server Documentation](./server/README.md)

## 👥 For EECS 497 Class

This project emphasizes usability and user-centered design. The app is designed to be intuitive and engaging for group motivation and friendly competition.