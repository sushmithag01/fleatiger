import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../Common.css';
import {BottomSheet} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Search from './SearchBar';
import ErrorText from './ErrorText/ErrorText';
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
import ActivityWhoComingList from './ActivityWhoComingList';

const ActivityWhoComing = props => {
  const {
    openAddFriend,
    setOpenAddFriend,
    handleOpen,
    handleClose,
    OtherPetdata,
    setSelectedComing,
    selectedComing,
    selectedComingProfile,
    setSelectedComingProfile,
    setSearch,
    search,
  } = props;

  const navigation = useNavigation();

  const [MyfriendList, setMyFriendList] = useState(OtherPetdata);
  const [GlobalMyfriendList, setGlobalMyFriendList] = useState(OtherPetdata);
  // err
  const [NoData, setNoData] = useState('');

  const [isAdded, setIsAdded] = useState(false);

  const handleFindFriend = () => {
    handleClose();
    navigation.navigate('FriendRequest');
  };


  useEffect(()=>{
    setMyFriendList(OtherPetdata)
  },[OtherPetdata]);

  const handleComing = petData => {
    console.log([...selectedComingProfile, petData], 'll');
    setSelectedComing([...selectedComing, petData.pet_id]);
    setSelectedComingProfile([...selectedComingProfile, petData]);
    setIsAdded(!isAdded);
  };

  const handleComingRemove = petData => {
    console.log(petData, 'rr');
    const filteredId = selectedComing.filter(item => item !== petData.pet_id);
    const filteredProfile = selectedComingProfile.filter(
      item => item !== petData,
    );
    console.log(filteredId, 'filteredId');
    setSelectedComing(filteredId);
    setSelectedComingProfile(filteredProfile);
  };

  return (
    <View>
      {/* upload popup */}
      <BottomSheet modalProps={{}} isVisible={openAddFriend}>
        <View style={[styles.bottomsheetmainAddfriend]}>
          {/* <TouchableOpacity onPress={() => handleClose()}>
            <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
          </TouchableOpacity>
          <View>
            <Text style={styles.timerHead}>Add Friends to an Activity</Text>
          </View> */}

          <Search search={search} setSearch={setSearch} placeholdertext="Find your BFF here"/>

          <View style={styles.space30}></View>
          {/* loop */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {MyfriendList?.length != 0 ? (
              <>
                {MyfriendList?.map((item, key) => {
                  return (
                    <View key={key}>
                      <ActivityWhoComingList
                        item={item}
                        handleComing={handleComing}
                        handleComingRemove={handleComingRemove}
                        isAdded={isAdded}
                        selectedComing={selectedComing}
                        selectedComingProfile={selectedComingProfile}
                        setSelectedComingProfile={setSelectedComingProfile}
                      />
                    </View>
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

          <View style={styles.space20}></View>

          <View style={styles.uploadphotomainPop}>
            <Text style={styles.addtextPopupHead}>Could not find?</Text>
            <TouchableOpacity
              style={[styles.addFriendBtnPopup]}
              onPress={() => handleFindFriend()}>
              <Text style={styles.addtextPopup}>
                Send a friend request to your {'\n'}new paw-pal
              </Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.space10}></View> */}
          <View style={styles.feedsecWho}>
            <TouchableOpacity
              style={styles.feedsec1}
              onPress={() => handleClose()}>
              <Text style={styles.exittext}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default ActivityWhoComing;
