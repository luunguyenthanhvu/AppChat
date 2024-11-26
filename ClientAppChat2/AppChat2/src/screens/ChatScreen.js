import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';  // Import các biểu tượng
import { BACKEND_URL_HTTP } from '../../config'; // Import biến cấu hình
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ChatScreen = ({ route, navigation }) => {
    const { chattingWith } = route.params; // Người đang chat với
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [connection, setConnection] = useState(null);
    const [emailUser, setEmailUser] = useState(''); // State cho email người dùng

    // Hàm lấy email từ AsyncStorage khi màn hình được render
    useEffect(() => {
        const loadEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setEmailUser(storedEmail);
                } else {
                    console.error('Không tìm thấy email trong AsyncStorage');
                }
            } catch (error) {
                console.error('Lỗi khi lấy email:', error);
            }
        };
        loadEmail();
    }, []);

    // Hàm lấy danh sách tin nhắn từ API
    useEffect(() => {
        if (!emailUser) return;  // Nếu chưa có email, không gọi API

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/chat/messages/${emailUser}/${chattingWith.userId}`);
                const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setMessages(sortedMessages);
            } catch (error) {
                console.error("Lỗi khi lấy tin nhắn:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [chattingWith, emailUser]);

    // Hàm tạo kết nối với SignalR hub
    useEffect(() => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`http://${BACKEND_URL_HTTP}/chatHub`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        hubConnection.start()
            .then(() => {
                console.log("Connected to SignalR hub");
                setConnection(hubConnection);
            })
            .catch(err => console.log("Error connecting to SignalR hub:", err));

        hubConnection.on("ReceiveMessage", (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            if (hubConnection) {
                hubConnection.stop();
            }
        };
    }, []);

    // Hàm gửi tin nhắn mới
    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const newMsg = {
                content: newMessage,
                senderId: 12,  // Bạn có thể thay thế 12 bằng một giá trị hợp lý khác nếu cần
                receiverId: chattingWith.userId,
                timestamp: new Date().toISOString(),
                isImage: false
            };

            // Cập nhật ngay tin nhắn vào danh sách trên giao diện
            setMessages(prevMessages => [...prevMessages, newMsg]);

            setNewMessage('');

            if (connection) {
                try {
                    await connection.invoke("SendMessage", {
                        senderId: 12,  // Bạn có thể thay thế 12 bằng một giá trị hợp lý khác nếu cần
                        receiverId: chattingWith.userId,
                        content: newMessage,
                        isImage: false,
                    });
                } catch (error) {
                    console.error("Lỗi khi gửi tin nhắn:", error);
                }
            }
        }
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

                {/* Thêm các biểu tượng ở góc phải */}
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <Ionicons name="call-outline" size={24} color="orange" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 15 }}>
                        <Ionicons name="videocam-outline" size={24} color="orange" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.navigate('UserInfoScreen', { user: chattingWith })}>
                        <Ionicons name="information-circle-outline" size={24} color="orange" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Danh sách tin nhắn */}
            <FlatList
                data={messages}
                keyExtractor={item => item.messageId?.toString() || Math.random().toString()}
                renderItem={({ item }) => (
                    <View style={[styles.messageContainer, item.senderId === 12 ? styles.myMessage : styles.theirMessage]}>
                        <Text style={styles.messageText}>{item.content}</Text>
                        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                    </View>
                )}
            />

            {/* Phần nhập tin nhắn */}
            <View style={styles.inputContainer}>
                {/* Biểu tượng đính kèm hình ảnh */}
                <TouchableOpacity>
                    <MaterialIcons name="insert-photo" size={24} color="#1e90ff" />
                </TouchableOpacity>

                {/* Biểu tượng chụp ảnh */}
                <TouchableOpacity>
                    <Ionicons name="camera-outline" size={24} color="#1e90ff" />
                </TouchableOpacity>

                {/* Biểu tượng microphone */}
                <TouchableOpacity>
                    <FontAwesome name="microphone" size={24} color="#1e90ff" />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity>
                    <FontAwesome name="smile-o" size={24} color="#1e90ff" />
                </TouchableOpacity>
                {/* Nút gửi tin nhắn */}
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
        flex: 1,  // Để tên user có thể co dãn nếu cần thiết
    },
    iconContainer: {
        flexDirection: 'row',
        marginLeft: 'auto', // Đẩy các biểu tượng về phía bên phải
        marginRight: 10,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
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
        alignItems: 'center', // Đảm bảo tất cả biểu tượng và input cùng thẳng hàng
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginHorizontal: 10,  // Thêm khoảng cách giữa biểu tượng và input
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
