import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const useChat = (token) => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState('');

    useEffect(() => {
        const createConnection = async () => {
            const hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('https://localhost:7084/Chat', {
                    accessTokenFactory: () => token,
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets
                })
                .build();
            
            hubConnection.on("ReciveMessages", (message) => {
                setMessages(message)
            })
            
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
                connection.stop();
            }
        }
    }, [token]);

    const sendMessage = async (recipientUserId, message) => {
        if (connection) {
            try {
                console.log(recipientUserId, message)
                await connection.invoke("SendMessage", recipientUserId, message);
            } catch (err) {
                console.error("send fail" + err);
            }
        }
    }
    return { connection, messages, sendMessage };
}

export default useChat;