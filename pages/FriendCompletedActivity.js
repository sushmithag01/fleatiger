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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DeleteActivityAPI,
  GetDashboardApi,
  UploadActivityImageApi,
  chatHighlightApi,
  getCompletedActivityApi,
  getFriendListActivityApi,
  getFriendListApi,
} from './API/ApiCalls';
import {useIsFocused} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from './CommonScreens/ProfileScreen';
import CompletedActivityJson from './DummyJson/CompletedActivity';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {BottomSheet} from '@rneui/themed';
import ActivityWhoComing from './ActivityWhoComing';
import FriendsiMet from './FrinedsiMet';
import AddFriend from './AddFriend';
import Loader from './CommonScreens/Loader';
import CompletedActivityPlus from './CompletedActivityPlus';
import ProfileRemovedConfirmation from './Popups/ProfileRemovedConfirmation';
import RemoveProfileMessage from './Popups/RemoveProfileMessage';
import MotivationalMessage from './Popups/MotivationalMessage';
import Tracking from './Maps/Tracking';
import MapDirection from './Maps/MapDirection';
import FriendProfile from './FriendProfile';
import {
  CommonHeaderRight,
  FriendCompletedActivityHeaderLeft,
  FriendCompletedActivityHeaderRight,
} from '../navigation/CustomBackNavigation';

