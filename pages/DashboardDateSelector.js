import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';
import styles from '../Common.css';
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
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
import { useNavigation } from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import { GetDashboardApi } from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import CalenderSelector from './CalenderSelector';
import Loader from './CommonScreens/Loader';
import Toast from 'react-native-root-toast';
import ErrorText from './ErrorText/ErrorText';
import moment from 'moment-timezone';

const DashboardDateSelector = props => {
  const { ShowDates, setShowDates } = props;
  const currentTimeZone = moment.tz.guess();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [activitiesCount, setActivitiesCount] = useState(0);

  const [dateSelected, setdateSelected] = useState('')
  const [loading, setLoading] = useState(false)


  const isFocused = useIsFocused();

  useEffect(() => {
    // GetDashboard();
    if (isFocused) {
      GetDashboard();
    }
  }, [isFocused]);

  const GetDashboard = async (dateVal) => {
    console.log(dateVal, "dateVal")
    setLoading(true)
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    setdateSelected(dateVal)
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const currentDate = year + '-' + month + '-' + date;
    AsyncStorage.setItem('selectedDate', undefined ? currentDate : dateVal);
    const payload = {
      user_id: parseInt(UserID),
      id: parseInt(PetId),
      date: dateVal == undefined ? currentDate : dateVal,
      timezone : currentTimeZone
    };
    const Response = await GetDashboardApi(payload);
    if (Response == false) {
      setLoading(false)
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
        console.log("Response.data[0].activities",Response.data[0].activities)
        setLoading(false)
        setData(Response.data[0]);
        setActivitiesCount(Response.data[0].activities);
      } else {
        setLoading(false)
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

  const handleViewProfile = id => {
    AsyncStorage.setItem('PetId', JSON.stringify(id));
    navigation.navigate('HomeStackNavigator', { screen: 'Home' });
    setShowDates(false)
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}

      <ScrollView showsVerticalScrollIndicator={false}>
        <TopHeader />
        <View>
          <TouchableOpacity onPress={() => handleViewProfile(data.id)}>
            <Profile petImage={data?.pet_image_path} petName={data?.pet_name} user_name={data?.user_name == '' ? '' : data?.user_name} />
            <Text style={styles.familytext}>Family Member</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.todaysec}
          onPress={() => handleViewProfile(data.id)}
        >
          <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
          <Text style={styles.calendarBackBtn}>Back</Text>
        </TouchableOpacity>

        <View style={styles.space30}></View>
        <CalenderSelector GetDashboard={GetDashboard} />

        <View style={styles.homecardmain}>
          <View style={styles.cardList}>
            <TouchableOpacity
              style={styles.homecardinnerSmall}
              onPress={() => {
                navigation.navigate('Health', {
                  dateClicked: dateSelected,
                });
              }}>
              <View style={styles.homecardvalueSmall}>
                <Text style={styles.homecardNoSmall}>
                  {data.health == '' ? '0' : data.health}
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.homecardtextSmall}>Health</Text>
          </View>

          <View style={styles.cardList}>
            <TouchableOpacity
              style={styles.homecardinnerSmall}
              onPress={() => {
                navigation.navigate('ActiveTime', {
                  PetName: data?.pet_name,
                  EditPetImg: data?.pet_image_path,
                  dateClicked: dateSelected,
                });
              }}>

              <View style={styles.homecardvalueActivieSmall}>
                <Text style={styles.homecardNoActSmall}>
                  {data.active_time == '' ? '0' : data.active_time}
                  {'\n'}mins
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.homecardtextSmall}>Active Time</Text>
          </View>

          <View style={styles.cardList}>
            <TouchableOpacity
              style={styles.homecardinnerSmall}
              onPress={() => {
                navigation.navigate('Activities', {
                  dateClicked: dateSelected,
                });
              }}
            >


              {/* activitiesCount== 0 */}
              {activitiesCount == '0' && (
                <View>
                  <View style={[styles.activitymain, styles.actmain]}>
                    <Text style={styles.activityunfillSmall}></Text>
                    <Text style={styles.activityunfillSmall}></Text>
                  </View>
                  <View style={styles.activitymain}>
                    <Text style={styles.activityunfillSmall}></Text>
                    <Text style={styles.activityunfillSmall}></Text>
                  </View>
                </View>
              )}
              {/* activitiesCount== 1 */}
              {activitiesCount == '1' && (
                <View>
                  <View style={[styles.activitymain, styles.actmain]}>
                    <Text style={styles.activityfillSmall}></Text>
                    <Text style={styles.activityunfillSmall}></Text>
                  </View>
                  <View style={styles.activitymain}>
                    <Text style={styles.activityunfillSmall}></Text>
                    <Text style={styles.activityunfillSmall}></Text>
                  </View>
                </View>
              )}
              {/* activitiesCount== 2 */}
              {activitiesCount == '2' && (
                <View>
                  <View style={[styles.activitymain, styles.actmain]}>
                    <Text style={styles.activityfillSmall}></Text>
                    <Text style={styles.activityfillSmall}></Text>
                  </View>
                  <View style={styles.activitymain}>
                    <Text style={styles.activityunfillSmall}></Text>
                    <Text style={styles.activityunfillSmall}></Text>
                  </View>
                </View>
              )}
              {/* activitiesCount== 3 */}
              {activitiesCount == '3' && (
                <View>
                  <View style={[styles.activitymain, styles.actmain]}>
                    <Text style={styles.activityfillSmall}></Text>
                    <Text style={styles.activityfillSmall}></Text>
                  </View>
                  <View style={styles.activitymain}>
                    <Text style={styles.activityfillSmall}></Text>
                    <Text style={styles.activityunfillSmall}></Text>
                  </View>
                </View>
              )}
              {/* activitiesCount== 4 */}
              {activitiesCount >='4' && (
                <View>
                  <View style={[styles.activitymain, styles.actmain]}>
                    <Text style={styles.activityfillSmall}></Text>
                    <Text style={styles.activityfillSmall}></Text>
                  </View>
                  <View style={styles.activitymain}>
                    <Text style={styles.activityfillSmall}></Text>
                    <Text style={styles.activityfillSmall}></Text>
                  </View>
                </View>
              )}
              
            </TouchableOpacity>
            <Text style={styles.homecardtextSmall}>Activities</Text>
          </View>

          <View style={styles.cardList}>
            <TouchableOpacity
              style={styles.homecardinnerSmall}
              onPress={() => {
                navigation.navigate('Energy', {
                  dateClicked: dateSelected,
                });
              }}
            >
              <View style={styles.energy}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 116 57"
                  width={56}
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
            <Text style={styles.homecardtextSmall}>Energy</Text>
          </View>
        </View>

        <View style={styles.space30}></View>
        {/* logbook */}
        <View style={styles.bluebtnsmallmain}>
          <TouchableOpacity
            style={styles.bluebtnsmall}
            onPress={() => navigation.navigate('LogBook')}>
            <Text style={styles.bluebtnsmalltext}>LOGBOOK</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.space30}></View>
      </ScrollView>
    </>
  );
};
export default DashboardDateSelector;
