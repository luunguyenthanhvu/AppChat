import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Switch,
    Modal,
    TextInput, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../config/config';
import { useTheme } from '../context/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
    const { isDarkMode, toggleTheme, theme } = useTheme();
    const [avatar, setAvatar] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [updatedUserName, setUpdatedUserName] = useState('');
    const [gender, setGender] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dob, setDob] = useState(new Date());
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    // Hàm xử lý Save Update cho thông tin cá nhân
    const handleSaveUserInfo = () => {
        if (!firstName.trim() || !lastName.trim() || !updatedUserName.trim() || !gender.trim() || !dob) {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }
        // Logic gọi API cập nhật thông tin user
        Alert.alert('Success', 'User Info Updated Successfully');
        setUpdateModalVisible(false);
    };

// Hàm xử lý Save Update cho mật khẩu
    const handleSavePassword = () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (newPassword.trim().length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        // Logic gọi API cập nhật mật khẩu
        Alert.alert('Success', 'Password Updated Successfully');
        setPasswordModalVisible(false);
    };


    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios'); // Ẩn DatePicker trên Android khi chọn xong
        setDob(currentDate);
    };
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const storedEmail = await AsyncStorage.getItem('email');
                if (!storedEmail) return;

                setEmail(storedEmail);
                const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/profile`, { params: { email: storedEmail } });
                const { userName, img } = response.data;
                setUserName(userName);
                setAvatar(img || 'https://www.example.com/default-avatar.png');
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const getQRCodeUrl = (email: string) => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(email)}`;
    };

    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
              <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('MainTabNavigator')}>
                  <Ionicons name="arrow-back-outline" size={24} color={theme.textColor} />
              </TouchableOpacity>

              <Text style={[styles.headerText, { color: theme.textColor }]}>Me</Text>

              <TouchableOpacity onPress={() => navigation.navigate('QRCodeScanScreen', { email: email })}>
                  <Ionicons name="qr-code-outline" size={24} color={theme.textColor} />
              </TouchableOpacity>

          </View>

          {/* Hiển thị Avatar và Loading */}
          {loading ? (
            <ActivityIndicator size="large" color={theme.textColor} />
          ) : (
            <View style={styles.avatarContainer}>
                <Image source={{ uri: avatar || '' }} style={styles.avatar} />
                <Text style={[styles.nameText, { color: theme.textColor }]}>{userName || 'Loading...'}</Text>
            </View>
          )}

          {/* Hiển thị QR Code */}
          <View style={styles.qrCodeContainer}>
              <Text style={[styles.qrCodeText, { color: theme.textColor }]}>Share this QR code to make friend </Text>
              {email && <Image source={{ uri: getQRCodeUrl(email) }} style={styles.qrCode} />}
          </View>

          {/* Danh sách các lựa chọn */}
          <View style={styles.optionContainer}>
              {/* Chế độ tối */}
              <View style={[styles.optionItem, { justifyContent: 'space-between' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="moon-o" size={24} color={theme.textColor} />
                      <Text style={[styles.optionText, { color: theme.textColor }]}>Dark mode</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
                    onValueChange={toggleTheme}
                    value={isDarkMode}
                  />
              </View>


              {/* Sửa thông tin */}
              <TouchableOpacity style={styles.optionItem} onPress={() => setModalVisible(true)}>
                  <Icon name="edit" size={24} color={theme.textColor} />
                  <Text style={[styles.optionText, { color: theme.textColor }]}>Edit infomation</Text>
              </TouchableOpacity>

              {/* Modal User Info */}
              <Modal visible={modalVisible} transparent animationType="slide">
                  <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                          {/* Nút Close nằm trên cùng bên phải */}
                          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                              <Icon name="close" size={24} color="#333" />
                          </TouchableOpacity>
                          <Text style={styles.title}>User Info</Text>
                          <Image source={{ uri: avatar }} style={styles.avatarLarge} />
                          <Text style={styles.infoText}>User Name: {userName || 'N/A'}</Text>
                          <Text style={styles.infoText}>First Name:</Text>
                          <Text style={styles.infoText}>Last Name:</Text>
                          <Text style={styles.infoText}>Gender:</Text>
                          <Text style={styles.infoText}>Dob:</Text>
                          <Text style={styles.note}>Only people who are friends with you can see this information.</Text>
                          <TouchableOpacity style={styles.button} onPress={() => { setModalVisible(false); setUpdateModalVisible(true); }}>
                              <Text style={styles.buttonText}>Update Info</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </Modal>

              {/* Modal Update User Info */}
              <Modal visible={updateModalVisible} transparent animationType="slide">
                  <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                          <TouchableOpacity onPress={() => setUpdateModalVisible(false)} style={styles.modalCloseButton}>
                              <Icon name="close" size={24} color="#333" />
                          </TouchableOpacity>
                          <Text style={styles.title}>Update User Info</Text>

                          {/* First Name */}
                          <View style={styles.inputRow}>
                              <Text style={styles.label}>First Name:</Text>
                              <TextInput
                                placeholder="Enter First Name"
                                style={styles.inputField}
                                value={firstName}
                                onChangeText={setFirstName}
                              />
                          </View>

                          {/* Last Name */}
                          <View style={styles.inputRow}>
                              <Text style={styles.label}>Last Name:</Text>
                              <TextInput
                                placeholder="Enter Last Name"
                                style={styles.inputField}
                                value={lastName}
                                onChangeText={setLastName}
                              />
                          </View>

                          {/* User Name */}
                          <View style={styles.inputRow}>
                              <Text style={styles.label}>User Name:</Text>
                              <TextInput
                                placeholder="Enter User Name"
                                style={styles.inputField}
                                value={updatedUserName}
                                onChangeText={setUpdatedUserName}
                              />
                          </View>

                          {/* Gender */}
                          <View style={styles.inputRow}>
                              <Text style={styles.label}>Gender:</Text>
                              <View style={styles.pickerContainer}>
                                  <Picker
                                    selectedValue={gender}
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                    style={styles.picker}
                                  >
                                      <Picker.Item label="Select Gender" value="" />
                                      <Picker.Item label="Male" value="Male" />
                                      <Picker.Item label="Female" value="Female" />
                                  </Picker>
                              </View>
                          </View>


                          {/* Date of Birth */}
                          <View style={styles.inputRow}>
                              <Text style={styles.label}>Date of Birth:</Text>
                              <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.dateInput}
                              >
                                  <Text>{dob ? new Date(dob).toDateString() : "No Date Selected"}</Text>
                                  <Icon name="calendar" size={20} color="#666" />
                              </TouchableOpacity>
                          </View>
                          {showDatePicker && (
                            <DateTimePicker
                              value={dob}
                              mode="date"
                              display="default"
                              onChange={onChangeDate}
                            />
                          )}
                          <TouchableOpacity style={styles.buttonOutline} onPress={() => setPasswordModalVisible(true)}>
                              <Text style={styles.buttonOutlineText}>Update Password</Text>
                          </TouchableOpacity>

                          {/* Save Button */}
                          <TouchableOpacity style={styles.button} onPress={handleSaveUserInfo}>
                              <Text style={styles.buttonText}>Save Update</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </Modal>

              {/* Modal Update Password */}
              <Modal visible={passwordModalVisible} transparent animationType="slide">
                  <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                          {/* Close Button */}
                          <TouchableOpacity onPress={() => setPasswordModalVisible(false)} style={styles.modalCloseButton}>
                              <Icon name="close" size={24} color="#333" />
                          </TouchableOpacity>

                          <Text style={styles.title}>Update Password</Text>

                          {/* New Password */}
                          <View style={styles.inputRow}>
                              <Text style={styles.label}>New Password:</Text>
                              <TextInput
                                placeholder="Enter New Password"
                                style={styles.inputField}
                                value={newPassword}
                                secureTextEntry
                                onChangeText={setNewPassword}
                              />
                          </View>

                          {/* Confirm Password */}
                          <View style={styles.inputRow}>
                              <Text style={styles.label}>Confirm Password:</Text>
                              <TextInput
                                placeholder="Confirm Password"
                                style={styles.inputField}
                                value={confirmPassword}
                                secureTextEntry
                                onChangeText={setConfirmPassword}
                              />
                          </View>

                          {/* Update Personal Info */}
                          <TouchableOpacity style={styles.buttonOutline} onPress={() => setPasswordModalVisible(false)}>
                              <Text style={styles.buttonOutlineText}>Update Personal Information</Text>
                          </TouchableOpacity>

                          {/* Save Update */}
                          <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
                              <Text style={styles.buttonText}>Save Update</Text>
                          </TouchableOpacity>

                      </View>
                  </View>
              </Modal>

              {/* Đăng xuất */}
              <TouchableOpacity
                style={styles.optionItem}
                onPress={async () => {
                    await AsyncStorage.clear();
                    navigation.replace('Login');
                }}
              >
                  <Icon name="sign-out" size={24} color={theme.textColor} />
                  <Text style={[styles.optionText, { color: theme.textColor }]}>Logout</Text>
              </TouchableOpacity>
          </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    menuButton: { padding: 10 },
    headerText: { fontSize: 20, fontWeight: 'bold' },
    avatarContainer: { alignItems: 'center', marginVertical: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60 },
    nameText: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
    qrCodeContainer: { alignItems: 'center', marginVertical: 20 },
    qrCodeText: { fontSize: 18, marginBottom: 10 },
    qrCode: { width: 200, height: 200 },
    optionContainer: { marginTop: 20 },
    optionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
    optionText: { marginLeft: 10, fontSize: 18 },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 10, padding: 20, position: 'relative' },
    modalCloseButton: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
    title: { fontSize: 22, textAlign: 'center', marginBottom: 20 },
    infoText: { fontSize: 16, marginVertical: 5 },
    note: { fontSize: 12, color: 'gray', marginTop: 10, textAlign: 'center' },
    button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 20, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16 },
    avatarLarge: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 10 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 150, // Độ rộng cho label
    },
    inputField: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        fontSize: 16,
    },
    pickerContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    picker: {
        height: 50,
        color: '#333',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        flex: 1,
    },
    buttonOutline: {
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonOutlineText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default ProfileScreen;
