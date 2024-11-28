// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
//
// interface CallScreenProps {
//     navigation: any; // Bạn có thể thay thế `any` bằng kiểu cụ thể cho navigation của bạn
//     userID: string;
//     userName: string;
//     callID: string;
//     yourAppID: number;  // appID nên là kiểu number, nếu nó là chuỗi, hãy điều chỉnh lại
//     yourAppSign: string; // appSign là kiểu string
// }
//
// const CallScreen: React.FC<CallScreenProps> = (props) => {
//     const { userID, userName, callID, yourAppID, yourAppSign, navigation } = props;
//
//     return (
//         <View style={styles.container}>
//             <ZegoUIKitPrebuiltCall
//                 appID={yourAppID}
//                 appSign={yourAppSign}
//                 userID={userID} // userID có thể là một số điện thoại hoặc userID trong hệ thống của bạn
//                 userName={userName}
//                 callID={callID} // callID có thể là một chuỗi duy nhất
//                 config={{
//                     // Sử dụng cấu hình cuộc gọi video 1-1
//                     ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
//                     onCallEnd: (callID, reason, duration) => {
//                         // Khi cuộc gọi kết thúc, điều hướng về trang HomePage
//                         navigation.navigate('HomePage');
//                     },
//                 }}
//             />
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 0,
//     },
// });
//
// export default CallScreen;
