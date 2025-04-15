import React, {useEffect, useState} from 'react';
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
import {
  DeletefriendIMetApi,
  LikeDislikeApi,
  RemovefriendFromListApi,
  getFriendListApi,
} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {useNavigation} from '@react-navigation/native';
import RemoveProfileMessage from './Popups/RemoveProfileMessage';
import ProfileRemovedConfirmation from './Popups/ProfileRemovedConfirmation';

const CompletedActivityFriends = props => {
  const {
    item,
    activityInfo,
    setOpenViewFriend,
    GetCompletedActivityList,
    MyfriendList,
    GetPetFriendListData,
    setMyFriendList,
    setSelectedComing,
    selectedComing,
  } = props;

  const navigation = useNavigation();
  // popup
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  // hearts-like/dislike
  const handleHearts = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      friend_pet_id: parseInt(item.pet_id),
      friend_list_id: parseInt(item.friend_list_id),
    };
    const Response = await LikeDislikeApi(payload);
    if (Response.success == true) {
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

  const handleComingRemove = petData => {
    // console.log("petData",petData,selectedComing)
    const filteredId = selectedComing.filter(item => item !== petData.pet_id);
    const filteredProfile = MyfriendList.filter(item => item !== petData);
    // console.log(filteredId, 'filteredId');
    setSelectedComing(filteredId);
    setMyFriendList(filteredProfile);
  };

  // remove-friend-list

  const handleRemove = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      friend_pet_id: parseInt(item.id),
      activity_id: parseInt(activityInfo.activity_id),
    };
    const Response = await DeletefriendIMetApi(payload);
    setModalVisible(false);
    if (Response.success == true) {
      setModalSuccess(true);
      setTimeout(() => {
        GetPetFriendListData();
        GetCompletedActivityList();
      }, 1000);
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
  // Chat
  const handleChat = data => {
    let payload = {
      friend_list_id: data.friend_list_id,
      pet_image_path: data.pet_image_path,
      pet_name: data.pet_name,
      pet_id: data.id,
      location: data.location,
    };
    setOpenViewFriend(false);
    navigation.navigate('MessagesStackNavigator', {
      screen: 'Chat',
      params: {userInfo: payload},
    });
    // navigation.navigate("Chat",{ userInfo: payload });
  };
  //   open-profile
  const handleViewProfile = () => {
    AsyncStorage.setItem('PetId', JSON.stringify(item.pet_id));
    navigation.navigate('ProfileDetail');
  };
  return (
    <View
    //  onPress={()=>handleViewProfile()}
    >
      <View style={styles.logmain}>
        <View style={styles.logmain2}>
          <Image
            source={{uri: item?.pet_image_path ?? item?.petImg}}
            style={styles.newsimg1}></Image>

          <View style={{width: 125}}>
            <Text style={styles.homecardtext1}>{item.pet_name}</Text>
            <Text style={styles.logdate}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.likesec1}>
          {/* remove friend */}
          <TouchableOpacity onPress={() => handleComingRemove(item)}>
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

          {/* chat-friend */}
          <TouchableOpacity onPress={() => handleChat(item)}>
            <Svg
              id="Circle-Turquoise-blue"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              height={50}
              width={50}>
              <Defs></Defs>
              <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
              <Path
                className="cls-1"
                d="M37.13 12.11l.03-.03H11.2c-1.21 0-2.2.99-2.2 2.2v16.1c0 1.21.99 2.2 2.2 2.2h2.12v4.6a.751.751 0 00.74.75c.19 0 .38-.07.52-.22l5.13-5.13H36.8a2.2 2.2 0 002.2-2.2v-16.1c0-1.1-.81-2.01-1.87-2.17zM14.06 31.09H11.2c-.39 0-.71-.32-.71-.71v-16.1c0-.39.32-.71.71-.71h25.6c.39 0 .71.32.71.71v16.1c0 .39-.32.71-.71.71H19.4c-.2 0-.38.08-.52.22l-4.08 4.08v-3.56c0-.41-.33-.74-.74-.74z"
                fill="#223656"
              />
              <Path
                className="cls-1"
                d="M22.18 28.38l1.2-.66c.37-.2.82-.2 1.19 0l1.2.66c.4.22.9.2 1.28-.05l1.27-.84c.61-.41.98-1.09.98-1.82a2.2 2.2 0 00-.77-1.67l-3.76-3.18a1.24 1.24 0 00-1.6 0L19.41 24c-.49.42-.77 1.02-.77 1.67 0 .73.37 1.42.98 1.82l1.27.84c.38.25.88.27 1.28.05z"
                fill="#223656"
              />
              <Ellipse
                className="cls-1"
                cx={19.19}
                cy={21.08}
                rx={1.39}
                ry={1.64}
                fill="#223656"
              />
              <Ellipse
                className="cls-1"
                cx={28.77}
                cy={21.08}
                rx={1.39}
                ry={1.64}
                fill="#223656"
              />
              <Path
                className="cls-1"
                d="M21.95 19.8c.89 0 1.61-.81 1.61-1.82s-.72-1.82-1.61-1.82-1.61.81-1.61 1.82.72 1.82 1.61 1.82zM25.98 19.8c.89 0 1.61-.81 1.61-1.82s-.72-1.82-1.61-1.82-1.61.81-1.61 1.82.72 1.82 1.61 1.82z"
                fill="#223656"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
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
            text="Do you want to remove this friend from the activity"
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
            text="FRIEND REMOVED FROM ACTIVITY"
            shortText=""
          />
        </>
      )}
    </View>
  );
};

export default CompletedActivityFriends;
