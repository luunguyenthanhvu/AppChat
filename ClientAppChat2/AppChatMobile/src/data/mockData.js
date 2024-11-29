// src/data/mockData.js

export const mockUsers = [
  {
    id: 1,
    userName: 'Nguyễn Huy',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    phoneNumber: '0123456789',
    email: 'huy@example.com',
    status: 'Đang online',
    bio: 'Lập trình viên Frontend.',
    notifications: true,
    mediaFiles: ['image1.jpg', 'video1.mp4'],
  },
  {
    id: 2,
    userName: 'Trung Duy',
    avatar: 'https://randomuser.me/api/portraits/men/13.jpg',
    phoneNumber: '0987654321',
    email: 'trung@example.com',
    status: 'Đang offline',
    bio: 'Sinh viên năm cuối.',
    notifications: false,
    mediaFiles: ['image2.jpg', 'video2.mp4'],
  },
  // Thêm các user giả khác nếu cần
];
