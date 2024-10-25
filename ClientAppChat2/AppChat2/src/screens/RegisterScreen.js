import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Dialog, Portal, Button, Provider } from 'react-native-paper';
import { BACKEND_URL_HTTP } from "../../config";

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);  // State for Dialog visibility
    const [dialogMessage, setDialogMessage] = useState('');  // State for dialog message
    const navigation = useNavigation();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateUserName = (username) => username.length >= 3;

    // Hiển thị thông báo lỗi với react-native-paper Dialog
    const showDialog = (message) => {
        setDialogMessage(message);
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    const registerHandler = async () => {
        if (!validateUserName(username) || !validateEmail(email) || password === '') {
            showDialog('Vui lòng kiểm tra lại thông tin.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/register`, {
                userName: username,
                email: email,
                password: password,
            });

            if (response.status === 200 && response.data.message === "Đăng ký tài khoản thành công ! Vui lòng xác minh tài khoản") {
                showDialog('Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.');
                navigation.navigate('VerifyRegisterScreen', { email });
            } else {
                showDialog(response.data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            showDialog('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Text style={styles.title}>Đăng ký tài khoản</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Tên người dùng"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
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
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {isLoading ? (
                    <ActivityIndicator size="large" color="#1e90ff" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={registerHandler}>
                        <Text style={styles.buttonText}>Đăng ký</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.backToLogin}>
                        Đã có tài khoản? Đăng nhập ngay
                    </Text>
                </TouchableOpacity>

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
        backgroundColor: '#f5f6fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        width: '100%',
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    backToLogin: {
        color: '#1e90ff',
        marginTop: 20,
        fontSize: 16,
    },
});

export default RegisterScreen;
