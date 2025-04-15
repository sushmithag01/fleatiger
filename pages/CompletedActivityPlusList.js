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
  AddFriendActivityApi,
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

const CompletedActivityPlusList = props => {
  const {
    item,
    handleComing,
    isAdded,
    selectedComing,
    handleComingRemove,
    selectedComingProfile,
    setSelectedComingProfile,
    activityId,
    GetCompletedActivityList,
    GetNeedToFriendData,
    GetSiblingList,
    GetPetFriendListData,
    friendsIMetID,
    setFriendsIMetID
  } = props;
  const navigation = useNavigation();
  const [modalSuccess, setModalSuccess] = useState(false);


  const handleAddPet = async pet => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      activity_id: parseInt(activityId),
      friend_pet_id: parseInt(pet.id),
    };
    const Response = await AddFriendActivityApi(payload);
    if (Response.success == false) {
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
    } else {
      setModalSuccess(true);
      setTimeout(() => {
        // to update-popup plus icon list
        // GetNeedToFriendData();
        // to refresh completed
        GetCompletedActivityList();
         GetSiblingList()
        GetPetFriendListData()
      }, 1000);

      // popup
    }
  };
  return (
    <TouchableOpacity
    //  onPress={()=>handleViewProfile()}
    >
      <View style={styles.logmain}>
        <View style={styles.logmain2}>
          <Image
            source={
              item.pet_image_path == 'https://devapi.fleatiger.com/'
                ? require('../assets/pic9.png')
                : {uri: item.pet_image_path}
            }
            style={styles.newsimg1}></Image>

          <View style={{width: 125}}>
            <Text style={styles.homecardtext1}>{item.pet_name}</Text>
            <Text style={styles.logdate}>{item.location}</Text>
          </View>
        </View>

        {/* pop-up */}
        <View style={styles.likesec1}>
          {/* <TouchableOpacity onPress={e => handleAddPet(item)}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              id="icons-RZ_Weiss"
              viewBox="0 0 50 50"
              width={45}
              height={45}>
              <Circle cx={25} cy={25} r={24} fill="#CE5757" />
              <Path
                d="M38.5 23.5H26.51v-12c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v11.99H11.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h11.99v11.99c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V26.49h11.99c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"
                fill="#fff"
              />
            </Svg>
          </TouchableOpacity> */}
          {selectedComing.includes(item.pet_id) ? 
        <TouchableOpacity 
        onPress={e => handleComingRemove(item)}
        >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              id="icons-RZ_Weiss"
              viewBox="0 0 50 50"
              width={45}
              height={45}>
              <Circle cx={25} cy={25} r={24} fill="#CE5757" />
              <Path
                d="M38.5 26.5h-27c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h26.99c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
                fill="#fff"
              />
            </Svg>
            </TouchableOpacity> 
                :
                <TouchableOpacity 
                onPress={e => handleComing(item)}
                >
                     <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="icons-RZ_Weiss"
                      viewBox="0 0 50 50"
                      width={45}
                      height={45}>
                      <Circle cx={25} cy={25} r={24} fill="#CE5757" />
                      <Path
                        d="M38.5 23.5H26.51v-12c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v11.99H11.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h11.99v11.99c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V26.49h11.99c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"
                        fill="#fff"
                      />
                    </Svg>
                     </TouchableOpacity> 
       
            }
        </View>
      </View>
      {/* EE */}
      {modalSuccess && (
        <>
          <ProfileRemovedConfirmation
            visible={modalSuccess}
            onRequestClose={() => {
              setModalSuccess(false);
            }}
            modalSuccess={modalSuccess}
            setModalSuccess={setModalSuccess}
            text="FRIEND ADDED TO ACTIVITY"
            shortText=""
          />
        </>
      )}
    </TouchableOpacity>
  );
};

export default CompletedActivityPlusList;
