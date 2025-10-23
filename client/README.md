# Bet. Client - React Native Frontend

React Native frontend for the Bet. social gamification app built with Expo, React Navigation, and React Native Paper.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio (for Android)

### Installation & Setup
```bash
cd client
npm install
npx expo start
```

Follow the Expo instructions to run on your device or simulator.

## 🏗️ Project Structure

```
client/
├── src/
│   ├── screens/           # App screens
│   │   ├── HomeScreen.js
│   │   ├── CreateGameScreen.js
│   │   ├── EventScreen.js
│   │   ├── VetoScreen.js
│   │   └── LeaderboardScreen.js
│   ├── store/             # State management
│   │   └── useStore.js
│   ├── services/          # API services
│   │   └── apiService.js
│   └── theme.js           # App theme
├── App.js                 # Main app component
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design components
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication

## 📱 Screens

### HomeScreen
- User selection (mock users)
- Group selection
- Create new group button

### CreateGameScreen
- Group name input
- Member selection
- Rule creation (description, points, veto threshold)
- Group creation

### EventScreen
- Rule selection
- Event submission
- Recent events display
- Navigation to other screens

### VetoScreen
- Recent events review
- Veto functionality
- Veto count display
- Navigation to other screens

### LeaderboardScreen
- Rankings display
- Score visualization
- Pull-to-refresh
- Navigation to other screens

## 🔄 State Management

The app uses Zustand for state management with the following structure:

```javascript
{
  currentUser: User,
  currentGroup: Group,
  groups: Group[],
  rules: Rule[],
  events: Event[],
  leaderboard: LeaderboardEntry[],
  socket: Socket,
  loading: boolean,
  error: string
}
```

### Key Actions
- `setCurrentUser(user)` - Set current user
- `setCurrentGroup(group)` - Set current group
- `loadGroups()` - Load all groups
- `createGroup(data)` - Create new group
- `submitEvent(data)` - Submit new event
- `vetoEvent(eventId, userId)` - Veto an event
- `loadLeaderboard(groupId)` - Load group leaderboard

## 🔌 API Integration

The app connects to the backend server at `http://localhost:3000` with the following endpoints:

### Groups
- `GET /groups` - Get all groups
- `POST /groups/create` - Create new group
- `GET /groups/:id` - Get group by ID
- `POST /groups/:id/members` - Add members to group

### Events
- `GET /events/group/:groupId` - Get group events
- `GET /events/recent/:groupId` - Get recent events
- `POST /events/submit` - Submit new event
- `POST /events/veto` - Veto an event

### Leaderboard
- `GET /leaderboard/:groupId` - Get group leaderboard

## 🔌 Socket.io Integration

Real-time updates are handled through Socket.io:

### Client → Server
- `join_group` - Join a group room for updates

### Server → Client
- `event_added` - New event submitted
- `veto_update` - Event veto status changed
- `leaderboard_update` - Leaderboard scores updated

## 🎨 UI Components

The app uses React Native Paper components:
- **Cards** - Content containers
- **Buttons** - Actions and navigation
- **TextInput** - Form inputs
- **List** - Data display
- **Chip** - Tags and selections
- **FAB** - Floating action button
- **ActivityIndicator** - Loading states

## 🧪 Mock Data

The app includes mock data for demonstration:
- **Users**: Alex, Jordan, Sam, Taylor, Casey
- **Rules**: Run 1 mile (10 pts), 50 push-ups (15 pts), Meditate 10 min (5 pts)
- **Sample Group**: Fitness Challenge

## 🚀 Development

### Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web

### Hot Reloading
The app supports hot reloading for fast development. Changes to components will automatically update the app.

### Debugging
- Use React Native Debugger for advanced debugging
- Console logs are available in the Expo CLI
- Network requests are logged in the API service

## 📱 Testing

### Manual Testing Flow
1. Start the backend server
2. Start the Expo development server
3. Select a user (Alex, Jordan, etc.)
4. Create a new group or join existing
5. Submit events and watch real-time updates
6. Test veto functionality
7. Check leaderboard updates

### Key Test Scenarios
- User selection and group joining
- Event submission and point earning
- Veto system functionality
- Real-time leaderboard updates
- Navigation between screens
- Error handling and loading states

## 🐛 Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Network errors**: Ensure backend server is running on port 3000
3. **Socket.io connection**: Check server URL and CORS settings
4. **Expo CLI issues**: Update to latest version with `npm install -g @expo/cli`

### Debug Tips
- Check console logs for API errors
- Verify network connectivity
- Ensure backend server is running
- Check Expo CLI version compatibility

## 🚀 Future Enhancements

- User authentication
- Push notifications
- Offline support
- Advanced animations
- Custom themes
- Social features
- Analytics integration
