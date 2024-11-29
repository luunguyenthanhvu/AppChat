import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../config/config'; // Import URL from config
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons correctly

const ChatScreen: React.FC = ({ route, navigation }) => {
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
                senderId: 12,  // Replace 12 with a valid value if needed
                receiverId: chattingWith.userId,
                timestamp: new Date().toISOString(),
                isImage: false
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
            callType: 'audio'  // Gọi âm thanh
        });
    };

    const handleCallVideo = () => {
        navigation.navigate('CallScreen', {
            userID: chattingWith.userId,
            userName: chattingWith.userName,
            callType: 'video'  // Gọi video
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e90ff" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color="#000" />
                </TouchableOpacity>
                <Avatar.Image size={40} source={{ uri: chattingWith.img }} />
                <Text style={styles.userName}>{chattingWith.userName}</Text>

                {/* Icons on the right */}
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={handleCallVoice}>
                        <Ionicons name="call-outline" size={24} color="orange" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={handleCallVideo}>
                        <Ionicons name="videocam-outline" size={24} color="orange" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.navigate('UserInfoScreen', { user: chattingWith })}>
                        <Ionicons name="information-circle-outline" size={24} color="orange" />
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
                            source={{ uri: item.senderId === 12 ? 'your-avatar-url' : chattingWith.img }}
                            style={[styles.avatar, item.senderId === 12 ? styles.myAvatar : styles.theirAvatar]}
                        />

                        {/* Message content */}
                        <View style={[styles.messageContainer, item.senderId === 12 ? styles.myMessage : styles.theirMessage]}>
                            <Text style={styles.messageText}>{item.content}</Text>
                            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                        </View>
                    </View>
                )}
            />

            {/* Message input */}
            <View style={styles.inputContainer}>
                {/* Attach image icon */}
                <TouchableOpacity>
                    <Ionicons name="image-outline" size={24} color="#1e90ff" />
                </TouchableOpacity>

                {/* Microphone icon */}
                <TouchableOpacity>
                    <Ionicons name="mic-outline" size={24} color="#1e90ff" />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Enter message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />

                {/* Send message button */}
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Ionicons name="send" size={24} color="#1e90ff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
        marginRight: 10,
    },
    messageWrapper: {
        flexDirection: 'row', // Make sure avatar and message are in one row
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    avatar: {
        marginRight: 10, // Space between avatar and message
    },
    myAvatar: {
        alignSelf: 'flex-end', // Avatar for the sender on the right
    },
    theirAvatar: {
        alignSelf: 'flex-start', // Avatar for the receiver on the left
    },
    messageContainer: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5ea',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0078fe',
        color: '#fff',
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 10,
        color: '#aaa',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginHorizontal: 10,
    },
    sendButton: {
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
