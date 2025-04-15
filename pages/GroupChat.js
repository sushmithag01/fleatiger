import React, { useState, useEffect, useCallback } from 'react';
import { ButtonGroup } from '@rneui/themed';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import styles from '../Common.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
  Actions,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Consumer } from 'react-native-paper/lib/typescript/src/core/settings';
import { AddGroupChatApi, InsertChatApi, NotificationReadApi } from './API/ApiCalls';
import Loader from './CommonScreens/Loader';
import IconsMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import notifee, { AndroidImportance } from '@notifee/react-native';

let auth_email;
let auth_token;
let auth_user_id;
let auth_first_name;
let auth_last_name;
let auth_pet_id;
let auth_pet_name;
let auth_pet_image;

async function authUserInfo() {
  auth_email = await AsyncStorage.getItem('email');
  auth_token = await AsyncStorage.getItem('token');
  auth_user_id = await AsyncStorage.getItem('userId');
  auth_first_name = await AsyncStorage.getItem('firstName');
  auth_last_name = await AsyncStorage.getItem('lastName');
  auth_pet_id = await AsyncStorage.getItem('PetId');
  auth_pet_name = await AsyncStorage.getItem('PetName');
  auth_pet_image = await AsyncStorage.getItem('PetImage');
}
const GroupChat = ({ route, navigation }) => {
  let header = navigation;
  const route_props = route.params.userInfo;
  const chat_type = route.params.chat_type;
  const [allmessages, setAllMessages] = useState([]);
  const [recieverInfo, setRecieverInfo] = useState([]);
  const [chatSize, setChatSize] = useState('');
  const [messages, setMessages] = useState([]);
  const [senderInfo, setSenderInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [channel_id, setChannelId] = useState(route_props?.group_id ? 'fleatigerGroup' + '_' + route_props.group_id : '');
  const isFocused = useIsFocused();
  const [chatType, setChatType] = useState(chat_type);

  useEffect(() => {
    setMessages([]);
    if (isFocused) {
      setTimeout(() => {
        navigation.setOptions({
          header: props => (
            <>
              <View
                style={[
                  styles.headerhomesingle,
                  styles.chatsignlemain,
                  { marginTop: 20 },
                ]}>
                <TouchableOpacity
                  style={[styles.backinnert, styles.chatsingle, { marginHorizontal: 5 }]}
                  onPress={() =>
                    navigation.navigate('MessagesStackNavigator', {
                      screen: 'ChatListing', params: { index: 0 }
                    })
                  }>
                  <Ionicons color="#223656" name="chevron-back" size={23} />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Messages', {
                        screen: 'GroupInner',
                        params: { groupId: route_props?.group_id }
                      })

                    }}>
                    <View>
                      <Image
                        source={

                          recieverInfo.group_image ? { uri: recieverInfo.group_image } : require('../assets/pic9.png')
                        }
                        style={styles.chatimg}></Image>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Messages', {
                        screen: 'GroupInner',
                        params: { groupId: route_props?.group_id }
                      })

                    }}>
                    <View style={{ width: 250 }}>
                      <Text style={styles.backbtntext} numberOfLines={2}>
                        {recieverInfo.group_name}
                      </Text>
                      <Text style={styles.secext} numberOfLines={2}>
                        {' '}
                        {recieverInfo.group_desc}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ),
        });
      }, 500);
    }
  }, [route, route_props, isFocused, recieverInfo]);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      // Set receiver info from route params
      setRecieverInfo(route_props);
      setChatType(chat_type);

      // Get sender info from storage
      await authUserInfo();
      const sender = {
        _id: auth_pet_id,
        name: auth_pet_name,
        email: auth_email,
        user_id: auth_user_id,
        user_name: auth_first_name,
        auth_pet_image: JSON.parse(auth_pet_image),
      };
      setSenderInfo(sender);
      // Set channel ID if friend_list_id exists
      if (route_props?.group_id) {
        const channel = 'fleatigerGroup' + '_' + route_props.group_id;
        setChannelId(channel);

        // Setup Firebase listener
        const unsubscribe = await handleFirebase(channel);

        // Update read status
        await massupdateFirebasesers(channel);
        await handleNotificationReadCount(channel);

        return () => unsubscribe(); // Cleanup on unmount
      }

      setLoading(false);
    };

    if (isFocused) {
      initializeData();
    }
  }, [isFocused, route_props, chat_type]);


  useEffect(() => {
    massupdateFirebasesers()
      .then(() => {
        handleNotificationReadCount();
      })
  }, [channel_id, isFocused, senderInfo]);




  // Update read status in Firebase
  async function massupdateFirebasesers(channel) {
    if (!channel) return;

    try {
      const usersQuerySnapshot = await firestore().collection(channel).get();
      const batch = firestore().batch();

      usersQuerySnapshot.forEach(documentSnapshot => {
        const docData = documentSnapshot.data();
        if (auth_user_id === docData.received) {
          const docRef = firestore()
            .collection(channel)
            .doc(documentSnapshot.id);
          batch.update(docRef, { read: true });
        }
      });

      await batch.commit();
    } catch (error) {
      console.log("Update read status error", error);
    }
  }


  // Handle Firebase messages
  const handleFirebase = useCallback(async (channel) => {
    try {
      console.log("channel", channel)
      const unsubscribe = firestore()
        .collection(channel)
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          if (!querySnapshot || querySnapshot.empty) {
            console.warn('No messages found');
            return;
          }
          const messagesFirestore = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              _id: data._id,
              text: data.text,
              createdAt: data.createdAt.toDate(),
              sent: data.sent,
              read: data.read,
              received: data.received,
              image: data.image,
              user: {
                _id: data.user?._id,
                name: data.user?.name,
                avatar: data.user?.image
              },
            };
          });
          setMessages(messagesFirestore);
        });

      return unsubscribe;
    } catch (error) {
      console.log("Firebase error", error);
      return () => { }; // Return empty cleanup function
    }
  }, [recieverInfo]);

  // Handle sending messages
  async function handleSend(messages) {
    if (!channel_id) {
      console.error("No channel ID set");
      return;
    }

    try {
      const message = messages[0];
      await firestore()
        .collection(channel_id)
        .add({
          _id: message._id,
          createdAt: message.createdAt,
          text: message.text,
          user: {
            _id: message.user._id,
            name: message.user.name,
            email: message.user.email,
            user_id: message.user.user_id,
            user_name: message.user.user_name,
            image: senderInfo?.auth_pet_image
          },
          sent: true,
          read: false,
          received: recieverInfo.group_id,
          name: recieverInfo.group_name,
          receiver_profile_image: recieverInfo.group_image,
          receiver_group_id: recieverInfo.group_id,
        });
      await handleInsertGroupChat(messages);
    } catch (error) {
      console.log("Send message error", error);
    }
  }

  function renderInputToolbar(props) {
    return (
      // <InputToolbar {...props} containerStyle={styles.toolbar}
      //  textInputProps={Platform.OS==='android'?{multiline: true,marginBottom:10,marginTop:10,style: {lineHeight: 25, width: 290},}:{multiline: true,marginBottom:20,marginTop:10,style: {lineHeight: 20, width: 290},}}
      //   placeholder="Type your message here..." />

      //   <InputToolbar
      //     {...props}
      //     textInputProps={Platform.OS==='android'?{multiline: true,marginBottom:10,marginTop:10,style: {lineHeight: 25, width: 290},}:
      //     {multiline: true,marginBottom:20,marginTop:10,style: {lineHeight: 20, width: 290},}}

      //     containerStyle={styles.toolbar}
      //     placeholder="Type your message here...">

      //     </InputToolbar>

      <InputToolbar {...props} containerStyle={styles.toolbar}>
        <ScrollView
          keyboardShouldPersistTaps="handled" // Ensure taps outside text input dismiss keyboard
        >
          <TextInput
            multiline
            placeholder="Type your message here..."
            {...props.textInputProps}
          />
        </ScrollView>
      </InputToolbar>
    );
  }
  function renderSend(props) {
    return (
      <Send {...props}>
        <View
          style={{
            marginRight: -50,
            marginBottom: 0,
            width: 80,
            marginLeft: 30,
          }}>
          <Icons name="send-circle" size={38} color="#CE5757" />
        </View>
      </Send>
    );
  }
  const handleInsertGroupChat = async (data) => {
    let payload = {
      channel_id: channel_id,
      group_id: recieverInfo.group_id,
      pet_id: data[0].user._id,
      user_id: data[0].user.user_id,
      message: data[0].text,
      platform: Platform.OS
    }
    const Response = await AddGroupChatApi(payload);
    console.log("AddGroupChatApi", Response, payload)
  }



  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#92bcbf',
            marginBottom: 20,
            lineHeight: 25,
          },
          left: {
            backgroundColor: '#fff',
            marginBottom: 20,
            lineHeight: 22,
          },
        }}
        textStyle={{
          right: {
            color: '#000',
            paddingBottom: 2,
          },
          left: {
            color: '#000',
            paddingBottom: 2,
          },
        }}
      />
    );
  }

  const appendMessages = useCallback(
    messages => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
    },
    [messages],
  );

  const renderTick = props => {
    return (
      <Text
        style={
          props.sent & props.read
            ? { color: '#0064FE', marginRight: 5 }
            : {
              color: '#CE5757',
              marginRight: 5,
            }
        }>
        {props.sent && props.read ? '✓✓' : props.read || props.sent ? '✓' : ''}
      </Text>
    );
  };

  const handleNotificationReadCount = async () => {
    let payload = {
      notify_type_id: 'chat',
      channel_id: channel_id,
      user_id: await AsyncStorage.getItem('userId'),
    };
    const updateReadCount = await NotificationReadApi(payload);
    if (updateReadCount.status === 200) {
      if (updateReadCount.badge) {
        if (Platform.OS === 'ios') {
          const badgeCount = updateReadCount.badge;
          await notifee.setBadgeCount(badgeCount);
        } else {
          const badgeCount = updateReadCount.data.badge;
          await notifee.setBadgeCount(badgeCount);
        }
      } else {
        await notifee.setBadgeCount(0);
      }
    }
  };

  const renderActions = props => {
    const options = {
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.5,
      mediaType: 'photo',
      includeBase64: true,
      presentationStyle: 'pageSheet',
      cameraType: 'back',
    };
    return (
      <Actions
        containerStyle={{
          position: 'absolute',
          right: 60,
          bottom: '10%',
          zIndex: 999999,
        }}
        {...props}
        icon={() => (
          <Text style={styles.attach}>
            <IconsMaterialIcons name="attach-file" size={25} color="#CE5757" />
          </Text>
        )}
        options={{
          Image: async props => {
            // You can also use as a promise without 'callback':
            const result = await launchImageLibrary(options);
            const imgbase64 = result.assets[0].base64;
            var imgURI = result.assets[0].uri;
            // console.log('imgURI', imgURI);
            var filename = imgURI.substring(imgURI.lastIndexOf('/') + 1);
            // console.log('filename', imgURI);
            try {
              const file = await storage().ref(filename).putFile(imgURI);
              console.log('file', file);
              const url = await storage().ref(filename).getDownloadURL();
              var image_data = [
                {
                  image: url,
                  _id: uuid.v4(),
                  user: senderInfo,
                  createdAt: new Date(),
                  text: '',
                  sent: true,
                  read: false,
                  received: recieverInfo.pet_id,
                  name: recieverInfo.pet_name,
                  receiver_profile_image: recieverInfo.pet_image_path,
                  receiver_friend_list_id: recieverInfo.friend_list_id,
                },
              ];
              // messages.push(image_data);
              const writes = image_data.map(m =>
                firestore().collection(channel_id).add(m),
              );
              await Promise.all(writes);
              console.log(url);
            } catch (e) {
              console.log('error', e);
            }
          },
          Cancel: props => {
            console.log('Cancel');
          },
        }}
        onSend={args => console.log(args)}
      />
    );
  };

  const renderAvatar = props => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ marginBottom: 20 }}>
        {/* Customize the color and appearance of the avatar */}

        <Image
          source={
            recieverInfo.pet_image_path == 'https://devapi.fleatiger.com/'
              ? require('../assets/pic9.png')
              : { uri: recieverInfo.pet_image_path }
          }
          style={styles.receivechatimg}></Image>
      </View>
      {/* Use the default renderAvatar provided by GiftedChat */}
    </View>
  );


  function renderLoading() {
    return (
      <View style={styles.loadingcontainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          style={{ opacity: 1 }}
          color="#999999"
        />
      </View>
    );
  }
  return (
    <>
      <GiftedChat
        // renderAvatar={renderAvatar}
        renderUsernameOnMessage={true}
        messages={messages}
        user={senderInfo}
        onSend={handleSend}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderBubble={renderBubble}
        scrollToBottom={true}
        alwaysShowSend={true}
        // renderActions={() => renderActions()}
        // renderLoading={renderLoading}
        renderTicks={renderTick}
      // {...(Platform.OS !== 'android'
      //   ? {
      //       bottomOffset: 62,
      //     }
      //   : {})}
      />
    </>
  );
};
export default GroupChat;
