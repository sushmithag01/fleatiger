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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopHeader from './TopHeader';
import Search from './SearchBar';
import {
  getFriendListApi,
  GetAddPetFriendListApi,
  SendFriendRequestApi,
} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import AllFriendsList from './AllFriendsList';
import ErrorText from './ErrorText/ErrorText';
import Loader from './CommonScreens/Loader';
import AddFriend from './AddFriend';
import ProfileRemovedConfirmation from './Popups/ProfileRemovedConfirmation';
import RemoveProfileMessage from './Popups/RemoveProfileMessage';
import BottomTabNavigator from '../navigation/TabNavigator';
import DrawerNavigator from '../navigation/DrawerNavigator';
import {UnFriendListHeaderLeft} from '../navigation/CustomBackNavigation';

const UnFriendList = props => {
  const navigation = useNavigation();

  const [MyfriendList, setMyFriendList] = useState([]);
  const [GlobalMyfriendList, setGlobalMyFriendList] = useState([]);
  // err
  const [NoData, setNoData] = useState('');
  const [loading, setLoading] = useState(false);

  const [friendList, setFriendList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <UnFriendListHeaderLeft navigation={navigation} />,
      });
      GetAddPetFriendListData();
    }
  }, [isFocused,search]);

  const GetAddPetFriendListData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      search:search
    };

    // onsole.log(payload, 'payload');
    const Response = await GetAddPetFriendListApi(payload);
    if (Response.status === 200) {
      setLoading(false);
      setFriendList(Response?.data);
      setGlobalMyFriendList(Response?.data);
    }
  };

  const handleAddFriendRequest = async (e, key) => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      friend_pet_id: parseInt(friendList[key].pet_id),
    };

    const Response = await SendFriendRequestApi(payload);
    // console.log(Response.messsage, 'res');
    if (Response.success == true) {
      setModalSuccess(true);
      setTimeout(() => {
        GetAddPetFriendListData();
      }, 1000);
    } else {
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
    }
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>
        {/* <View style={styles.space30}></View> */}
        <View style={styles.space20}></View>
        {/* navbar / dog profile */}
        {/* <TopHeader /> */}
        {/* search */}
        <View>
          <Text style={styles.unFriendTtl} numberOfLines={2}>
            Meet New Friends
          </Text>
        </View>
        <Search
          search={search}
          setSearch={setSearch}
          placeholdertext="Find your BFF here"
        />
        <View style={styles.space20}></View>

        <View style={[styles.bottomsheetmainAddfriend]}>
          <ScrollView
            style={styles.mainpage}
            showsVerticalScrollIndicator={false}>
            <View style={styles.homecardinner3}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {friendList?.length != 0 ? (
                  <>
                    {friendList?.map((item, key) => {
                      return (
                        <View style={styles.logmain}>
                          <View style={styles.logmain2}>
                            {/* {uri:item.pet_image_path} */}
                            <Image
                              source={
                                item.pet_image_path ==
                                'https://devapi.fleatiger.com/'
                                  ? require('../assets/pic9.png')
                                  : {uri: item.pet_image_path}
                              }
                              style={styles.newsimg1}></Image>
                            <View style={{width: 125}}>
                              <Text style={styles.homecardtext1}>
                                {item.pet_name}
                              </Text>
                              <Text style={styles.logdate}>
                                {item.location}
                                {/* {item.country} */}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.likesec1}>
                            <TouchableOpacity
                              style={[
                                styles.brownbtnAddFriend,
                                styles.newsfeedhead2,
                              ]}
                              onPress={e => handleAddFriendRequest(e, key)}>
                              <Text style={styles.brownbtntextAdd}>Add</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}

                    {modalSuccess && (
                      <>
                        <ProfileRemovedConfirmation
                          visible={modalSuccess}
                          onRequestClose={() => {
                            setModalSuccess(false);
                          }}
                          modalSuccess={modalSuccess}
                          setModalSuccess={setModalSuccess}
                          text="FRIEND REQUEST SENT"
                          shortText=""
                        />
                      </>
                    )}
                  </>
                ) : (
                  <Text style={styles.nodatatext}>{ErrorText.NoData}</Text>
                )}

                {NoData && (
                  <Text style={styles.nodatatext}>{ErrorText.NoData}</Text>
                )}
              </ScrollView>
            </View>
          </ScrollView>
          <View style={styles.space30}></View>
        </View>
      </ScrollView>
    </>
  );
};

export default UnFriendList;
