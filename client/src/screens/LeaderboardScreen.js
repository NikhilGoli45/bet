import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  List,
  Divider,
  ActivityIndicator,
  Text,
  Chip,
  Button,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/useStore';

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const {
    currentGroup,
    leaderboard,
    loading,
    error,
    loadLeaderboard,
  } = useStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentGroup) {
      loadLeaderboard(currentGroup.id);
    }
  }, [currentGroup]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (currentGroup) {
      await loadLeaderboard(currentGroup.id);
    }
    setRefreshing(false);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return 'trophy';
      case 1:
        return 'medal';
      case 2:
        return 'award';
      default:
        return 'numeric';
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return '#FFD700'; // Gold
      case 1:
        return '#C0C0C0'; // Silver
      case 2:
        return '#CD7F32'; // Bronze
      default:
        return '#666666';
    }
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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            <Title>Leaderboard</Title>
            <Paragraph>
              Current rankings for {currentGroup.name}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Rankings</Title>
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading leaderboard...</Text>
              </View>
            ) : leaderboard.length === 0 ? (
              <Paragraph>No scores yet. Submit some events to get started!</Paragraph>
            ) : (
              leaderboard.map((score, index) => (
                <List.Item
                  key={score.userId}
                  title={score.userName}
                  description={`${score.totalPoints} points`}
                  left={(props) => (
                    <View style={styles.rankContainer}>
                      <Text style={[styles.rankText, { color: getRankColor(index) }]}>
                        #{index + 1}
                      </Text>
                    </View>
                  )}
                  right={(props) => (
                    <Chip
                      mode="outlined"
                      style={[styles.scoreChip, { backgroundColor: getRankColor(index) + '20' }]}
                    >
                      {score.totalPoints} pts
                    </Chip>
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
            onPress={() => navigation.navigate('Veto')}
            style={styles.navButton}
          >
            Veto Events
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
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  rankContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreChip: {
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

export default LeaderboardScreen;
