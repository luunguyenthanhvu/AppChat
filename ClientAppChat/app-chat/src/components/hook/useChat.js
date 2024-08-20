import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import {BACKEND_URL_HTTP, BACKEND_URL_HTTPS} from '../../config.js'

const useChat = () => {
    const token =  localStorage.getItem('token');
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState('');
    const [newListChat, setNewListChat] = useState('');
    const [userInfo, setUserInfo] = useState({
        userName: '',
        email: '',
        img: ''
    });
    useEffect(() => {
        const createConnection = async () => {
            const hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(`http://${BACKEND_URL_HTTP}/Chat?access_token=${token}`, {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets
                })
                .build();
            
            hubConnection.on("ReceiveMessage", (message) => {
                setMessages(message);
            });

        
            hubConnection.on("NewListChatReceive", (listChat) => {
                setNewListChat(listChat);
            });

            hubConnection.on("UserInfoUpdate", (userInfo) => {
                console.log("user info update" + JSON.stringify(userInfo))
                setUserInfo({
                    userName: userInfo.userName,
                    email: userInfo.email,
                    img: userInfo.img
                });

                
                localStorage.setItem('userName', userInfo.userName);
                localStorage.setItem('email', userInfo.email);
                localStorage.setItem('img', userInfo.img);
            });

            try {
                await hubConnection.start();
                console.log("Connection to hub");
                setConnection(hubConnection);
            } catch (err) {
                console.log(err);
            }
        };

        createConnection();

        return () => {
            if (connection) {
                connection.stop().catch(err => console.log('Error stopping connection: ', err));
            }
        };
    }, []);

    const sendMessage = async (recipientUserId, message, isImage) => {
        if (connection) {
            try {
                await connection.invoke("SendMessage", recipientUserId.toString(), message.toString(), isImage);
            } catch (err) {
                console.log("send fail: " + err);
            }
        }
    }

    const updateProfile = async (email, isUpdateImage, isUpdatePass) => {
        if (connection) {
            try {
                await connection.invoke("UpdateProfile", email, isUpdateImage, isUpdatePass);
            } catch (err) {
                console.log("send fail: " + err);
            }
        }
    }

    return { newListChat,connection, messages, userInfo,sendMessage, updateProfile };
}

export default useChat;
