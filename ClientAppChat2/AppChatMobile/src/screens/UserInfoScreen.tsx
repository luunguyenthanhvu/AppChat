import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Modal, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';
import { BACKEND_URL_HTTP } from '../config/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserInfoScreen = ({ route, navigation }) => {
    const { theme } = useTheme();
    const { user } = route.params;
    const [emailUser, setEmailUser] = useState('');
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isModalVisible, setModalVisible] = useState(false); // State for Modal visibility
    const [isNicknameModalVisible, setNicknameModalVisible] = useState(false);
    const [nickname, setNickname] = useState('');
    useEffect(() => {
        const fetchUserInfo = async () => {
            const tokenUser = await AsyncStorage.getItem('token');
            const emailStoreage = await AsyncStorage.getItem('email');
            // @ts-ignore
            setEmailUser(emailStoreage);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/mark-up/user-info/details-id`, {
                params: {
                    id: user.userId
                },
                headers: {
                    Authorization: `Bearer ${tokenUser}`
                }
            });

            setUserInfo({
                userId: user.userId,
                userName: response.data.userName,
                img: response.data.img,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                gender: response.data.gender,
                dob: response.data.dob
            });
        };

        fetchUserInfo();
    }, [user]);

    if (!userInfo) {
        return (
          <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
              <Text style={{ color: theme.textColor }}>Loading...</Text>
          </View>
        );
    }

    const handleUnfriend = (userId) => {
        Alert.alert(
          'Confirm Unfriend',
          'Are you sure you want to remove this friend?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Unfriend',
              style: 'destructive',
              onPress: () => performUnfriend(userId),
            },
          ],
        );
    };

    const performUnfriend = async (userId: any) => {
        try {
            await axios.delete(`http://${BACKEND_URL_HTTP}/api/friend-controller/delete-friend`, {
                params: {
                    userEmail: emailUser,
                    friendId: user.userId
                }
            });
            Alert.alert("Success", "Friend removed successfully!");
            navigation.goBack();
        } catch (error) {
            console.error("Error unfriending user:", error);
            Alert.alert("Error", "Failed to unfriend user.");
        }
    };
    const handleReport = async () => {
        try {
            const tokenUser = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${tokenUser}`
                }
            };

            const reportPayload = {
                ReportedUserId: user.userId,
                Reason: "User spam chat",
            };

            await axios.put(`http://${BACKEND_URL_HTTP}/api/User/report-user`, reportPayload, config);

            Alert.alert("Success", "Report successfully!");
            navigation.goBack();
        } catch (error) {
            console.error("Error unfriending user:", error);
            Alert.alert("Error", "Failed to unfriend user.");
        }
    };
    const saveNickname = async () => {
        try {
            await AsyncStorage.setItem(`nickname-${user.userId}`, nickname);
            Alert.alert("Success", "Nickname updated successfully!");
            setNicknameModalVisible(false);
        } catch (error) {
            console.error("Error saving nickname:", error);
            Alert.alert("Error", "Failed to save nickname.");
        }
    };

    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
              <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back-outline" size={24} color={theme.textColor} />
              </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileContainer}>
              <Image source={{ uri: userInfo.img }} style={styles.avatar} />
              <Text style={[styles.userName, { color: theme.textColor }]}>{userInfo.userName}</Text>
          </View>

          {/* Icons */}
          <View style={[styles.iconRow, { borderBottomColor: theme.borderColor }]}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setModalVisible(true)} // Show modal on press
              >
                  <Ionicons name="information-circle-outline" size={24} color={theme.iconColor} />
                  <Text style={{ color: theme.textColor }}>Information</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => handleUnfriend(user.userId)}>
                  <FontAwesome name="user-times" size={24} color={theme.iconColor} />
                  <Text style={{ color: theme.textColor }}>Unfriend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleReport} // Report action placeholder
              >
                  <MaterialIcons name="report" size={24} color={theme.iconColor} />
                  <Text style={{ color: theme.textColor }}>Report</Text>
              </TouchableOpacity>
          </View>

          {/* Scrollable "More Actions" */}

          <ScrollView style={styles.scrollSection}>
              <View style={styles.actionSection}>
                  <Text style={[styles.sectionTitle, { color: theme.textColor }]}>More Actions</Text>

                  <TouchableOpacity style={[styles.actionItem, { borderBottomColor: theme.borderColor }]}>
                      <Ionicons name="color-palette-outline" size={24} color={theme.iconColor} />
                      <Text style={[styles.actionText, { color: theme.textColor }]}>Change Chat Theme</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionItem, { borderBottomColor: theme.borderColor }]}
                    onPress={() => setNicknameModalVisible(true)} // Mở modal đổi nickname
                  >
                      <Ionicons name="person-outline" size={24} color={theme.iconColor} />
                      <Text style={[styles.actionText, { color: theme.textColor }]}>Change Nickname</Text>
                  </TouchableOpacity>


                  <TouchableOpacity style={[styles.actionItem, { borderBottomColor: theme.borderColor }]}>
                      <MaterialIcons name="insert-photo" size={24} color={theme.iconColor} />
                      <Text style={[styles.actionText, { color: theme.textColor }]}>View Media & Links</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionItem, { borderBottomColor: theme.borderColor }]}>
                      <Ionicons name="search-outline" size={24} color={theme.iconColor} />
                      <Text style={[styles.actionText, { color: theme.textColor }]}>Search in Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionItem, { borderBottomColor: theme.borderColor }]}>
                      <Ionicons name="chatbubbles-outline" size={24} color={theme.iconColor} />
                      <Text style={[styles.actionText, { color: theme.textColor }]}>Create Group Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionItem, { borderBottomColor: theme.borderColor }]}>
                      <Ionicons name="share-social-outline" size={24} color={theme.iconColor} />
                      <Text style={[styles.actionText, { color: theme.textColor }]}>Share Contact Info</Text>
                  </TouchableOpacity>
              </View>
          </ScrollView>

          {/* Information Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
              <View style={styles.modalContainer}>
                  <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
                      <Text style={[styles.modalTitle, { color: theme.textColor }]}>User Information</Text>
                      <Text style={[styles.modalText, { color: theme.textColor }]}>Name: {userInfo.userName}</Text>
                      <Text style={[styles.modalText, { color: theme.textColor }]}>Email: {userInfo.email}</Text>
                      <Text style={[styles.modalText, { color: theme.textColor }]}>Phone: {userInfo.phoneNumber}</Text>
                      <Text style={[styles.modalText, { color: theme.textColor }]}>Gender: {userInfo.gender}</Text>
                      <Text style={[styles.modalText, { color: theme.textColor }]}>Date of Birth: {userInfo.dob}</Text>
                      <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: theme.primaryColor }]}
                        onPress={() => setModalVisible(false)}
                      >
                          <Text style={{ color: theme.lightText }}>Close</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </Modal>

          <Modal visible={isNicknameModalVisible} transparent onRequestClose={() => setNicknameModalVisible(false)}>
              <View style={styles.modalContainer}>
                  <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
                      <Text style={[styles.modalTitle, { color: theme.textColor }]}>Change Nickname</Text>
                      <TextInput
                        style={[styles.input, { borderColor: theme.borderColor }]}
                        placeholder="Enter new nickname"
                        value={nickname}
                        onChangeText={setNickname}
                      />
                      <TouchableOpacity onPress={saveNickname} style={styles.saveButton}>
                          <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </Modal>
      </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10 },
    menuButton: { marginRight: 15 },
    profileContainer: { alignItems: 'center', marginVertical: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#ccc' },
    userName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
    iconRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, borderBottomWidth: 1 },
    iconButton: { alignItems: 'center' },
    scrollSection: { flex: 1 },
    actionSection: { paddingHorizontal: 20, paddingVertical: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
    actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1 },
    actionText: { marginLeft: 10, fontSize: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { padding: 20, borderRadius: 10, width: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalText: { fontSize: 16, marginBottom: 5 },
    closeButton: { marginTop: 15, padding: 10, borderRadius: 5, alignItems: 'center' },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
        marginTop: 10,
        marginBottom: 20,
        color: '#333', // Màu chữ mặc định
    },
    saveButton: {
        backgroundColor: '#007AFF', // Màu nền xanh
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF', // Màu chữ trắng
    },

});

export default UserInfoScreen;
