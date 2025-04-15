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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import ProfileScreen from './CommonScreens/ProfileScreen';
import LogbookList from './LogbookList';
import Toast from 'react-native-root-toast';
import Loader from './CommonScreens/Loader';
import {LogbookAPI, chatHighlightApi} from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadMore from './LoadMore';
import {useRef} from 'react';
import ErrorText from './ErrorText/ErrorText';
import {
  CommonHeaderRight,
  LogBookHeaderLeft,
  LogBooklHeaderRight,
} from '../navigation/CustomBackNavigation';

const LogBook = props => {
  const navigation = useNavigation();
  const [logList, setLogList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [EndOfList, setEndOfList] = useState(false);

  const [offset, setOffset] = useState(1);

  const scrollRef = useRef(null);
  const [chatNotify, setChatnotify] = useState(0);

  const onPressTouch = () => {
    return scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <LogBookHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      GetFirstLogData();
      notificationHilightHandler();
    }
  }, [isFocused, chatNotify]);

  const notificationHilightHandler = async () => {
    let payload = {
      pet_id: parseInt(await AsyncStorage.getItem('PetId')),
      user_id: await AsyncStorage.getItem('userId'),
      notify_type_id: 'chat',
    };
    const gethiglight = await chatHighlightApi(payload);
    setChatnotify(gethiglight.data.length > 0 ? 1 : 0);
  };

  const GetFirstLogData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      // "user_id":53,
      // "user_pet_id":126,
      page_no: 1,
      limit: 5,
    };
    const Response = await LogbookAPI(payload);
    if (Response == false) {
      setLoading(false);
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    } else if (Response.message == 'Pet friend data not found') {
      // setLogList([]);
      console.log('kk');
    } else {
      setLoading(false);
      setLogList(Response?.data);
    }
  };

  useEffect(() => {
    GetLogData();
  }, [offset]);
  // logbook
  const GetLogData = async () => {
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      page_no: offset,
      limit: 5,
    };
    const Response = await LogbookAPI(payload);
    if (Response == false) {
      setLoading(false);
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    } else if (Response.message == 'Pet friend data not found') {
      setLoading(false);
      setEndOfList(true);
    } else {
      setLoading(false);
      setLogList([...logList, ...Response?.data]);
    }
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <View style={styles.mainpage}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        {/* <TopHeader/> */}
        <ProfileScreen />
        <Text style={styles.familytext}>Family Member</Text>
        <Text style={styles.maintitle}>My Logbook</Text>

        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          {logList.length == 0 ? (
            <View>
              <Text style={styles.nodatatext}>{ErrorText.NoData}</Text>
            </View>
          ) : (
            <View>
              {logList.map((eachItem, key) => {
                return <LogbookList eachItem={eachItem} />;
              })}
            </View>
          )}

          <View style={styles.space20}></View>

          {logList.length == 0 ? (
            ''
          ) : (
            <LoadMore
              onPressTouch={onPressTouch}
              setOffset={setOffset}
              offset={offset}
              EndOfList={EndOfList}
            />
          )}
        </ScrollView>

        <View style={styles.space50}></View>
      </View>
    </>
  );
};

export default LogBook;
