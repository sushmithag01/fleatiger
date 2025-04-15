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
} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import ProfileRemovedConfirmation from './Popups/ProfileRemovedConfirmation';
import RemoveProfileMessage from './Popups/RemoveProfileMessage';

const AllFriendsList = props => {
  const {item, GetPetFriendListData} = props;
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
    console.log(Response.message,"res");
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
      GetPetFriendListData();
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

  // remove-friend-list

  const handleRemove = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      friend_pet_id: parseInt(item.pet_id),
      friend_list_id: parseInt(item.friend_list_id),
    };
    const Response = await RemovefriendFromListApi(payload);
    console.log(Response.message, 'res');
    if (Response.success == true) {
      setModalVisible(false);
      setTimeout(() => {
        setModalSuccess(true);
      }, 700);
      setTimeout(() => {
        GetPetFriendListData();
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
  var text = item.location;
  var parts = text.split(','); // Split the string into an array of strings by character /
  var lastIndexOf = parts.length - 1; // Determine the last word's 0-based index in array (length -1)
  var location = parts[lastIndexOf]; // Grab the last part of the array.
  return (
    <View
    //  onPress={()=>handleViewProfile()}
    >
      <View style={styles.logmain}>
        <View style={styles.logmain2}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FriendProfile', {
                friendId: item.pet_id,
                pageName: 'allFriends',
              });
            }}>
            <Image
              source={
                item.pet_image_path == 'https://devapi.fleatiger.com/'
                  ? require('../assets/pic9.png')
                  : {uri: item.pet_image_path}
              }
              style={styles.newsimg1}></Image>
          </TouchableOpacity>

          <View style={{width: 125}}>
            <Text style={styles.homecardtext1}>{item.pet_name}</Text>
            <Text style={styles.logdate}>{location}</Text>
          </View>
        </View>
        <View style={styles.likesec1}>
          {/* /like/dislike-friend */}

          {item.like_dislike_status == 1 ? (
            <TouchableOpacity onPress={() => handleHearts()}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                id="icons-RZ_Weiss"
                viewBox="0 0 50 50"
                width={50}
                height={50}>
                <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                <Path
                  d="M30.73 12.74l-3.83 2.1c-1.18.65-2.62.65-3.81 0l-3.83-2.1a3.96 3.96 0 00-4.08.17l-4.05 2.67a6.955 6.955 0 00-3.14 5.81c0 2.04.9 3.98 2.47 5.31l11.98 10.12a3.975 3.975 0 005.11 0L39.53 26.7A6.943 6.943 0 0042 21.39c0-2.34-1.18-4.52-3.14-5.81l-4.05-2.67c-1.22-.81-2.8-.87-4.08-.17z"
                  fill="#223656"
                />
              </Svg>
            </TouchableOpacity>
          ) : (
            // dislike
            <TouchableOpacity onPress={() => handleHearts()}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={50}
                height={50}>
                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                <Path
                  d="M36 15.47l-3.37-2.21a4.16 4.16 0 00-4.29-.17l-3.18 1.74c-.73.4-1.6.4-2.33 0l-3.18-1.74c-1.35-.74-3-.67-4.29.17l-3.37 2.21a6.6 6.6 0 00-3 5.54c0 1.95.86 3.8 2.36 5.06l9.96 8.39c.78.65 1.73.98 2.68.98s1.9-.33 2.68-.98l9.96-8.39a6.603 6.603 0 002.36-5.06c0-2.23-1.12-4.3-3-5.54zm-.48 9.27l-9.96 8.39c-.91.76-2.22.76-3.13 0l-9.96-8.39a4.867 4.867 0 01-1.74-3.73c0-1.65.83-3.17 2.22-4.09l3.37-2.21c.4-.27.87-.4 1.33-.4.4 0 .8.1 1.17.3L22 16.35c1.25.68 2.74.68 4 0l3.18-1.74c.79-.43 1.75-.39 2.5.1l3.37 2.21a4.88 4.88 0 012.22 4.09c0 1.44-.64 2.8-1.74 3.73z"
                  fill="#223656"
                  strokeWidth={0}
                />
              </Svg>
            </TouchableOpacity>
          )}
          {/* remove friend */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
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
      {modalVisible === true && (
        <>
          <RemoveProfileMessage
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            handleRemove={handleRemove}
            text="Are you sure you want to remove this friend?"
            shortText="They will not be notified"
          />
        </>
      )}

      {modalSuccess && (
        <>
          <ProfileRemovedConfirmation
            visible={modalSuccess}
            onRequestClose={() => {
              setModalSuccess(false);
            }}
            modalSuccess={modalSuccess}
            setModalSuccess={setModalSuccess}
            text="FRIEND REMOVED"
            shortText=""
          />
        </>
      )}
    </View>
  );
};

export default AllFriendsList;
