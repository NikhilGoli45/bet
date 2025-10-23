import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  List,
  Divider,
  ActivityIndicator,
  Text,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/useStore';

const VetoScreen = () => {
  const navigation = useNavigation();
  const {
    currentUser,
    currentGroup,
    events,
    loading,
    error,
    loadEvents,
    vetoEvent,
  } = useStore();

  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    if (currentGroup) {
      loadEvents(currentGroup.id);
    }
  }, [currentGroup]);

  useEffect(() => {
    // Filter recent approved events
    const recent = events
      .filter(e => e.groupId === currentGroup?.id && e.approved)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    setRecentEvents(recent);
  }, [events, currentGroup]);

  const handleVetoEvent = async (event) => {
    if (!currentUser) {
      Alert.alert('Error', 'User not found');
      return;
    }

    Alert.alert(
      'Veto Event',
      `Are you sure you want to veto this event? This will remove ${event.points} points from the user.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Veto',
          style: 'destructive',
          onPress: async () => {
            const result = await vetoEvent(event.id, currentUser.id);
            if (result) {
              Alert.alert('Success', 'Event vetoed successfully!');
            }
          },
        },
      ]
    );
  };

  const getVetoCount = (event) => {
    return event.votes ? event.votes.length : 0;
  };

  const getVetoThreshold = (event) => {
    // Mock veto threshold based on points
    if (event.points >= 15) return 1;
    if (event.points >= 10) return 2;
    return 3;
  };

  const canVeto = (event) => {
    if (!currentUser) return false;
    if (event.userId === currentUser.id) return false; // Can't veto own events
    if (event.votes && event.votes.includes(currentUser.id)) return false; // Already voted
    return true;
  };

  if (!currentGroup) {
    return (
      <View style={styles.center}>
        <Text>No group selected</Text>
        <Button onPress={() => navigation.navigate('Home')}>
          Go to Home
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Veto Events</Title>
            <Paragraph>
              Review recent events and veto if you think they're invalid.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Events</Title>
            {recentEvents.length === 0 ? (
              <Paragraph>No recent events to review.</Paragraph>
            ) : (
              recentEvents.map((event) => (
                <List.Item
                  key={event.id}
                  title={`+${event.points} points`}
                  description={`User ${event.userId} - ${new Date(event.createdAt).toLocaleString()}`}
                  left={(props) => <List.Icon {...props} icon="trophy" />}
                  right={(props) => (
                    <View style={styles.eventActions}>
                      <Chip
                        mode="outlined"
                        style={styles.vetoChip}
                      >
                        {getVetoCount(event)}/{getVetoThreshold(event)} vetoes
                      </Chip>
                      {canVeto(event) && (
                        <Button
                          mode="outlined"
                          onPress={() => handleVetoEvent(event)}
                          style={styles.vetoButton}
                          textColor="#c62828"
                        >
                          Veto
                        </Button>
                      )}
                    </View>
                  )}
                />
              ))
            )}
          </Card.Content>
        </Card>

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Event')}
            style={styles.navButton}
          >
            Submit Event
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Leaderboard')}
            style={styles.navButton}
          >
            Leaderboard
          </Button>
        </View>

        {error && (
          <Card style={[styles.card, styles.errorCard]}>
            <Card.Content>
              <Text style={styles.errorText}>Error: {error}</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vetoChip: {
    marginRight: 8,
  },
  vetoButton: {
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  errorCard: {
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
  },
});

export default VetoScreen;
