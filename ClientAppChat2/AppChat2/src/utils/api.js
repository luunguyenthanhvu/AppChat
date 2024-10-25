import axios from 'axios';
import { API_URL_HTTP, API_URL_HTTPS } from '@env';  // Sử dụng biến môi trường từ file .env

// Thiết lập baseURL từ biến môi trường
const api = axios.create({
    baseURL: `http://${API_URL_HTTP}`,  // Thêm "http://" ở đây
    headers: {
        'Content-Type': 'application/json',
    },
});
// Chat APIs
export const loginUser = async (data) => {
    try {
        const response = await axios.post('/api/UserServices/login', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUserChats = async (userId) => {
    try {
        const response = await axios.get(`/api/chat/user-chat-list?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchFriendChats = async (userId) => {
    try {
        const response = await axios.get(`/api/chat/friend-chat-list?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchChatMessages = async (email, userId) => {
    try {
        const response = await axios.get(`/api/chat/messages/${email}/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cloudinary APIs
export const getCloudinarySignature = async () => {
    try {
        const response = await axios.get('/api/cloudinary/get-signature');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeCloudinaryImage = async (public_id) => {
    try {
        const response = await axios.post(`/api/cloudinary/remove-image/${public_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Friend APIs
export const findPotentialFriends = async () => {
    try {
        const response = await axios.get('/api/friend-controller/find-potential-friends');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendFriendRequest = async (data) => {
    try {
        const response = await axios.post('/api/friend-controller/send-friend-request', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const acceptFriendRequest = async (data) => {
    try {
        const response = await axios.post('/api/friend-controller/accept-friend-request', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const declineFriendRequest = async (data) => {
    try {
        const response = await axios.post('/api/friend-controller/decline-friend-request', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const confirmFriend = async (data) => {
    try {
        const response = await axios.post('/api/friend-controller/confirm-friend', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const cancelFriendRequest = async (data) => {
    try {
        const response = await axios.post('/api/friend-controller/cancel-friend-request', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteFriend = async (friendId) => {
    try {
        const response = await axios.delete(`/api/friend-controller/delete-friend?friendId=${friendId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const pendingFriendRequests = async () => {
    try {
        const response = await axios.get('/api/friend-controller/pending-friend-requests');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// User APIs
export const addUser = async (data) => {
    try {
        const response = await axios.post('/api/User/add-user', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeUser = async (userId) => {
    try {
        const response = await axios.delete(`/api/User/remove-user/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get('/api/User/all-users');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const countAllUsers = async () => {
    try {
        const response = await axios.get('/api/User/count-all-users');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (data) => {
    try {
        const response = await axios.put('/api/User/update-user-infor-profile', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserAvatar = async (data) => {
    try {
        const response = await axios.put('/api/User/update-user-avatar', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// User Services APIs
export const registerUser = async (data) => {
    try {
        const response = await axios.post('/api/UserServices/register', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUserServices = async (data) => {
    try {
        const response = await axios.post('/api/UserServices/login', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyAccount = async (data) => {
    try {
        const response = await axios.post('/api/UserServices/verifyAccount', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post('/api/UserServices/ForgotPassword', { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (data) => {
    try {
        const response = await axios.post('/api/UserServices/ChangePassword', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// VuLuuMarkUp APIs
export const updateImage = async (data) => {
    try {
        const response = await axios.put('/api/mark-up/user-info/update-image', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserInfoByEmail = async (email) => {
    try {
        const response = await axios.get(`/api/mark-up/user-info/details-email?email=${email}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserInfoById = async (id) => {
    try {
        const response = await axios.get(`/api/mark-up/user-info/details-id?id=${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserInfo = async (data) => {
    try {
        const response = await axios.put('/api/mark-up/user-info/update-info', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
