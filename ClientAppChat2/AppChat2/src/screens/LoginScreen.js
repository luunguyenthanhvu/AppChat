import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dialog, Portal, Button, Provider } from 'react-native-paper';
import { BACKEND_URL_HTTP } from '../../config';  // Import từ config.js

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);  // State for Dialog visibility
    const [dialogMessage, setDialogMessage] = useState('');  // State for dialog message
    const navigation = useNavigation();

    // Cấu hình Google Sign-In
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '949616830490-pk1dfhp9t07l8do161m39nc9jp0onabq.apps.googleusercontent.com', // Thay bằng Client ID của bạn
        });
    }, []);

    // Hiển thị thông báo lỗi với react-native-paper Dialog
    const showDialog = (message) => {
        setDialogMessage(message);
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    // Hàm xử lý đăng nhập thông thường
    const loginHandler = async () => {
        if (email === '' || password === '') {
            showDialog('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/login`, {
                email: email,
                password: password
            });

            if (response.data.message) {
                showDialog(response.data.message);
            } else {
                const { userName, email, token } = response.data;
                await AsyncStorage.setItem('userName', userName);
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('token', token);
                navigation.replace('MainTabNavigator');  // Chuyển hướng sang màn hình ChatList
            }
        } catch (error) {
            console.error(error);
            showDialog('Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý đăng nhập Google
    const googleLoginHandler = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const { idToken } = userInfo;

            // Gửi idToken đến API Google Login mà bạn đã có
            setLoading(true);
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/LoginGoogle/google-login-response-dto`, {
                tokenId: idToken,
            });

            if (response.status === 200) {
                const { userName, email, token } = response.data;
                await AsyncStorage.setItem('userName', userName);
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('token', token);
                navigation.replace('ChatList');  // Chuyển hướng sang màn hình ChatList
            } else {
                showDialog(response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                showDialog('Đăng nhập bị hủy');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                showDialog('Đang xử lý đăng nhập...');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                showDialog('Google Play Services không khả dụng');
            } else {
                console.error(error);
                showDialog('Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

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
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={loginHandler} disabled={loading}>
                    <Text style={styles.loginButtonText}>{loading ? "Đang đăng nhập..." : "LOGIN"}</Text>
                </TouchableOpacity>

                <Text style={styles.link} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                    Forgot Password?
                </Text>

                <Text style={styles.orText}>or login with</Text>

                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity onPress={googleLoginHandler}>
                        <Image source={{ uri: 'https://cdn-teams-slug.flaticon.com/google.jpg' }} style={styles.socialIcon} />
                    </TouchableOpacity>
                </View>

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
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        width: '100%'
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
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%'
    },
    socialIcon: {
        width: 50,
        height: 50
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
