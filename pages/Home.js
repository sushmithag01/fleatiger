import React, {useEffect, useState} from 'react';
import {Tab, TabView} from '@rneui/themed';
import {
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import styles from '../Common.css';
import MeHome from './MeHome';
import NewsFeed from './NewsFeed';
import DashboardDateSelector from './DashboardDateSelector';
import {useIsFocused} from '@react-navigation/native';
import {
  storeFCMTokenApi,
  userSubscriptionInfoApi,
  NotificationListner,
} from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import WeightComponent from './Components/WeightComponent';

const Home = props => {
  const {route} = props;
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);
  const [ShowDates, setShowDates] = useState(false);

  useEffect(() => {
    if (isFocused) {
      handleSubscriptionInfo();
      registerAppWithFCM();
      NotificationListner();
    }
    // setGetPetId(route.params.state.petId)
  }, [isFocused]);


  // Register the message handler
  const registerAppWithFCM = async () => {
    const channelId = await notifee.createChannel({
      id: 'important',
      name: 'Important Notifications',
      importance: AndroidImportance.HIGH,
    });
    // Request permission for notifications
    const authStatus = await messaging().requestPermission();
    // If permission is granted
    if (authStatus) {
      // Get the device token
      const fcmToken = await messaging().getToken();

      let payload = {
        user_id: parseInt(await AsyncStorage.getItem('userId')),
        fcm_token: fcmToken,
      };
      const fcmStore = await storeFCMTokenApi(payload);
      // console.log('FCM Token:', fcmToken);
      // console.log("fcmStore", fcmStore, payload)
      // Receive and handle incoming messages
      messaging().onMessage(async remoteMessage => {
        console.log('remoteMessage', remoteMessage.data.screen);
        if (Platform.OS === 'ios') {
          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            data: {
              screen: remoteMessage.data.screen, // Add screen info for navigation
            },
            ios: {
              foregroundPresentationOptions: {
                badge: true,
                sound: true,
                banner: true,
                list: true,
              },
            },
            // android: {
            //   channelId,
            //   importance: AndroidImportance.HIGH,
            // },
          });
          const badgeCount = remoteMessage.notification.ios.badge || 0;
          await notifee.setBadgeCount(badgeCount);
        } else {
          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            // ios: {
            //   foregroundPresentationOptions: {
            //     badge: true,
            //     sound: true,
            //     banner: true,
            //     list: true,
            //   },
            // },
            data: {
              screen: remoteMessage.data.screen, // Add screen info for navigation
            },
            android: {
              channelId,
              importance: AndroidImportance.HIGH,
            },
          });
          const badgeCount = remoteMessage.data.badge || 0;
          await notifee.setBadgeCount(badgeCount);
        }

        // Handle the incoming message here
      });
    }
  };

  const handleSubscriptionInfo = async () => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    const getUserSubscriptionPlan = await userSubscriptionInfoApi(payload);
    // console.log("getUserSubscriptionPlan", getUserSubscriptionPlan, payload)
  };

  return (
    <>
      <View style={styles.tabmain}>
        <Tab
          value={index}
          onChange={e => setIndex(e)}
          containerStyle={{backgroundColor: '#fff'}}
          indicatorStyle={{
            backgroundColor: '#495F75',
            marginTop: 0,
            flex: 1,
          }}>
          <Tab.Item
            title="Me"
            titleStyle={active => ({
              fontSize: 12,
              textAlign: 'right',
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              fontSize: 25,
              fontFamily: 'Montserrat-Bold',
              color: active ? '#495F75' : '#CED4D8',
              padding: 2,
            })}
            containerStyle={active => ({
              borderBottomColor: active ? '#495F75' : '#CED4D8',
              borderBottomWidth: 4,
              padding: 0,
              margin: 0,
            })}
          />
          <Tab.Item
            title="Friends"
            titleStyle={active => ({
              fontSize: 12,
              textAlign: 'right',
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              fontSize: 25,
              fontFamily: 'Montserrat-Bold',
              color: active ? '#495F75' : '#CED4D8',
            })}
            containerStyle={active => ({
              borderBottomColor: active ? '#495F75' : '#CED4D8',
              borderBottomWidth: 4,
            })}
          />
        </Tab>

        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item style={{backgroundColor: '#fff', flex: 1}}>
            {ShowDates == false ? (
              <MeHome ShowDates={ShowDates} setShowDates={setShowDates} />
            ) : (
              <DashboardDateSelector
                ShowDates={ShowDates}
                setShowDates={setShowDates}
              />
            )}
      
          </TabView.Item>
          <TabView.Item style={{backgroundColor: '#fff', width: '100%'}}>
            <NewsFeed />
          </TabView.Item>
        </TabView>
      </View>
    </>
  );
};

export default Home;
