import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import VerifyRegisterScreen from './src/screens/VerifyRegisterScreen';
import ChatScreen from './src/screens/ChatScreen';
import UserInfoScreen from "./src/screens/UserInfoScreen";
import MainTabNavigator from './src/navigation/MainTabNavigator'; // Import Tab Navigator
import ProfileScreen from './src/screens/ProfileScreen'; // Import ProfileScreen
import { ThemeProvider } from './src/context/ThemeContext'; // Import ThemeProvider

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    {/* Các màn hình Stack Navigator */}
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="VerifyRegisterScreen" component={VerifyRegisterScreen} options={{ headerShown: false }} />

                    {/* Tab Navigator cho ChatList và AddFriend */}
                    <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{ headerShown: false }} />

                    {/* Các màn hình khác như ChatDetail */}
                    <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} options={{ headerShown: false }} />

                    {/* Thêm ProfileScreen vào Stack */}
                    <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
};

export default App;
