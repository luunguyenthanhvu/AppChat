import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const useChat = (token) => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState('');

    useEffect(() => {
        const createConnection = async () => {
            const hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(`https://localhost:7084/Chat?access_token=${token}`, {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets
                })
                .build();
            
            hubConnection.on("ReceiveMessage", (message) => {
                console.log('this is message: ' + message);
                setMessages(message);
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
    }, [token]);

    const sendMessage = async (recipientUserId, message) => {
        if (connection) {
            try {
                console.log(recipientUserId, message)
                await connection.invoke("SendMessage", recipientUserId.toString(), message.toString());
            } catch (err) {
                console.log("send fail: " + err);
            }
        }
    }

    return { connection, messages, sendMessage };
}

export default useChat;
