import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { NotificationLeftHeader } from '../navigation/CustomBackNavigation';
import styles from '../Common.css';
import NotificationRenderItem from './RenderComponents/NotificationRenderItem';
import {
  NotificationBadgeCountApi,
  NotificationListApi,
  UpdateNotificationReadCountUpdateApi,
} from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorText from './ErrorText/ErrorText';
import { ScrollView } from 'react-native';
import Loader from './CommonScreens/Loader';
function Notification() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [listOfNotification, setlistOfNotification] = useState([]);
  const [listOfNotificationErr, setlistOfNotificationErr] = useState('');
  const [loading, setLoading] = useState('');
  const [notificationbadge, setNotificationBadge] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <NotificationLeftHeader navigation={navigation} />,
    });
    notificationListHandler();
    setLoading(true);
  }, [isFocused]);

  const notificationListHandler = async () => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
      pet_id: await AsyncStorage.getItem('PetId'),
    };

    const responseList = await NotificationListApi(payload);
    if (responseList.status === 200) {
      setLoading(false);
      setlistOfNotification(responseList.data);
      setlistOfNotificationErr('');
    } else {
      setLoading(false);
      setlistOfNotification([]);
      setlistOfNotificationErr(ErrorText.NoData);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Call your function after 3 minutes
      updateReadCountHandler();
    }, 5000); // 180,000 ms = 3 minutes

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once when component mounts

  const updateReadCountHandler = async () => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
      pet_id: await AsyncStorage.getItem('PetId'),
    };
    const responseData = await UpdateNotificationReadCountUpdateApi(payload);
    // console.log('responseData', responseData);
    if (responseData.status == 200) {
      notificationListHandler();
    }
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#fff', height: 'auto' }}>
        <View style={{ margin: 10, }}>
          <Text style={styles.settingmainText}>Notifications</Text>
          <View>
            {listOfNotification.length > 0 ? (
              <SafeAreaView>
                <FlatList
                  data={listOfNotification}
                  keyExtractor={item => item.notification_id}
                  renderItem={item => <NotificationRenderItem item={item} />}
                  nestedScrollEnabled={true}
                />
              </SafeAreaView>

            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 200,
                  paddingHorizontal: 120,
                  fontFamily: 'Montserrat-Medium',
                  padding: 10,
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                {listOfNotificationErr}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default Notification;
