import React, {useEffect, useState} from 'react';
import {Tab, TabView} from '@rneui/themed';
import {Text, View, Image, ScrollView, TouchableOpacity} from 'react-native';
import styles from '../../Common.css';
import ActiveTimeWeek from './ActiveTimeWeek';
import ActiveTimeMonth from './ActiveTimeMonth';
import ActiveTimeYear from './ActiveTimeYear';
import TopHeader from '../TopHeader';
import {useIsFocused} from '@react-navigation/native';
import {GetActiveTimeApi, chatHighlightApi} from '../API/ApiCalls';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActiveTimeDay from './ActiveTimeDay';
import ProfileScreen from '../CommonScreens/ProfileScreen';
import Loader from '../CommonScreens/Loader';
import {
  ActiveTimeHeaderLeft,
  ActiveTimeHeaderRight,
  CommonHeaderRight,
} from '../../navigation/CustomBackNavigation';

const ActiveTime = ({navigation, route}) => {
  const {PetName, EditPetImg, dateClicked} = route.params;
  const [index, setIndex] = useState(0);
  const [NOData, setNoData] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [chatNotify, setChatnotify] = useState(0);
  const [tab, setTab] = useState('0');

  const handleText = (e, val) => {
    if (val == '0') {
      setTab('0');
    }
    if (val == '1') {
      setTab('1');
    }
    if (val == '2') {
      setTab('2');
    }
    if (val == '3') {
      setTab('3');
    }
  };

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <ActiveTimeHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      setLoading(true);
      GetActiveTimeData();
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

  const GetActiveTimeData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const currentDate = year + '-' + month + '-' + date;
    console.log(currentDate, 'currentDate', dateClicked);

    const payload = {
      user_id: UserID,
      pet_id: PetId,
      date: dateClicked == undefined ? currentDate : dateClicked,
    };

    console.log(payload, 'payloadTime');
    const Response = await GetActiveTimeApi(payload).finally(() => {
      setLoading(false);
    });
    console.log('Response', Response);
    if (Response.success == true) {
      // console.log(Response?.data[0]?.total_monthly_result[0], "Response")
      setDaily(Response?.data[0]?.total_day_result);
      setWeekly(Response?.data[0]?.total_week_result[0]);
      setMonthly(Response?.data[0]?.total_monthly_result[0]);
      setYearly(Response?.data[0]?.total_yearly_result[0]);
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
    } else if (Response.data.length == 0) {
      setDaily([]);
      setWeekly([]);
      setMonthly([]);
      setYearly([]);
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
      setDaily([]);
      setWeekly([]);
      setMonthly([]);
      setYearly([]);
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
      <View style={styles.mainpage}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        {/* <TopHeader/> */}
        <View style={styles.tabmain1}>
          <ProfileScreen />
          <Text style={styles.familytext}>Family Member</Text>
        </View>

        <View style={styles.space20}></View>

        <View style={styles.todaysec}>
          <Text style={styles.todaytext}>Active Time</Text>
        </View>
        <View style={styles.space20}></View>

        <View style={styles.tabmain3}>
          {/*  */}
          <View style={styles.selectswitchBar}>
            <View style={styles.tabmainBar}>
              <View style={styles.tabSec}>
                <TouchableOpacity
                  style={
                    tab === '0' ? styles.activeTabBar : styles.InactiveTabBar
                  }
                  onPress={e => handleText(e, '0')}>
                  <Text
                    style={
                      tab === '0'
                        ? styles.activeTabText
                        : styles.InactiveTabText
                    }>
                    D
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    tab === '1' ? styles.activeTabBar : styles.InactiveTabBar
                  }
                  onPress={e => handleText(e, '1')}>
                  <Text
                    style={
                      tab === '1'
                        ? styles.activeTabText
                        : styles.InactiveTabText
                    }>
                    W
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    tab === '2' ? styles.activeTabBar : styles.InactiveTabBar
                  }
                  onPress={e => handleText(e, '2')}>
                  <Text
                    style={
                      tab === '2'
                        ? styles.activeTabText
                        : styles.InactiveTabText
                    }>
                    M
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    tab === '3' ? styles.activeTabBar : styles.InactiveTabBar
                  }
                  onPress={e => handleText(e, '3')}>
                  <Text
                    style={
                      tab === '3'
                        ? styles.activeTabText
                        : styles.InactiveTabText
                    }>
                    Y
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/*  */}
          <View style={{backgroundColor: '#fff', flex: 1, paddingLeft: 20}}>
            {tab == '0' && <ActiveTimeDay daily={daily} />}

            {tab == '1' && <ActiveTimeWeek weekly={weekly} />}

            {tab == '2' && <ActiveTimeMonth monthly={monthly} />}
            {tab == '3' && <ActiveTimeYear yearly={yearly} />}
          </View>
        </View>
      </View>
    </>
  );
};

export default ActiveTime;
