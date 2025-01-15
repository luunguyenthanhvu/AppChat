import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns'; // Thư viện để định dạng thời gian
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm AsyncStorage
import { BACKEND_URL_HTTP } from '../config/config';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import biến cấu hình từ config
import { useTheme } from '../context/ThemeContext';
import useChat from '../websocket/UseChat.ts';


const ChatListScreen: React.FC = ({ navigation }) => {
    const { theme } = useTheme(); // Lấy theme từ ThemeContext
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFriend, setSearchFriend] = useState('');
    const [emailUser, setEmailUser] = useState(''); // State để lưu email người dùng
    const [token, setToken] = useState('');

    const {
            newListChat,
            messages,
            serverMessage,
            userInfo,
            sendMessage,
            updateProfile,
            updatePass,
            updateChatList,
            updateChatListWithId,
    } = useChat();

    useEffect(() => {
        console.log("Raw newListChat received:", newListChat);

        try {
            // Kiểm tra nếu `newListChat` là chuỗi JSON
            const parsedData = typeof newListChat === "string" ? JSON.parse(newListChat) : newListChat;
            const uniqueMessages = parsedData.filter(
              (value, index, self) =>
                index ===
                self.findIndex(
                  (t) => t.userId === value.userId && t.timestamp === value.timestamp
                )
            );
            if (Array.isArray(uniqueMessages)) {
                setChats(uniqueMessages);
            } else {
                console.error("Parsed newListChat is not an array:", uniqueMessages);
                setChats([]); // Nếu không phải mảng, đặt giá trị mặc định là mảng rỗng
            }
        } catch (error) {
            console.error("Error parsing newListChat:", error);
            setChats([]); // Xử lý khi gặp lỗi
        }
    }, [newListChat]);

    const getUserEmail = async () => {
        try {
            const userEmail = await AsyncStorage.getItem('email');
            const tokenUser = await AsyncStorage.getItem('token');
            if (userEmail) {
                setEmailUser(userEmail);
                setToken(tokenUser);
            } else {
                console.error('Không tìm thấy email trong AsyncStorage');
            }
        } catch (error) {
            console.error('Lỗi khi lấy email:', error);
        }
    };

    useEffect(() => {
        getUserEmail();
    }, []);

    useEffect(() => {
        if (!emailUser) return; // Nếu chưa có email thì không gọi API

        const fetchChatList = async () => {
            try {
                const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/chat/friend-chat-list`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        email: emailUser,
                        username: searchFriend
                    }
                });
                const uniqueMessages = response.data.filter(
                  (value, index, self) =>
                    index ===
                    self.findIndex(
                      (t) => t.userId === value.userId && t.timestamp === value.timestamp
                    )
                );

                setChats(uniqueMessages);
                console.log(uniqueMessages);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chat:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatList();
    }, [emailUser]);

    const filteredChats = chats.filter(chat =>
      chat.userName.toLowerCase().includes(searchFriend.toLowerCase())
    );

    // Hàm định dạng thời gian để hiển thị
    const formatTimestamp = (timestamp: string) => {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };

    // Hàm lấy dòng đầu tiên của tin nhắn
    const getFirstLineOfMessage = (messageContent: string) => {
        const firstLine = messageContent.split('\n')[0];
        return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
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
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.headerColor }]}>
              {/* Icon menu bên trái */}
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('ProfileScreen')} // Điều hướng tới ProfileScreen
              >
                  <Icon name="bars" size={24} color={theme.textColor} />
              </TouchableOpacity>

              {/* Tiêu đề đoạn chat */}
              <Text style={[styles.headerText, { color: theme.textColor }]}>Messages</Text>

              {/* Icon chỉnh sửa bên phải */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('CreateGroupScreen')} // Chuyển đến CreateGroupScreen
              >
                  <Icon name="pencil" size={24} color={theme.textColor} />
              </TouchableOpacity>

          </View>

          {/* Search Bar */}
          <View style={[styles.searchBar, { borderColor: theme.borderColor }]}>
              <TextInput
                style={[styles.searchInput, { color: theme.textColor }]}
                placeholder="Search"
                placeholderTextColor={theme.placeholderColor}
                value={searchFriend}
                onChangeText={(text) => setSearchFriend(text)}
              />
          </View>

          {/* Danh sách Chat */}
          <FlatList
            data={filteredChats}
            keyExtractor={item => item.userId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.chatItem, { borderBottomColor: theme.borderColor }]}
                onPress={() => navigation.navigate('ChatScreen', { chattingWith: item, scrollToBottomOnOpen: true })}
              >
                  <Avatar.Image size={56} source={{ uri: item.img }} />
                  <View style={styles.chatTextContainer}>
                      <Text style={[styles.userName, { color: theme.textColor }]}>{item.userName}</Text>
                      <Text style={[styles.lastMessage, { color: theme.placeholderColor }]}>
                          {item.messageContent ? getFirstLineOfMessage(item.messageContent) : `No message with ${item.userName}`}
                      </Text>
                      <Text style={[styles.timestamp, { color: theme.placeholderColor }]}>{formatTimestamp(item.timestamp)}</Text>
                  </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
                <View style={styles.noFriendsMessage}>
                    <Text style={{ color: theme.textColor }}>You don't have any friends named like this</Text>
                    <Text style={{ color: theme.textColor }}>Let's go and add some new friends</Text>
                </View>
            }
          />
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    menuButton: {
        position: 'relative',
        padding: 5,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    editButton: {
        padding: 5,
        borderRadius: 15,
    },
    searchBar: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 10,
    },
    searchInput: {
        fontSize: 16,
    },
    chatItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
    },
    chatTextContainer: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 14,
    },
    timestamp: {
        fontSize: 12,
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFriendsMessage: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
});

export default ChatListScreen;
