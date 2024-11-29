import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';  // Thay thế expo-image-picker

const ProfileScreen = ({ navigation }) => {
    // Mock data cho người dùng
    const mockData = {
        userName: 'Nguyễn Văn A', // Tên người dùng giả lập
        avatarUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6_jInN9u5P5QudjgpUcgvNRZ__mQw7EU73w&s', // Avatar mặc định
    };

    const [avatar, setAvatar] = useState({ uri: mockData.avatarUri }); // Ảnh đại diện, mặc định là avatar từ mockData
    const [userName, setUserName] = useState(mockData.userName); // Tên người dùng, mặc định từ mockData
    const [isDarkMode, setIsDarkMode] = useState(false); // Trạng thái chế độ tối

    // Chọn ảnh từ thư viện
    const pickImage = () => {
        ImagePicker.launchImageLibrary(
          {
              mediaType: 'photo',
              includeBase64: false,
              maxWidth: 1000,
              maxHeight: 1000,
          },
          (response) => {
              if (response.assets && response.assets.length > 0) {
                  const uri = response.assets[0].uri;
                  setAvatar({ uri }); // Cập nhật avatar mới
              }
          }
        );
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev); // Chuyển chế độ sáng/tối
    };

    return (
      <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
          {/* Header */}
          <View style={styles.header}>
              <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
                  <Icon name="arrow-left" size={24} color={isDarkMode ? "#fff" : "#000"} />
              </TouchableOpacity>

              <Text style={[styles.headerText, { color: isDarkMode ? "#fff" : "#000" }]}>Tôi</Text>

              <TouchableOpacity>
                  <Icon name="qrcode" size={24} color={isDarkMode ? "#fff" : "#000"} />
              </TouchableOpacity>
          </View>

          {/* Avatar và nút camera */}
          <View style={styles.avatarContainer}>
              <Image source={avatar} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                  <Icon name="camera" size={20} color="#fff" />
              </TouchableOpacity>
          </View>

          {/* Hiển thị username */}
          <Text style={[styles.nameText, { color: isDarkMode ? "#fff" : "#000" }]}>{userName}</Text>

          {/* Danh sách các lựa chọn */}
          <View style={styles.optionContainer}>
              {/* Chế độ tối */}
              <View style={styles.optionItem}>
                  <Icon name="moon-o" size={24} color="#000" />
                  <Text style={[styles.optionText, { color: isDarkMode ? "#fff" : "#000" }]}>Chế độ tối</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleDarkMode}
                    value={isDarkMode}
                  />
              </View>

              {/* Thêm một số tùy chọn khác */}
              <View style={styles.optionItem}>
                  <Icon name="edit" size={24} color="#000" />
                  <Text style={[styles.optionText, { color: isDarkMode ? "#fff" : "#000" }]}>Sửa thông tin</Text>
              </View>

              <View style={styles.optionItem}>
                  <Icon name="sign-out" size={24} color="#000" />
                  <Text style={[styles.optionText, { color: isDarkMode ? "#fff" : "#000" }]}>Đăng xuất</Text>
              </View>
          </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    darkContainer: {
        backgroundColor: '#333',
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuButton: {
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    avatarContainer: {
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 30,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    optionContainer: {
        marginTop: 20,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 18,
    },
});

export default ProfileScreen;
