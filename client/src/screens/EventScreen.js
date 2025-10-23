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

const EventScreen = () => {
  const navigation = useNavigation();
  const {
    currentUser,
    currentGroup,
    events,
    loading,
    error,
    loadEvents,
    submitEvent,
  } = useStore();

  const [selectedRule, setSelectedRule] = useState(null);

  // Mock rules for demo
  const mockRules = [
    { id: '1', description: 'Run 1 mile', points: 10, vetoThreshold: 2 },
    { id: '2', description: 'Do 50 push-ups', points: 15, vetoThreshold: 1 },
    { id: '3', description: 'Meditate for 10 minutes', points: 5, vetoThreshold: 3 },
  ];

  useEffect(() => {
    if (currentGroup) {
      loadEvents(currentGroup.id);
    }
  }, [currentGroup]);

  const handleRuleSelect = (rule) => {
    setSelectedRule(rule);
  };

  const handleSubmitEvent = async () => {
    if (!selectedRule) {
      Alert.alert('No Rule Selected', 'Please select a rule to submit an event');
      return;
    }

    if (!currentUser || !currentGroup) {
      Alert.alert('Error', 'User or group not found');
      return;
    }

    const eventData = {
      userId: currentUser.id,
      ruleId: selectedRule.id,
      groupId: currentGroup.id,
    };

    const newEvent = await submitEvent(eventData);
    if (newEvent) {
      Alert.alert('Success', `Event submitted! You earned ${selectedRule.points} points.`);
      setSelectedRule(null);
    }
  };

  const getRecentEvents = () => {
    return events
      .filter(e => e.groupId === currentGroup?.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
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
            <Title>Submit Event</Title>
            <Paragraph>
              Select a rule and submit an event to earn points!
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Available Rules</Title>
            <Paragraph>Choose what you accomplished:</Paragraph>
            {mockRules.map((rule) => (
              <Chip
                key={rule.id}
                selected={selectedRule?.id === rule.id}
                onPress={() => handleRuleSelect(rule)}
                style={styles.chip}
              >
                {rule.description} (+{rule.points} pts)
              </Chip>
            ))}
            
            {selectedRule && (
              <Button
                mode="contained"
                onPress={handleSubmitEvent}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
              >
                Submit Event
              </Button>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Events</Title>
            {getRecentEvents().length === 0 ? (
              <Paragraph>No events yet. Be the first to submit one!</Paragraph>
            ) : (
              getRecentEvents().map((event) => (
                <List.Item
                  key={event.id}
                  title={`+${event.points} points`}
                  description={`${event.userId} - ${new Date(event.createdAt).toLocaleString()}`}
                  left={(props) => <List.Icon {...props} icon="trophy" />}
                />
              ))
            )}
          </Card.Content>
        </Card>

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Veto')}
            style={styles.navButton}
          >
            Veto Events
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
  chip: {
    margin: 4,
  },
  submitButton: {
    marginTop: 16,
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

export default EventScreen;
