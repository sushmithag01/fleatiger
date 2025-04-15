import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import styles from '../Common.css';
import Svg, { Path } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import { GetDashboardApi } from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Loader from './CommonScreens/Loader';
import Toast from 'react-native-root-toast';
import ErrorText from './ErrorText/ErrorText';
import MotivationalMessage from './Popups/MotivationalMessage';
import moment from 'moment-timezone';

const MeHome = props => {
  const { ShowDates, setShowDates } = props;

  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const currentDate = year + '-' + month + '-' + date;
  const currentTimeZone = moment.tz.guess();
  const timezone = moment(new Date())
    .tz(currentTimeZone)
    .format('YYYY-MM-DD HH:mm:ss a z');
  // console.log(currentDate,"currentDate")

  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [activitiesCount, setActivitiesCount] = useState('');
  const [SliderDates, setSliderDates] = useState([]);

  const [sliderView, setSliderView] = useState(false);
  const [myInd, setMyInd] = useState(3);
  const [SeletedSliderDate, setSeletedSliderDate] = useState(currentDate);

  const [loading, setLoading] = useState(false);
  // pop-up-health
  // congrats -text
  const [MessagePop, setMessagePop] = useState('');
  const [congratsMsg, setCongratsMsg] = useState(false);

  const isFocused = useIsFocused();

  const width = Dimensions.get('window').width;

  // dates-slider
  //  dates - slider - data
  function formatDate(date) {
    var mm = date.toLocaleString('en-US', { month: 'short' });
    var dd = date.toLocaleString('en-US', { day: 'numeric' });
    var yy = date.toLocaleString('en-US', { year: 'numeric' });
    // date-selected
    var monthNo = date.toLocaleString('en-US', { month: 'numeric' });
    //
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    if (yy < 10) {
      yy = '0' + yy;
    }
    date = { monthVal: mm, dateVal: dd, monthNumber: monthNo, yearVal: yy };
    return date;
  }
  function Last3Days() {
    var result = [];
    for (var i = 0; i < 3; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      result.push(formatDate(d));
    }
    var x = result;
    var y = [...x].reverse();
    y.splice(-1);
    return y;
  }

  function Next3Days() {
    var result1 = [];
    for (var i = 0; i < 1; i++) {
      var d = new Date();
      // d.setDate(d.getDate() + i);
      result1.push(formatDate(d));
    }

    return result1;
  }

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      GetDashboard();
      const getTotal = [
        { monthVal: 'plus', dateVal: '', monthNumber: '', yearVal: '' },
        ...Last3Days(),
        ...Next3Days(),
        // { monthVal: 'minus', dateVal: '', monthNumber: '', yearVal: '' },
      ];
      console.log(getTotal, 'result');
      setSliderDates(getTotal);
    }
  }, [isFocused]);

  const GetDashboard = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const getAuthPetCount = await AsyncStorage.getItem('userPetCount');
    const weight = await AsyncStorage.getItem('weight');
    const weightUnit = await AsyncStorage.getItem('weightUnit');
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const currentDate = year + '-' + month + '-' + date;
    // console.log(currentDate,"currentDate")
    const payload = {
      user_id: parseInt(UserID),
      id: parseInt(PetId),
      date: SeletedSliderDate == currentDate ? currentDate : SeletedSliderDate,
      timezone: currentTimeZone //  Asia/Kolkata 2024-01-24 11:12:38 am IST
    };
    const Response = await GetDashboardApi(payload);
    if (getAuthPetCount === '0') {
      navigation.navigate('Public', { screen: 'Onboarding1', params: { status: '' } });
    } else if (Response === false) {
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
        setActivitiesCount(Response.data[0].activities);
        setMessagePop(Response.data[0].health_message);
        AsyncStorage.setItem('PetImage', JSON.stringify(Response.data[0].pet_image_path));
        // console.log(Response.data[0].health_message,"Response.data[0].health_message")
        if (Response.data[0].health_message != '') {
          setTimeout(() => {
            setCongratsMsg(true);
          }, 500);
        } else {
          setCongratsMsg(false);
        }
      } else {
        setLoading(false);
        if (Response.message === 'Network Error') {
          Toast.show(ErrorText.InternetIssue, {
            duration: Toast.durations.LONG,
            position: 50,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: '#fff',
            textColor: '#000',
          });
        } else {
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
        }
      }
    }
  };

  const handleViewProfile = id => {
    AsyncStorage.setItem('PetId', JSON.stringify(id));
    navigation.navigate('ProfileDetail');
  };

  const GetDashboardForDate = async (selDate, e, key) => {
    // console.log(key, "key", selDate)
    if (key == 3) {
      setSliderView(false);
    } else {
      setSliderView(true);
    }
    setLoading(true);
    setMyInd(key);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const date = parseInt(selDate.dateVal);
    const month = parseInt(selDate.monthNumber);
    const year = parseInt(selDate.yearVal);

    const ClickedDate = year + '-' + month + '-' + date;
    AsyncStorage.setItem('selectedDate', ClickedDate);
    // console.log(ClickedDate,"ClickedDate")
    setSeletedSliderDate(ClickedDate);

    const payload = {
      user_id: parseInt(UserID),
      id: parseInt(PetId),
      date: ClickedDate,
      timezone: currentTimeZone
    };

    // console.log(selDate,"selDate",payload)
    const Response = await GetDashboardApi(payload);
    // console.log("Response", Response)
    if (Response == false) {
      setLoading(false);
      Toast.show(ErrorText.InternalError, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    } else {
      if (Response.success == true) {
        // console.log(Response.data[0],"Response.data[0]")
        setLoading(false);
        setData(Response.data[0]);
        setActivitiesCount(Response.data[0].activities);
        setMessagePop(Response.data[0].health_message);
        if (Response.data[0].health_message != '') {
          setTimeout(() => {
            setCongratsMsg(true);
          }, 500);
        } else {
          setCongratsMsg(false);
        }
      } else {
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
      }
    }
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopHeader />
        <View>
          <TouchableOpacity onPress={() => handleViewProfile(data.id)}>
            <Profile
              petImage={data?.pet_image_path}
              petName={data?.pet_name}
              user_name={data?.user_name == '' ? '' : data?.user_name}
            />
            <Text style={styles.familytext}>Family Member</Text>
          </TouchableOpacity>

          <View style={styles.space20}></View>
          {sliderView == true ? (
            <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
              <View
                style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                {SliderDates.map((item, key) => {
                  return (
                    <TouchableOpacity
                      style={
                        key == myInd
                          ? styles.datescrollCurrent
                          : styles.datescroll
                      }
                      onPress={
                        item.monthVal == 'minus'
                          ? () => setShowDates(true)
                          : item.monthVal == 'plus'
                            ? () => setShowDates(true)
                            : e => GetDashboardForDate(item, e, key)
                      }>
                      <Text
                        style={
                          key == myInd
                            ? styles.datesSelectorCurrent
                            : styles.datesSelector
                        }>
                        {item.dateVal}
                      </Text>

                      <Text
                        style={
                          key == myInd
                            ? styles.datesSelectorCurrent
                            : styles.datesSelector
                        }>
                        {item.monthVal == 'minus' ? (
                          <>
                            <Ionicons
                              name="arrow-forward"
                              size={30}
                              color="#436077"
                            // onPress={()=>setShowDates(true)}
                            ></Ionicons>
                          </>
                        ) : item.monthVal == 'plus' ? (
                          <View style={{ alignItems: 'center', padding: 25 }}>
                            <Ionicons
                              name="arrow-back"
                              size={30}
                              color="#436077"
                            // onPress={()=>setShowDates(true)}
                            ></Ionicons>
                          </View>
                        ) : (
                          <Text>{item.monthVal}</Text>
                        )}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          ) : (
            <TouchableOpacity
              style={styles.todaysec}
              // onPress={() => setShowDates(true)}
              onPress={() => setSliderView(true)}>
              <Ionicons name="arrow-back" size={30} color="#436077"></Ionicons>
              <Text style={styles.todaytext}>Today</Text>
            </TouchableOpacity>
          )}

          {/* end */}
        </View>
        <View style={styles.homecardmain}>
          <TouchableOpacity
            style={[styles.homecardinner, styles.homecardmainhealth]}
            onPress={() => {
              navigation.navigate('Health', {
                dateClicked: SeletedSliderDate,
              });
            }}>
            <Text style={styles.homecardtext}>Health</Text>
            <Text style={[styles.homecardvalue, styles.homval, { fontSize: 22 }]}>
              {data.health == '' ? '0' : data.health}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.homecardinner, styles.homecardmainhealth]}
            onPress={() => {
              navigation.navigate('ActiveTime', {
                PetName: data?.pet_name,
                EditPetImg: data?.pet_image_path,
                dateClicked: SeletedSliderDate,
              });
            }}>
            <Text style={styles.homecardtext}>Active Time</Text>
            <Text style={styles.homecardvalue1}>
              {data.active_time == '' ? '0' : data.active_time}
              {'\n'}mins
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.homecardmain}>
          <TouchableOpacity
            style={[styles.homecardinner, styles.homecardmainhealth1]}
            onPress={() => {
              navigation.navigate('Activities', {
                dateClicked: SeletedSliderDate,
              });
            }}>
            <Text style={styles.homecardtext}>Activities</Text>

            {/* activitiesCount== 0 */}
            {activitiesCount == '0' && (
              <View>
                <View style={[styles.activitymain, styles.actmain]}>
                  <Text style={styles.activityunfill}></Text>
                  <Text style={styles.activityunfill}></Text>
                </View>
                <View style={styles.activitymain}>
                  <Text style={styles.activityunfill}></Text>
                  <Text style={styles.activityunfill}></Text>
                </View>
              </View>
            )}
            {/* activitiesCount== 1 */}
            {activitiesCount == '1' && (
              <View>
                <View style={[styles.activitymain, styles.actmain]}>
                  <Text style={styles.activityfill}></Text>
                  <Text style={styles.activityunfill}></Text>
                </View>
                <View style={styles.activitymain}>
                  <Text style={styles.activityunfill}></Text>
                  <Text style={styles.activityunfill}></Text>
                </View>
              </View>
            )}
            {/* activitiesCount== 2 */}
            {activitiesCount == '2' && (
              <View>
                <View style={[styles.activitymain, styles.actmain]}>
                  <Text style={styles.activityfill}></Text>
                  <Text style={styles.activityfill}></Text>
                </View>
                <View style={styles.activitymain}>
                  <Text style={styles.activityunfill}></Text>
                  <Text style={styles.activityunfill}></Text>
                </View>
              </View>
            )}
            {/* activitiesCount== 3 */}
            {activitiesCount == '3' && (
              <View>
                <View style={[styles.activitymain, styles.actmain]}>
                  <Text style={styles.activityfill}></Text>
                  <Text style={styles.activityfill}></Text>
                </View>
                <View style={styles.activitymain}>
                  <Text style={styles.activityfill}></Text>
                  <Text style={styles.activityunfill}></Text>
                </View>
              </View>
            )}
            {/* activitiesCount== 4 */}
            {activitiesCount == '4' && (
              <View>
                <View style={[styles.activitymain, styles.actmain]}>
                  <Text style={styles.activityfill}></Text>
                  <Text style={styles.activityfill}></Text>
                </View>
                <View style={styles.activitymain}>
                  <Text style={styles.activityfill}></Text>
                  <Text style={styles.activityfill}></Text>
                </View>
              </View>
            )}

            {/* activitiesCount== 5+.. */}
            {activitiesCount >= 5 && (
              <View>
                <View style={[styles.activitymain, styles.actmain]}>
                  <Text style={styles.activityfill}></Text>
                  <Text style={styles.activityfill}></Text>
                </View>
                <View style={styles.activitymain}>
                  <Text style={styles.activityfill}></Text>
                  <Text style={styles.activityfill}></Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.homecardinner, styles.homecardmainhealth1]}
            onPress={() => {
              navigation.navigate('Energy', {
                dateClicked: SeletedSliderDate,
              });
            }}>
            <Text style={styles.homecardtext}>Energy</Text>
            <View style={styles.energy}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 116 57"
                width={116}
                height={57}>
                <Path
                  id="bones-pet-svgrepo-com"
                  d="M102.9 36.8q0-1-.1-2-.2-.9-.5-1.8-.3-1-.7-1.8-.4-.9-.9-1.7.5-.8.9-1.7.4-.8.6-1.8.3-.9.4-1.8.1-1 .1-1.9c0-1.8-.4-3.5-1.1-5.1-.7-1.6-1.7-3.1-2.9-4.3-1.3-1.3-2.7-2.3-4.4-3-1.6-.7-3.3-1-5.1-1.1-1.5 0-3 .2-4.4.7-1.4.5-2.8 1.3-4 2.2-1.1 1-2.1 2.2-2.9 3.5-.7 1.3-1.2 2.7-1.5 4.2l-37.6-.6c-.3-1.5-.9-3-1.7-4.3-.8-1.3-1.8-2.5-3-3.5-1.1-1-2.5-1.8-3.9-2.4-1.5-.5-3-.8-4.6-.8-1.7-.1-3.4.2-5 .9-1.6.6-3.1 1.6-4.3 2.8-1.2 1.2-2.1 2.6-2.8 4.2-.6 1.6-.9 3.4-.9 5.1q0 .9.2 1.9.1 1 .4 1.9.3.9.7 1.8.5.9 1 1.7-.5.8-.9 1.6-.4.9-.7 1.8-.2.9-.3 1.9-.2.9-.1 1.9c0 1.7.4 3.5 1.1 5.1.7 1.6 1.6 3.1 2.9 4.3 1.2 1.2 2.7 2.2 4.3 2.9 1.6.7 3.4 1.1 5.1 1.1 1.5.1 3-.2 4.5-.7 1.4-.5 2.7-1.2 3.9-2.2 1.2-.9 2.2-2.1 2.9-3.4.8-1.3 1.3-2.8 1.5-4.3l37.6.7c.3 1.5.9 2.9 1.7 4.3.8 1.3 1.8 2.5 3 3.5s2.5 1.8 4 2.3c1.4.5 3 .8 4.5.9 1.7 0 3.5-.3 5.1-.9 1.6-.7 3-1.6 4.2-2.8 1.2-1.2 2.2-2.7 2.8-4.3.7-1.6 1-3.3.9-5z"
                  fill="#9bbbbe"
                />
              </Svg>
            </View>
            <Text style={styles.caltext}>
              {data.energy == '' ? '0' : data.energy} Cals
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bluebtnsmallmain}>
          <TouchableOpacity
            style={styles.bluebtnsmall}
            onPress={() => navigation.navigate('LogBook')}>
            <Text style={styles.bluebtnsmalltext}>LOGBOOK</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {congratsMsg == true ? (
        <MotivationalMessage
          MessagePop={MessagePop}
          congratsMsg={congratsMsg}
          setCongratsMsg={setCongratsMsg}
        />
      ) : (
        ''
      )}
    </>
  );
};
export default MeHome;
