import React, { useEffect, useState } from 'react';
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
  FAB,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/useStore';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {
    groups,
    loading,
    error,
    loadGroups,
    setCurrentGroup,
    setCurrentUser,
  } = useStore();

  const [selectedUser, setSelectedUser] = useState(null);

  // Mock users for demo
  const mockUsers = [
    { id: '1', name: 'Alex' },
    { id: '2', name: 'Jordan' },
    { id: '3', name: 'Sam' },
    { id: '4', name: 'Taylor' },
    { id: '5', name: 'Casey' },
  ];

  useEffect(() => {
    loadGroups();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setCurrentUser(user);
  };

  const handleGroupSelect = (group) => {
    if (!selectedUser) {
      Alert.alert('Select User', 'Please select a user first');
      return;
    }
    setCurrentGroup(group);
    navigation.navigate('Event');
  };

  const handleCreateGroup = () => {
    if (!selectedUser) {
      Alert.alert('Select User', 'Please select a user first');
      return;
    }
    navigation.navigate('CreateGame');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Welcome to Bet.</Title>
            <Paragraph>
              Choose your user and join a group to start competing!
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Select User</Title>
            <Paragraph>Choose your identity for this session:</Paragraph>
            {mockUsers.map((user) => (
              <Button
                key={user.id}
                mode={selectedUser?.id === user.id ? 'contained' : 'outlined'}
                onPress={() => handleUserSelect(user)}
                style={styles.userButton}
              >
                {user.name}
              </Button>
            ))}
          </Card.Content>
        </Card>

        {selectedUser && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Available Groups</Title>
              {groups.length === 0 ? (
                <Paragraph>No groups available. Create one to get started!</Paragraph>
              ) : (
                groups.map((group) => (
                  <List.Item
                    key={group.id}
                    title={group.name}
                    description={`${group.members.length} members`}
                    right={(props) => (
                      <Button
                        mode="contained"
                        onPress={() => handleGroupSelect(group)}
                      >
                        Join
                      </Button>
                    )}
                  />
                ))
              )}
            </Card.Content>
          </Card>
        )}

        {error && (
          <Card style={[styles.card, styles.errorCard]}>
            <Card.Content>
              <Text style={styles.errorText}>Error: {error}</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Create Group"
        onPress={handleCreateGroup}
        disabled={!selectedUser}
      />
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  userButton: {
    marginVertical: 4,
  },
  errorCard: {
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
