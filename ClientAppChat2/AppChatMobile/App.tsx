import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserInfoScreen from './src/screens/UserInfoScreen';
import MainTabNavigator from './src/navigators/MainTabNavigator';
import VerifyRegisterScreen from './src/screens/VerifyRegisterScreen';
import CallScreen from './src/screens/CallScreen.tsx';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import QRCodeScanScreen from './src/screens/QRCodeScanScreen';
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();

// Tách phần Navigation ra để sử dụng hook useTheme
const AppNavigator: React.FC = () => {
  const { isDarkMode } = useTheme(); // Lấy trạng thái dark mode từ ThemeContext
  LogBox.ignoreAllLogs();
  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Login">
        {/* Các màn hình login và đăng ký */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyRegisterScreen" component={VerifyRegisterScreen} options={{ headerShown: false }} />
        {/* Main Tab Navigator */}
        <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CallScreen" component={CallScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QRCodeScanScreen" component={QRCodeScanScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
