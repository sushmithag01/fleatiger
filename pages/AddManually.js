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
  KeyboardAvoidingView,
  Picker,
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
  GetDashboardApi,
  SaveActivityApi,
  chatHighlightApi,
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  AddManuallyHeaderLeft,
  AddManuallyHeaderRight,
  CommonHeaderRight,
} from '../navigation/CustomBackNavigation';

import {handleAddManuallySave} from './functions/addManuallyFunction';
import ActivityProfileScreen from './CommonScreens/ActivityProfileScreen';

const AddManually = props => {
  const navigation = useNavigation();
  const initialDuration = new Date(2000, 0, 1, 0, 0, 0);
  const isFocused = useIsFocused();

  const [data, setData] = useState([]);
  //  who coming
  const [OtherPetdata, setOtherPetData] = useState([]);
  const [search, setSearch] = useState('');

  const [selectedHours, setSelectedHours] = useState('00');
  const [selectedMinutes, setSelectedMinutes] = useState('00');

  const hours = Array.from({length: 24}, (_, i) => ({
    label: `${i < 10 ? '0' : ''}${i}`,
    value: `${i < 10 ? '0' : ''}${i}`,
  }));
  const minutes = Array.from({length: 60}, (_, i) => ({
    label: `${i < 10 ? '0' : ''}${i}`,
    value: `${i < 10 ? '0' : ''}${i}`,
  }));

  // activity -type
  const [ActivityType, setActivityType] = useState([]);
  const [ActivityTypeName, setActivityTypeName] = useState('');
  const [ActivityTypeId, setActivityTypeId] = useState('');
  // feilds - time

  const [duration, setDuration] = useState('Select Time');
  const [dateTime, setDateTime] = useState('Select Date and Time');
  const [TimeValue, setTimeValue] = useState('');
  const [selectedTimeVal, setSelectedTimeVal] = useState('');
  // const [durationTimeValue, setDurationTimeValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [durationTime, setDurationTime] = useState(initialDuration);
  const [open, setOpen] = useState(false);
  const [Durationopen, setDurationOpen] = useState(false);
  const [ActivityName, setActivityName] = useState('');
  // duration
  const [DurationFinal, setDurationFinal] = useState('00 : 00');
  // handleInput - distance
  const [distance, setdistance] = useState('');
  const [distanceErr, setdistanceErr] = useState('');

  //  Error
  const [ActivityNameErr, setActivityNameErr] = useState('');
  const [ActivityTypeErr, setActivityTypeErr] = useState('');
  const [TimeErr, setTimeErr] = useState('');
  const [DurationErr, setDurationErr] = useState('');

  // popup-slected- who's coming
  const [selectedComing, setSelectedComing] = useState([]);
  const [selectedComingProfile, setSelectedComingProfile] = useState([]);

  const [loading, setLoading] = useState(false);
  const [chatNotify, setChatnotify] = useState(0);

  const [activityDescription, setActivityDescription] = useState('');
  const [activityDescriptionErr, setActivityDescriptionErr] = useState('');
  const [selectedMeasureUnit, setSelectedMeasureUnit] = useState('');
  const [is24Format, setIs24Format] = useState('');

  useEffect(() => {
    notificationHilightHandler();
  }, [isFocused, chatNotify]);

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <AddManuallyHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });

      GetActivityTypeList();
    }
  }, [isFocused, chatNotify]);

  useEffect(() => {
    GetSiblingList();
  }, [search, isFocused, selectedMeasureUnit]);

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

  // who's coming - data
  const GetSiblingList = async () => {
    const gettimeformat = await AsyncStorage.getItem('selected_time_format');
    const is24Hour = JSON.parse(gettimeformat);
    const measureUnit = await AsyncStorage.getItem('selected_unit_of_measure');
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      user_pet_id: PetId,
      // user_id: 40,
      // user_pet_id: 126,
      search: search,
    };
    const Response = await getFriendListApi(payload);
    // console.log(Response.data.length);
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
    } else {
      setOtherPetData(Response?.data);
      setSelectedMeasureUnit(JSON.parse(measureUnit).distance_unit);
      setIs24Format(is24Hour);
      setLoading(false);
    }
  };

  // Activity type- data
  const GetActivityTypeList = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      pet_id: PetId,
      // user_id: 40,
      // pet_id: 126,
    };

    const Response = await getActivityTypeApi(payload);
    // console.log(Response?.data,"sib")
    setLoading(false);
    setActivityType(Response?.data);
  };

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
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const SelectedDuration = duration.split(' ').join('');
    // console.log(SelectedDuration, 'SelectedDuration');

    const SelectedTimeValue = selectedTimeVal.split(' ').join('');
    const SelectedDateTime = dateTime + ' ' + SelectedTimeValue;
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
    if (SelectedDateTime == 'Select Date and Time ') {
      setTimeErr(ErrorText.TimeRequiredError);
      setLoading(false);
    } else {
      setTimeErr('');
      setLoading(false);
    }
    if (
      duration == '00:00:00' ||
      duration == '00 : 00' ||
      duration === 'Select Time'
    ) {
      setDurationErr(ErrorText.DurationRequiredError);
      setLoading(false);
    }
    if (distance == '') {
      setdistanceErr(ErrorText.DistanceRequiredError);
      setLoading(false);
    }
    //  console.log(ActivityNameErr ,ActivityTypeErr.length , TimeErr.length , DurationErr.length ,distanceErr.length,"kkkk" ,ActivityTypeId)

    if (
      ActivityNameErr.length == '' &&
      ActivityTypeErr.length == 0 &&
      TimeErr.length == 0 &&
      DurationErr.length == 0 &&
      distanceErr.length == 0 &&
      ActivityName.length != 0 &&
      ActivityTypeId != '' &&
      SelectedDateTime != 'Select Date and Time ' &&
      SelectedDuration != '00:00'
    ) {
      const payload = {
        user_id: parseInt(UserID),
        user_pet_id: parseInt(PetId),
        // friend_pet_id: parseInt(SiblingId),
        friend_pet_id: selectedComing,
        activity_type_id: parseInt(ActivityTypeId),
        activity_name: ActivityName,
        time: SelectedDateTime,
        duration: SelectedDuration,
        distance: SelectedDistance,
        description: activityDescription,
      };
      const Response = await SaveActivityApi(payload);
      if (Response.success == true) {
        setLoading(false);
        Toast.show(Response.messsage, {
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
        navigation.navigate('CompletedActivity', {
          item: {activity_id: Response.data},
          dateClicked: dateTime,
          status: 'new',
        });
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
  const [DisplayTimeFormat, setDisplayTimeFormat] = useState('');

  const handleClose = () => {
    setOpenAddFriend(false);
  };

  const handleOpen = () => {
    setOpenAddFriend(true);
  };

  const handleConfirm = async selectedDate => {
    setTimeErr('');
    const gettimeformat = await AsyncStorage.getItem('selected_time_format');
    const is24Hour = JSON.parse(gettimeformat);
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
    if (is24Hour === null || is24Hour.time_format_name === '24-hour') {
      // 24-hour format
      formattedTime = hours.toString().padStart(2, '0') + ':' + minutes;
    } else {
      // 12-hour format with AM/PM
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert to 12-hour format
      formattedTime = hours + ':' + minutes + ' ' + ampm;
    }
    setDisplayTimeFormat(formattedDate);
    setDateTime(formattedDate);
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
          <ActivityProfileScreen />
          <Text style={styles.familytext}>Family Member</Text>
          <View style={styles.space30}></View>

          <View style={styles.marginhz15}>
            <Text style={styles.addmanuallytext}>Activity Name</Text>
            <View style={[styles.inputContainer1]}>
              <TextInput
                placeholder="Name of Activity, i.e, Sunday Stroll"
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
                maxLength={100}
                multiline={true}
                numberOfLines={3}
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
                              source={{
                                uri: selectedComingProfile[0].pet_image_path,
                              }}
                              style={styles.metmainpic}></Image>
                          </View>
                          <View style={styles.metmain}>
                            <Image
                              source={{
                                uri: selectedComingProfile[1].pet_image_path,
                              }}
                              style={styles.metmainpic}></Image>
                          </View>
                          <View style={styles.metmain}>
                            <Image
                              source={{
                                uri: selectedComingProfile[2].pet_image_path,
                              }}
                              style={styles.metmainpic}></Image>
                          </View>
                          <View style={styles.metmain}>
                            <Image
                              source={{
                                uri: selectedComingProfile[3].pet_image_path,
                              }}
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
                                  source={{uri: item.pet_image_path}}
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
                  {/* <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={70} height={70}>
                    <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                    <Path
                      d="M34.32 26.89l-8.06-6.8a3.494 3.494 0 00-4.51 0l-8.06 6.8a5.503 5.503 0 00-1.96 4.2c0 1.85.93 3.57 2.49 4.6l2.73 1.8c1.08.72 2.47.77 3.61.15l2.57-1.41c.55-.3 1.21-.3 1.76 0l2.57 1.41a3.5 3.5 0 003.61-.15l2.73-1.8a5.48 5.48 0 002.49-4.6c0-1.62-.71-3.15-1.96-4.2zM13.46 24.43c.21 0 .42-.03.62-.07 1.4-.33 2.45-1.78 2.45-3.52s-1.05-3.18-2.45-3.52c-.2-.05-.41-.07-.62-.07-.42 0-.83.1-1.19.28-.55.27-1.02.73-1.35 1.3a3.997 3.997 0 00-.52 2.01c0 1.24.54 2.33 1.35 2.98.49.39 1.08.61 1.71.61zM36.7 18.3c-.55-.65-1.32-1.05-2.17-1.05-1.69 0-3.06 1.61-3.06 3.59s1.37 3.59 3.06 3.59 3.06-1.61 3.06-3.59c0-.99-.34-1.89-.9-2.54zM19.53 18.05c.49 0 .95-.11 1.37-.31.42-.2.8-.49 1.12-.86.64-.72 1.03-1.72 1.03-2.82 0-2.2-1.58-3.99-3.53-3.99s-3.53 1.79-3.53 3.99 1.58 3.99 3.53 3.99zM28.39 18.05c1.95 0 3.53-1.79 3.53-3.99s-1.58-3.99-3.53-3.99c-.49 0-.95.11-1.37.31-.42.2-.8.49-1.12.86-.64.72-1.03 1.72-1.03 2.82 0 2.2 1.58 3.99 3.53 3.99z"
                      fill="#223656"
                      strokeWidth={0}
                    />
                  </Svg> */}
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
                <Text style={styles.addmanuallytext}>
                  Activity Type<Text style={{color: '#f00732'}}>*</Text>
                </Text>
                {ActivityType?.length == 0 ? (
                  <View style={styles.addmanuallyFeilds}>
                    <Text style={styles.selectedTextStylePlace}>
                      {' '}
                      No Activity type
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.inputunitContainer3, styles.acttype]}>
                    <Dropdown
                      search={true}
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyleunit}
                      selectedTextStyle={styles.selectedTextStyleunit}
                      inputSearchStyle={styles.inputSearchStyle1}
                      baseColor={'#000000'}
                      labelStyle={{color: 'black'}}
                      data={ActivityType}
                      maxHeight={300}
                      labelField="activity_type_name"
                      valueField="activity_type_id"
                      placeholder="Activity Type"
                      itemTextStyle={styles.activitylabel}
                      // value={ActivityName}
                      onChange={item => {
                        setActivityTypeId(item.activity_type_id);
                        setActivityTypeName(item.activity_type_name);
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
                      d="M29.99 25.47l-5.03-2.16v-8.14c0-.46-.37-.83-.83-.83s-.83.37-.83.83v8.69c0 .33.2.63.5.76l5.54 2.37c.11.04.21.07.32.07.33 0 .63-.2.77-.5a.834.834 0 00-.44-1.09z"
                      fill="#223656"
                      strokeWidth={0}
                    />
                    <Path
                      d="M24 10c-7.72 0-14 6.28-14 14s6.28 14 14 14 14-6.28 14-14-6.28-14-14-14zm0 26.32c-6.79 0-12.32-5.53-12.32-12.32S17.21 11.68 24 11.68 36.32 17.21 36.32 24 30.79 36.32 24 36.32z"
                      fill="#223656"
                      strokeWidth={0}
                    />
                  </Svg>
                </View>
              </View>
              <View style={styles.unitinner4}>
                <Text style={styles.addmanuallytext}>
                  Time<Text style={{color: '#f00732'}}>*</Text>
                </Text>
                <TouchableOpacity onPress={() => setOpen(true)}>
                  <View style={styles.addmanuallyFeilds}>
                    <Text style={styles.selectedTextStylePlace}>
                      {dateTime} {TimeValue}
                    </Text>
                    {/* <Text style={styles.selectedTextStylePlace}>
                
                  </Text> */}
                  </View>
                  <DatePicker
                    is24HourFormat={true}
                    modal
                    open={open}
                    date={date}
                    mode="datetime"
                    title="Select Date and Time"
                    value={date}
                    locale={is24Format.time_format_name === '24-hour' ?"en_GB" :"en_IN" }
                    // locale="en_IN"
                    maximumDate={new Date()}
                    is24hourSource="locale"
                    // timeZoneOffsetInMinutes={0}
                    onConfirm={handleConfirm}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                  {/* <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode="datetime"
                    title="Select Date and Time"
                    locale="en_GB" // Locale that uses 24-hour format by default
                    maximumDate={new Date()}
                    onConfirm={selectedDate => {
                      setOpen(false);
                      setDate(selectedDate);

                      // Format the date
                      const formattedDate =
                        selectedDate.getFullYear() +
                        '-' +
                        String(selectedDate.getMonth() + 1).padStart(2, '0') +
                        '-' +
                        String(selectedDate.getDate()).padStart(2, '0');

                      // Format the time to 24-hour format explicitly
                      const getHours = String(selectedDate.getHours()).padStart(
                        2,
                        '0',
                      );
                      const getMin = String(selectedDate.getMinutes()).padStart(
                        2,
                        '0',
                      );

                      const TimeFormat = `${getHours}:${getMin}`;

                      // Set the formatted date and time
                      // setDateTime(formattedDate);
                      // setTimeValue(TimeFormat);
                      console.log(
                        formattedDate,
                        TimeFormat,
                        'Formatted Date & Time',
                      );
                    }}
                    onCancel={() => setOpen(false)}
                  /> */}
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
                      d="M24.75 13.49v-1.98h3.06c.41 0 .75-.34.75-.75s-.34-.75-.75-.75h-7.62c-.41 0-.75.34-.75.75s.34.75.75.75h3.06v1.98c-6.46.39-11.5 5.74-11.5 12.24S17.25 38.01 24 38.01s12.25-5.51 12.25-12.28-5.04-11.84-11.5-12.24zM24 36.5c-5.92 0-10.74-4.83-10.74-10.77S18 15.04 23.85 14.96v10.91h10.89c-.08 5.87-4.87 10.62-10.74 10.62z"
                      fill="#223656"
                      strokeWidth={0}
                    />
                  </Svg>
                </View>
              </View>
              <View style={styles.unitinner4}>
                <Text style={styles.addmanuallytext}>
                  Duration (hh : mm)<Text style={{color: '#f00732'}}>*</Text>
                </Text>
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
                    value={duration}
                    locale="en_GB" // to remove AM and PM
                    // locale="en-IN"
                    display="spinner"
                    // maximumDate={new Date()}
                    is24hourSource="locale"
                    // timeZoneOffsetInMinutes={0}
                    onConfirm={date => {
                      console.log(date, 'date');
                      setDurationOpen(false);
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
              </View>
            </View>
          </View>

          {/* 4 */}
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
                      d="M31.2 23.26h.05c.19 0 .36-.09.46-.21.19-.19 4.65-4.66 4.65-8.59 0-1.8-.58-3.26-1.66-4.22-.89-.79-2.13-1.23-3.49-1.23s-2.6.44-3.49 1.23c-1.08.96-1.66 2.42-1.66 4.22 0 3.94 4.58 8.53 4.62 8.56.15.15.34.24.53.24zm-3.66-8.8c0-3.68 2.8-3.97 3.66-3.97 3.4 0 3.67 3.04 3.67 3.97 0 2.62-2.68 5.86-3.66 6.96a22.78 22.78 0 01-1.59-2c-1.36-1.93-2.07-3.64-2.07-4.95z"
                      fill="#223656"
                      strokeWidth={0}
                    />
                    <Path
                      d="M33.71 14.19c0-1.4-1.12-2.53-2.5-2.53s-2.5 1.15-2.5 2.55 1.12 2.53 2.5 2.53 2.5-1.15 2.5-2.55zM12.99 32.72c-1.71 0-3.09 1.42-3.09 3.15S11.28 39 12.99 39s3.09-1.42 3.09-3.15-1.38-3.13-3.09-3.13zM33.49 25.41H14.52c-2.12 0-3.85-1.75-3.85-3.89s1.73-3.89 3.85-3.89h9.27c.46 0 .84-.38.84-.84s-.38-.84-.84-.84h-9.27c-3.05 0-5.52 2.5-5.52 5.58s2.48 5.58 5.52 5.58h18.96c2.12 0 3.84 1.75 3.84 3.9s-1.73 3.89-3.85 3.89H18.35c-.46 0-.84.38-.84.84s.38.84.84.84h15.12c3.05 0 5.52-2.5 5.52-5.58s-2.47-5.58-5.51-5.58z"
                      fill="#223656"
                      strokeWidth={0}
                    />
                  </Svg>
                </View>
              </View>
              <View style={styles.unitinner4}>
                <Text style={styles.addmanuallytext}>
                  Distance ({selectedMeasureUnit ? selectedMeasureUnit : 'km'})
                  <Text style={{color: '#f00732'}}>*</Text>
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
                        maxLength={5}
                        keyboardType="numeric"
                        value={distance}
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
        <ActivityWhoComing
          openAddFriend={openAddFriend}
          setOpenAddFriend={setOpenAddFriend}
          handleOpen={handleOpen}
          handleClose={handleClose}
          OtherPetdata={OtherPetdata}
          setSelectedComing={setSelectedComing}
          selectedComing={selectedComing}
          selectedComingProfile={selectedComingProfile}
          setSelectedComingProfile={setSelectedComingProfile}
          setSearch={setSearch}
          search={search}
        />
      )}
    </>
  );
};
export default AddManually;
