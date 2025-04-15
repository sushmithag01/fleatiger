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
import {getFriendListActivityApi, getFriendListApi} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import AllFriendsList from './AllFriendsList';
import ErrorText from './ErrorText/ErrorText';
import {BottomSheet} from '@rneui/themed';
import CompletedActivityFriends from './CompletedActivityFriends';

const FriendsiMet = props => {
  const {
    openViewFriend,
    setOpenViewFriend,
    handleOpenMore,
    handleCloseMore,
    item,
    MyfriendList,
    setMyFriendList,
    GlobalMyfriendList,
    setGlobalMyFriendList,
    GetPetFriendListData,
    activityInfo,
    GetCompletedActivityList,
    setSelectedComing,
    selectedComing,
    setSelectedComingProfile,
    selectedComingProfile,
  } = props;

  const navigation = useNavigation();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      GetPetFriendListData();
    }
  }, [isFocused]);

  // err
  const [NoData, setNoData] = useState('');

  return (
    <>
      <View>
        <BottomSheet modalProps={{}} isVisible={openViewFriend}>
          <ScrollView
            style={[styles.bottomsheetmainAddfriend]}
            showsVerticalScrollIndicator={false}>
            {/* <TouchableOpacity onPress={() => handleCloseMore()}>
            <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
          </TouchableOpacity> */}

            <View>
              <TouchableOpacity onPress={() => handleCloseMore()}>
                <Ionicons
                  name="close-outline"
                  size={30}
                  color="#B85A57"></Ionicons>
              </TouchableOpacity>
              <Text style={styles.myfamilytext}>Friends I Met</Text>
            </View>

            <View style={styles.space10}></View>

            <View style={styles.homecardinner3}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {MyfriendList?.length != 0 ? (
                  <>
                    {MyfriendList?.map(item => {
                      return (
                        <CompletedActivityFriends
                          item={item}
                          GetPetFriendListData={GetPetFriendListData}
                          activityInfo={activityInfo}
                          setOpenViewFriend={setOpenViewFriend}
                          GetCompletedActivityList={GetCompletedActivityList}
                          MyfriendList={MyfriendList}
                          setMyFriendList={setMyFriendList}
                          setSelectedComing={setSelectedComing}
                          selectedComing={selectedComing}
                          setSelectedComingProfile={setSelectedComingProfile}
                          selectedComingProfile={selectedComingProfile}
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
                <View style={styles.space50}></View>
              </ScrollView>
              <View style={styles.space50}></View>
            </View>
          </ScrollView>
        </BottomSheet>
      </View>
    </>
  );
};

export default FriendsiMet;
