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
import { useNavigation } from '@react-navigation/native';
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
import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from './CommonScreens/ProfileScreen';
import CompletedActivityJson from './DummyJson/CompletedActivity';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { BottomSheet } from '@rneui/themed';
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
import MapPathView from './Maps/MapPathView';
import {
  CommonHeaderRight,
  CompletedActivityHeaderLeft,
  CompletedActivityHeaderRight,
} from '../navigation/CustomBackNavigation';
import { FlatList } from 'react-native-gesture-handler';
import LikeRenderItem from './RenderComponents/LikeRenderItem';

const CompletedActivity = ({ navigation, route }) => {
  const { item, dateClicked, status, PageName } = route.params;
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

  const isFocused = useIsFocused();

  const [chatNotify, setChatnotify] = useState(0);
  const [selectedComing, setSelectedComing] = useState([]);
  const [selectedComingProfile, setSelectedComingProfile] = useState([]);

  useEffect(() => {
    if (isFocused) {
      notificationHilightHandler();
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <CompletedActivityHeaderLeft
          PageName={PageName}
          navigation={navigation}
        />
      ),
      headerRight: () => (
        <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
      ),
    });
    if (isFocused) {
      setLoading(true);
      GetSiblingList();
      GetPetFriendListData();
      GetCompletedActivityList();
      setMessagePop('');
    }
  }, [isFocused, navigation, chatNotify]);

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
    if (Response.status === 200) {
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
      // Toast.show(Response.message, {
      //   duration: Toast.durations.LONG,
      //   position: 50,
      //   shadow: true,
      //   animation: true,
      //   hideOnPress: true,
      //   delay: 0,
      //   backgroundColor: '#fff',
      //   textColor: '#000'
      // });
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
    if (Response.status === 200) {
      setOtherPetData(Response?.data);
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
    // console.log('Response getCompletedActivityApi', payload);
    const Response = await getCompletedActivityApi(payload);
    // console.log('Response', Response.data[0]);
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
      setSelectedComingProfile(Response.data[0].friend_pet_id);
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

      // console.log(getId, "getId")
    }
  };

  const options = {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.5,
    mediaType: 'photo',
    includeBase64: true,
    presentationStyle: 'pageSheet',
    cameraType: 'back',
  };

  const chooseCamera = async () => {
    const result = await launchCamera(options);
    // console.log("sgvfh",result)
    setFilePath(`data:image/jpeg;base64,${result.assets[0].base64}`);
    const obj = {
      data: `data:image/jpeg;base64,${result.assets[0].base64}`,
      file_type: 'jpeg',
    };
    setSliderImage([...SliderImage, obj]);
    setIsVisible(false);
    Toast.show(result.errorCode, {
      duration: Toast.durations.LONG,
      position: 50,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: '#fff',
      textColor: '#000',
    });
    // alert(result,"result1")
  };

  const chooseGallery = async () => {
    const result = await launchImageLibrary(options);

    setIsVisible(false);
    // console.log(result.assets[0].fileSize, 'result12');
    // if(result.assets[0].fileSize > 400000){
    //   Toast.show('Please upload image size less than 400KB', {
    //     duration: Toast.durations.LONG,
    //     position: 50,
    //     shadow: true,
    //     animation: true,
    //     hideOnPress: true,
    //     delay: 0,
    //     backgroundColor:'#fff',
    //     textColor:'#000'
    //   })
    // }else{

    // }

    // if (result.assets[0].fileSize > 300000) {
    //   setMessagePop('Please provide an image that is less than 400 KB in size')
    //   setTimeout(() => {
    //     setCongratsMsg(true)
    //   }, 500);
    // } else {
    setMessagePop('');
    setCongratsMsg(false);
    setFilePath(`data:image/jpeg;base64,${result.assets[0].base64}`);
    const obj = {
      data: `data:image/jpeg;base64,${result.assets[0].base64}`,
      file_type: 'jpeg',
    };
    setSliderImage([...SliderImage, obj]);
    // }
  };

  // popup
  const [openAddFriend, setOpenAddFriend] = useState(false);
  const [openViewFriend, setOpenViewFriend] = useState(false);

  const handleClose = () => {
    setOpenAddFriend(false);
  };

  const handleOpen = () => {
    setOpenAddFriend(true);
  };

  const handleCloseMore = () => {
    setOpenViewFriend(false);
  };

  const handleOpenMore = () => {
    setOpenViewFriend(true);
  };

  const handleSaveImg = async () => {
    // console.log("friendsIMetIDyyyy", friendsIMetID)
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      date: dateClicked,
      uploadedImg: SliderImage,
      pet_activity_id: parseInt(item.activity_id),
      friendlist: friendsIMetID,
      activity_name: '',
      activity_type_id: '',
    };

    //  console.log("friendsIMetIDyyyy",payload)
    const Response = await UploadActivityImageApi(payload);
    // console.log("Response Image", Response)
    if (Response.success == false) {
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
      // console.log(Response);
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
      navigation.navigate('HomeStackNavigator', { screen: 'Home' });
    }
  };

  const handleDelete = async () => {
    setModalVisible(false);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      activity_id: parseInt(item.activity_id),
    };

    // console.log(payload, "payload")
    const Response = await DeleteActivityAPI(payload);
    // console.log(Response, "Response")
    if (Response.success == false) {
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
      setModalSuccess(true);
      setTimeout(() => {
        // navigation.goBack()
        navigation.navigate('AddActivity');
      }, 2000);
    }
  };

  // delete-img
  const handleImgDelete = () => {
    setimgDelete(false);
    const removedImg = SliderImage.filter(item => item != SelectedImg);
    setSliderImage(removedImg);
  };
  const wayPoints = {
    mapPoints: MapPoints ? MapPoints : '',
    pageName: 'completedactivity',
  };

  const renderFriendsImet = item => {
    return (
      <View style={styles.metmain}>
        <Image
          source={{ uri: item.item.petImg }}
          style={styles.metmainpic}></Image>
      </View>
    );
  };

  const handleCommentList = () => {
    navigation.navigate('CommentList', { ActivityId: completed.activity_id });
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <View style={styles.mainpage}>
        <View style={styles.space20}></View>
        {/* <View style={styles.space20}></View> */}
        {/* <TopHeader /> */}
        <ProfileScreen />
        <Text style={styles.familytext}>Family Member</Text>
        <View style={styles.space20}></View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* activity name/img */}
          {completed.activityName != '' ? (
            <View style={styles.homecardinner1}>
              <View style={styles.logmain}>
                <View>
                  <Text style={styles.homecardtext1}>
                    {completed.activityName}
                  </Text>
                  {/* <Text style={styles.activityComment}>{completed.activityComment}</Text> */}
                  <Text style={styles.logdate}>{completed.activityDate}</Text>
                </View>

                <Image
                  // source={require('../assets/profile.png')}
                  style={[styles.activityImg]}
                  source={{ uri: completed.activityImg }}></Image>
              </View>
            </View>
          ) : (
            ''
          )}
          <View style={[styles.homecardinner1, { flexDirection: 'row' }]}>
            <View>
              <Text style={[styles.logdate, { marginBottom: 5 }]}>
                Activity Descrption
              </Text>
              <Text style={styles.activityComment}>
                {completed?.activityComment ?? '-'}
              </Text>
            </View>
            {/* <Image
              // source={require('../assets/profile.png')}
              style={[styles.activityImg]}
              source={{uri: completed.activityImg}}></Image> */}
          </View>
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
                          fill="#223656"
                        />
                        <Path
                          className="cls-1"
                          d="M25.14 14.78c-.28 0-.5.22-.5.5v9.57c0 .2.12.38.3.46l6.09 2.61c.06.03.13.04.2.04a.5.5 0 00.46-.3c.11-.25 0-.55-.26-.66l-5.79-2.48v-9.24c0-.28-.22-.5-.5-.5z"
                          fill="#223656"
                        />
                      </Svg>
                      <Text style={[styles.act5]}>
                        {completed.activityTime}
                      </Text>
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
                          d="M24.66 12.77v-2.45h3.48c.36 0 .66-.29.66-.66S28.51 9 28.14 9h-8.27c-.36 0-.66.29-.66.66s.29.66.66.66h3.48v2.45c-6.95.34-12.48 6.07-12.48 13.1S16.75 39 24 39s13.13-5.88 13.13-13.13-5.53-12.76-12.48-13.1zM24 37.69c-6.52 0-11.82-5.3-11.82-11.82S17.48 14.05 24 14.05v11.82h11.82c0 6.52-5.3 11.82-11.82 11.82z"
                          fill="#223656"
                        />
                      </Svg>
                      <Text style={[styles.act5]}>{completed.duration}</Text>
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
                          fill="#223656"
                        />
                        <Path
                          className="cls-1"
                          d="M31.21 16.73c1.38 0 2.5-1.15 2.5-2.55s-1.12-2.53-2.5-2.53-2.5 1.15-2.5 2.55 1.12 2.53 2.5 2.53zM12.99 32.72c-1.71 0-3.09 1.42-3.09 3.15S11.28 39 12.99 39s3.09-1.42 3.09-3.15-1.38-3.13-3.09-3.13zM33.55 25.51H14.46c-2.19 0-3.98-1.8-3.98-4.02s1.78-4.02 3.98-4.02h9.34c.41 0 .74-.34.74-.75s-.33-.75-.74-.75h-9.34c-3.01 0-5.46 2.47-5.46 5.52s2.45 5.52 5.46 5.52h19.09c2.19 0 3.97 1.8 3.97 4.02s-1.78 4.02-3.98 4.02H18.32c-.41 0-.74.34-.74.75s.33.75.74.75h15.22c3.01 0 5.46-2.47 5.46-5.52s-2.45-5.52-5.45-5.52z"
                          fill="#223656"
                        />
                      </Svg>
                      <Text style={[styles.act5]}>
                        {completed?.activityDistance}
                      </Text>
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
                          fill="#223656"
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
          {
            MapPoints.length == 0 ? (
              <View style={[styles.comight, styles.homecardinner1]}>
                <Text style={styles.maptext}>
                  Map is shown when you track activity with a fleaTag or phone
                </Text>
              </View>
            ) : (
              <View style={{ padding: 20, height: 350 }}>
                <MapPathView waypoints={MapPoints} />
              </View>
            )
            // <View style={{ padding: 20, height: 350 }}>
            //   <MapDirection waypoints={MapPoints} />
            // </View>
          }
          <View style={styles.likeComment}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              id="icons-RZ_Weiss"
              viewBox="0 0 50 50"
              width={30}
              height={30}>
              <Path
                d="M30.73 12.74l-3.83 2.1c-1.18.65-2.62.65-3.81 0l-3.83-2.1a3.96 3.96 0 00-4.08.17l-4.05 2.67a6.955 6.955 0 00-3.14 5.81c0 2.04.9 3.98 2.47 5.31l11.98 10.12a3.975 3.975 0 005.11 0L39.53 26.7A6.943 6.943 0 0042 21.39c0-2.34-1.18-4.52-3.14-5.81l-4.05-2.67c-1.22-.81-2.8-.87-4.08-.17z"
                fill="#223656"
              />
            </Svg>
            {/* likes profile list */}
            {completed?.likes_details?.length > 0 ? (
              <SafeAreaView>
                <FlatList
                  keyExtractor={item => item.likes_details}
                  data={completed?.likes_details}
                  renderItem={item =>
                    completed?.likes_details.length <= 3 ? (
                      <LikeRenderItem
                        item={item}
                        ActivityId={completed.activity_id}
                      />
                    ) : null
                  }
                  contentContainerStyle={{
                    flexDirection: 'row',
                    width: '100%',
                  }}
                  nestedScrollEnabled={true}
                />
              </SafeAreaView>

            ) : (
              <Text style={{ fontSize: 16, fontWeight: '600' }}>0</Text>
            )}
          </View>

          <TouchableOpacity onPress={() => handleCommentList()}>
            <View style={styles.likeComment}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={30}
                height={30}>
                <Path
                  d="M18.09 19.84a2.21 2.21 0 10.001 4.421 2.21 2.21 0 00-.001-4.421zM23.99 19.84a2.21 2.21 0 10.001 4.421 2.21 2.21 0 00-.001-4.421zM29.89 19.84a2.21 2.21 0 10.001 4.421 2.21 2.21 0 00-.001-4.421z"
                  fill="#223656"
                  strokeWidth={0}
                />
                <Path
                  d="M36.7 12.06H11.3a2.3 2.3 0 00-2.3 2.3v15.97a2.3 2.3 0 002.3 2.3h1.98v4.44c0 .35.21.66.53.79a.88.88 0 00.94-.19l5.05-5.05h16.9a2.3 2.3 0 002.3-2.3V14.35a2.3 2.3 0 00-2.3-2.3zm.58 4.17v14.1c0 .32-.26.58-.58.58H19.45a.88.88 0 00-.61.25L15.01 35v-3.23c0-.47-.39-.86-.86-.86h-2.84a.58.58 0 01-.58-.58V14.36c0-.32.26-.58.58-.58H36.7c.32 0 .58.26.58.58v1.87z"
                  fill="#223656"
                  strokeWidth={0}
                />
              </Svg>

              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {completed?.commentCount}
              </Text>
            </View>
          </TouchableOpacity>

          {/* upload img */}
          <View style={[styles.dflex, styles.imgSliderAct]}>
            <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', width: 200 }}>
                {SliderImage.length == 0 ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => setIsVisible(true)}
                      style={styles.placeimgMt}>
                      <Text style={styles.addimgplcaeholder}>
                        Add {'\n'} Image{' '}
                      </Text>
                      <View
                        style={{
                          position: 'absolute',
                          right: -20,
                          zIndex: 1,
                          top: 30,
                        }}>
                        <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={40}
                          height={40}
                          viewBox="0 0 30 30"
                          fill="none">
                          <G clipPath="url(#clip0_1_197)">
                            <Path
                              d="M15 29.4c7.953 0 14.4-6.447 14.4-14.4S22.953.6 15 .6.6 7.047.6 15 7.047 29.4 15 29.4z"
                              fill="#CE5757"
                            />
                            <Path
                              d="M23.1 14.1h-7.194V6.9a.899.899 0 10-1.8 0v7.194H6.9a.899.899 0 100 1.8h7.194v7.194a.899.899 0 101.8 0v-7.194h7.194a.899.899 0 100-1.8l.012.006z"
                              fill="#fff"
                            />
                          </G>
                          <Defs>
                            <ClipPath id="clip0_1_197">
                              <Path fill="#fff" d="M0 0H30V30H0z" />
                            </ClipPath>
                          </Defs>
                        </Svg>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    {SliderImage.map((item, key) => {
                      return (
                        <View style={styles.place}>
                          <TouchableOpacity
                            onPress={() => {
                              setimgDelete(true);
                              setSelectedImg(item);
                            }}>
                            <Image
                              source={{ uri: item.data }}
                              style={styles.placeimg}></Image>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </ScrollView>

            {SliderImage.length != 0 && (
              <View
                style={[
                  styles.addplace,
                  { backgroundColor: '#f7f7f7', border: 10 },
                ]}>
                <TouchableOpacity onPress={() => setIsVisible(true)}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={40}
                    height={40}
                    viewBox="0 0 30 30"
                    fill="none">
                    <G clipPath="url(#clip0_1_197)">
                      <Path
                        d="M15 29.4c7.953 0 14.4-6.447 14.4-14.4S22.953.6 15 .6.6 7.047.6 15 7.047 29.4 15 29.4z"
                        fill="#CE5757"
                      />
                      <Path
                        d="M23.1 14.1h-7.194V6.9a.899.899 0 10-1.8 0v7.194H6.9a.899.899 0 100 1.8h7.194v7.194a.899.899 0 101.8 0v-7.194h7.194a.899.899 0 100-1.8l.012.006z"
                        fill="#fff"
                      />
                    </G>
                    <Defs>
                      <ClipPath id="clip0_1_197">
                        <Path fill="#fff" d="M0 0H30V30H0z" />
                      </ClipPath>
                    </Defs>
                  </Svg>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* friends i met */}
          <View
            style={[
              styles.dflex,
              styles.metsec,
              {
                borderWidth: 2,
                borderColor: '#495F75',
                borderStyle: 'solid',
                borderRadius: 10,
              },
            ]}>
            <View style={[styles.dflex2]}>
              <TouchableOpacity onPress={() => handleOpenMore()}>
                {selectedComingProfile.length == 0 ? (
                  <Text style={[styles.mettext]}>Friends I Met</Text>
                ) : null}
              </TouchableOpacity>
              {/* more than 3 */}

              {selectedComingProfile?.length == 0 ? (
                <View>
                  <Text style={{ color: 'red' }}></Text>
                </View>
              ) : (
                <ScrollView>
                  <View>
                    {selectedComingProfile?.length > 0 ? (
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <View style={[styles.dflexMet, styles.metProfile]}>
                          <SafeAreaView>
 {/* <FlatList
                            keyExtractor={(item) => item.friendId}
                            data={friendsIMet}
                            renderItem={renderFriendsImet}
                            contentContainerStyle={[styles.dflexMet, styles.metProfile]}
                            nestedScrollEnabled={true}
                          /> */}
                          </SafeAreaView>
                         
                          <View style={styles.metmain}>
                            <Image
                              source={{
                                uri:
                                  selectedComingProfile[0]?.pet_image_path ??
                                  selectedComingProfile[0]?.petImg,
                              }}
                              style={styles.metmainpic}></Image>
                          </View>
                          <View style={styles.metmain}>
                            <Image
                              source={{
                                uri:
                                  selectedComingProfile[1]?.pet_image_path ??
                                  selectedComingProfile[1]?.petImg,
                              }}
                              style={styles.metmainpic}></Image>
                          </View>
                          <View style={styles.metmain}>
                            <Image
                              source={{
                                uri:
                                  selectedComingProfile[2]?.pet_image_path ??
                                  selectedComingProfile[2]?.petImg,
                              }}
                              style={styles.metmainpic}></Image>
                          </View>
                          {selectedComingProfile.length >= 3 ? (
                            <TouchableOpacity onPress={() => handleOpenMore()}>
                              <Text style={styles.moreText}>...</Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </ScrollView>
                    ) : (
                      <ScrollView>
                        <TouchableOpacity
                          style={[styles.dflexMet, styles.metProfile]}
                          onPress={() => handleOpenMore()}>
                          {selectedComingProfile?.map((i, k) => {
                            return (
                              <View style={styles.metmain}>
                                <ScrollView>
                                  <Image
                                    source={{ uri: i.petImg }}
                                    style={styles.metmainpic}></Image>
                                </ScrollView>
                              </View>
                            );
                          })}
                        </TouchableOpacity>
                      </ScrollView>
                    )}
                  </View>
                </ScrollView>
              )}
            </View>
            <TouchableOpacity onPress={() => handleOpen()}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={40}
                height={40}
                viewBox="0 0 30 30"
                fill="none">
                <G clipPath="url(#clip0_1_197)">
                  <Path
                    d="M15 29.4c7.953 0 14.4-6.447 14.4-14.4S22.953.6 15 .6.6 7.047.6 15 7.047 29.4 15 29.4z"
                    fill="#CE5757"
                  />
                  <Path
                    d="M23.1 14.1h-7.194V6.9a.899.899 0 10-1.8 0v7.194H6.9a.899.899 0 100 1.8h7.194v7.194a.899.899 0 101.8 0v-7.194h7.194a.899.899 0 100-1.8l.012.006z"
                    fill="#fff"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_1_197">
                    <Path fill="#fff" d="M0 0H30V30H0z" />
                  </ClipPath>
                </Defs>
              </Svg>
            </TouchableOpacity>
          </View>

          {/* edit-delete */}
          <View style={styles.dflex}>
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditActivity', {
                    activityId: item.activity_id,
                    ActivityInfo: route,
                  })
                }>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  height={50}
                  width={50}>
                  <Circle cx={24} cy={24} r={24} fill="none" strokeWidth={0} />
                  <Path
                    d="M38.75 17.37l-3.95-3.94a.907.907 0 00-.44-.24c-.05 0-.1-.01-.14-.01a.754.754 0 00-.61.25L18.24 28.8a.88.88 0 00-.24.48l-.55 3.88H9.84c-.47 0-.84.38-.84.84s.38.84.84.84h8.45l4.6-.66c.18-.02.34-.1.48-.23l15.37-15.37c.16-.16.25-.38.25-.6s-.09-.44-.25-.6zm-3.55 2.36L23.01 31.92l-2.75-2.76 12.18-12.19 2.76 2.76zm1.76-1.77l-.56.57-2.76-2.76.57-.57 2.75 2.76z"
                    fill="#223656"
                    strokeWidth={0}
                  />
                </Svg>
              </TouchableOpacity>
            </View>
            <View>
              <MaterialCommunityIcons
                name="delete"
                size={28}
                color="#6D7177"
                //  onPress={()=>handleDelete()}
                onPress={() => setModalVisible(true)}></MaterialCommunityIcons>
            </View>
          </View>

          {/* logbook button */}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              margin: 20,
            }}>
            <View style={styles.savebtn1}>
              <TouchableOpacity
                style={styles.bluebtnsmallact}
                onPress={() => handleSaveImg()}>
                <Text style={styles.bluebtnsmalltextSave}>SAVE</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.savebtn1}>
              <TouchableOpacity
                style={styles.bluebtnsmallact}
                onPress={() => navigation.navigate('LogBook')}>
                <Text style={styles.bluebtnsmalltextSave}>LOGBOOK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* upload popup */}
        <BottomSheet modalProps={{}} isVisible={isVisible}>
          <ScrollView
            style={[styles.bottomsheetmainsmall]}
            showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Ionicons
                name="close-outline"
                size={30}
                color="#B85A57"></Ionicons>
            </TouchableOpacity>
            <View style={styles.space20}></View>
            <View>
              <Text style={styles.createacc}>Upload Photo</Text>
            </View>
            <View style={styles.space20}></View>
            <View style={styles.uploadphotomain}>
              <View style={styles.uploadphotoinner}>
                <TouchableOpacity
                  onPress={() => chooseCamera()}
                  style={{ alignItems: 'center' }}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Circle-Turquoise-Blue"
                    viewBox="0 0 48 48"
                    width={50}
                    height={50}>
                    <Defs></Defs>
                    <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                    <Path
                      className="cls-2"
                      d="M36.48 15.29h-5.67c-.43-1.65-1.13-3.56-3.26-3.56h-7.1c-2.15 0-2.84 1.91-3.26 3.56h-5.67c-1.39 0-2.52 1.13-2.52 2.52v15.95c0 1.39 1.13 2.52 2.52 2.52h24.95c1.39 0 2.52-1.13 2.52-2.52V17.84c0-1.4-1.13-2.54-2.52-2.54zm1.02 18.46c0 .56-.46 1.02-1.02 1.02H11.52c-.56 0-1.02-.46-1.02-1.02V17.8c0-.56.46-1.02 1.02-1.02h6.25c.35 0 .65-.24.73-.57.51-2.11.9-2.99 1.95-2.99h7.1c1.04 0 1.43.88 1.95 2.99.08.33.38.57.73.57h6.25c.56 0 1.02.48 1.02 1.04v15.92z"
                    />
                    <Path
                      className="cls-2"
                      d="M24 19.28c-3.6 0-6.54 2.92-6.54 6.51S20.39 32.3 24 32.3s6.54-2.92 6.54-6.51-2.93-6.51-6.54-6.51zm0 11.52c-2.78 0-5.04-2.25-5.04-5.01s2.26-5.01 5.04-5.01 5.04 2.25 5.04 5.01S26.78 30.8 24 30.8z"
                    />
                  </Svg>
                  <Text style={styles.uploadtext}>Camera</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.uploadphotoinner}>
                <TouchableOpacity
                  onPress={() => chooseGallery()}
                  style={{ alignItems: 'center' }}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Circle-Turquoise-Blue"
                    viewBox="0 0 48 48"
                    width={50}
                    height={50}>
                    <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                    <Path
                      className="cls-2"
                      d="M17.3 19.39l5.97-5.93v15.81c0 .4.33.72.73.72s.73-.33.73-.72V13.46l5.97 5.93c.28.27.76.27 1.03 0 .14-.14.21-.32.21-.51s-.08-.38-.21-.51l-7.21-7.16c-.28-.27-.76-.27-1.03 0l-7.21 7.16c-.14.14-.21.32-.21.51s.08.38.21.51c.29.28.75.28 1.03 0z"
                    />
                    <Path
                      className="cls-2"
                      d="M35.25 29c-.41 0-.75.34-.75.75v3.75h-21v-3.75c0-.41-.34-.75-.75-.75s-.75.34-.75.75v4.5c0 .41.34.75.75.75h22.5c.41 0 .75-.34.75-.75v-4.5c0-.41-.34-.75-.75-.75z"
                    />
                  </Svg>
                  <Text style={styles.uploadtext}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.space20}></View>
            <View style={styles.space20}></View>
            <View style={styles.space20}></View>
            <View style={styles.space20}></View>
            <View style={styles.space20}></View>
          </ScrollView>
        </BottomSheet>

        {/* popup */}
        {openAddFriend && (
          <CompletedActivityPlus
            openAddFriend={openAddFriend}
            setOpenAddFriend={setOpenAddFriend}
            handleOpen={handleOpen}
            handleClose={handleClose}
            OtherPetdata={OtherPetdata}
            item={item}
            dateClicked={dateClicked}
            GetCompletedActivityList={GetCompletedActivityList}
            GetSiblingList={GetSiblingList}
            GetPetFriendListData={GetPetFriendListData}
            friendsIMetID={friendsIMetID}
            setSelectedComing={setSelectedComing}
            selectedComing={selectedComing}
            setSelectedComingProfile={setSelectedComingProfile}
            selectedComingProfile={selectedComingProfile}
          />
        )}

        {/* popup-view friend - inside - child CompletedActivityFriends*/}
        {openViewFriend && (
          <FriendsiMet
            openViewFriend={openViewFriend}
            setOpenViewFriend={setOpenViewFriend}
            handleOpenMore={handleOpenMore}
            handleCloseMore={handleCloseMore}
            activityInfo={item}
            MyfriendList={selectedComingProfile}
            setMyFriendList={setSelectedComingProfile}
            GlobalMyfriendList={GlobalMyfriendList}
            setGlobalMyFriendList={setGlobalMyFriendList}
            GetPetFriendListData={GetPetFriendListData}
            GetCompletedActivityList={GetCompletedActivityList}
            setSelectedComing={setSelectedComing}
            selectedComing={selectedComing}
            setSelectedComingProfile={setSelectedComingProfile}
            selectedComingProfile={selectedComingProfile}
          />
        )}

        {modalVisible === true ? (
          <>
            <RemoveProfileMessage
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
              handleRemove={handleDelete}
              text="Are you sure you want to delete this activity?"
              shortText=""
            />
          </>
        ) : null}

        {modalSuccess && (
          <>
            <ProfileRemovedConfirmation
              visible={modalSuccess}
              onRequestClose={() => {
                setModalSuccess(false);
              }}
              modalSuccess={modalSuccess}
              setModalSuccess={setModalSuccess}
              text="ACTIVITY DELETED!"
              shortText=""
            />
          </>
        )}

        {congratsMsg == true ? (
          <MotivationalMessage
            MessagePop={MessagePop}
            congratsMsg={congratsMsg}
            setCongratsMsg={setCongratsMsg}
          />
        ) : (
          ''
        )}

        <BottomSheet modalProps={{}} isVisible={imgDelete}>
          <ScrollView
            style={[styles.bottomsheetImages]}
            showsVerticalScrollIndicator={false}>
            <View style={styles.space10}></View>
            <View>
              <TouchableOpacity
                style={styles.bluebtnsmallImg}
                onPress={() => handleImgDelete()}>
                <Text style={styles.bluebtnsmalltextImg}>Delete</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                style={styles.bluebtnsmallImg}
                onPress={() => setimgDelete(false)}>
                <Text style={styles.bluebtnsmalltextImg}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </BottomSheet>
      </View>
    </>
  );
};

export default CompletedActivity;
