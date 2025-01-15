import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../config/config'; // Import URL from config
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons correctly
import { useTheme } from '../context/ThemeContext';
import useChat from '../websocket/UseChat.ts'; // Import ThemeContext
import { launchImageLibrary } from 'react-native-image-picker';
const ChatScreen: React.FC = ({ route, navigation }) => {
    const { theme } = useTheme(); // Lấy theme từ ThemeContext
    const [chattingContent, setChattingContent] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [emailUser, setEmailUser] = useState(''); // State for storing the logged-in user's email
    const [imgUser, setImgUser] = useState(''); // State for storing the logged-in user's
    const { chattingWith, scrollToBottomOnOpen } = route.params; // Nhận tham số từ ChatListScreen

  const [imageMessage, setImageMessage] = useState('');
  const flatListRef = useRef<FlatList>(null); // Định nghĩa kiểu cụ thể cho ref
  const scrollToBottom = () => {
    if (flatListRef.current && chattingContent.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true }); // Cuộn xuống cuối danh sách
    }
  };

  // Cuộn xuống khi giao diện được mở nếu tham số scrollToBottomOnOpen = true
  useEffect(() => {
    if (scrollToBottomOnOpen) {
      scrollToBottom();
    }
  }, [scrollToBottomOnOpen]); // Lắng nghe tham số này

  // Cuộn xuống khi tin nhắn thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [chattingContent]);

    const {
        messages,
        sendMessage,
    } = useChat();
    // Get email from AsyncStorage when the screen is loaded
    useEffect(() => {
        const loadEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                const storeImg = await AsyncStorage.getItem('avatarUri');
                if (storedEmail) {
                    setEmailUser(storedEmail);
                    setImgUser(storeImg);
                } else {
                    console.error('No email found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error loading email:', error);
            }
        };
        loadEmail();
    }, []);

    useEffect(() => {
        if (chattingWith.userId === messages.receiverId || chattingWith.userId === messages.senderId) {
            const lastMessage = getLastTenMessages();
            const isDuplicate = lastMessage && lastMessage.messageId === messages.messageId;

            if (!isDuplicate) {
                setChattingContent(prev => [...prev, messages]);
            }
        }
    }, [chattingWith, messages]);

    const getLastTenMessages = () => {
        if (chattingContent.length > 0) {
            console.log(chattingContent[chattingContent.length - 1]); // In ra tin nhắn cuối cùng
            return chattingContent[chattingContent.length - 1];
        }
        return null;  // Nếu không có tin nhắn nào, trả về null
    }


    // Fetch messages from the API
    useEffect(() => {
        if (!emailUser) return;  // Do not call the API if there's no email

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/chat/messages/${emailUser}/${chattingWith.userId}`);
                const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setChattingContent(sortedMessages);
                console.log("dong tin nhan ne " + sortedMessages)
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [chattingWith, emailUser]);

    const handleSendMessage = () => {
        if (newMessage) {
            console.log(chattingWith);
            sendMessage(chattingWith.userId, newMessage, false);
            setNewMessage('');
        }
        else if (imageMessage) {
            sendMessage(chattingWith.userId, imageMessage, true)
            setImageMessage('');
        }
    }

  const handleSelectAndUploadFile = async () => {
    // Mở thư viện để chọn file
    const options = {
      mediaType: 'photo', // Hoặc 'video', 'mixed'
      includeBase64: false,
    };

    const result = await launchImageLibrary(options);

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      console.log('Selected file:', file);

      // Upload file lên Cloudinary
      await handleUploadToCloudinary(file);
    } else {
      console.log('User cancelled file selection or no file selected');
    }
  };

  const handleUploadToCloudinary = async (file) => {
    try {
      // Gọi server để lấy signature
      const signatureResponse = await axios.get(`http://${BACKEND_URL_HTTP}/api/cloudinary/get-signature`);
      const {signature, timestamp, apiKey} = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type, // MIME type, ví dụ: image/jpeg
        name: file.fileName, // Tên file
      });
      formData.append('api_key', apiKey);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);

      // Sử dụng XMLHttpRequest để upload và theo dõi tiến trình
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dter3mlpl/image/upload');

      xhr.upload.onprogress = (event) => {
        const progressPercentage = Math.round((event.loaded / event.total) * 100);
        console.log(`Upload progress: ${progressPercentage}%`);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          console.log('Upload success:', response);

          // Sau khi upload thành công, thêm ảnh vào danh sách tin nhắn
          const uploadedFileUrl = response.url;
          setImageMessage(uploadedFileUrl);
          // setChattingContent((prevContent) => [
          //   ...prevContent,
          //   {
          //     messageId: Date.now().toString(),
          //     senderId: emailUser,
          //     content: uploadedFileUrl,
          //     timestamp: new Date().toISOString(),
          //   },
          // ]);
        } else {
          console.error('Upload failed:', xhr.responseText);
        }
      };

      xhr.onerror = () => {
        console.error('Upload error');
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading file:', error);
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

    // @ts-ignore
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
            ref={flatListRef} // Gắn tham chiếu vào FlatList
            data={chattingContent}
            keyExtractor={item => item.messageId.toString()}
            renderItem={({ item }) => (
              <View style={[styles.messageWrapper,
                  item.senderId === chattingWith.userId  ? styles.theirMessage : styles.myMessage,]}>
                  {/* Sender's avatar */}
                  <Avatar.Image
                    size={40}
                    source={{ uri: item.senderId === chattingWith.userId  ? chattingWith.img :  "" }}
                    style={[styles.avatar, item.senderId === chattingWith.userId  ? '' : styles.myAvatar]}
                  />

                  {/* Message content */}
                <View
                  style={[
                    styles.messageContainer,
                    item.senderId === chattingWith.userId
                      ? styles.theirMessage
                      : styles.myMessage,
                    !item.isImage && {
                      backgroundColor:
                        item.senderId === chattingWith.userId
                          ? theme.secondaryBackgroundColor
                          : theme.primaryColor,
                    },
                  ]}
                >
                    {item.isImage ? (
                      <TouchableOpacity onPress={() => {/* Bạn có thể mở ảnh lớn tại đây */}}>
                        <Image
                          source={{ uri: item.content }}
                          style={{
                            width: 200, // Chiều rộng ảnh
                            height: 200, // Chiều cao ảnh
                            borderRadius: 10, // Bo góc ảnh nếu cần
                          }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ) : (
                      // Nếu IsImage không phải true, hiển thị nội dung text
                      <>
                        <Text
                          style={[
                            styles.messageText,
                            {
                              color:
                                item.senderId === chattingWith.userId
                                  ? theme.textColor
                                  : theme.lightText,
                            },
                          ]}
                        >
                          {item.content}
                        </Text>
                        <Text style={[styles.timestamp, { color: theme.placeholderColor }]}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </Text>
                      </>  )}
                  </View>
              </View>
            )}
          />
        {/* Nếu có ảnh sau khi upload, hiển thị ảnh và nút X */}
        {imageMessage ? (
          <View style={styles.leftPreviewContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: imageMessage }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageMessage('')}
              >
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {/* Message input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.headerColor }]}>

          {/* Attach image icon */}
          <TouchableOpacity onPress={handleSelectAndUploadFile}>
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
    myAvatar: {
        display: 'none',
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
        maxWidth: '80%',
    },
    myMessage: {
        display: 'flex',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        display: 'flex',
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
  previewContainer: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: 100, // Chiều rộng ảnh
    height: 100, // Chiều cao ảnh
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10, // Nút X nằm phía trên ảnh
    right: -10, // Nút X nằm ở góc phải
  },leftPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: 100, // Chiều rộng ảnh
    height: 100, // Chiều cao ảnh
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5, // Nút X nằm phía trên ảnh
    right: -5, // Nút X nằm ở góc phải
  },
});

export default ChatScreen;
