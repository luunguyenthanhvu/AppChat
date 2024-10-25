import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatListScreen from '../screens/ChatListScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'ChatList') {
                        iconName = 'comments'; // Icon cho ChatList
                    } else if (route.name === 'AddFriend') {
                        iconName = 'users'; // Icon cho AddFriend
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: false,
            })}
        >
            <Tab.Screen name="ChatList" component={ChatListScreen} options={{headerShown: false }} />
            <Tab.Screen name="AddFriend" component={AddFriendScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
