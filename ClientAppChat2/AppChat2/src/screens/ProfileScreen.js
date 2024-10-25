import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Import context
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = ({ navigation }) => {
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext); // Sử dụng context
    const [avatar, setAvatar] = useState(require('../assets/images/1219692.jpg')); // Ảnh mặc định
    const [userName, setUserName] = useState(''); // State để lưu username

    // Lấy username và avatar từ AsyncStorage khi màn hình được render
    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem('userName');
                const storedAvatar = await AsyncStorage.getItem('avatarUri');

                if (storedUserName) {
                    setUserName(storedUserName);
                }

                if (storedAvatar) {
                    setAvatar({ uri: storedAvatar });
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
            }
        };
        loadProfileData();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setAvatar({ uri: result.uri });
            await AsyncStorage.setItem('avatarUri', result.uri);  // Lưu URI của avatar vào AsyncStorage
        }
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

            {/* Hiển thị username lấy từ AsyncStorage */}
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

                <View style={styles.optionItem}>
                    <Icon name="user" size={24} color="#000" />
                    <Text style={[styles.optionText, { color: isDarkMode ? "#fff" : "#000" }]}>Tên người dùng</Text>
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
