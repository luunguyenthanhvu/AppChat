import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserInfoScreen from './src/screens/UserInfoScreen';
import MainTabNavigator from './src/navigators/MainTabNavigator';
import VerifyRegisterScreen from './src/screens/VerifyRegisterScreen';  // Import VerifyRegisterScreen

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* Các màn hình login và đăng ký */}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
                <Stack.Screen name="VerifyRegisterScreen" component={VerifyRegisterScreen} options={{ headerShown: false }} />

                {/* Main Tab Navigator */}
                <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{ headerShown: false }} />

                {/* Các màn hình chat và profile */}
                <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerTitle: 'Hồ sơ' }} />
                <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} options={{ headerTitle: 'Thông tin người dùng' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
