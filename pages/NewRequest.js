import {Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../Common.css';
import TopHeader from './TopHeader';
import NewRequestList from './NewRequestList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Loader from './CommonScreens/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import {
  NewFriendListAPI,
  NotificationReadApi,
  chatHighlightApi,
} from './API/ApiCalls';
import ProfileRemovedConfirmation from './Popups/ProfileRemovedConfirmation';
import {
  CommonHeaderRight,
  NewRequestHeaderLeft,
  NewRequestHeaderRight,
} from '../navigation/CustomBackNavigation';
import notifee, {AndroidImportance} from '@notifee/react-native';
import Search from './SearchBar';

const NewRequest = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [chatNotify, setChatnotify] = useState(0);
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <NewRequestHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      setLoading(true);
      handleNotificationReadCount();

      notificationHilightHandler();
    }
  }, [isFocused, chatNotify]);

  useEffect(()=>{
    GetRequestList()
  },[search,isFocused])

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

  const GetRequestList = async () => {
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      search:search
    };
    
    const Response = await NewFriendListAPI(payload);
    // console.log("payload",payload,Response)
    if (Response.success == true) {
      setListData(Response.data);
      setLoading(false);
    } else {
      setLoading(false);
      setListData([]);
      //  Toast.show(Response.message, {
      //    duration: Toast.durations.LONG,
      //    position: 50,
      //    shadow: true,
      //    animation: true,
      //    hideOnPress: true,
      //    delay: 0,
      //    backgroundColor: '#fff',
      //    textColor: '#000',
      //  });
    }
  };

  const handleNotificationReadCount = async () => {
    let payload = {
      notify_type_id: 'friend_request',
      channel_id: '',
      user_id: await AsyncStorage.getItem('userId'),
    };
    // console.log('payload', payload);
    const updateReadCount = await NotificationReadApi(payload);
    // console.log('updateReadCount', updateReadCount);
    if (updateReadCount.status === 200) {
      if (updateReadCount.badge) {
        if (Platform.OS === 'ios') {
          const badgeCount = updateReadCount.badge;
          await notifee.setBadgeCount(badgeCount);
        } else {
          const badgeCount = remoteMessage.data.badge;
          await notifee.setBadgeCount(badgeCount);
        }
      } else {
        await notifee.setBadgeCount(0);
      }
    }
  };
  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <View style={styles.mainpage}>
        {/* <View style={styles.space30}></View> */}
        <View style={styles.space20}></View>
        {/* <TopHeader /> */}
        <View style={styles.space30}></View>
        <View style={{alignContent: 'center'}}>
          <Text style={styles.newReq}>MEET YOUR NEW FRIENDS</Text>
        </View>
        <Search search={search} setSearch={setSearch}  placeholdertext="Find your BFF here"/>
        <View style={styles.space30}></View>

        {listData.length == 0 ? (
          <View style={{alignContent: 'center'}}>
            <View style={styles.space20}></View>
            <Text style={styles.newReqErr}>
              Sorry, you have no open {'\n'}Requests. Go out and meet new
              buddies.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{marginRight: 20, marginLeft: 20}}
            showsVerticalScrollIndicator={false}>
            <NewRequestList
              listData={listData}
              setLoading={setLoading}
              GetRequestList={GetRequestList}
            />
          </ScrollView>
        )}
        <View style={styles.space20}></View>
      </View>
    </>
  );
};

export default NewRequest;