const FriendCompletedActivity = ({navigation, route}) => {
  const {item, dateClicked, status} = route.params;

  console.log(item, dateClicked, status, 'item,dateClicked');
  const [completed, setCompleted] = useState([]);
  const [SliderImage, setSliderImage] = useState([]);
  const [friendsIMet, setFriendsIMet] = useState([]);

  const [friendsIMetID, setFriendsIMetID] = useState([]);

  const [MyfriendList, setMyFriendList] = useState([]);
  const [GlobalMyfriendList, setGlobalMyFriendList] = useState([]);

  const [isVisible, setIsVisible] = useState(false);
  const [imgDelete, setimgDelete] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [OtherPetdata, setOtherPetData] = useState([]);
  const [loading, setLoading] = useState(false);

  // popup
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  // congrats -text
  const [MessagePop, setMessagePop] = useState('');
  const [congratsMsg, setCongratsMsg] = useState(false);

  // delete-img
  const [SelectedImg, setSelectedImg] = useState([]);

  // maps
  const [MapPoints, setMapPoints] = useState([]);

  // popup
  const [openAddFriend, setOpenAddFriend] = useState(false);
  const [openViewFriend, setOpenViewFriend] = useState(false);

  const isFocused = useIsFocused();
  const [chatNotify, setChatnotify] = useState(0);

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => (
          <FriendCompletedActivityHeaderLeft navigation={navigation} />
        ),
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      // setLoading(true)
      // GetSiblingList()
      // GetPetFriendListData()
      // GetCompletedActivityList()
      setMessagePop('');
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

  // popup-friendView--threee-dots
  const GetPetFriendListData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      activity_id: parseInt(item.activity_id),
    };
    const Response = await getFriendListActivityApi(payload);
    console.log(payload, Response, 'check response-friendsImzet');
    if (Response.success == true) {
      // console.log(payload,"friendsIMet-data");
      // Toast.show(Response.message, {
      //   duration: Toast.durations.LONG,
      //   position: 50,
      //   shadow: true,
      //   animation: true,
      //   hideOnPress: true,
      //   delay: 0,
      //   backgroundColor:'#fff',
      //   textColor:'#000'
      // });
      // setLoading(false)
      setMyFriendList(Response?.data);
      setGlobalMyFriendList(Response?.data);
    } else {
      // setLoading(false)
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
  };

  // friend-met-list
  const GetSiblingList = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      user_pet_id: PetId,
      // user_id: 40,
      // user_pet_id: 126,
    };
    const Response = await getFriendListApi(payload);
    // console.log(Response,"llllllllllllllll");
    if (Response.message == 'No pet friend details available') {
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
      setOtherPetData(Response?.data);
    }
  };

  const GetCompletedActivityList = async () => {
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      date: dateClicked,
      clicked_activity_id: parseInt(item.activity_id),
      status: status,
    };
    const Response = await getCompletedActivityApi(payload);
    if (Response.success == false) {
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
      // console.log(Response, "look response", Response.data[0].map_coordinates, Response.data[0].map_coordinates.length)
      setLoading(false);

      setCompleted(Response.data[0]);
      setFriendsIMet(Response.data[0].friend_pet_id);
      setSliderImage(Response.data[0].uploadedImages);
      const getId = Response.data[0].friend_pet_id.map(item => item.friendId);
      setFriendsIMetID(getId);

      setMessagePop(Response.data[0].message);
      if (Response.data[0].message != '') {
        setTimeout(() => {
          setCongratsMsg(true);
        }, 500);
      } else {
        setCongratsMsg(false);
      }

      if (Response.data[0].map_coordinates?.length == 0) {
        setMapPoints([]);
      } else {
        setMapPoints(Response.data[0].map_coordinates);
      }

      console.log(getId, 'getId');
    }
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <View style={styles.mainpage}>
        <View style={styles.space20}></View>
        {/* <View style={styles.space20}></View> */}
        {/* <TopHeader /> */}
        <Profile
          petImage={item?.pet_image_path}
          petName={item?.pet_name}
          user_name={item?.user_name == '' ? '' : item?.user_name}
        />
        <Text style={styles.familytext}>Family Member</Text>
        <View style={styles.space20}></View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* activity name/img */}
          {item.activity_name != '' ? (
            <View style={styles.homecardinner1}>
              <View style={styles.logmain}>
                <View>
                  <Text style={styles.homecardtext1}>{item.activity_name}</Text>
                  <Text style={styles.logdate}>{item.activity_time}</Text>
                </View>

                <Image
                  // source={require('../assets/profile.png')}
                  style={[styles.activityImg]}
                  source={{uri: item.activity_image_path}}></Image>
              </View>
            </View>
          ) : (
            ''
          )}

          <View>
            <View style={[styles.comight, styles.homecardinner1]}>
              <View style={[styles.prodemain]}>
                <View style={styles.comminner}>
                  <View style={styles.measurementVal}>
                    <Text style={styles.homecardtext1}>Time</Text>
                    <View style={[styles.act1, styles.comact4]}>
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="icons-RZ_Weiss"
                        viewBox="0 0 50 50"
                        width={50}
                        height={50}>
                        <Defs></Defs>
                        <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                        <Path
                          className="cls-1"
                          d="M39.5 24.5c-.28 0-.5.22-.5.5 0 7.72-6.28 14-14 14s-14-6.28-14-14 6.28-14 14-14c.28 0 .5-.22.5-.5s-.22-.5-.5-.5c-8.27 0-15 6.73-15 15s6.73 15 15 15 15-6.73 15-15c0-.28-.22-.5-.5-.5z"
                          fill="#fff"
                        />
                        <Path
                          className="cls-1"
                          d="M25.14 14.78c-.28 0-.5.22-.5.5v9.57c0 .2.12.38.3.46l6.09 2.61c.06.03.13.04.2.04a.5.5 0 00.46-.3c.11-.25 0-.55-.26-.66l-5.79-2.48v-9.24c0-.28-.22-.5-.5-.5z"
                          fill="#fff"
                        />
                      </Svg>
                      <Text style={[styles.act5]}>{item.activity_time}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.comminner}>
                  <View style={styles.measurementVal}>
                    <Text style={styles.homecardtext1}>Duration</Text>
                    <View style={[styles.act1, styles.comact4]}>
                      <Svg
                        id="Circle-Turquoise-White"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        height={50}
                        width={50}>
                        <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                        <Path
                          className="cls-1"
                          d="M30.42 25.74l-5.54-2.38v-8.93c0-.41-.33-.74-.74-.74s-.74.33-.74.74v9.41c0 .3.18.56.45.68l5.99 2.57a.738.738 0 10.58-1.36z"
                          fill="#fff"
                        />
                        <Path
                          className="cls-1"
                          d="M24 9C15.72 9 9 15.72 9 24s6.72 15 15 15 15-6.72 15-15S32.28 9 24 9zm0 28.5c-7.44 0-13.5-6.06-13.5-13.5S16.56 10.5 24 10.5 37.5 16.56 37.5 24 31.44 37.5 24 37.5z"
                          fill="#fff"
                        />
                      </Svg>
                      <Text style={[styles.act5]}>{item.duration}</Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* 2 */}
              <View style={[styles.prodemain]}>
                <View style={styles.comminner}>
                  <View style={styles.measurementVal}>
                    <Text style={styles.homecardtext1}>Distance</Text>
                    <View style={[styles.act1, styles.comact4]}>
                      <Svg
                        id="Circle-Turquoise-White"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        height={50}
                        width={50}>
                        <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                        <Path
                          className="cls-1"
                          d="M31.2 23.26h.05c.19 0 .36-.09.46-.21.19-.19 4.65-4.66 4.65-8.59 0-1.8-.58-3.26-1.66-4.22-.89-.79-2.13-1.23-3.49-1.23s-2.6.44-3.49 1.23c-1.08.96-1.66 2.42-1.66 4.22 0 3.94 4.58 8.53 4.62 8.56.15.15.34.24.53.24zm0-12.76c3.4 0 3.67 3.04 3.67 3.97 0 2.62-2.68 5.86-3.66 6.96a22.78 22.78 0 01-1.59-2c-1.36-1.93-2.07-3.64-2.07-4.95 0-3.68 2.8-3.97 3.66-3.97z"
                          fill="#fff"
                        />
                        <Path
                          className="cls-1"
                          d="M31.21 16.73c1.38 0 2.5-1.15 2.5-2.55s-1.12-2.53-2.5-2.53-2.5 1.15-2.5 2.55 1.12 2.53 2.5 2.53zM12.99 32.72c-1.71 0-3.09 1.42-3.09 3.15S11.28 39 12.99 39s3.09-1.42 3.09-3.15-1.38-3.13-3.09-3.13zM33.55 25.51H14.46c-2.19 0-3.98-1.8-3.98-4.02s1.78-4.02 3.98-4.02h9.34c.41 0 .74-.34.74-.75s-.33-.75-.74-.75h-9.34c-3.01 0-5.46 2.47-5.46 5.52s2.45 5.52 5.46 5.52h19.09c2.19 0 3.97 1.8 3.97 4.02s-1.78 4.02-3.98 4.02H18.32c-.41 0-.74.34-.74.75s.33.75.74.75h15.22c3.01 0 5.46-2.47 5.46-5.52s-2.45-5.52-5.45-5.52z"
                          fill="#fff"
                        />
                      </Svg>
                      <Text style={[styles.act5]}>{item.distance}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.comminner}>
                  <View style={styles.measurementVal}>
                    <Text style={styles.homecardtext1}>Calories</Text>
                    <View style={[styles.act1, styles.comact4]}>
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="icons-RZ_Blau"
                        viewBox="0 0 50 50"
                        width={50}
                        height={50}>
                        <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                        <Path
                          d="M35.83 31.95c.98-4.65-.88-6.85-2.67-8.98-2.2-2.61-4.27-5.07-1.27-12.27.04-.08.05-.18.03-.27a.508.508 0 00-.11-.25.503.503 0 00-.49-.18c-2.95.58-5.64 2.17-7.56 4.49a13.192 13.192 0 00-3.02 8.26v1.02l-.77-.67a6.46 6.46 0 01-2.02-3.3c-.03-.1-.1-.2-.2-.26a.538.538 0 00-.28-.08h-.06a.47.47 0 00-.31.16 12.085 12.085 0 00-3.2 8.56c.09 3.18 1.39 6.15 3.67 8.37 2.28 2.22 5.29 3.44 8.47 3.44.2 0 .39 0 .59-.01 2.19-.17 4.3-1.05 5.94-2.49 1.64-1.44 2.8-3.41 3.25-5.55zm-3.45-8.34c1.72 2.04 3.34 3.96 2.46 8.13a9.377 9.377 0 01-1.71 3.69A9.236 9.236 0 0130 38.02l-1.55.79.95-1.45c.33-.5.56-1.06.68-1.64.47-2.21-.45-3.29-1.25-4.24-.96-1.14-1.79-2.12-.52-5.17.05-.11.05-.24.01-.35a.495.495 0 00-.22-.27c-.1-.06-.23-.08-.35-.06-1.14.22-2.18.76-3.03 1.56-.84.8-1.44 1.81-1.72 2.94l-.38 1.49-.51-1.45a.513.513 0 00-.37-.33.491.491 0 00-.47.15c-.77.83-1.27 1.86-1.44 2.98-.17 1.12 0 2.25.47 3.28l.95 1.86-1.51-1.04c-2.44-1.68-4.09-4.2-4.64-7.11s.05-5.86 1.7-8.32l.45-.67.35.72c.73 1.51 2 2.68 3.56 3.29a.5.5 0 00.5-.07c.14-.11.21-.29.19-.46-.36-2.71.22-5.5 1.64-7.84s3.61-4.15 6.18-5.09l.91-.33-.31.92c-2.18 6.45 0 9.03 2.1 11.52"
                          fill="#fff"
                          fillRule="evenodd"
                        />
                      </Svg>
                      <Text style={[styles.act5]}>
                        {completed.activityCalories} cal
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* <View style={[styles.comight, styles.homecardinner1]}>
            <Text style={styles.maptext}>
              Map is shown when you track activity with a fleaTag or phone
            </Text>
          </View> */}
          {MapPoints.length == 0 ? (
            <View style={[styles.comight, styles.homecardinner1]}>
              <Text style={styles.maptext}>
                Map is shown when you track activity with a fleaTag or phone
              </Text>
            </View>
          ) : (
            <View style={{padding: 20, height: 350}}>
              <MapDirection waypoints={MapPoints} />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default FriendCompletedActivity;
