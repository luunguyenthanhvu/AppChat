import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Dialog, Portal, Provider } from 'react-native-paper';
import { BACKEND_URL_HTTP } from '../config/config'; // Import config variables

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const navigation = useNavigation(); // Navigation hook

    // Display error message with react-native-paper Dialog
    const showDialog = (message: string) => {
        setDialogMessage(message);
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    const forgotPasswordHandler = async () => {
        if (!email) {
            showDialog('Please enter your email.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/ForgotPassword?email=${encodeURIComponent(email)}`);
            if (response.data.message) {
                showDialog(response.data.message);
            } else {
                showDialog('Request successful, please check your email.');
            }
        } catch (error) {
            showDialog('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
      <Provider>
          <View style={styles.container}>
              <Text style={styles.title}>Forgot Password</Text>

              <TextInput
                style={styles.input}
                label="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
              />

              {loading ? (
                <ActivityIndicator size="large" color="#1e90ff" />
              ) : (
                <TouchableOpacity style={styles.button} onPress={forgotPasswordHandler}>
                    <Text style={styles.buttonText}>Retrieve Password</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.backToLogin}>Back to login</Text>
              </TouchableOpacity>

              {/* Dialog for error or success messages */}
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
    backToLogin: {
        color: '#1e90ff',
        marginTop: 20,
        fontSize: 16,
    },
});

export default ForgotPasswordScreen;

