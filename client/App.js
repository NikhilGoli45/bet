import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import CreateGameScreen from './src/screens/CreateGameScreen';
import EventScreen from './src/screens/EventScreen';
import VetoScreen from './src/screens/VetoScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

// Import theme
import { theme } from './src/theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Bet. - Choose Group' }}
          />
          <Stack.Screen 
            name="CreateGame" 
            component={CreateGameScreen} 
            options={{ title: 'Create Game' }}
          />
          <Stack.Screen 
            name="Event" 
            component={EventScreen} 
            options={{ title: 'Submit Event' }}
          />
          <Stack.Screen 
            name="Veto" 
            component={VetoScreen} 
            options={{ title: 'Veto Events' }}
          />
          <Stack.Screen 
            name="Leaderboard" 
            component={LeaderboardScreen} 
            options={{ title: 'Leaderboard' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
