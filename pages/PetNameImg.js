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

const PetNameImg = props => {
  const [Name, setName] = useState('');
  const [ProfileImage, setProfileImage] = useState('');
  const [UserName, setUserName] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getName();
    }
  }, [isFocused]);

  const getName = async () => {
    const petName = await AsyncStorage.getItem('petName');
    const petImg = await AsyncStorage.getItem('profileImg');
    const petUserName = await AsyncStorage.getItem('user_name');

    setName(petName);
    setProfileImage(
      petImg
        ? petImg
        : 'https://devapi.fleatiger.com/pets/pet_profile_default.png',
    );
    setUserName(petUserName);
  };
  // console.log(Name,'Name')
  return (
    <>
      <View style={[styles.logosection]}>
        <Image
          style={[styles.ProfileLogo, styles.addupload]}
          source={{uri: ProfileImage}}></Image>
      </View>
      <View style={styles.editnamemain}>
        <Text style={styles.editnametext}>{Name == null ? 'Lucky' : Name}</Text>
      </View>
      {UserName == '' ? '' : <Text style={styles.petusername}>{UserName}</Text>}
      <Text style={styles.familytext}>Family Member</Text>
    </>
  );
};

export default PetNameImg;
