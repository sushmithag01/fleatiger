import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import styles from '../Common.css';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  NavigationContainer,
  DrawerActions,
  useIsFocused,
} from '@react-navigation/native';
import Svg, {
  Path,
  G,
  Defs,
  ClipPath,
  Circle,
  Mask,
  Pattern,
  Use,
  xlinkHref,
  style,
} from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AddNewChat from './AddNewChat';
import {chatHighlightApi, NotificationBadgeCountApi} from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactSeller from './ContactSeller';

const TopHeader = props => {
  const isFocused = useIsFocused();
  const [openFriendList, setopenFriendList] = useState(false);
  const [chatNotify, setChatnotify] = useState(0);
  const navigation = useNavigation();
  const [chatbadge, setChatBadge] = useState(0);
  const [notificationbadge, setNotificationBadge] = useState(0);

  useEffect(() => {
    notificationHilightHandler();
    badgeCountHandler();
  }, [isFocused, chatNotify]);

  const handleIcon = async () => {
    if (props.pageName !== 'chat') {
      navigation.navigate('MessagesStackNavigator', {screen: 'ChatListing',params: { index: 0 }});
    } else {
      handleRequestNewChat();
    }
  };
  // hightlight chat based on unread notification
  const notificationHilightHandler = async () => {
    let payload = {
      pet_id: parseInt(await AsyncStorage.getItem('PetId')),
      user_id: await AsyncStorage.getItem('userId'),
      notify_type_id: 'chat',
    };
    const gethiglight = await chatHighlightApi(payload);
    setChatnotify(gethiglight.data.length > 0 ? 1 : 0);
  };

  const handleRequestNewChat = () => {
    setopenFriendList(!openFriendList);
  };

  const badgeCountHandler = async () => {
    let payload = {
      pet_id: parseInt(await AsyncStorage.getItem('PetId')),
      user_id: await AsyncStorage.getItem('userId'),
    };
    const badgeCount = await NotificationBadgeCountApi(payload);
    if (badgeCount.status === 200) {
      setChatBadge(badgeCount.data.chat_count);
      setNotificationBadge(badgeCount.data.unread_notification_count);
    } else {
      setChatBadge(0);
      setNotificationBadge(0);
    }
  };

  return (
    <>
      <View style={styles.topheader}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Entypo name="menu" size={30} color="#CE5757"></Entypo>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width={35}
              height={35}>
              <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
              <Path
                d="M36.68 12.06h-25.4a2.3 2.3 0 00-2.3 2.3v15.97a2.3 2.3 0 002.3 2.3h1.98v4.44c0 .35.21.66.53.79a.88.88 0 00.94-.19l5.05-5.05h16.9a2.3 2.3 0 002.3-2.3V14.35a2.3 2.3 0 00-2.3-2.3zm.58 4.17v14.1c0 .32-.26.58-.58.58H19.43a.88.88 0 00-.61.25L14.99 35v-3.23c0-.47-.39-.86-.86-.86h-2.84a.58.58 0 01-.58-.58V14.36c0-.32.26-.58.58-.58h25.39c.32 0 .58.26.58.58v1.87z"
                fill="#223656"
                strokeWidth={0}
              />
              <Path
                d="M28.59 23.68l-3.6-3.04c-.58-.49-1.43-.49-2.02 0l-3.6 3.04c-.56.47-.87 1.15-.87 1.88 0 .83.41 1.59 1.11 2.05l1.22.8c.48.32 1.1.34 1.61.07l1.15-.63c.25-.13.54-.13.79 0l1.15.63c.24.13.49.19.75.19.3 0 .6-.09.86-.26l1.22-.8c.7-.46 1.11-1.22 1.11-2.05 0-.72-.32-1.41-.87-1.88zM19.28 22.58c.09 0 .19-.01.28-.03.62-.15 1.09-.8 1.09-1.57s-.47-1.42-1.09-1.57c-.09-.02-.18-.03-.28-.03-.19 0-.37.04-.53.13-.25.12-.45.33-.6.58-.05.09-.09.18-.13.27-.07.19-.11.4-.11.62 0 .55.24 1.04.6 1.33.22.17.48.27.76.27zM29.65 19.85c-.25-.29-.59-.47-.97-.47-.76 0-1.37.72-1.37 1.6s.61 1.6 1.37 1.6 1.37-.72 1.37-1.6c0-.44-.15-.84-.4-1.13zM21.99 19.73c.22 0 .43-.05.61-.14.19-.09.36-.22.5-.38.29-.32.46-.77.46-1.26 0-.98-.71-1.78-1.58-1.78s-1.58.8-1.58 1.78.71 1.78 1.58 1.78zM25.94 19.73c.87 0 1.58-.8 1.58-1.78s-.71-1.78-1.58-1.78c-.22 0-.43.05-.61.14-.19.09-.36.22-.5.38-.29.32-.46.77-.46 1.26 0 .98.71 1.78 1.58 1.78z"
                fill="#223656"
                strokeWidth={0}
              />
            </Svg>
            {notificationbadge > 0 ? (
              <View style={styles.badgecontainer}>
                <Text style={styles.badgeText}>
                  {notificationbadge > 10 ? 10 + '+' : notificationbadge}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleIcon()} style={{margin: 5}}>
            {chatNotify ? (
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                id="Circle-Turquoise-Blue"
                viewBox="0 0 48 48"
                height={35}
                width={35}>
                <Defs></Defs>
                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                <Path
                  className="cls-1"
                  d="M23.11 17.5c0-.85-.69-1.54-1.55-1.54s-1.55.69-1.55 1.54.69 1.54 1.55 1.54 1.55-.69 1.55-1.54z"
                />
                <Path
                  className="cls-1"
                  d="M34.06 23.3l-5.37-1.53 5.18-3.1c.81-.48 1.27-1.4 1.17-2.33l-.22-2.18c-.06-.51-.33-.97-.74-1.27-.41-.3-.93-.42-1.45-.31l-6.91 1.97-2.16-1a8.005 8.005 0 00-3.34-.73c-1.58 0-3.09.45-4.4 1.31l-1.71-3.66a.82.82 0 00-.74-.47c-.32 0-.6.19-.73.48l-1.68 3.77c-.3.67-.41 1.42-.32 2.15l.27 2.17L9 25.46a.803.803 0 00.58.93c.08.02.16.03.24.03.43 0 .68-.32.75-.6l.86-3.09.12.93c.05.4.39.71.8.71h.1c.21-.03.41-.14.54-.3a.85.85 0 00.17-.6l-.91-7.26c-.05-.44.01-.89.19-1.3l.96-2.15 2.83 6.05c.19.39.69.57 1.08.39.4-.19.58-.67.39-1.07l-1.18-2.51c1.82-1.29 4.32-1.53 6.36-.6l2.43 1.12c.18.08.38.1.56.04l5.04-1.44c.53.85 1.46 1.38 2.48 1.4l.04.35c.03.31-.12.62-.39.78l-6.78 4.06a.805.805 0 00.19 1.47l6.29 1.79-.13.31c-.22.54-.74.92-1.33.95l-6.21.46c-.29.02-.55.2-.67.47l-2.31 10.06c-.09.2-.1.42-.02.62s.22.36.41.45c.11.05.22.08.34.08.31 0 .6-.18.74-.47l2.11-9.63 5.73-.42c1.2-.08 2.26-.84 2.71-1.96l.47-1.15a.8.8 0 00-.53-1.08z"
                />
                <Path
                  className="cls-1"
                  d="M38.25 20.18h-2.9c-.41 0-.75.34-.75.75s.34.75.75.75h2.9c.41 0 .75-.34.75-.75s-.34-.75-.75-.75zM34.63 19.24c.09.33.39.55.72.55.07 0 .13 0 .2-.03l2.89-.8c.4-.11.63-.52.52-.92a.749.749 0 00-.92-.52l-2.89.8c-.4.11-.63.52-.52.92zM38.44 22.9l-2.89-.8c-.4-.11-.81.12-.92.52-.11.4.12.81.52.92l2.89.8c.07.02.13.03.2.03.33 0 .63-.22.72-.55.11-.4-.12-.81-.52-.92z"
                />
              </Svg>
            ) : (
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                id="Circle-Turquoise-Blue"
                viewBox="0 0 48 48"
                height={35}
                width={35}>
                <Defs></Defs>
                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                <Circle className="cls-1" cx={23.51} cy={17.67} r={1.57} />
                <Path
                  className="cls-1"
                  d="M37.98 20.69l-.24-2.35c-.07-.54-.35-1.04-.79-1.35-.38-.28-.83-.31-1.23-.33l-7.65-.78-1.79-1.69a4.29 4.29 0 00-1.67-.98c-.83-.26-1.69-.39-2.56-.39-1.69 0-3.33.49-4.73 1.42l-1.85-3.96a.863.863 0 00-.78-.49c-.33 0-.64.2-.77.51l-1.8 4.06c-.32.72-.44 1.52-.34 2.31l.29 2.34-2.04 7.36v.05c-.04.2 0 .41.09.59.11.2.3.34.52.4.08.02.17.03.25.03.37 0 .69-.24.8-.63l.95-3.41.14 1.09c.03.23.14.44.32.58.17.14.4.19.63.16.23-.03.43-.14.57-.32.14-.18.2-.4.17-.63l-.98-7.83c-.06-.48.01-.97.21-1.41l1.04-2.35 3.06 6.55c.19.41.72.6 1.13.41.21-.1.36-.27.44-.48.08-.21.07-.44-.03-.65l-1.27-2.72c1.77-1.26 4.14-1.61 6.2-.92.38.13.73.33 1.05.61l2.11 1.86c.19.15.39.23.61.24l5.5.56c.3.55 1.35 2.28 2.72 2.32l.04.4c.03.3-.35.85-.68 1.05h-6.66c-.43 0-.79.35-.79.79s.35.79.79.79h6.43l-.18.81c-.24.59-.81 1-1.44 1.04l-6.46.5c-.31.02-.58.21-.72.5L24.1 37.03c-.1.21-.1.44-.02.65.08.21.24.38.44.48.11.05.23.08.36.08.33 0 .64-.2.78-.51l2.29-10.22 5.94-.46c1.28-.08 2.42-.9 2.9-2.1l.52-1.26c.06-.22.06-.41-.02-.63l-.02-.08c-.02-.06-.04-.13-.07-.21.64-.49.91-1.17.82-2.07z"
                />
              </Svg>
            )}
            {chatbadge > 0 ? (
              <View style={styles.badgecontainer}>
                <Text style={styles.badgeText}>
                  {chatbadge > 10 ? 10 + '+' : chatbadge}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
          {openFriendList && (
            <AddNewChat
              openFriendList={openFriendList}
              handleRequestNewChat={handleRequestNewChat}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default TopHeader;
