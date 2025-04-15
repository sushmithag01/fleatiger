import React, { useEffect, useState } from 'react';
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
  Rect,
  Mask,
  Pattern,
  Use,
  xlinkHref,
  style,
} from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopHeader from './TopHeader';
import Search from './SearchBar';
import {
  chatHighlightApi,
  getFriendListApi,
  userSubscriptionInfoApi,
} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import AllFriendsList from './AllFriendsList';
import ErrorText from './ErrorText/ErrorText';
import Loader from './CommonScreens/Loader';
import AddFriend from './AddFriend';
import ProfileRemovedConfirmation from './Popups/ProfileRemovedConfirmation';
import RemoveProfileMessage from './Popups/RemoveProfileMessage';
import {
  AllFriendsHeaderLeft,
  AllFriendsHeaderRight,
  CommonHeaderRight,
} from '../navigation/CustomBackNavigation';
import MotivationalMessage from './Popups/MotivationalMessage';

const AllFriends = props => {
  const navigation = useNavigation();
  const MessagePop = 'Upgrade your plan to use this feature';
  const [ShowPopUp, setShowPopUp] = useState(false);
  const [MyfriendList, setMyFriendList] = useState([]);
  const [GlobalMyfriendList, setGlobalMyFriendList] = useState([]);
  const [search, setSearch] = useState('');
  // err
  const [NoData, setNoData] = useState('');
  const [loading, setLoading] = useState(false);

  // popup
  const [openAddFriend, setOpenAddFriend] = useState(false);

  const [friendsMapPlan, setFriendsMapPlan] = useState('');

  const [chatNotify, setChatnotify] = useState(0);

  const handleClose = () => {
    setOpenAddFriend(false);
  };

  const handleOpen = () => {
    setOpenAddFriend(true);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    notificationHilightHandler();
  }, [isFocused, chatNotify]);

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <AllFriendsHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      GetPetFriendListData();
      handleSubscriptionInfo();
    }
  }, [isFocused, chatNotify, search]);

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

  const handleSubscriptionInfo = async () => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    const getUserSubscriptionPlan = await userSubscriptionInfoApi(payload);
    if (getUserSubscriptionPlan.status === 200) {
      setFriendsMapPlan(
        getUserSubscriptionPlan.data.subscription_info.func_friends_in_vicinity,
      );
    } else {
      setFriendsMapPlan('');
    }
  };

  const GetPetFriendListData = async () => {
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      search: search,
    };
    const Response = await getFriendListApi(payload);
    // console.log("Response",Response)
    if (Response.success == true) {
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
      setLoading(false);
      setMyFriendList(Response?.data);
      setGlobalMyFriendList(Response?.data);
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
  };

  const handleFrndsMap = () => {
    if (friendsMapPlan > 0) {
      navigation.navigate('FriendsMap');
    } else {
      setShowPopUp(true);
    }
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <View style={styles.mainpage} showsVerticalScrollIndicator={false}>
        {/* <View style={styles.space30}></View> */}
        <View style={styles.space20}></View>
        {/* navbar / dog profile */}
        {/* <TopHeader/> */}
        {/* search */}
        <Search search={search} setSearch={setSearch} placeholdertext="Find your BFF here"/>
        <View style={styles.space20}></View>

        <View style={styles.homecardinner3}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {MyfriendList?.length != 0 ? (
              <>
                {MyfriendList?.map(item => {
                  return (
                    <AllFriendsList
                      item={item}
                      GetPetFriendListData={GetPetFriendListData}
                    />
                  );
                })}
              </>
            ) : (
              <Text style={styles.nodatatext}>{ErrorText.NoData}</Text>
            )}

            {NoData && (
              <Text style={styles.nodatatext}>{ErrorText.NoData}</Text>
            )}
          </ScrollView>

          <View style={styles.friendsBottomIcons}>
            <TouchableOpacity
              style={styles.feedsec1}
              onPress={() => navigation.navigate('MessagesStackNavigator',{screen:'GroupsList'})}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={50}
                height={50}
                viewBox="0 0 53 53"
                fill="none"

              >
                <Rect width={53} height={53} rx={26.5} fill="#92BCBF" />
                <G clipPath="url(#clip0_97_96)" fill="#223656">
                  <Path d="M16.333 23a4 4 0 100-8 4 4 0 000 8zM20.72 25.76a9.321 9.321 0 00-4.387 7.907h-2.666A2.674 2.674 0 0111 31v-2.667a4.012 4.012 0 014-4h2.667a4 4 0 013.053 1.427zM37.667 23a4 4 0 100-8 4 4 0 000 8zM43 28.333V31a2.675 2.675 0 01-2.667 2.667h-2.666a9.321 9.321 0 00-4.387-7.907 4.002 4.002 0 013.053-1.427H39a4.012 4.012 0 014 4zM27 25.667A5.333 5.333 0 1027 15a5.333 5.333 0 000 10.667zM35 33.667V35a4.012 4.012 0 01-4 4h-8a4.012 4.012 0 01-4-4v-1.333A6.667 6.667 0 0125.667 27h2.666A6.667 6.667 0 0135 33.667z" />
                </G>
                <Defs>
                  <ClipPath id="clip0_97_96">
                    <Path fill="#fff" transform="translate(11 11)" d="M0 0H32V32H0z" />
                  </ClipPath>
                </Defs>
              </Svg>
              <Text style={styles.feedtext}>Groups</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.feedsec1}
              onPress={() => handleOpen()}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={50}
                height={50}
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
              <Text style={styles.feedtext}>Add Friend</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.feedsec1}
              onPress={() => handleFrndsMap()}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={50}
                height={50}>
                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                <Path
                  d="M24 13.15c-3.55 0-6.42 2.95-6.42 6.54s2.87 6.5 6.42 6.5 6.42-2.95 6.42-6.54-2.87-6.5-6.42-6.5z"
                  fill="#223656"
                  strokeWidth={0}
                />
                <Path
                  d="M31.2 11.52C29.37 9.9 26.82 9 24 9s-5.39.9-7.21 2.53c-2.23 1.98-3.41 5-3.41 8.76 0 8.45 9.91 18.33 10.01 18.43.18.18.4.28.6.28h.07c.2 0 .38-.09.5-.22.1-.1 10.07-10.05 10.07-18.49 0-3.76-1.18-6.79-3.42-8.77zM24.37 36.5l-.37.41-.37-.41a49.388 49.388 0 01-3.81-4.77c-3.1-4.41-4.74-8.37-4.74-11.44 0-7.08 4.61-9.6 8.93-9.6 6.58 0 8.93 4.96 8.93 9.6 0 6.32-6.55 14-8.55 16.21z"
                  fill="#223656"
                  strokeWidth={0}
                />
              </Svg>
              <Text style={styles.feedtext}>Friends Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.feedsec1}
              onPress={() => navigation.navigate('NewRequest')}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                height={50}
                width={50}>
                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                <Path
                  d="M23.11 17.5c0-.85-.69-1.54-1.55-1.54s-1.55.69-1.55 1.54.69 1.54 1.55 1.54 1.55-.69 1.55-1.54z"
                  fill="#223656"
                  strokeWidth={0}
                />
                <Path
                  d="M34.06 23.3l-5.37-1.53 5.18-3.1c.81-.48 1.27-1.4 1.17-2.33l-.22-2.18c-.06-.51-.33-.97-.74-1.27-.41-.3-.93-.42-1.45-.31l-6.91 1.97-2.16-1a8.005 8.005 0 00-3.34-.73c-1.58 0-3.09.45-4.4 1.31l-1.71-3.66a.82.82 0 00-.74-.47c-.32 0-.6.19-.73.48l-1.68 3.77c-.3.67-.41 1.42-.32 2.15l.27 2.17L9 25.46a.803.803 0 00.58.93c.08.02.16.03.24.03.43 0 .68-.32.75-.6l.86-3.09.12.93c.05.4.39.71.8.71h.1c.21-.03.41-.14.54-.3a.85.85 0 00.17-.6l-.91-7.26c-.05-.44.01-.89.19-1.3l.96-2.15 2.83 6.05c.19.39.69.57 1.08.39.4-.19.58-.67.39-1.07l-1.18-2.51c1.82-1.29 4.32-1.53 6.36-.6l2.43 1.12c.18.08.38.1.56.04l5.04-1.44c.53.85 1.46 1.38 2.48 1.4l.04.35c.03.31-.12.62-.39.78l-6.78 4.06a.805.805 0 00.19 1.47l6.29 1.79-.13.31c-.22.54-.74.92-1.33.95l-6.21.46c-.29.02-.55.2-.67.47l-2.31 10.06c-.09.2-.1.42-.02.62s.22.36.41.45c.11.05.22.08.34.08.31 0 .6-.18.74-.47l2.11-9.63 5.73-.42c1.2-.08 2.26-.84 2.71-1.96l.47-1.15a.8.8 0 00-.53-1.08z"
                  fill="#223656"
                  strokeWidth={0}
                />
                <Path
                  d="M38.25 20.18h-2.9c-.41 0-.75.34-.75.75s.34.75.75.75h2.9c.41 0 .75-.34.75-.75s-.34-.75-.75-.75zM34.63 19.24c.09.33.39.55.72.55.07 0 .13 0 .2-.03l2.89-.8c.4-.11.63-.52.52-.92a.749.749 0 00-.92-.52l-2.89.8c-.4.11-.63.52-.52.92zM38.44 22.9l-2.89-.8c-.4-.11-.81.12-.92.52-.11.4.12.81.52.92l2.89.8c.07.02.13.03.2.03.33 0 .63-.22.72-.55.11-.4-.12-.81-.52-.92z"
                  fill="#223656"
                  strokeWidth={0}
                />
              </Svg>
              <Text style={styles.feedtext}>Friend Requests</Text>
            </TouchableOpacity>
          </View>
        </View>
        {ShowPopUp == true ? (
          <MotivationalMessage
            MessagePop={MessagePop}
            congratsMsg={ShowPopUp}
            setCongratsMsg={setShowPopUp}
            status="activity"
          />
        ) : (
          ''
        )}
      </View>

      {/* popup */}
      {openAddFriend && (
        <AddFriend
          openAddFriend={openAddFriend}
          setOpenAddFriend={setOpenAddFriend}
          handleOpen={handleOpen}
          handleClose={handleClose}
          GetPetFriendListData={GetPetFriendListData}
        />
      )}
    </>
  );
};

export default AllFriends;
