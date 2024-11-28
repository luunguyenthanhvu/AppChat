import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns'; // Thư viện để định dạng thời gian
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm AsyncStorage
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { BACKEND_URL_HTTP } from '../config/config'; // Import biến cấu hình từ config

const ChatListScreen: React.FC = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFriend, setSearchFriend] = useState('');
    const [emailUser, setEmailUser] = useState(''); // State để lưu email người dùng

    const getUserEmail = async () => {
        try {
            const userEmail = await AsyncStorage.getItem('email');
            if (userEmail) {
                setEmailUser(userEmail);
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
                const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/chat/user-chat-list`, { params: { email: emailUser } });
                setChats(response.data);
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
        // Chia tin nhắn thành các dòng (người dùng có thể sử dụng dấu ngắt dòng '\n')
        const firstLine = messageContent.split('\n')[0];
        // Nếu dòng quá dài, cắt và thêm "..."
        return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
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
            {/* Header */}
            <View style={styles.header}>
                {/* Icon menu bên trái */}
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('ProfileScreen')} // Điều hướng tới ProfileScreen
                >
                    <Icon name="bars" size={24} color="#000" />
                </TouchableOpacity>

                {/* Tiêu đề đoạn chat */}
                <Text style={styles.headerText}>Đoạn chat</Text>

                {/* Icon chỉnh sửa bên phải */}
                <TouchableOpacity style={styles.editButton}>
                    <Icon name="pencil" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#888"
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
                        style={styles.chatItem}
                        onPress={() => navigation.navigate('ChatScreen', { chattingWith: item })}
                    >
                        <Avatar.Image size={56} source={{ uri: item.img }} />
                        <View style={styles.chatTextContainer}>
                            <Text style={styles.userName}>{item.userName}</Text>
                            <Text style={styles.lastMessage}>
                                {item.messageContent ? getFirstLineOfMessage(item.messageContent) : `No message with ${item.userName}`}
                            </Text>
                            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.noFriendsMessage}>
                        <Text>You don't have any friends named like this</Text>
                        <Text>Let's go and add some new friend</Text>
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
        borderColor: '#555',
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
        borderBottomColor: '#555',
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
        color: '#777'
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
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
    }
});

export default ChatListScreen;
