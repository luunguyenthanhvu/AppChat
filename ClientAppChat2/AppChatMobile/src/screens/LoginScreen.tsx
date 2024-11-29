import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dialog, Portal, Button, Provider } from 'react-native-paper';
import { BACKEND_URL_HTTP } from '../config/config';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
    const navigation = useNavigation();

    // Hiển thị thông báo lỗi với react-native-paper Dialog
    const showDialog = useCallback((message) => {
        setDialogMessage(message);
        setVisible(true);
    }, []);

    const hideDialog = useCallback(() => {
        setVisible(false);
    }, []);

    // Hàm xử lý đăng nhập thông thường
    const loginHandler = useCallback(async () => {
        if (email === '' || password === '') {
            showDialog('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/login`, {
                email,
                password
            });

            if (response.data.message) {
                showDialog(response.data.message);
            } else {
                const { userName, email, token, avatar } = response.data; // Lấy avatar từ backend (có thể null hoặc không có)

                await AsyncStorage.setItem('userName', userName);
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('token', token);

                // Nếu avatar có giá trị, lưu vào AsyncStorage, nếu không, lưu giá trị mặc định
                if (avatar) {
                    await AsyncStorage.setItem('avatarUri', avatar);  // Lưu avatar từ backend
                } else {
                    // Lưu một giá trị mặc định cho avatar nếu không có
                    const defaultAvatar = 'https://www.example.com/default-avatar.png'; // Thay thế URL với avatar mặc định của bạn
                    await AsyncStorage.setItem('avatarUri', defaultAvatar);
                }

                navigation.replace('MainTabNavigator');  // Chuyển hướng sang màn hình ChatList
            }
        } catch (error) {
            console.error(error);
            showDialog('Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [email, password, navigation, showDialog]);


    return (
      <Provider>
          <View style={styles.container}>
              <Image source={{ uri: 'https://cdn.oneesports.vn/cdn-data/sites/4/2023/08/One-Piece-Gear-5-1024x576.jpg' }} style={styles.logo} />
              <Text style={styles.title}>Login into account</Text>

              <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible}
                      />
                      <TouchableOpacity
                        style={styles.togglePasswordVisibility}
                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                      >
                          <Text>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
                      </TouchableOpacity>
                  </View>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={loginHandler} disabled={loading}>
                  <Text style={styles.loginButtonText}>{loading ? "Đang đăng nhập..." : "LOGIN"}</Text>
              </TouchableOpacity>

              <Text style={styles.link} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                  Forgot Password?
              </Text>

              <Text style={styles.orText}>or login with</Text>

              <Text style={styles.registerText}>
                  Don't have an account?
                  <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                      Register here
                  </Text>
              </Text>

              {/* Dialog for validation or error messages */}
              <Portal>
                  <Dialog visible={visible} onDismiss={hideDialog}>
                      <Dialog.Title>Thông báo</Dialog.Title>
                      <Dialog.Content>
                          <Text>{dialogMessage}</Text>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={hideDialog}>OK</Button>
                      </Dialog.Actions>
                  </Dialog>
              </Portal>
          </View>
      </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f6fa'
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
        borderRadius: 60
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16
    },
    passwordContainer: {
        position: 'relative',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        width: '100%',
    },
    togglePasswordVisibility: {
        position: 'absolute',
        right: 10,
        top: 12,
    },
    loginButton: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    link: {
        color: '#1e90ff',
        marginTop: 10,
        textAlign: 'center'
    },
    orText: {
        marginVertical: 20,
        fontSize: 16,
        fontWeight: '600'
    },
    registerText: {
        marginTop: 20,
        fontSize: 14
    },
    registerLink: {
        color: '#1e90ff'
    }
});

export default LoginScreen;
