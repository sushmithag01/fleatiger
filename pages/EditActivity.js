import React, {useState, useEffect} from 'react';
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
  Ellipse,
} from 'react-native-svg';
import Profile from './Profile';
import TopHeader from './TopHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown} from 'react-native-element-dropdown';
import {
  EditActivityInfoAPI,
  EditactivityAddFriendListAPI,
  GetDashboardApi,
  SaveActivityApi,
  UpdateActivityInfoAPI,
  getActivityTypeApi,
  getFriendListApi,
  getSiblingListApi,
} from './API/ApiCalls';
import DatePicker from 'react-native-date-picker';
import DurationPicker from './DurationPicker';
import Regex from './Regex/Regex';
import ErrorText from './ErrorText/ErrorText';
import Toast from 'react-native-root-toast';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ActivityWhoComing from './ActivityWhoComing';
import ProfileScreen from './CommonScreens/ProfileScreen';
import Loader from './CommonScreens/Loader';
import EditActivityFriends from './EditActivityFriends';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  CommonHeaderRight,
  EditActivityHeaderLeft,
  EditActivityHeaderRight,
} from '../navigation/CustomBackNavigation';

const EditActivity = ({route}) => {
  const {activityId, ActivityInfo} = route.params;
  const navigation = useNavigation();
  const initialDuration = new Date(2000, 0, 1, 0, 0, 0);
  const isFocused = useIsFocused();

  const [data, setData] = useState([]);
  //  who coming
  const [OtherPetdata, setOtherPetData] = useState([]);
  // activity -type
  const [ActivityType, setActivityType] = useState([]);
  const [ActivityTypeName, setActivityTypeName] = useState('');
  const [ActivityTypeId, setActivityTypeId] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  // feilds - time
  const [Durationopen, setDurationOpen] = useState(false);
  const [duration, setDuration] = useState('Select Time');
  // const [TimeValue, setTimeValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [durationTime, setDurationTime] = useState(initialDuration);
  const [open, setOpen] = useState(false);
  const [ActivityName, setActivityName] = useState('');
  // duration
  const [DurationFinal, setDurationFinal] = useState('00 : 00');
  // handleInput - distance
  const [distance, setdistance] = useState('');
  const [distanceErr, setdistanceErr] = useState('');
  const [dateTime, setDateTime] = useState('Select Date and Time');
  const [TimeValue, setTimeValue] = useState('');
  const [DisplayTimeFormat, setDisplayTimeFormat] = useState('');

  //  Error
  const [ActivityNameErr, setActivityNameErr] = useState('');
  const [ActivityTypeErr, setActivityTypeErr] = useState('');
  const [TimeErr, setTimeErr] = useState('');
  const [DurationErr, setDurationErr] = useState('');
  const [activityDescriptionErr, setActivityDescriptionErr] = useState('');

  // popup-slected- who's coming
  const [selectedComing, setSelectedComing] = useState([]);
  const [selectedComingProfile, setSelectedComingProfile] = useState([]);

  const [loading, setLoading] = useState(false);

  const [friendsIMetID, setFriendsIMetID] = useState([]);
  const [chatNotify, setChatnotify] = useState(0);
  const [selectedTimeVal, setSelectedTimeVal] = useState('');
  const [selectedMeasureUnit, setSelectedMeasureUnit] = useState('');

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => (
          <EditActivityHeaderLeft
            navigation={navigation}
            routeParams={ActivityInfo.params}
          />
        ),
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      setLoading(true);
      GetEditData();
      GetSiblingList();
      notificationHilightHandler();
    }
  }, [isFocused, route, chatNotify]);

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

  // get - filled - data
  const GetEditData = async () => {
    const measureUnit = await AsyncStorage.getItem('selected_unit_of_measure');
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      pet_id: parseInt(PetId),
      user_id: parseInt(UserID),
      pet_activity_id: activityId,
    };

    const Response = await EditActivityInfoAPI(payload);
    if (Response.data == []) {
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
    } else {
      const res = Response.data[0];
      setSelectedMeasureUnit(JSON.parse(measureUnit).distance_unit);
      // console.log(res.time,"activity_type")
      setActivityName(res.activity_name);
      setActivityDescription(res.activity_description);
      setActivityType(res.activity_type);
      setActivityTypeId(res.activity_type_id);
      setDateTime(res.time);
      setSelectedTimeVal(res.time);
      // setTimeValue(res.time)
      setDuration(res.duration);
      setDurationFinal(res.duration);
      setdistance(res.distance);
      // friendList
      setSelectedComingProfile(res.friend_pet_id);
      // console.log(res.friend_pet_id,"edit-screen")
      setLoading(false);
      const getId = res.friend_pet_id.map(item => item.friendId);
      setSelectedComing(getId);
    }
  };

  // who's coming - data
  const GetSiblingList = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      pet_id: PetId,
      pet_activity_id: activityId,
      // user_id: 40,
      // user_pet_id: 126,
    };
    const Response = await EditactivityAddFriendListAPI(payload);
    // console.log(payload,"list",Response);
    if (Response.message == 'No pet friend details available') {
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
      console.log('removed');
    } else {
      setOtherPetData(Response?.data);
      setLoading(false);
    }
  };

  // Activity type- data
  // const GetActivityTypeList = async () => {
  //   const UserID = await AsyncStorage.getItem('userId');
  //   const PetId = await AsyncStorage.getItem('PetId');
  //   const payload = {
  //     user_id: UserID,
  //     pet_id: PetId,
  //     // user_id: 40,
  //     // pet_id: 126,
  //   };

  //   const Response = await getActivityTypeApi(payload);
  //   // console.log(Response?.data,"sib")
  //   setLoading(false)
  //   setActivityType(Response?.data);
  // };

  const handleChange = (value, event) => {
    if (value == 'activityName') {
      setActivityName(event.nativeEvent.text);
      if (event.nativeEvent.text.length == 0) {
        setActivityNameErr(ErrorText.ActivityRequiredError);
      } else {
        setActivityNameErr('');
      }
    }
    if (value == 'activityDescription') {
      setActivityDescription(event.nativeEvent.text);
      // if (event.nativeEvent.text.length == 0) {
      //   setActivityDescriptionErr(ErrorText.ActivityRequiredError);
      // } else {
      //   setActivityDescriptionErr('');
      // }
    }
    if (value == 'distance') {
      setdistance(event.nativeEvent.text);
      setdistanceErr('');
      if (Regex.HeightWeightTest.test(event.nativeEvent.text) === false) {
        setdistanceErr(ErrorText.DistanceValidError);
      } else {
        setdistanceErr('');
      }
    }
  };

  // handle-save
  const handleSave = async () => {
    // setLoading(true)
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const SelectedDuration = duration.split(' ').join('');

    // const SelectedTimeValue = TimeValue.split(' ').join('');
    // const SelectedDateTime = dateTime + ' ' + SelectedTimeValue;

    const SelectedDistance =
      (distance ? distance : 0) +
      ' ' +
      (selectedMeasureUnit ? selectedMeasureUnit : 'km');

    if (ActivityName.length == 0) {
      setActivityNameErr(ErrorText.ActivityRequiredError);
      setLoading(false);
    }
    if (ActivityTypeId == '') {
      setActivityTypeErr(ErrorText.ActivityTypeRequiredError);
      setLoading(false);
    }
    if (dateTime == 'Select Date and Time ') {
      setTimeErr(ErrorText.TimeRequiredError);
      setLoading(false);
    }
    if (SelectedDuration == '00:00:00' || SelectedDuration == '0:00') {
      setDurationErr(ErrorText.DurationRequiredError);
      setLoading(false);
    }
    // if (distance == '') {
    //   setdistanceErr(ErrorText.DistanceRequiredError);
    //   setLoading(false)
    // }
    // console.log(ActivityNameErr.length ,ActivityTypeErr.length , TimeErr.length , DurationErr.length ,distanceErr.length,"kkkk" )

    if (
      ActivityNameErr.length == 0 &&
      ActivityTypeErr.length == 0 &&
      TimeErr.length == 0 &&
      DurationErr.length == 0 &&
      distanceErr.length == 0 &&
      ActivityName.length != 0 &&
      ActivityTypeId != '' &&
      SelectedDuration != '0:00'
    ) {
      const payload = {
        user_id: parseInt(UserID),
        pet_id: parseInt(PetId),
        friend_pet_id: selectedComing,
        activity_type_id: parseInt(ActivityTypeId),
        activity_name: ActivityName,
        time: selectedTimeVal,
        duration: SelectedDuration,
        distance: SelectedDistance,
        activity_id: activityId,
        description: activityDescription,
      };
      const Response = await UpdateActivityInfoAPI(payload);
      if (Response.success == true) {
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
        // navigation.navigate('Activities', {
        //   dateClicked: undefined,
        // });
        navigation.navigate('HomeStackNavigator', {screen: 'Home'});
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
        // navigation.navigate('Activities')
      }
    } else {
      setLoading(false);
    }
  };

  // popup
  const [openAddFriend, setOpenAddFriend] = useState(false);

  const handleClose = () => {
    setOpenAddFriend(false);
  };

  const handleOpen = () => {
    setOpenAddFriend(true);
  };

  const handleConfirm = async selectedDate => {
    const gettimeformat = await AsyncStorage.getItem('selected_time_format');
    const is24Hour = JSON.parse(gettimeformat);
    // console.log('selectedDate', selectedDate, is24Hour);
    setOpen(false);
    setDate(selectedDate);
    // Formatting the date (YYYY-MM-DD)
    const formattedDate =
      selectedDate.getFullYear() +
      '-' +
      (selectedDate.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      selectedDate.getDate().toString().padStart(2, '0');

    // Formatting the time in 12-hour or 24-hour format
    let hours = selectedDate.getHours();
    let minutes = selectedDate.getMinutes().toString().padStart(2, '0');
    let formattedTime = '';
    setSelectedTimeVal(hours.toString().padStart(2, '0') + ':' + minutes);
    if (is24Hour.time_format_name === '24-hour') {
      // 24-hour format
      formattedTime = hours.toString().padStart(2, '0') + ':' + minutes;
    } else {
      // 12-hour format with AM/PM
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert to 12-hour format
      formattedTime = hours + ':' + minutes + ' ' + ampm;
    }
    setDisplayTimeFormat(formattedDate);
    setDateTime(formattedDate + ' ' + formattedTime);
    setTimeValue(formattedTime);
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          {/* <View style={styles.space20}></View> */}
          <View style={styles.space20}></View>
          {/* <TopHeader /> */}
          <ProfileScreen />
          <Text style={styles.familytext}>Family Member</Text>
          <View style={styles.space30}></View>
          <View style={styles.marginhz15}>
            <Text style={styles.addmanuallytext}>Activity Name</Text>
            <View style={[styles.inputContainer1, styles.inputContainer2]}>
              <TextInput
                placeholder="Name your activity…"
                style={styles.selectedTextStyle2}
                maxLength={30}
                value={ActivityName}
                onChange={event => {
                  handleChange('activityName', event);
                }}
              />
            </View>
            {ActivityNameErr && (
              <Text style={styles.errormsg}>{ActivityNameErr}</Text>
            )}
          </View>

          <View style={styles.space30}></View>

          <View style={styles.marginhz15}>
            <Text style={styles.addmanuallytext}>Activity Description</Text>
            <View style={[styles.inputContainer1]}>
              <TextInput
                placeholder="How did you do? Share more about your activity…"
                style={styles.selectedTextStyle2}
                multiline={true}
                numberOfLines={3}
                maxLength={100}
                value={activityDescription}
                onChange={event => {
                  handleChange('activityDescription', event);
                }}
              />
            </View>
            {activityDescriptionErr && (
              <Text style={styles.errormsg}>{activityDescriptionErr}</Text>
            )}
          </View>

          <View style={styles.space30}></View>

          {/* 1 */}
          <View style={styles.marginhz15}>
            <View style={styles.unitmain1}>
              <View style={styles.unitinner3}>
                <Image
                  // style={styles.tinyLogo}
                  source={require('../assets/with-shadow.png')}
                />
              </View>

              {/* new */}
              <View style={styles.unitinner4}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}>
                  <Text style={styles.addmanuallytext}>Who's coming? </Text>

                  {selectedComing?.length == 0 ? (
                    ''
                  ) : (
                    <TouchableOpacity
                      style={[styles.addFriendBtnSmall]}
                      onPress={() => handleOpen()}>
                      <Text style={styles.addtextSmall}>Add Friends</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.space10}></View>

                {selectedComing?.length == 0 ? (
                  <TouchableOpacity
                    style={[styles.addFriendBtn]}
                    onPress={() => handleOpen()}>
                    <Text style={styles.addtext}>Add Friends</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.inputunitContainer3}>
                    <View style={styles.mainDiv}>
                      {/* more than 3 */}
                      {selectedComingProfile.length > 4 ? (
                        <View style={[styles.dflexMet, styles.metProfile]}>
                          <View style={styles.metmain}>
                            <Image
                              source={{uri: selectedComingProfile[0].petImg}}
                              style={styles.metmainpic}></Image>
                          </View>
                          <View style={styles.metmain}>
                            <Image
                              source={{uri: selectedComingProfile[1].petImg}}
                              style={styles.metmainpic}></Image>
                          </View>
                          <View style={styles.metmain}>
                            <Image
                              source={{uri: selectedComingProfile[2].petImg}}
                              style={styles.metmainpic}></Image>
                          </View>
                          <View style={styles.metmain}>
                            <Image
                              source={{uri: selectedComingProfile[3].petImg}}
                              style={styles.metmainpic}></Image>
                          </View>
                          <TouchableOpacity onPress={() => handleOpen()}>
                            <Text style={{color: '#000', fontSize: 25}}>
                              ...
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={[styles.dflexMet, styles.metProfile]}>
                          {selectedComingProfile.map((item, k) => {
                            return (
                              <View style={styles.metmain}>
                                <Image
                                  source={{uri: item.petImg}}
                                  style={styles.metmainpic}></Image>
                              </View>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>

              {/* end */}
            </View>
          </View>
          {/* 2 */}
          <View style={styles.marginhz15}>
            <View style={styles.unitmain1}>
              <View style={styles.unitinner3}>
                <View style={styles.actIcon}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    height={70}
                    width={70}>
                    <Circle
                      cx={24}
                      cy={24}
                      r={24}
                      fill="#92bcbf"
                      strokeWidth={0}
                    />
                    <Path
                      d="M33.13 26.74c-.68-.57-1.66-.57-2.34 0l-4.17 3.52c-.64.54-1.01 1.34-1.01 2.18 0 .96.48 1.85 1.29 2.38l1.41.93c.56.37 1.28.4 1.87.08l1.33-.73c.28-.16.63-.16.91 0l1.33.73a1.827 1.827 0 001.87-.08l1.41-.93c.81-.53 1.29-1.42 1.29-2.38 0-.84-.37-1.63-1.01-2.18l-4.17-3.52zM26.5 28.98c.11 0 .22-.01.32-.04.72-.17 1.27-.92 1.27-1.82s-.54-1.65-1.27-1.82a1.32 1.32 0 00-.94.11c-.28.14-.53.38-.7.67-.06.1-.11.2-.15.32-.08.22-.12.47-.12.72 0 .64.28 1.21.7 1.54.25.2.56.32.89.32zM38.54 25.81c-.29-.34-.68-.54-1.12-.54-.88 0-1.59.83-1.59 1.86s.71 1.86 1.59 1.86 1.59-.83 1.59-1.86c0-.51-.18-.98-.46-1.32zM29.64 25.68a1.715 1.715 0 001.29-.6c.33-.37.54-.89.54-1.46 0-1.14-.82-2.07-1.83-2.07s-1.83.93-1.83 2.07.82 2.07 1.83 2.07zM34.23 25.68c1.01 0 1.83-.93 1.83-2.07s-.82-2.07-1.83-2.07a1.715 1.715 0 00-1.29.6 2.2 2.2 0 00-.54 1.46c0 1.14.82 2.07 1.83 2.07zM17.21 17.15c-.68-.57-1.66-.57-2.34 0l-4.17 3.52c-.64.54-1.01 1.34-1.01 2.18 0 .96.48 1.85 1.29 2.38l1.41.93c.56.37 1.28.4 1.87.08l1.33-.73c.28-.16.63-.16.91 0l1.33.73a1.827 1.827 0 001.87-.08l1.41-.93c.81-.53 1.29-1.42 1.29-2.38 0-.84-.37-1.63-1.01-2.18l-4.17-3.52zM10.59 19.4c.11 0 .22-.01.32-.04.72-.17 1.27-.92 1.27-1.82s-.54-1.65-1.27-1.82a1.32 1.32 0 00-.94.11c-.28.14-.53.38-.7.67-.06.1-.11.2-.15.32-.08.22-.12.47-.12.72 0 .64.28 1.21.7 1.54.25.2.56.32.89.32zM21.5 15.68c-.88 0-1.59.83-1.59 1.86s.71 1.86 1.59 1.86 1.59-.83 1.59-1.86c0-.51-.18-.98-.46-1.32-.29-.34-.68-.54-1.12-.54zM13.73 16.09a1.715 1.715 0 001.29-.6c.33-.37.54-.89.54-1.46 0-1.14-.82-2.07-1.83-2.07s-1.83.93-1.83 2.07.82 2.07 1.83 2.07zM18.31 16.09c1.01 0 1.83-.93 1.83-2.07s-.82-2.07-1.83-2.07a1.715 1.715 0 00-1.29.6 2.2 2.2 0 00-.54 1.46c0 1.14.82 2.07 1.83 2.07z"
                      fill="#223656"
                      strokeWidth={0}
                    />
                  </Svg>
                </View>
              </View>
              <View style={styles.unitinner4}>
                <Text style={styles.addmanuallytext}>Activity Type</Text>
                {ActivityType?.length == 0 ? (
                  <View style={styles.addmanuallyFeilds}>
                    <Text style={styles.selectedTextStylePlace}>
                      {' '}
                      No Activity type
                    </Text>
                  </View>
                ) : (
                  <View style={styles.inputunitContainer3}>
                    <Dropdown
                      search={true}
                      style={[styles.dropdown, {height: 40}]}
                      placeholderStyle={styles.placeholderEditAct}
                      selectedTextStyle={styles.selectedTextStyleunit}
                      inputSearchStyle={styles.inputSearchStyle1}
                      data={ActivityType}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={ActivityType[0].label}
                      itemTextStyle={styles.activitylabel}
                      // value={ActivityName}
                      onChange={item => {
                        setActivityTypeId(item.value);
                        setActivityTypeName(item.label);
                        setActivityTypeErr('');
                      }}
                    />
                  </View>
                )}
                {ActivityTypeErr && (
                  <Text style={styles.errormsg}>{ActivityTypeErr}</Text>
                )}
              </View>
            </View>
          </View>
          {/* 3 */}
          <View style={styles.marginhz15}>
            <View style={styles.unitmain1}>
              <View style={styles.unitinner3}>
                <View style={styles.actIcon}>
                  <Svg
                    id="Circle-Turquoise-White"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width={70}
                    height={70}>
                    <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                    <Path
                      className="cls-1"
                      d="M30.42 25.74l-5.54-2.38v-8.93c0-.41-.33-.74-.74-.74s-.74.33-.74.74v9.41c0 .3.18.56.45.68l5.99 2.57a.738.738 0 10.58-1.36z"
                      fill="#223656"
                    />
                    <Path
                      className="cls-1"
                      d="M24 9C15.72 9 9 15.72 9 24s6.72 15 15 15 15-6.72 15-15S32.28 9 24 9zm0 28.5c-7.44 0-13.5-6.06-13.5-13.5S16.56 10.5 24 10.5 37.5 16.56 37.5 24 31.44 37.5 24 37.5z"
                      fill="#223656"
                    />
                  </Svg>
                </View>
              </View>
              <View style={styles.unitinner4}>
                <Text style={styles.addmanuallytext}>Time</Text>
                <TouchableOpacity onPress={() => setOpen(true)}>
                  <View style={styles.addmanuallyFeilds}>
                    <Text style={styles.selectedTextStylePlace}>
                      {dateTime}
                    </Text>
                    {/* <Text style={styles.selectedTextStylePlace}>
                 
                  </Text> */}
                  </View>
                  <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode="datetime"
                    title="Select Date and Time"
                    value={date}
                    locale="en-IN"
                    maximumDate={new Date()}
                    // is24hourSource="locale"
                    // timeZoneOffsetInMinutes={0}
                    // onConfirm={date => {
                    //   console.log(date, 'date');
                    //   setOpen(false);
                    //   setDate(date);
                    //   var formattedDate =
                    //     date.getFullYear() +
                    //     '-' +
                    //     (date.getMonth() + 1) +
                    //     '-' +
                    //     date.getDate();
                    //   // hours
                    //   var getHours =
                    //     date.getHours() <= 9
                    //       ? `0${date.getHours()}`
                    //       : date.getHours();
                    //   // min
                    //   var getMin =
                    //     date.getMinutes() <= 9
                    //       ? `0${date.getMinutes()}`
                    //       : date.getMinutes();
                    //   // sec
                    //   var getSec =
                    //     date.getSeconds() <= 9
                    //       ? `0${date.getSeconds()}`
                    //       : date.getSeconds();
                    //   var TimeFormat = getHours + ':' + getMin;
                    //   const DateAndTime = formattedDate + '  ' + TimeFormat;
                    //   setDateTime(DateAndTime);
                    //   setTimeErr('');
                    //   console.log(DateAndTime, 'DateAndTime');
                    // }}
                    onConfirm={handleConfirm}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                  {TimeErr && <Text style={styles.errormsg}>{TimeErr}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* 4 */}
          <View style={styles.marginhz15}>
            <View style={styles.unitmain1}>
              <View style={styles.unitinner3}>
                <View style={styles.actIcon}>
                  <Svg
                    id="Circle-Turquoise-White"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    height={70}
                    width={70}>
                    <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                    <Path
                      d="M24.66 12.77v-2.45h3.48c.36 0 .66-.29.66-.66S28.51 9 28.14 9h-8.27c-.36 0-.66.29-.66.66s.29.66.66.66h3.48v2.45c-6.95.34-12.48 6.07-12.48 13.1S16.75 39 24 39s13.13-5.88 13.13-13.13-5.53-12.76-12.48-13.1zM24 37.69c-6.52 0-11.82-5.3-11.82-11.82S17.48 14.05 24 14.05v11.82h11.82c0 6.52-5.3 11.82-11.82 11.82z"
                      fill="#223656"
                    />
                  </Svg>
                </View>
              </View>
              <View style={styles.unitinner4}>
                <Text style={styles.addmanuallytext}>Duration (hh : mm)</Text>
                <TouchableOpacity onPress={() => setDurationOpen(true)}>
                  <View style={styles.addmanuallyFeilds}>
                    <Text style={styles.selectedTextStylePlace}>
                      {duration}
                    </Text>
                  </View>
                  <DatePicker
                    modal
                    open={Durationopen}
                    date={durationTime}
                    mode="time"
                    title="Select Time"
                    value={durationTime}
                    locale="en_GB"
                    // locale="en-IN"
                    display="spinner"
                    // maximumDate={new Date()}
                    is24hourSource="locale"
                    // timeZoneOffsetInMinutes={0}
                    onConfirm={date => {
                      console.log(date, 'date');
                      setDurationOpen(false);
                      setDate(date);
                      var formattedDate =
                        date.getFullYear() +
                        '-' +
                        (date.getMonth() + 1) +
                        '-' +
                        date.getDate();
                      // hours
                      var getHours =
                        date.getHours() <= 9
                          ? `0${date.getHours()}`
                          : date.getHours();
                      // min
                      var getMin =
                        date.getMinutes() <= 9
                          ? `0${date.getMinutes()}`
                          : date.getMinutes();
                      // sec
                      var getSec =
                        date.getSeconds() <= 9
                          ? `0${date.getSeconds()}`
                          : date.getSeconds();
                      var TimeFormat = getHours + ' : ' + getMin;
                      setDuration(TimeFormat);
                      setDurationErr('');
                      console.log(formattedDate, TimeFormat, 'TimeFormat');
                    }}
                    onCancel={() => {
                      setDurationOpen(false);
                    }}
                  />
                  {DurationErr && (
                    <Text style={styles.errormsg}>{DurationErr}</Text>
                  )}
                </TouchableOpacity>
                {/* <DurationPicker
                  DurationFinal={DurationFinal}
                  setDurationFinal={setDurationFinal}
                  DurationErr={DurationErr}
                  setDurationErr={setDurationErr}
                /> */}
              </View>
            </View>
          </View>
          {/* 4 */}
          <View style={styles.marginhz15}>
            <View style={styles.unitmain1}>
              <View style={styles.unitinner3}>
                <View style={styles.actIcon}>
                  <Svg
                    id="Circle-Turquoise-White"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    height={70}
                    width={70}>
                    <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                    <Path
                      className="cls-1"
                      d="M31.2 23.26h.05c.19 0 .36-.09.46-.21.19-.19 4.65-4.66 4.65-8.59 0-1.8-.58-3.26-1.66-4.22-.89-.79-2.13-1.23-3.49-1.23s-2.6.44-3.49 1.23c-1.08.96-1.66 2.42-1.66 4.22 0 3.94 4.58 8.53 4.62 8.56.15.15.34.24.53.24zm0-12.76c3.4 0 3.67 3.04 3.67 3.97 0 2.62-2.68 5.86-3.66 6.96a22.78 22.78 0 01-1.59-2c-1.36-1.93-2.07-3.64-2.07-4.95 0-3.68 2.8-3.97 3.66-3.97z"
                      fill="#223656"
                    />
                    <Path
                      className="cls-1"
                      d="M31.21 16.73c1.38 0 2.5-1.15 2.5-2.55s-1.12-2.53-2.5-2.53-2.5 1.15-2.5 2.55 1.12 2.53 2.5 2.53zM12.99 32.72c-1.71 0-3.09 1.42-3.09 3.15S11.28 39 12.99 39s3.09-1.42 3.09-3.15-1.38-3.13-3.09-3.13zM33.55 25.51H14.46c-2.19 0-3.98-1.8-3.98-4.02s1.78-4.02 3.98-4.02h9.34c.41 0 .74-.34.74-.75s-.33-.75-.74-.75h-9.34c-3.01 0-5.46 2.47-5.46 5.52s2.45 5.52 5.46 5.52h19.09c2.19 0 3.97 1.8 3.97 4.02s-1.78 4.02-3.98 4.02H18.32c-.41 0-.74.34-.74.75s.33.75.74.75h15.22c3.01 0 5.46-2.47 5.46-5.52s-2.45-5.52-5.45-5.52z"
                      fill="#223656"
                    />
                  </Svg>
                </View>
              </View>
              <View style={styles.unitinner4}>
                <Text style={styles.addmanuallytext}>
                  Distance ({selectedMeasureUnit ? selectedMeasureUnit : 'km'})
                </Text>
                {/* start */}
                <View style={styles.unitmain}>
                  <View style={styles.unitinner1}>
                    <View style={styles.addmanuallyFeilds}>
                      <TextInput
                        placeholder={`00.00 ${
                          selectedMeasureUnit ? selectedMeasureUnit : 'km'
                        }`}
                        style={styles.selectedTextStylePlace}
                        maxLength={8}
                        value={`${distance}`}
                        keyboardType="numeric"
                        onChange={event => {
                          handleChange('distance', event);
                        }}
                      />
                    </View>
                    {distanceErr && (
                      <Text style={styles.errormsg}>{distanceErr}</Text>
                    )}
                  </View>
                </View>
                {/* end */}
              </View>
            </View>
          </View>
          <View style={styles.space20}></View>
          <View style={styles.editBtn}>
            <TouchableOpacity
              style={[styles.bluebtnsmallSave, styles.addperbtn]}
              onPress={() => handleSave()}>
              <Text style={styles.bluebtnsmalltextSave}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bluebtnsmallSave, styles.addperbtn]}
              onPress={() => navigation.goBack()}>
              <Text style={styles.bluebtnsmalltextSave}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space50}></View>
          <View style={styles.space20}></View>
        </KeyboardAwareScrollView>
      </ScrollView>

      {/* popup */}
      {openAddFriend && (
        <EditActivityFriends
          openAddFriend={openAddFriend}
          setOpenAddFriend={setOpenAddFriend}
          handleOpen={handleOpen}
          handleClose={handleClose}
          OtherPetdata={OtherPetdata}
          setSelectedComing={setSelectedComing}
          selectedComing={selectedComing}
          selectedComingProfile={selectedComingProfile}
          setSelectedComingProfile={setSelectedComingProfile}
        />
      )}
    </>
  );
};
export default EditActivity;
