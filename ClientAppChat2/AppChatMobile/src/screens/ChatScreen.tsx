import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../config/config'; // Import URL from config
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons correctly
import { useTheme } from '../context/ThemeContext'; // Import ThemeContext

const ChatScreen: React.FC = ({ route, navigation }) => {
    const { theme } = useTheme(); // Lấy theme từ ThemeContext
    const { chattingWith } = route.params; // User you're chatting with
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [emailUser, setEmailUser] = useState(''); // State for storing the logged-in user's email

    // Get email from AsyncStorage when the screen is loaded
    useEffect(() => {
        const loadEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setEmailUser(storedEmail);
                } else {
                    console.error('No email found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error loading email:', error);
            }
        };
        loadEmail();
    }, []);

    // Fetch messages from the API
    useEffect(() => {
        if (!emailUser) return;  // Do not call the API if there's no email

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/chat/messages/${emailUser}/${chattingWith.userId}`);
                const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setMessages(sortedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [chattingWith, emailUser]);

    // Send a new message
    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const newMsg = {
                content: newMessage,
                senderId: emailUser, // Replace with valid sender ID
                receiverId: chattingWith.userId,
                timestamp: new Date().toISOString(),
                isImage: false,
            };

            // Immediately update the message in the UI
            setMessages(prevMessages => [...prevMessages, newMsg]);

            setNewMessage('');
        }
    };

    // Navigate to CallScreen on call button press
    const handleCallVoice = () => {
        navigation.navigate('CallScreen', {
            userID: chattingWith.userId,
            userName: chattingWith.userName,
            callType: 'audio', // Gọi âm thanh
        });
    };

    const handleCallVideo = () => {
        navigation.navigate('CallScreen', {
            userID: chattingWith.userId,
            userName: chattingWith.userName,
            callType: 'video', // Gọi video
        });
    };

    if (loading) {
        return (
          <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
              <ActivityIndicator size="large" color={theme.primaryColor} />
          </View>
        );
    }

    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          <View style={[styles.header, { backgroundColor: theme.headerColor }]}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Ionicons name="arrow-back-outline" size={24} color={theme.textColor} />
              </TouchableOpacity>
              <Avatar.Image size={40} source={{ uri: chattingWith.img }} />
              <Text style={[styles.userName, { color: theme.textColor }]}>{chattingWith.userName}</Text>

              {/* Icons on the right */}
              <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={handleCallVoice}>
                      <Ionicons name="call-outline" size={24} color={theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 15 }} onPress={handleCallVideo}>
                      <Ionicons name="videocam-outline" size={24} color={theme.iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.navigate('UserInfoScreen', { user: chattingWith })}>
                      <Ionicons name="information-circle-outline" size={24} color={theme.iconColor} />
                  </TouchableOpacity>
              </View>
          </View>

          {/* Message list */}
          <FlatList
            data={messages}
            keyExtractor={item => item.messageId?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.messageWrapper}>
                  {/* Sender's avatar */}
                  <Avatar.Image
                    size={40}
                    source={{ uri: item.senderId === emailUser ? 'your-avatar-url' : chattingWith.img }}
                    style={[styles.avatar, item.senderId === emailUser ? styles.myAvatar : styles.theirAvatar]}
                  />

                  {/* Message content */}
                  <View
                    style={[
                        styles.messageContainer,
                        item.senderId === emailUser ? styles.myMessage : styles.theirMessage,
                        { backgroundColor: item.senderId === emailUser ? theme.primaryColor : theme.secondaryBackgroundColor },
                    ]}
                  >
                      <Text style={[styles.messageText, { color: item.senderId === emailUser ? theme.lightText : theme.textColor }]}>
                          {item.content}
                      </Text>
                      <Text style={[styles.timestamp, { color: theme.placeholderColor }]}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                      </Text>
                  </View>
              </View>
            )}
          />

          {/* Message input */}
          <View style={[styles.inputContainer, { backgroundColor: theme.headerColor }]}>
              {/* Attach image icon */}
              <TouchableOpacity>
                  <Ionicons name="image-outline" size={24} color={theme.iconColor} />
              </TouchableOpacity>

              {/* Microphone icon */}
              <TouchableOpacity>
                  <Ionicons name="mic-outline" size={24} color={theme.iconColor} />
              </TouchableOpacity>

              <TextInput
                style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
                placeholder="Enter message..."
                placeholderTextColor={theme.placeholderColor}
                value={newMessage}
                onChangeText={setNewMessage}
              />

              {/* Send message button */}
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Ionicons name="send" size={24} color={theme.iconColor} />
              </TouchableOpacity>
          </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        flex: 1,
    },
    iconContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    messageWrapper: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    avatar: {
        marginRight: 10,
    },
    messageContainer: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
    },
    theirMessage: {
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginHorizontal: 10,
    },
    sendButton: {
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
