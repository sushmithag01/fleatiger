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
  FlatList,
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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import {
  GetFamilyListApi,
  RemovePetProfileApi,
  chatHighlightApi,
  userSubscriptionInfoApi,
} from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../pages/Home';
import ErrorText from './ErrorText/ErrorText';
import Toast from 'react-native-root-toast';
import RemoveProfileMessage from './Popups/RemoveProfileMessage';
import ProfileRemovedConfirmation from './Popups/ProfileRemovedConfirmation';
import MotivationalMessage from './Popups/MotivationalMessage';
import {
  CommonHeaderRight,
  SwitchProfilesHeaderLeft,
  SwitchProfilesHeaderRight,
} from '../navigation/CustomBackNavigation';

const SwitchProfiles = props => {
  const navigation = useNavigation();
  const [familyList, setfamilyList] = useState([]);
  const [noDataMsg, setNoDataMsg] = useState('');

  // popup
  const MessagePop = 'Upgrade your plan to use this feature';
  const [ShowPopUp, setShowPopUp] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [petIDSelected, setPetIDSelected] = useState('');

  const [addFamilyMemberCount, setaddFamilyMemberCount] = useState('');

  const isFocused = useIsFocused();
  const [chatNotify, setChatnotify] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <SwitchProfilesHeaderLeft navigation={navigation} />,
      headerRight: () => (
        <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
      ),
    });
    if (isFocused) {
      GetFamilyListData();
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

  // console.log(route.params.state.petId,"lllll")

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
    } else {
      setaddFamilyMemberCount('');
    }
  };

  const GetFamilyListData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      id: PetId,
    };
    const Response = await GetFamilyListApi(payload);
    // console.log(Response.data);
    if (Response.data.length == 0) {
      setNoDataMsg(ErrorText.NoData);
      setfamilyList(Response.data);
    } else {
      setfamilyList(Response.data);
    }
  };
  //handleshowprofile
  const handleShowProfile = data => {
    AsyncStorage.setItem('PetName', data.pet_name);
    AsyncStorage.setItem('PetId', JSON.stringify(data.id));
    navigation.replace('HomeStackNavigator', { screen: 'Home' });
  };

  const handleDelete = id => {
    setPetIDSelected(id);
    setModalVisible(true);
  };

  // remove-friend-list

  const handleRemove = async () => {
    setModalSuccess(false);
    console.log(modalSuccess);
    const UserID = await AsyncStorage.getItem('userId');
    const payload = {
      pet_id: parseInt(petIDSelected),
      user_id: parseInt(UserID),
    };
    // console.log(payload);
    const Response = await RemovePetProfileApi(payload);
    // console.log(Response, 'res');
    setModalVisible(false);
    if (Response.success == true) {
      setTimeout(() => {
        setModalSuccess(true);
        GetFamilyListData();
      }, 700);
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

  // flat-list-display-dog profile
  const FamilyListItem = props => {
    const { item } = props;
    return (
      <View style={styles.logmain}>
        <TouchableOpacity onPress={() => handleShowProfile(item)}>
          <View style={styles.logmain2}>
            <Image
              source={
                item.pet_image_path == 'https://devapi.fleatiger.com/'
                  ? require('../assets/pic9.png')
                  : { uri: item.pet_image_path }
              }
              style={styles.newsimg1}></Image>

            <View style={{ width: 125 }}>
              <Text style={styles.homecardtext1}>{item.pet_name}</Text>
              <Text style={styles.logdate}>{item.location}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.likesec1}>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              id="icons-RZ_Weiss"
              viewBox="0 0 50 50"
              width={50}
              height={50}>
              <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
              <Path
                d="M38.5 26.5h-27c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h26.99c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
                fill="#223656"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  // add-friend by clciking plus icon
  const handleAddFriend = () => {
    if (addFamilyMemberCount > 0) {
      const isClickedPlus = JSON.stringify(1);
      AsyncStorage.setItem('AddFriend', isClickedPlus);
      navigation.navigate('AddNewMember', { screen: 'SliderAdd1' });
    } else if (addFamilyMemberCount === 0) {
      setShowPopUp(true);
    }
  };

  return (
    <>
      <View style={styles.mainpage}>
        {/* <View style={styles.space20}></View> */}
        {/* <View style={styles.space20}></View> */}
        {/* <TopHeader /> */}
        <View>
          <Text style={styles.myfamilytext}>My Family Profiles</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {familyList.length == 0 ? (
            <Text style={styles.nodatatext}>{noDataMsg}</Text>
          ) : (
            <SafeAreaView>
              <View style={styles.profileList}>
                <FlatList
                  data={familyList}
                  renderItem={({ item }) => <FamilyListItem item={item} />}
                  keyExtractor={item => item.id}
                  nestedScrollEnabled={true}
                />
              </View>
            </SafeAreaView>

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
                handleRemove={handleRemove}
                text="Are you sure you want to remove this profile?"
                shortText="All information on this profile will be deleted"
              />
            </>
          ) : null}
        </ScrollView>

        <View style={styles.feedsec}>
          <TouchableOpacity
            style={styles.feedsec1}
            // onPress={()=>navigation.navigate('Onboarding1')}
            onPress={() => handleAddFriend()}>
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
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.feedsec1}
            onPress={() =>
              navigation.navigate('HomeStackNavigator', { screen: 'Home' })
            }>
            <Text style={styles.exittext}>Exit</Text>
          </TouchableOpacity>
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

        <View style={styles.space50}></View>

        {modalSuccess && (
          <>
            <ProfileRemovedConfirmation
              visible={modalSuccess}
              onRequestClose={() => {
                setModalSuccess(false);
              }}
              modalSuccess={modalSuccess}
              setModalSuccess={setModalSuccess}
              text="PROFILE REMOVED"
              shortText=""
            />
          </>
        )}
      </View>
    </>
  );
};
export default SwitchProfiles;
