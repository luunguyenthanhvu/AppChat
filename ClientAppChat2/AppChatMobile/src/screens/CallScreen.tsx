import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CallScreen = ({ route, navigation }) => {
  const { userID, userName, callType } = route.params;  // Thêm callType để biết là Video Call hay Voice Call

  const [callStatus, setCallStatus] = useState('connecting');
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');  // Kiểm tra nếu là Video Call
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm kết thúc cuộc gọi và quay lại màn hình trước đó
  const endCall = () => {
    setCallStatus('ended');
    setIsLoading(false);
    navigation.goBack();  // Quay lại màn hình trước khi kết thúc cuộc gọi
  };

  // Hàm để bật/tắt video
  const toggleVideo = () => {
    if (callType === 'audio') return;  // Không cho phép thay đổi video khi là Voice Call
    setIsVideoEnabled(prevState => !prevState);
  };

  // Hàm bật/tắt micro
  const toggleMute = () => {
    setIsMuted(prevState => !prevState);
  };

  // Hàm để bắt đầu cuộc gọi
  const startCall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCallStatus('ongoing');
      setIsLoading(false);
    }, 3000);
  };

  useEffect(() => {
    startCall();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Connecting...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>In Call</Text>
      </View>

      <View style={styles.callInfo}>
        <Image source={{ uri: `https://www.example.com/avatar/${userID}` }} style={styles.avatar} />
        <Text style={styles.contactName}>{userName}</Text>
        <Text style={styles.callStatus}>{callStatus === 'ongoing' ? 'Call in progress' : 'Connecting...'}</Text>
      </View>

      <View style={styles.controlPanel}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          <Icon name={isMuted ? "microphone-slash" : "microphone"} size={30} color={isMuted ? "#ff4d4d" : "#fff"} />
          <Text style={styles.controlText}>Mute</Text>
        </TouchableOpacity>

        {/* Chỉ hiển thị nút video nếu là Video Call */}
        {callType === 'video' && (
          <TouchableOpacity style={styles.controlButton} onPress={toggleVideo}>
            <Icon name={isVideoEnabled ? "video-camera" : "video-slash"} size={30} color={isVideoEnabled ? "#fff" : "#ff4d4d"} />
            <Text style={styles.controlText}>Video</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.endCallButton, styles.controlButton]} onPress={endCall}>
          <Icon name="phone" size={30} color="#fff" />
          <Text style={styles.controlText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  callInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  contactName: {
    fontSize: 20,
    color: '#fff',
  },
  callStatus: {
    color: '#aaa',
    fontSize: 16,
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlText: {
    color: '#fff',
    marginTop: 5,
  },
  endCallButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 50,
    padding: 20,
  },
});

export default CallScreen;
