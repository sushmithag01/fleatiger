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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import {
  GetActivitiesApi,
  GetDashboardApi,
  chatHighlightApi,
} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorText from './ErrorText/ErrorText';
import ProfileScreen from './CommonScreens/ProfileScreen';
import Loader from './CommonScreens/Loader';
import ChatTopHeader from './ChatTopHeader';
import {
  CommonHeaderRight,
  HealthHeaderLeft,
  HealthHeaderRight,
} from '../navigation/CustomBackNavigation';
import CommonCss from '../Common.css';
import moment from 'moment-timezone';

const Health = ({navigation, route}) => {
  const {dateClicked} = route.params;

  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ActivitiesCount, setActivitiesCount] = useState([]);
  const [NOData, setNoData] = useState('');
  const [ActiveTime, setActiveTime] = useState('');
  const [chatNotify, setChatnotify] = useState(0);
  const currentTimeZone = moment.tz.guess();

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <HealthHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      setLoading(true);
      GetDashboard();
      GetActivitiesData();
      notificationHilightHandler();
    }
  }, [isFocused, chatNotify]);

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

  const GetDashboard = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      id: PetId,
      // user_id: 40,
      // id: 126,
      timezone : currentTimeZone
    };
    const Response = await GetDashboardApi(payload);
    if (Response == false) {
      setLoading(false);
      // Toast.show(ErrorText.InternalError, {
      //   duration: Toast.durations.LONG,
      //   position: 50,
      //   shadow: true,
      //   animation: true,
      //   hideOnPress: true,
      //   delay: 0,
      //   backgroundColor: '#fff',
      //   textColor: '#000',
      // });
    } else {
      if (Response.success == true) {
        setLoading(false);
        setData(Response.data[0]);
      } else {
        setLoading(false);
        // Toast.show(Response.message, {
        //   duration: Toast.durations.LONG,
        //   position: 50,
        //   shadow: true,
        //   animation: true,
        //   hideOnPress: true,
        //   delay: 0,
        //   backgroundColor: '#fff',
        //   textColor: '#000',
        // });
      }
    }
  };

  const GetActivitiesData = async () => {
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const currentDate = year + '-' + month + '-' + date;
    console.log(currentDate, 'currentDate');

    const payload = {
      user_id: UserID,
      pet_id: PetId,
      time: dateClicked == undefined ? currentDate : dateClicked,

      // "pet_id":126,
      // "user_id":40,
      // "time":"2023-06-13"
    };
    const Response = await GetActivitiesApi(payload);
    console.log(Response, 'Response');

    if (Response.success == true) {
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
      setLoading(false);
      setActivitiesCount(Response?.data);
      setActiveTime(Response?.total_duration);
    } else if (Response.data.length == 0) {
      setLoading(false);
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
      setNoData(ErrorText.NoAcitivity);
    } else {
      setLoading(false);
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    }
  };
  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        {/* <ChatTopHeader/> */}
        <View style={styles.space30}></View>
        <ProfileScreen />
        <Text style={styles.familytext}>Family Member</Text>
        <View>
          <Text style={styles.maintitle}>Overall Health</Text>
        </View>
        <View style={styles.homecardinner1}>
          <Text style={styles.homecardtext1}>My Active Time</Text>
          <View style={styles.healthcircle}>
            <View style={styles.healthcircleinner}>
              <Text style={styles.homecardvalue2}>
                {NOData.length != 0 ? '0:00' : ActiveTime}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.homecardinner1}>
          <Text style={styles.homecardtext1}>My Activities</Text>
          {NOData ? (
            <View style={{flex: 1, alignItems: 'center', padding: 20}}>
              <Text style={styles.forgotcontent2}>{NOData}</Text>
            </View>
          ) : (
            <View>
              {ActivitiesCount.map((item, key) => {
                return (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.act1}>
                      {/* img */}
                      <Image
                        // source={require('../assets/profile.png')}
                        style={[styles.activityImg]}
                        source={{uri: item.activity_image_path}}></Image>
                      <View style={styles.minView}>
                        <Text style={styles.homecardtext1}>
                          {item.activity_type_name}
                        </Text>

                        <Text style={styles.actMinText}>{item.duration} </Text>
                      </View>
                    </View>
                  </ScrollView>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Health;
