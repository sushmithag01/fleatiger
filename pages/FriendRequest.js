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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopHeader from './TopHeader';
import Search from './SearchBar';
import {GetAddPetFriendListApi, SendFriendRequestApi} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import ErrorText from './ErrorText/ErrorText';

const FriendRequest = props => {
  const navigation = useNavigation();
  const [friendList, setFriendList] = useState([]);
  const [GlobalMyfriendList, setGlobalMyFriendList] = useState([]);
  // err
  const [NoData, setNoData] = useState('');
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();

  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const currentDate = year + '-' + month + '-' + date;

  useEffect(() => {
    if (isFocused) {
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

    // console.log(payload, 'payload');
    const Response = await GetAddPetFriendListApi(payload);
    // console.log(Response, 'res');
    setFriendList(Response?.data);
    setGlobalMyFriendList(Response?.data);
  };

  const handleAddFriendRequest = async (e, key) => {
    console.log(friendList[key], 'fri');

    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      friend_pet_id: parseInt(friendList[key].pet_id),
    };

    console.log(payload, 'payload');
    const Response = await SendFriendRequestApi(payload);
    console.log(Response, 'res');
    if (Response.success == true) {
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
      navigation.goBack();
      //   navigation.navigate('CompletedActivity');
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
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <TouchableOpacity
          style={[styles.padhoz15]}
          onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
        </TouchableOpacity>

        <Search
          setSearch={setSearch}
          search={search}
          placeholdertext="Find your BFF here"
        />
        <View style={styles.space20}></View>

        <View style={styles.homecardinner3}>
          <ScrollView>
            {friendList?.map((item, key) => {
              return (
                <View style={styles.logmain}>
                  <View style={styles.logmain2}>
                    {/* {uri:item.pet_image_path} */}
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
                  <View style={styles.likesec1}>
                    <TouchableOpacity
                      style={[styles.brownbtn, styles.newsfeedhead2]}
                      onPress={e => handleAddFriendRequest(e, key)}>
                      <Text style={styles.brownbtntext}> Add </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {NoData && <Text style={styles.nodatatext}>{ErrorText.NoData}</Text>}
        </View>
      </ScrollView>
    </>
  );
};

export default FriendRequest;
