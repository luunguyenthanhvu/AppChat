import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, FlatList, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { RadioButton, List, Appbar, Button, Avatar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL_HTTP } from "../config/config";
import { useTheme } from '../context/ThemeContext';

const CreateGroupScreen = ({ navigation }) => {
  const { theme } = useTheme(); // Hook theme

  const [groupName, setGroupName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch email and contacts from API
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const storedEmail = await AsyncStorage.getItem('email');
        if (!storedEmail) {
          alert('Email not found. Please log in again.');
          return;
        }

        const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/friend-controller/contacts`, {
          params: { email: storedEmail },
        });

        const normalizedContacts = response.data.map((contact, index) => ({
          ...contact,
          id: contact.id || index.toString(), // Ensure every contact has an ID
        }));

        setContacts(normalizedContacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        alert('Unable to load contacts.');
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  // Filter contacts based on search input
  const filteredContacts = contacts.filter(contact =>
    contact.username?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle select/deselect contact
  const toggleContactSelection = (contact) => {
    const alreadySelected = selectedContacts.some(selected => selected.id === contact.id);
    if (alreadySelected) {
      setSelectedContacts(selectedContacts.filter(selected => selected.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  // Remove contact from selected list
  const removeSelectedContact = (contactId) => {
    setSelectedContacts(selectedContacts.filter(contact => contact.id !== contactId));
  };

  // Render each contact item
  const renderContactItem = ({ item }) => {
    const isSelected = selectedContacts.some(contact => contact.id === item.id);

    return (
      <List.Item
        title={item.username}
        left={() => <Avatar.Image size={40} source={{ uri: item.avatar }} />}
        right={() => (
          <RadioButton
            value={item.id}
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => toggleContactSelection(item)}
          />
        )}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Appbar */}
      <Appbar.Header style={{ backgroundColor: theme.headerColor }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={theme.iconColor} />
        <Appbar.Content title="New Group" titleStyle={{ color: theme.textColor }} />
        <Button onPress={() => alert('Group created!')} disabled={selectedContacts.length === 0} color={theme.primaryColor}
        >
          Create
        </Button>
      </Appbar.Header>

      {/* Group name input */}
      <TextInput
        style={[styles.groupNameInput, { backgroundColor: theme.secondaryBackgroundColor, color: theme.textColor, borderColor: theme.borderColor }]}
        placeholder="Group Name"
        placeholderTextColor={theme.placeholderColor}
        value={groupName}
        onChangeText={setGroupName}
      />

      {/* Search input */}
      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.secondaryBackgroundColor, color: theme.textColor, borderColor: theme.borderColor }]}
        placeholder="Search"
        placeholderTextColor={theme.placeholderColor}
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Selected contacts */}
      {selectedContacts.length > 0 && (
        <ScrollView
          style={[
            styles.selectedContactsContainer, { backgroundColor: theme.secondaryBackgroundColor, borderColor: theme.borderColor },
            {
              maxHeight: Math.min(selectedContacts.length * 60, 120), // Max 2 rows
              minHeight: 120, // Min height
            },
          ]}
          contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
        >
          {selectedContacts.map(contact => (
            <View key={contact.id} style={styles.selectedContactItem}>
              <Avatar.Image size={40} source={{ uri: contact.avatar }} />
              <Text style={[styles.selectedContactName, { color: theme.textColor }]}>{contact.username}</Text>
              <TouchableOpacity onPress={() => removeSelectedContact(contact.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Contacts list */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  groupNameInput: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  searchInput: {
    height: 40,
    marginVertical: 10,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  selectedContactsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedContactItem: {
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
    width: 60,
  },
  selectedContactName: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    maxWidth: 50,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4d4d',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CreateGroupScreen;
