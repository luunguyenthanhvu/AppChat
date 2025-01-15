import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { BACKEND_URL_HTTP } from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HubConnection} from '@microsoft/signalr';

interface UserInfo {
  userName: string;
  email: string;
  img: string;

}

interface Messages {
  messageId: string;
  senderId: number;
  receiverId: number;
  content: string;
  isImage: boolean;
  timestamp: string;  // Hoặc Date nếu bạn muốn chuyển đổi nó thành đối tượng Date
}

interface UserListChatResponseDTO {
  userId: number;
  userName: string;
  img: string;
  messageContent?: string;  // Có thể là chuỗi, có thể là null hoặc không có
  isMine: boolean;
  isImage: boolean;
  timestamp: string;  // Nếu timestamp là chuỗi ISO 8601, bạn có thể giữ kiểu string
}
interface UseChatReturn {
  newListChat: string;
  connection: signalR.HubConnection | null;
  serverMessage: string;
  messages: string;
  userInfo: UserInfo;
  sendMessage: (recipientUserId: string, message: string, isImage: boolean) => Promise<void>;
  updateProfile: (email: string, isUpdateImage: boolean, isUpdatePass: boolean) => Promise<void>;
  updatePass: (email: string) => Promise<void>;
  updateChatList: (email1: string, email2: string) => Promise<void>;
  updateChatListWithId: (email1: string, id: string) => Promise<void>;
  sendNotification: (messages: string) => Promise<void>;
}

const useChat = (): {
  updatePass: (email: string) => Promise<void>;
  userInfo: UserInfo;
  newListChat: UserListChatResponseDTO[];
  updateProfile: (email: string, isUpdateImage: boolean, isUpdatePass: boolean) => Promise<void>;
  updateChatList: (email1: string, email2: string) => Promise<void>;
  updateChatListWithId: (email1: string, id: string) => Promise<void>;
  serverMessage: string;
  messages: Messages;
  sendMessage: (recipientUserId, message, isImage) => Promise<void>;
  connection: HubConnection | null;
  sendNotification: (messages: string) => Promise<void>
} => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Messages>({
    messageId: '',
    receiverId: 0,
    senderId: 0,
    content: '',
    timestamp: '',
    isImage: false
  });
  const [newListChat, setNewListChat] = useState<UserListChatResponseDTO[]>([]);
  const [serverMessage, setServerMessage] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userName: '',
    email: '',
    img: '',
  });

  useEffect(() => {
    const createConnection = async () => {
      const token = await AsyncStorage.getItem('token');
      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`http://${BACKEND_URL_HTTP}/Chat?access_token=${token}`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .build();

      hubConnection.on('ReceiveMessage', (message: Messages) => {
        console.log("receive message:", message);
        setMessages(message);
      });

      hubConnection.on('NewListChatReceive', (listChat: UserListChatResponseDTO[]) => {
        try {
          // In dữ liệu nhận được từ SignalR (mảng các đối tượng)
          console.log("Raw newListChat received:", listChat);

          // Cập nhật state trực tiếp với dữ liệu nhận được mà không cần xử lý timestamp
          setNewListChat(listChat);
        } catch (error) {
          console.error("Error processing listChat:", error);
        }
      });



      hubConnection.on('UserInfoUpdate', (userInfo: UserInfo) => {
        setUserInfo({
          userName: userInfo.userName,
          email: userInfo.email,
          img: userInfo.img,
        });
        AsyncStorage.setItem('userName', userInfo.userName);
        AsyncStorage.setItem('email', userInfo.email);
        AsyncStorage.setItem('img', userInfo.img);
      });

      hubConnection.on('UpdatePasswordAccount', (message: string) => {
        setServerMessage(message);
      });

      try {
        await hubConnection.start();
        setConnection(hubConnection);
      } catch (err) {
        console.error('Error connecting to SignalR Hub:', err);
      }
    };
    console.log("Ket noi websocket");
    console.log(connection);
    createConnection();

    return () => {
      if (connection) {
        connection.stop().catch((err) => console.error('Error stopping connection:', err));
      }
    };
  }, []); // Thêm connection vào dependency array


  const sendMessage = async (recipientUserId, message, isImage) => {
    if (connection) {
      try {
        console.log("Sending message:", { recipientUserId, message, isImage });
        await connection.invoke('SendMessage', String(recipientUserId), String(message), Boolean(isImage));
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const updateProfile = async (email: string, isUpdateImage: boolean, isUpdatePass: boolean) => {
    if (connection) {
      try {
        await connection.invoke('UpdateProfile', email, isUpdateImage, isUpdatePass);
      } catch (err) {
        console.error('Error updating profile:', err);
      }
    }
  };

  const updatePass = async (email: string) => {
    if (connection) {
      try {
        await connection.invoke('UpdatePassword', email);
      } catch (err) {
        console.error('Error updating password:', err);
      }
    }
  };

  const updateChatList = async (email1: string, email2: string) => {
    if (connection) {
      try {
        await connection.invoke('UpdateChat', email1, email2);
      } catch (err) {
        console.error('Error updating chat list:', err);
      }
    }
  };

  const updateChatListWithId = async (email1: string, id: string) => {
    if (connection) {
      try {
        await connection.invoke('UpdateChatWithId', email1, id);
      } catch (err) {
        console.error('Error updating chat list with ID:', err);
      }
    }
  };

  const sendNotification = async (messages: string) => {
    if (connection) {
      try {
        await connection.invoke('SendNotification', messages);
      } catch (err) {
        console.error('Error sending notification:', err);
      }
    }
  };

  return {
    newListChat,
    connection,
    serverMessage,
    messages,
    userInfo,
    sendMessage,
    updateProfile,
    updatePass,
    updateChatList,
    updateChatListWithId,
    sendNotification,
  };
};

export default useChat;
