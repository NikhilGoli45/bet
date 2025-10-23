import React, { useState } from 'react';
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
  TextInput,
  Button,
  List,
  Divider,
  Chip,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/useStore';

const CreateGameScreen = () => {
  const navigation = useNavigation();
  const {
    currentUser,
    loading,
    error,
    createGroup,
  } = useStore();

  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({ description: '', points: '', vetoThreshold: '' });

  // Mock users for selection
  const availableUsers = [
    { id: '1', name: 'Alex' },
    { id: '2', name: 'Jordan' },
    { id: '3', name: 'Sam' },
    { id: '4', name: 'Taylor' },
    { id: '5', name: 'Casey' },
  ];

  const handleMemberToggle = (user) => {
    if (selectedMembers.find(m => m.id === user.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== user.id));
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleAddRule = () => {
    if (!newRule.description || !newRule.points || !newRule.vetoThreshold) {
      Alert.alert('Invalid Rule', 'Please fill in all rule fields');
      return;
    }

    const rule = {
      id: Date.now().toString(),
      description: newRule.description,
      points: parseInt(newRule.points),
      vetoThreshold: parseInt(newRule.vetoThreshold),
    };

    setRules([...rules, rule]);
    setNewRule({ description: '', points: '', vetoThreshold: '' });
  };

  const handleRemoveRule = (ruleId) => {
    setRules(rules.filter(r => r.id !== ruleId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Invalid Group', 'Please enter a group name');
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert('Invalid Group', 'Please select at least one member');
      return;
    }

    if (rules.length === 0) {
      Alert.alert('Invalid Group', 'Please add at least one rule');
      return;
    }

    const groupData = {
      name: groupName,
      members: selectedMembers.map(m => m.id),
      rules: rules.map(r => r.id),
    };

    console.log('Creating group with data:', groupData);
    const newGroup = await createGroup(groupData);
    console.log('Create group result:', newGroup);
    
    if (newGroup) {
      Alert.alert('Success', 'Group created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } else {
      Alert.alert('Error', 'Failed to create group. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Create New Group</Title>
            <TextInput
              label="Group Name"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Select Members</Title>
            <Paragraph>Choose who can participate in this group:</Paragraph>
            {availableUsers.map((user) => (
              <Chip
                key={user.id}
                selected={selectedMembers.find(m => m.id === user.id)}
                onPress={() => handleMemberToggle(user)}
                style={styles.chip}
              >
                {user.name}
              </Chip>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Add Rules</Title>
            <Paragraph>Define actions and their point values:</Paragraph>
            
            <TextInput
              label="Rule Description"
              value={newRule.description}
              onChangeText={(text) => setNewRule({ ...newRule, description: text })}
              style={styles.input}
            />
            
            <TextInput
              label="Points"
              value={newRule.points}
              onChangeText={(text) => setNewRule({ ...newRule, points: text })}
              keyboardType="numeric"
              style={styles.input}
            />
            
            <TextInput
              label="Veto Threshold"
              value={newRule.vetoThreshold}
              onChangeText={(text) => setNewRule({ ...newRule, vetoThreshold: text })}
              keyboardType="numeric"
              style={styles.input}
            />
            
            <Button mode="outlined" onPress={handleAddRule} style={styles.addButton}>
              Add Rule
            </Button>

            {rules.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <Title>Current Rules</Title>
                {rules.map((rule) => (
                  <List.Item
                    key={rule.id}
                    title={rule.description}
                    description={`${rule.points} points, ${rule.vetoThreshold} vetoes needed`}
                    right={(props) => (
                      <Button
                        mode="text"
                        onPress={() => handleRemoveRule(rule.id)}
                        textColor="#c62828"
                      >
                        Remove
                      </Button>
                    )}
                  />
                ))}
              </>
            )}
          </Card.Content>
        </Card>

        {error && (
          <Card style={[styles.card, styles.errorCard]}>
            <Card.Content>
              <Text style={styles.errorText}>Error: {error}</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleCreateGroup}
        loading={loading}
        disabled={loading}
        style={styles.createButton}
      >
        Create Group
      </Button>
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
  input: {
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  addButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  errorCard: {
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
  },
  createButton: {
    margin: 16,
  },
});

export default CreateGameScreen;
