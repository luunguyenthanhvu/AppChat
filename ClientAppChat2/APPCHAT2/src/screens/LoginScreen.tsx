import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Sử dụng NavigationProp
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dialog, Portal, Button, Provider } from 'react-native-paper';
import { BACKEND_URL_HTTP } from '../config/config';  // Import URL từ config.js

// Định nghĩa kiểu Navigation
type RootStackParamList = {
    ForgotPasswordScreen: undefined;
    Register: undefined;
    MainTabNavigator: undefined;
};

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');  // Thêm kiểu string
    const [password, setPassword] = useState<string>('');  // Thêm kiểu string
    const [loading, setLoading] = useState<boolean>(false);  // Thêm kiểu boolean
    const [visible, setVisible] = useState<boolean>(false);  // Thêm kiểu boolean
    const [dialogMessage, setDialogMessage] = useState<string>('');  // Thêm kiểu string
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();  // Sử dụng NavigationProp để định nghĩa kiểu

    // Hiển thị thông báo lỗi với react-native-paper Dialog
    const showDialog = (message: string): void => {
        setDialogMessage(message);
        setVisible(true);
    };

    const hideDialog = (): void => {
        setVisible(false);
    };

    // Hàm xử lý đăng nhập thông thường
    const loginHandler = async (): Promise<void> => {
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
    registerText: {
        marginTop: 20,
        fontSize: 14
    },
    registerLink: {
        color: '#1e90ff'
    }
});

export default LoginScreen;
