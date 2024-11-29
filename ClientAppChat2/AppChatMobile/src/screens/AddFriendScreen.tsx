import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    StyleSheet,
    Image,
    ActivityIndicator,
    SectionList,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BACKEND_URL_HTTP } from "../config/config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddFriendScreen = ({ navigation }) => {
    const [friendList, setFriendList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('addFriend');
    const [email, setEmail] = useState('');  // Email state
    const [filteredFriendList, setFilteredFriendList] = useState([]);
    const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);

    // Lấy email từ AsyncStorage khi màn hình được render
    useEffect(() => {
        const loadEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setEmail(storedEmail);
                } else {
                    alert('Không tìm thấy email người dùng. Vui lòng đăng nhập lại.');
                }
            } catch (error) {
                console.error('Error loading email:', error);
            }
        };
        loadEmail();
    }, []);

    const fetchPotentialFriends = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/friend-controller/find-potential-friends`, { params: { email } });
            const updatedFriends = response.data.map(friend => ({
                ...friend,
                isRequestSent: friend.friendStatus === 'Pending',
            }));
            setFriendList(updatedFriends);
            setFilteredFriendList(updatedFriends); // Set danh sách bạn bè đã lọc ban đầu
        } catch (error) {
            alert('Error fetching potential friends.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingRequests = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/friend-controller/pending-friend-requests`, { params: { email } });
            setPendingRequests(response.data);
            setFilteredPendingRequests(response.data); // Set danh sách yêu cầu kết bạn đã lọc ban đầu

        } catch (error) {
            alert('Error fetching pending requests.');
        } finally {
            setLoading(false);
        }
    };

    const fetchContacts = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/friend-controller/contacts`, { params: { email } });
            const groupedContacts = groupByAlphabet(response.data); // Nhóm danh bạ theo chữ cái
            setContacts(groupedContacts);
            setFilteredContacts(groupedContacts); // Lưu danh bạ đã nhóm
        } catch (error) {
            alert('Error fetching contacts.');
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/group-controller/groups`, { params: { email } });
            setGroups(response.data);
            setFilteredGroups(response.data); // Set danh sách nhóm đã lọc ban đầu

        } catch (error) {
            alert('Error fetching groups.');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'addFriend') {
            fetchPotentialFriends();
        } else if (tab === 'pendingRequests') {
            fetchPendingRequests();
        } else if (tab === 'contacts') {
            fetchContacts();
        } else if (tab === 'groups') {
            fetchGroups();
        }
    };

    const handleAddFriend = async (friendEmail) => {
        if (!email) return;
        try {
            // Gửi yêu cầu POST để gửi yêu cầu kết bạn lên server
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/friend-controller/send-friend-request`, {
                senderEmail: email,
                recipientEmail: friendEmail
            });

            // Nếu thành công, cập nhật cả friendList và filteredFriendList
            if (response.status === 200) {
                setFriendList(prevState => {
                    const updatedList = prevState.map(friend =>
                      friend.email === friendEmail ? { ...friend, isRequestSent: true } : friend
                    );
                    const filteredList = updatedList.filter(friend =>
                      friend.username.toLowerCase().includes(searchUser.toLowerCase())
                    );
                    setFilteredFriendList(filteredList);
                    return updatedList;
                });
            } else {
                alert('Error sending friend request.');
            }
        } catch (error) {
            alert('Error sending friend request.');
        }
    };

    const handleCancelRequest = async (friendEmail) => {
        if (!email) return;
        try {
            // Gửi yêu cầu POST để hủy yêu cầu kết bạn
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/friend-controller/cancel-friend-request`, {
                senderEmail: email,
                recipientEmail: friendEmail
            });

            // Nếu thành công, cập nhật cả friendList và filteredFriendList
            if (response.status === 200) {
                setFriendList(prevState => {
                    const updatedList = prevState.map(friend =>
                      friend.email === friendEmail ? { ...friend, isRequestSent: false } : friend
                    );
                    const filteredList = updatedList.filter(friend =>
                      friend.username.toLowerCase().includes(searchUser.toLowerCase())
                    );
                    setFilteredFriendList(filteredList);
                    return updatedList;
                });
            } else {
                alert('Error cancelling friend request.');
            }
        } catch (error) {
            alert('Error cancelling friend request.');
        }
    };



    const handleSearch = (text) => {
        setSearchUser(text);
        if (activeTab === 'addFriend') {
            const filteredList = friendList.filter(friend =>
              friend.username.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredFriendList(filteredList);
        } else if (activeTab === 'pendingRequests') {
            const filteredList = pendingRequests.filter(request =>
              request.username.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredPendingRequests(filteredList);
        } else if (activeTab === 'contacts') {
            const filteredList = contacts.filter(contact =>
              contact.username.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredContacts(filteredList);
        } else if (activeTab === 'groups') {
            const filteredList = groups.filter(group =>
              group.groupName.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredGroups(filteredList);
        }
    };

    const renderAddFriendItem = ({ item }) => (
      <View style={styles.addFriendItem}>
          <Image source={{ uri: item.img }} style={styles.addFriendAvatar} />
          <Text style={styles.addFriendName}>{item.username}</Text>
          <TouchableOpacity
            style={item.isRequestSent ? styles.cancelButton : styles.addFriendButton}
            onPress={() => item.isRequestSent ? handleCancelRequest(item.email) : handleAddFriend(item.email)}
          >
              <Icon name={item.isRequestSent ? "user-times" : "user-plus"} size={20} color="#fff" />
              <Text style={styles.addFriendText}>{item.isRequestSent ? 'Cancel Request' : 'Add Friend'}</Text>
          </TouchableOpacity>
      </View>
    );

    const renderFriendRequestItem = ({ item }) => (
      <View style={styles.requestItem}>
          <Image source={{ uri: item.img }} style={styles.avatar} />
          <Text style={styles.requestName}>{item.username}</Text>
          <View style={styles.requestActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleAddFriend(item.email)}>
                  <Text style={styles.actionText}>Chấp nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleCancelRequest(item.email)}>
                  <Text style={styles.actionText}>Từ chối</Text>
              </TouchableOpacity>
          </View>
      </View>
    );
    // const renderContactItem = ({ item }) => (
    //   <View style={styles.contactItem}>
    //       <Image source={{ uri: item.img }} style={styles.contactAvatar} />
    //       <Text style={styles.contactName}>{item.username}</Text>
    //       <View style={styles.callButtonContainer}>
    //           <TouchableOpacity
    //             style={styles.callButton}
    //             onPress={() => console.log(`Calling ${item.username} with voice...`)}  // Thay thế bằng hành động gọi voice
    //           >
    //               <Icon name="phone" size={20} color="#fff" />
    //           </TouchableOpacity>
    //
    //           <TouchableOpacity
    //             style={styles.callButton}
    //             onPress={() => console.log(`Calling ${item.username} with video...`)}  // Thay thế bằng hành động gọi video
    //           >
    //               <Icon name="video-camera" size={20} color="#fff" />
    //           </TouchableOpacity>
    //       </View>
    //   </View>
    // );

    const groupByAlphabet = (contacts) => {
        const grouped = contacts.reduce((result, contact) => {
            const firstLetter = contact.username.charAt(0).toUpperCase();
            if (!result[firstLetter]) {
                result[firstLetter] = [];
            }
            result[firstLetter].push(contact);
            return result;
        }, {});

        // Chuyển đổi object thành array và sắp xếp theo chữ cái
        return Object.keys(grouped).sort().map(letter => ({
            title: letter,
            data: grouped[letter],
        }));
    };

    const renderContactItem = ({ item }) => (
      <View style={styles.contactItem}>
          <Image source={{ uri: item.img }} style={styles.contactAvatar} />
          <Text style={styles.contactName}>{item.username}</Text>
          <View style={styles.callButtonContainer}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => console.log(`Calling ${item.username} with voice...`)} // Thay thế bằng hành động gọi voice
              >
                  <Icon name="phone" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callButton}
                onPress={() => console.log(`Calling ${item.username} with video...`)} // Thay thế bằng hành động gọi video
              >
                  <Icon name="video-camera" size={20} color="#fff" />
              </TouchableOpacity>
          </View>
      </View>
    );

    const renderContacts = () => (
      <SectionList
        sections={filteredContacts}
        keyExtractor={(item, index) => item.userId.toString()}
        renderItem={renderContactItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text> // Tiêu đề nhóm chữ cái
        )}
      />
    );
    const renderGroupItem = ({ item }) => (
      <View style={styles.contactItem}>
          <Image source={{ uri: item.groupAvatar }} style={styles.avatar} />
          <Text style={styles.contactName}>{item.groupName}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => console.log(`Join group ${item.groupName}`)}
          >
              <Icon name="group" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Join Group</Text>
          </TouchableOpacity>
      </View>
    );

    return (
      <View style={styles.container}>
          <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="arrow-left" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Kết Bạn</Text>
          </View>

          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={searchUser}
            onChangeText={handleSearch}
          />

          <View style={styles.tabContainer}>fetchContacts
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'addFriend' && styles.activeTab]}
                onPress={() => handleTabChange('addFriend')}
              >
                  <Text style={[styles.tabText, activeTab === 'addFriend' && styles.activeTabText]}>Add Friend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'pendingRequests' && styles.activeTab]}
                onPress={() => handleTabChange('pendingRequests')}
              >
                  <Text style={[styles.tabText, activeTab === 'pendingRequests' && styles.activeTabText]}>Pending Requests</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'contacts' && styles.activeTab]}
                onPress={() => handleTabChange('contacts')}
              >
                  <Text style={[styles.tabText, activeTab === 'contacts' && styles.activeTabText]}>Contacts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'groups' && styles.activeTab]}
                onPress={() => handleTabChange('groups')}
              >
                  <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Groups</Text>
              </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <>
                {activeTab === 'addFriend' ? (
                  <FlatList
                    data={filteredFriendList}
                    keyExtractor={item => item.userId.toString()}
                    renderItem={renderAddFriendItem}
                  />
                ) : activeTab === 'pendingRequests' ? (
                  <FlatList
                    data={filteredPendingRequests}
                    keyExtractor={item => item.userId.toString()}
                    renderItem={renderFriendRequestItem}
                  />
                ) : activeTab === 'contacts' ? (
                  renderContacts()
                ) : (
                  <FlatList
                    data={filteredGroups}
                    keyExtractor={item => item.groupId.toString()}
                    renderItem={renderGroupItem}
                  />
                )}
            </>
          )}
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    tabButton: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    activeTab: {
        backgroundColor: '#007bff',
    },
    tabText: {
        fontSize: 16,
        color: '#000',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    searchBar: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 10,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    requestItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    contactName: {
        fontSize: 16,
        flex: 1,
    },
    requestName: {
        fontSize: 16,
        flex: 1,
    },
    requestActions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    actionText: {
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 5,
    },
    addFriendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    addFriendName: {
        fontSize: 16,
        flex: 1,
    },
    addFriendAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    addFriendButton: {
        backgroundColor: '#007bff',  // Màu xanh cho nút "Add Friend"
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',  // Màu đỏ cho nút "Cancel Request"
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addFriendText: {
        color: '#fff',
        marginLeft: 5,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    contactName: {
        fontSize: 16,
        flex: 1,
    },
    contactAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    callButtonContainer: {
        flexDirection: 'row',   // Đặt các nút gọi ngang với nhau
        alignItems: 'center',
    },
    // **Style cho từng nút gọi**
    callButton: {
        width: 50,            // Đảm bảo nút là hình tròn (có chiều rộng và chiều cao giống nhau)
        height: 50,
        borderRadius: 25,     // Để tạo hình tròn
        backgroundColor: '#dc8952', // Màu nền xanh
        justifyContent: 'center',  // Căn giữa icon trong nút
        alignItems: 'center', // Căn giữa icon trong nút
        marginHorizontal: 10, // Khoảng cách giữa các nút
    },
    callButtonText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default AddFriendScreen;
