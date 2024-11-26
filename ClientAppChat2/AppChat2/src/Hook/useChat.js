import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { API_URL_HTTP } from '@env';  // Assuming this is set up in your `.env` file

// Setup axios instance for API calls
const api = axios.create({
    baseURL: `http://${API_URL_HTTP}`,  // Adjust with environment variable for API
    headers: {
        'Content-Type': 'application/json',
    },
});

const useChat = (emailUser) => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newListChat, setNewListChat] = useState([]);
    const [serverMessage, setServerMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(true);

    // Initialize the SignalR connection
    useEffect(() => {
        const createConnection = async () => {
            const hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${API_URL_HTTP}/chatHub`)  // Replace with your API chat hub URL
                .configureLogging(signalR.LogLevel.Information)
                .build();

            hubConnection.on("ReceiveMessage", (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            });

            hubConnection.on("NewListChatReceive", (listChat) => {
                setNewListChat(listChat);
            });

            try {
                await hubConnection.start();
                console.log("Connected to SignalR hub");
                setConnection(hubConnection);
            } catch (err) {
                console.error("Connection error: ", err);
            }
        };

        createConnection();

        return () => {
            if (connection) {
                connection.stop().catch(err => console.error('Error stopping connection: ', err));
            }
        };
    }, []);

    // Fetch chat messages for a specific user
    const fetchChatMessages = async (receiverId) => {
        setLoadingMessages(true);
        try {
            const response = await api.get(`/api/chat/messages/${emailUser}/${receiverId}`);
            const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(sortedMessages);
        } catch (error) {
            console.error("Error fetching chat messages: ", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // Send a new message using SignalR
    const sendMessage = async (receiverId, content, isImage = false) => {
        if (connection) {
            const newMessage = {
                senderId: emailUser,
                receiverId,
                content,
                isImage,
                timestamp: new Date().toISOString(),
            };

            try {
                await connection.invoke("SendMessage", newMessage.receiverId, newMessage.content, newMessage.isImage);
                setMessages(prevMessages => [...prevMessages, newMessage]);  // Optimistic UI update
            } catch (err) {
                console.error("Failed to send message: ", err);
            }
        }
    };

    return {
        messages,
        newListChat,
        serverMessage,
        loadingMessages,
        sendMessage,
        fetchChatMessages,
    };
};

export default useChat;
