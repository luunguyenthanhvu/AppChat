import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput, Button, Dialog, Portal, Provider } from 'react-native-paper';
import { BACKEND_URL_HTTP } from "../config/config"; // Import from config.js

const VerifyRegisterScreen = () => {
    const route = useRoute();
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const navigation = useNavigation();

    const showDialog = (message) => {
        setDialogMessage(message);
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    // Hàm xử lý xác thực OTP
    const verifyHandler = async () => {
        if (otp.length !== 6) {
            showDialog('Mã OTP phải gồm 6 chữ số.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/verifyAccount`, {
                email: email,
                otp: otp,
            });

            if (response.data.message === "Tài khoản xác thực thành công.") {
                showDialog('Tài khoản của bạn đã được xác thực thành công.');
                navigation.navigate('Login');
            } else {
                showDialog(response.data.message || 'Xác thực thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            showDialog('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Text style={styles.title}>Xác minh tài khoản</Text>

                <TextInput
                    style={styles.input}
                    label="Mã OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    mode="outlined"
                    placeholder="Nhập mã OTP"
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#1e90ff" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={verifyHandler}>
                        <Text style={styles.buttonText}>Xác minh</Text>
                    </TouchableOpacity>
                )}

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
        width: '100%',
        marginBottom: 20,
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
});

export default VerifyRegisterScreen;
