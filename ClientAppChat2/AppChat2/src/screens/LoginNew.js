import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Google Sign-In
  GoogleSignin.configure({
    webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID', // Thay bằng webClientId của bạn
  });

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://<BACKEND_URL_HTTP>/api/UserServices/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', 'Đăng nhập thành công!');
        // Xử lý lưu token hoặc chuyển hướng
      } else {
        Alert.alert('Lỗi', result.message || 'Đăng nhập thất bại.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      // Gửi token đến backend
      const response = await fetch(
        'http://<BACKEND_URL_HTTP>/api/LoginGoogle/google-login-response-dto',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', 'Đăng nhập bằng Google thành công!');
        // Xử lý lưu token hoặc chuyển hướng
      } else {
        Alert.alert('Lỗi', result.message || 'Đăng nhập Google thất bại.');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Hủy', 'Bạn đã hủy đăng nhập bằng Google.');
      } else {
        Alert.alert('Lỗi', 'Không thể đăng nhập bằng Google.');
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{ uri: 'https://zalo-image-placeholder.com/logo.png' }} // Thay link ảnh logo của bạn
        style={styles.logo}
      />

      {/* Tiêu đề */}
      <Text style={styles.title}>Đăng nhập</Text>

      {/* Input cho Email/Số điện thoại */}
      <TextInput
        style={styles.input}
        placeholder="Nhập email hoặc số điện thoại"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Input cho mật khẩu */}
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Nút Đăng nhập */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Đăng nhập</Text>}
      </TouchableOpacity>

      {/* Đăng nhập bằng Google */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={loading}>
        <Text style={styles.googleText}>Đăng nhập bằng Google</Text>
      </TouchableOpacity>

      {/* Đăng ký tài khoản */}
      <TouchableOpacity onPress={() => Alert.alert('Thông báo', 'Chức năng Đăng ký đang phát triển!')}>
        <Text style={styles.registerText}>Bạn chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0084ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#db4437',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  googleText: {
    color: '#fff',
    fontSize: 16,
  },
  registerText: {
    color: '#0084ff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoginScreen;
