import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const UserInfoScreen = ({ route, navigation }) => {
    const { user } = route.params;  // Nhận thông tin người dùng được truyền vào từ ChatScreen
    const [userInfo, setUserInfo] = useState<any>(null);

    // Mock dữ liệu người dùng
    useEffect(() => {
        const fetchUserInfo = () => {
            // Mock dữ liệu người dùng
            const mockUserData = {
                id: user.id,
                userName: 'Nguyễn Huy',
                avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
                phoneNumber: '0123456789',
                email: 'huy@example.com',
                status: 'Đang online',
                bio: 'Lập trình viên Frontend.',
                notifications: true,
                mediaFiles: ['image1.jpg', 'video1.mp4'],
            };

            setUserInfo(mockUserData);  // Set mock dữ liệu vào state
        };

        fetchUserInfo();
    }, [user]);

    if (!userInfo) {
        return <Text>Loading...</Text>;
    }

    return (
      <ScrollView style={styles.container}>
          {/* Ảnh đại diện và tên người dùng */}
          <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Ionicons name="arrow-back-outline" size={24} color="#000" />
              </TouchableOpacity>
              <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
              <Text style={styles.userName}>{userInfo.userName}</Text>
              <Text>{userInfo.status}</Text>
              <Text>{userInfo.bio}</Text>
          </View>

          {/* Biểu tượng gọi điện, gọi video, thông tin */}
          <View style={styles.iconRow}>
              <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="call-outline" size={24} color="black" />
                  <Text>Gọi thoại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="videocam-outline" size={24} color="black" />
                  <Text>Gọi video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                  <MaterialIcons name="notifications-on" size={24} color="black" />
                  <Text>Thông báo</Text>
              </TouchableOpacity>
          </View>

          {/* Các hành động khác */}
          <View style={styles.actionSection}>
              <Text style={styles.sectionTitle}>Hành động khác</Text>
              <TouchableOpacity style={styles.actionItem}>
                  <MaterialIcons name="insert-photo" size={24} color="black" />
                  <Text>Xem file phương tiện, file & liên kết</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                  <MaterialIcons name="save-alt" size={24} color="black" />
                  <Text>Lưu ảnh & video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="search-outline" size={24} color="black" />
                  <Text>Tìm kiếm trong cuộc trò chuyện</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="notifications-outline" size={24} color="black" />
                  <Text>Thông báo & âm thanh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="share-outline" size={24} color="black" />
                  <Text>Chia sẻ thông tin liên hệ</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Quyền riêng tư & hỗ trợ</Text>
              <TouchableOpacity style={styles.actionItem}>
                  <FontAwesome name="eye" size={24} color="black" />
                  <Text>Thông báo đã đọc</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="ban-outline" size={24} color="black" />
                  <Text>Chặn</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                  <MaterialIcons name="report" size={24} color="black" />
                  <Text>Báo cáo</Text>
              </TouchableOpacity>
          </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    iconButton: {
        alignItems: 'center',
    },
    actionSection: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});

export default UserInfoScreen;
