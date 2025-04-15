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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import { Tab, TabView } from '@rneui/themed';
import MyProfilePet from './MyProfilePet';
import MyProfileTracker from './MyProfileTracker';
import MyProfileFamily from './MyProfileFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DeleteUserAccApi,
  ViewProfileApi,
  chatHighlightApi,
  userSubscriptionInfoApi,
} from './API/ApiCalls';
import Loader from './CommonScreens/Loader';
import Toast from 'react-native-root-toast';
import ErrorText from './ErrorText/ErrorText';
import {
  CommonHeaderRight,
  ProfileDetailHeaderLeft,
  ProfileDetailHeaderRight,
} from '../navigation/CustomBackNavigation';
import moment from 'moment-timezone';
import UserAccDeleteConfirmation from './Popups/UserAccDeleteConfirmation';

const ProfileDetail = props => {
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);
  const [data, setData] = useState([]);
  const currentTimeZone = moment.tz.guess();
  // pet-tab
  const [personality, setPersonality] = useState('');
  const [color, setColor] = useState('');
  const [yum, setYum] = useState([]);
  const [yuck, setYuck] = useState([]);
  const [love_it, setLove_it] = useState([]);
  const [no_way, setNo_way] = useState([]);
  const [toy_count, setToy_count] = useState('');
  // family-tab
  const [FamilyViewList, setFamilyViewList] = useState([]);

  const [ImeiNumber, setImeiNumber] = useState('');

  const [loading, setLoading] = useState(false);

  const [current_streak, setCurrentStreak] = useState('');
  const [pet_activity_record, setActivity] = useState('');
  const [confirmMsg, setConfirmMsg] = useState(false);

  const [addFamilyMemberCount, setaddFamilyMemberCount] = useState('');
  const [chatNotify, setChatnotify] = useState(0);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <ProfileDetailHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      ViewProfile();
      handleSubscriptionInfo();
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

  const ViewProfile = async () => {
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      id: PetId,
    };
    // console.log(payload, "payload12")
    const Response = await ViewProfileApi(payload);
    // console.log("Response", Response.data[0])
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
        setActivity(Response?.data[0].pet_activity_record);
        setCurrentStreak(Response?.data[0].current_streak);
        setData(Response?.data[0]);
        setPersonality(Response?.data[0]?.personality);
        setColor(Response?.data[0]?.color);
        setYum(Response?.data[0]?.yum);
        setYuck(Response?.data[0]?.yuck);
        setLove_it(Response?.data[0]?.love);
        setNo_way(Response?.data[0]?.no_way);
        setToy_count(Response?.data[0]?.toy_count);
        setFamilyViewList(Response?.data[0]?.family_members);
        setImeiNumber(Response?.data[0]?.imei_trackerid);
        setLoading(false);
      } else {
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
      }
    }
  };
  const handleViewProfile = id => {
    AsyncStorage.setItem('PetId', JSON.stringify(id));
    navigation.navigate('HomeStackNavigator', { screen: 'Home' });
  };

  const handleSubscriptionInfo = async () => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    const getUserSubscriptionPlan = await userSubscriptionInfoApi(payload);
    if (getUserSubscriptionPlan.status === 200) {
      setaddFamilyMemberCount(
        getUserSubscriptionPlan.data.subscription_info
          .func_add_multiple_profile,
      );
      // console.log("getUserSubscriptionPlan", getUserSubscriptionPlan.data.subscription_info.func_add_multiple_profile)
    }
  };
  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <View style={styles.mainpage}>
        <View style={styles.space20}></View>
        {/* <View style={styles.space20}></View> */}
        {/* <TopHeader /> */}
        <View style={[styles.prodemain, styles.marhoz15]}>
          <View>
            <View style={styles.space20}></View>
            <TouchableOpacity onPress={() => handleViewProfile(data.id)}>
              {/* <ProfileWithFamily petImage={data?.pet_image_path} petName={data?.pet_name}/>     */}
              <View style={{ padding: 7 }}>
                <Profile
                  petImage={data?.pet_image_path}
                  petName={data?.pet_name}
                  user_name={data?.user_name == '' ? '' : data?.user_name}
                />
                <Text style={styles.familytext}>Family Member</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <View style={[styles.prodemain]}>
              <View style={[styles.act1, styles.act4]}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="icons-RZ_Weiss"
                  viewBox="0 0 50 50"
                  width={30}
                  height={30}>
                  <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                  <Path
                    d="M34.07 10.31c-.02-.05-.06-.1-.09-.14 0 0 0-.01-.01-.02 0 0-.01 0-.02-.01a.56.56 0 00-.15-.1c-.04-.02-.09-.02-.13-.03-.02 0-.04-.01-.06-.01h-4.92c-.28 0-.5.22-.5.5s.22.5.5.5h3.72l-5.87 5.87a7.078 7.078 0 00-3.48-.91c-3.95 0-7.16 3.2-7.16 7.16s2.94 6.88 6.66 7.13v4.82h-3.44c-.28 0-.5.22-.5.5s.22.5.5.5h3.44v3.44c0 .28.22.5.5.5s.5-.22.5-.5v-3.44H27c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-3.44v-4.82c3.72-.26 6.66-3.35 6.66-7.13 0-2.32-1.11-4.38-2.83-5.69l5.73-5.72v3.72c0 .28.22.5.5.5s.5-.22.5-.5v-4.92c0-.07-.01-.13-.04-.19zm-4.85 12.81c0 3.4-2.76 6.16-6.16 6.16s-6.16-2.76-6.16-6.16 2.76-6.16 6.16-6.16 6.16 2.76 6.16 6.16z"
                    fill="#223656"
                  />
                </Svg>
                <Text style={[styles.act5]}>
                  {data?.gender == '' ? '-' : data?.gender}
                </Text>
              </View>
              <View style={[styles.act1, styles.act4]}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="icons-RZ_Weiss"
                  viewBox="0 0 50 50"
                  width={30}
                  height={30}>
                  <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                  <Path
                    d="M11.87 27.62v11.89c0 .27.22.5.5.5h25.27c.27 0 .5-.22.5-.5V27.62c0-2.33-1.9-4.23-4.23-4.23h-6.85v-6.04c0-.26-.2-.44-.5-.44h-3.17c-.24 0-.44.2-.44.44v6.04H16.1c-2.33 0-4.23 1.9-4.23 4.23zm12.07-9.22c0-.3.25-.55.55-.55h1.01c.3 0 .55.25.55.55v4.99h-2.12V18.4zm-5.4 10.36c.52-.51.98-.95 1.54-.95.52 0 1.02.35 1.6.76.82.58 1.84 1.29 3.32 1.29s2.48-.71 3.3-1.27c.6-.42 1.12-.78 1.67-.78s.98.44 1.5.94c.66.64 1.4 1.36 2.48 1.36s2.11-.36 2.97-1.03l.2-.16v9.42c0 .37-.3.67-.67.67H13.53a.67.67 0 01-.67-.67v-9.42l.2.16c.86.68 1.89 1.03 2.97 1.03s1.86-.72 2.51-1.35zM22.7 13.24c0 1.28 1.05 2.36 2.3 2.36s2.3-1.04 2.3-2.36-.96-2.78-2.09-3.18h-.01a.42.42 0 00-.21-.06c-.15 0-.27.09-.33.15-.14.16-.3.34-.47.51-.73.79-1.49 1.6-1.49 2.57zm2.14-1.86c.07-.08.13-.15.19-.21l.07-.08.09.06c.66.46 1.17 1.38 1.17 2.09 0 .76-.61 1.37-1.37 1.37-.71 0-1.31-.63-1.31-1.37 0-.59.66-1.32 1.15-1.86z"
                    fill="#223656"
                  />
                </Svg>
                <Text style={styles.act5}>
                  {data?.birth_day == '' ? '-' : data?.birth_day}
                </Text>
              </View>
            </View>

            <View style={[styles.act1, styles.act4]}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                id="icons-RZ_Weiss"
                viewBox="0 0 50 50"
                width={30}
                height={30}>
                <Defs></Defs>
                <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                <Path
                  className="cls-1"
                  d="M37.65 11.69a1.75 1.75 0 00-.89-1.45 1.77 1.77 0 00-1.7-.04c-3.32 1.69-5.72 4.07-7.15 5.77l-.02.02h-.03c-.54-.13-1.09-.19-1.64-.19h-2.46c-.55 0-1.11.06-1.64.19h-.03l-.02-.02c-1.86-2.21-3.99-4.01-6.34-5.34-.54-.3-1.09-.62-1.68-.62-.29 0-.56.07-.82.23-.52.3-.85.84-.89 1.45-.19 3.57.61 6.74 1.32 8.77.5 1.44 1.51 2.64 2.83 3.39h.02v3.69c0 2.7.61 5.28 1.76 7.45.74 1.39 2.05 3.27 4.1 4.34.85.44 1.74.67 2.63.67.69 0 1.38-.14 2.04-.41 2.06-.85 3.45-2.6 4.25-3.91 1.41-2.3 2.16-5.12 2.16-8.14v-3.68h.02a6.344 6.344 0 002.83-3.41c.71-2.03 1.51-5.19 1.32-8.77zM19.3 24.11c0-.3.12-.58.33-.79s.49-.33.79-.33.58.12.79.33c.21.21.33.49.33.79v.79c0 .3-.12.58-.33.79s-.49.33-.79.33-.58-.12-.79-.33-.33-.49-.33-.79v-.79zm16.2-4.29l-.11.31a5.339 5.339 0 01-2.65 3.01l-.05.04s-.02.02-.04.03l-.07.08v.02l.07.04h-.1l-.06.15v4.05c0 4.22-1.57 8.02-4.19 10.15-.81.66-2.11 1.44-3.63 1.32-1.68-.14-3.04-1.27-3.89-2.2-1.41-1.55-2.43-3.63-2.93-6.01v-.05h2.21c1.39 0 2.69-.54 3.67-1.52s1.52-2.29 1.52-3.67V16.8h.98c1.22 0 2.41.36 3.43 1.03.11.07.24.1.37.07a.487.487 0 00.38-.58.527.527 0 00-.21-.31c-.39-.26-.81-.48-1.24-.65l-.06-.02.04-.05c1.33-1.52 3.54-3.66 6.55-5.19.24-.13.52-.12.75.02.23.14.38.38.39.64.17 3.28-.53 6.2-1.16 8.07z"
                  fill="#223656"
                />
                <Path
                  className="cls-1"
                  d="M29.58 22.99c-.3 0-.58.12-.79.33-.21.21-.33.49-.33.79v.79a1.12 1.12 0 002.24 0v-.79c0-.3-.12-.58-.33-.79-.21-.21-.49-.33-.79-.33zM25.89 33.41l-.59.32c-.18.1-.41.1-.59 0l-.59-.32c-.2-.11-.44-.1-.63.03l-.63.41c-.3.2-.49.54-.49.9 0 .32.14.62.38.82l1.85 1.57c.23.19.56.19.79 0l1.85-1.57c.24-.2.38-.51.38-.82 0-.36-.18-.7-.49-.9l-.63-.41a.643.643 0 00-.63-.03z"
                  fill="#223656"
                />
              </Svg>
              <Text style={styles.act5}>{data?.breed_name}</Text>
            </View>
            {/* <View style={[styles.prodemain]}> */}
            <View style={[styles.act1, styles.act4]}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                id="icons-RZ_Weiss"
                viewBox="0 0 50 50"
                width={30}
                height={30}>
                <Defs></Defs>
                <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                <Path
                  className="cls-1"
                  d="M25.31 39.88c.11-.11 10.2-10.22 10.2-18.68 0-3.74-1.16-6.75-3.36-8.7l-.02-.02c-1.81-1.61-4.34-2.49-7.14-2.49s-5.34.89-7.15 2.5c-2.2 1.95-3.37 4.96-3.37 8.7 0 8.46 10.04 18.51 10.14 18.61.12.12.28.2.42.18.11 0 .21-.05.27-.11zm-.96-1.86a51.192 51.192 0 01-3.93-4.91c-3.22-4.57-4.92-8.69-4.92-11.91 0-7.5 4.9-10.18 9.49-10.18 6.99 0 9.49 5.26 9.49 10.18 0 6.6-6.77 14.55-8.85 16.83l-.64.71-.64-.71z"
                  fill="#223656"
                />
                <Path
                  className="cls-1"
                  d="M25 14.15c-3.55 0-6.42 2.95-6.42 6.54s2.87 6.5 6.42 6.5 6.42-2.95 6.42-6.54-2.87-6.5-6.42-6.5z"
                  fill="#223656"
                />
              </Svg>
              <View style={{ width: 140 }}>
                <Text style={[styles.act5]}>
                  {data?.location == '' ? '-' : data?.location}
                </Text>
              </View>
            </View>

            {/* </View> */}

            <View style={styles.bluebtnsmallmain2}>
              <TouchableOpacity
                style={styles.bluebtnverysmall}
                onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.bluebtnverysmalltext}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.tabmain3}>
          <Tab
            value={index}
            onChange={e => setIndex(e)}
            indicatorStyle={{
              backgroundColor: '#495F75',
            }}>
            <Tab.Item
              title="Pet"
              titleStyle={active => ({
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 12,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#495F75',
                padding: 0,
                margin: 0,
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
                padding: 0,
                margin: 0,
              })}
            />
            <Tab.Item
              title="Tracker"
              titleStyle={active => ({
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 12,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#495F75',
                padding: 0,
                margin: 0,
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
              })}
            />

            <Tab.Item
              title="Family"
              titleStyle={active => ({
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 12,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#495F75',
                padding: 0,
                margin: 0,
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
              })}
            />
          </Tab>
          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{ backgroundColor: '#fff', flex: 1 }}>
              <MyProfilePet
                personality={personality}
                color={color}
                yum={yum}
                yuck={yuck}
                loveIt={love_it}
                noWay={no_way}
                toyCount={toy_count}
                CurrentStreak={current_streak}
                Record={pet_activity_record}
              />
            </TabView.Item>
            <TabView.Item style={{ backgroundColor: '#fff', width: '100%' }}>
              <MyProfileTracker ImeiNumber={ImeiNumber} />
            </TabView.Item>
            <TabView.Item style={{ backgroundColor: '#fff', width: '100%' }}>
              <MyProfileFamily
                FamilyViewList={FamilyViewList}
                addFamilyMemberCount={addFamilyMemberCount}
              />
            </TabView.Item>
          </TabView>
        </View>
        <TouchableOpacity
          style={styles.deleteaccbtn}
          onPress={() =>navigation.navigate('UserAccDeleteConfirmation')}>
          <Text style={styles.bluebtnverysmalltext}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    
    </>
  );
};
export default ProfileDetail;
