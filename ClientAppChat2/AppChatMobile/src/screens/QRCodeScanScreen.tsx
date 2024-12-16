import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";  // Import axios
import { BACKEND_URL_HTTP } from "../config/config";

const dWidth = Dimensions.get("window").width;
const clr1 = "mediumseagreen";

const QRCodeScanScreen: React.FC = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");  // State để lưu email
  const [qrCode, setQrCode] = useState<string>("");  // State để lưu mã QR
  const [scanned, setScanned] = useState<boolean>(false);  // Trạng thái để kiểm soát quét QR

  // Lấy email từ AsyncStorage khi component được render
  useEffect(() => {
    const getEmailFromAsyncStorage = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail); // Cập nhật email vào state
      }
    };

    getEmailFromAsyncStorage();
  }, []);

  // Hàm quét QR Code
  const onQrRead = (qrtext: string | null) => {
    if (qrtext && !scanned) {  // Kiểm tra nếu chưa quét và có mã QR
      setQrCode(qrtext);
      setScanned(true);  // Đánh dấu là đã quét
      sendFriendRequest(qrtext);  // Gọi API khi quét thành công

      // Thiết lập timeout để cho phép quét lại sau 5 giây (có thể điều chỉnh)
      setTimeout(() => {
        setScanned(false);  // Cho phép quét lại sau timeout
      }, 5000); // 5 giây
    }
  };

  // Gửi yêu cầu kết bạn tới API
  const sendFriendRequest = async (recipientEmail: string) => {
    if (!email) {
      console.log("Email is not available");
      alert("Email is not available");
      return;
    }

    console.log("Sending friend request...");
    console.log("Sender Email:", email);
    console.log("Recipient Email:", recipientEmail);

    try {
      const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/friend-controller/send-friend-request`, {
        senderEmail: email,
        recipientEmail: recipientEmail,
      });

      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        console.log("Friend request sent successfully:", response.data);
        alert("Friend request sent successfully!");
        navigation.goBack();  // Trở về ProfileScreen sau khi gửi yêu cầu kết bạn
      } else {
        console.error("Unexpected status code:", response.status);
        alert("Unexpected error: " + response.status);
      }
    } catch (error) {
      // In chi tiết lỗi từ axios hoặc từ server
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Server response error:", error.response.data);
          alert("Error from server: " + error.response.data);
        } else if (error.request) {
          console.error("No response from server:", error.request);
          alert("No response from server. Please check your internet connection.");
        } else {
          console.error("Unexpected error:", error.message);
          alert("An unexpected error occurred: " + error.message);
        }
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <View style={styles.page}>
      <Ionicons
        name={"scan-circle-outline"}
        size={qrCode ? dWidth * 0.4 : dWidth * 0.75}
        color={clr1}
      />
      <Text style={{ fontSize: 16, color: "black", textAlign: "center", marginVertical: 10 }}>
        {qrCode ? "QR Value: " + qrCode : "Scan a QR Code"}
      </Text>

      <QRScanner onRead={onQrRead} />
    </View>
  );
};

const QRScanner: React.FC<{ onRead: (qrCode: string | null) => void }> = (props) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const device = useCameraDevice("back");

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      console.log("onCodeScanned ", codes);
      console.log("onCodeScanned value", codes[0].value);
      props.onRead(codes[0].value);  // Gọi callback khi quét được mã QR
    },
  });

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === "granted");
      if (permission !== "granted") {
        Alert.alert("Permission Denied", "Camera access is required for QR scanning.");
      }
    };

    requestCameraPermission();
  }, []);

  if (device == null || !hasPermission) {
    return null;  // Nếu không có quyền hoặc không có camera, không làm gì
  }

  return (
    <View style={styles.page2}>
      <Camera
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </View>
  );
};

export default QRCodeScanScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  page2: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
