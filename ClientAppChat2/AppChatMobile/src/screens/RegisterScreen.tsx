import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Dialog, Portal, Button, Provider } from 'react-native-paper';
import { BACKEND_URL_HTTP } from "../config/config"; // Import from config.js

const RegisterScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);  // State for Dialog visibility
    const [dialogMessage, setDialogMessage] = useState('');  // State for dialog message
    const navigation = useNavigation();

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateUserName = (username: string) => username.length >= 3;

    // Display error message with react-native-paper Dialog
    const showDialog = (message: string) => {
        setDialogMessage(message);
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    // Function for handling registration
    const registerHandler = async () => {
        if (!validateUserName(username) || !validateEmail(email) || password === '') {
            showDialog('Please check your information.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/register`, {
                userName: username,
                email: email,
                password: password,
            });

            if (response.status === 200 && response.data.message === "Account registration successful! Please verify your account.") {
                showDialog('Registration successful! Please check your email to verify your account.');
                navigation.navigate('VerifyRegisterScreen', { email }); // Navigate to VerifyRegisterScreen
            } else {
                showDialog(response.data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            showDialog('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <Provider>
          <View style={styles.container}>
              <Text style={styles.title}>Register Account</Text>

              <TextInput
                style={styles.input}
                placeholder="Username"
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
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {isLoading ? (
                <ActivityIndicator size="large" color="#1e90ff" />
              ) : (
                <TouchableOpacity style={styles.button} onPress={registerHandler}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.backToLogin}>
                      Already have an account? Log in now
                  </Text>
              </TouchableOpacity>

              {/* Dialog for validation or error messages */}
              <Portal>
                  <Dialog visible={visible} onDismiss={hideDialog}>
                      <Dialog.Title>Notification</Dialog.Title>
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
