import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatListScreen from '../screens/ChatListScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import Icon from 'react-native-vector-icons/FontAwesome'; // Đảm bảo rằng FontAwesome được cài đúng

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: string = '';

                    if (route.name === 'ChatList') {
                        iconName = 'comments';  // Biểu tượng chat
                    } else if (route.name === 'AddFriend') {
                        iconName = 'user-plus';  // Biểu tượng thêm bạn
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007bff',  // Màu cho tab đang được chọn
                tabBarInactiveTintColor: 'gray',  // Màu cho tab không được chọn
                tabBarShowLabel: false,  // Hiển thị tên của tab
            })}
        >
            <Tab.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{
                  headerShown: false
                }}
            />
            <Tab.Screen
                name="AddFriend"
                component={AddFriendScreen}
                options={{
                  headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
