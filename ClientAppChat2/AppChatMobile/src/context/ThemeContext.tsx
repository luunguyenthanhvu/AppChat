import React, { createContext, useContext, useState, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho ThemeContext
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: ThemeType;
}

// Định nghĩa kiểu cho theme
interface ThemeType {
  backgroundColor: string;
  textColor: string;
  headerColor: string;
  borderColor: string;
  iconColor: string;
  placeholderColor: string;
  primaryColor: string;
  secondaryBackgroundColor: string;
  lightText: string; // Màu chữ cho light text (ví dụ: tin nhắn của bạn)
}

// Định nghĩa light và dark theme
export const lightTheme: ThemeType = {
  backgroundColor: '#fff',
  textColor: '#000',
  headerColor: '#f5f5f5',
  borderColor: '#ddd',
  iconColor: '#000',
  placeholderColor: '#888',
  primaryColor: '#1e90ff', // Màu chính (ví dụ: nút bấm hoặc trạng thái đang hoạt động)
  secondaryBackgroundColor: '#f5f5f5', // Màu nền cho các thành phần phụ
  lightText: '#fff', // Màu chữ cho tin nhắn của bạn
};

export const darkTheme: ThemeType = {
  backgroundColor: '#000',
  textColor: '#fff',
  headerColor: '#444',
  borderColor: '#555',
  iconColor: '#fff',
  placeholderColor: '#666',
  primaryColor: '#1e90ff',
  secondaryBackgroundColor: '#333',
  lightText: '#fff',
};

// Tạo Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Tạo Provider để bọc toàn bộ app
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook để sử dụng ThemeContext
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
