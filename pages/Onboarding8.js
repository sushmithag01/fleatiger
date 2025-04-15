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
import {SvgXml} from 'react-native-svg';
import Logo from '../assets/fleatiger-logo.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import {Avatar, Badge, Icon, withBadge, Input} from '@rneui/themed';
import FontAwesome from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import {PetDetailsApi} from './API/ApiCalls';
import {useNavigation} from '@react-navigation/native';
import {Onboarding8HeaderLeft} from '../navigation/CustomBackNavigation';

const Onboarding8 = ({route}) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Onboarding8HeaderLeft navigation={navigation} />,
    });
  }, []);

  // onClick-finish-button
  const handleFinish = async value => {
    const UserID = await AsyncStorage.getItem('userId');
    // //////-->onboarding2
    const ProfileImg = await AsyncStorage.getItem('profileImg');
    const ProfileImagePath = {
      data: ProfileImg == null ? '' : ProfileImg,
      file_type: 'jpg',
    };
    const PetName = await AsyncStorage.getItem('petName');
    const Breed = await AsyncStorage.getItem('breed');
    const Sex = await AsyncStorage.getItem('sex');
    const Location = await AsyncStorage.getItem('location');
    // //////-->onboarding3
    const Birthday = await AsyncStorage.getItem('birthday');
    // //////-->onboarding4
    const Weight = await AsyncStorage.getItem('weight');
    const WeightUnit = await AsyncStorage.getItem('weightUnit');
    // //////-->onboarding5
    const Height = await AsyncStorage.getItem('height');
    const HeightUnit = await AsyncStorage.getItem('heightUnit');
    // //////-->onboarding6
    const ImeiNumber = await AsyncStorage.getItem('ImeiNumber');

    // //////-->Personality
    const Personality = await AsyncStorage.getItem('personality_id');

    // //////-->toys
    const Toys = await AsyncStorage.getItem('toy_box_values');

    // //////-->food
    const Food = await AsyncStorage.getItem('food_box_values');
    // //////-->LikesDislikes
    const LikesDislikes = await AsyncStorage.getItem(
      'pet_likesdislikesbox_values',
    );

    // const userName = await AsyncStorage.getItem('user_name');

    //  {"birth_day": null, "breed_category_id": 1, "color": "", "food_box_values": null, "gender": "Female", "height": "", "height_unit": "", "imei_tracker_id": "", "location": "Norway", "personality_id": NaN, "pet_image_path": {"data": "", "file_type": "jpg"}, "pet_likesdislikesbox_values": null, "pet_name": "Jumbo", "status": 1, "toy_box_values": null, "user_id": 83, "user_name": "Me@12", "weight": "", "weight_unit": ""}

    const data = {
      user_id: parseInt(UserID),
      // user_name: userName,
      breed_category_id: Breed == NaN ? '' : parseInt(Breed),
      pet_name: PetName == null ? '' : PetName,
      birth_day: Birthday == 'Enter Birthday' || null ? ' ' : Birthday,
      weight: Weight == null || NaN ? '' : parseFloat(Weight),
      weight_unit: WeightUnit == null ? '' : WeightUnit,
      height: Height == null || NaN ? '' : parseFloat(Height),
      height_unit: HeightUnit == null ? '' : HeightUnit,
      gender: Sex == null ? '' : Sex,
      color: '',
      pet_image_path: ProfileImg == '' ? '' : ProfileImagePath,
      location: Location == null ? '' : Location,
      status: 1,
      imei_tracker_id: ImeiNumber == null || NaN ? '' : parseInt(ImeiNumber),
      personality_id: parseInt(Personality),
      toy_box_values: JSON.parse(Toys),
      food_box_values: JSON.parse(Food),
      pet_likesdislikesbox_values: JSON.parse(LikesDislikes),
    };

    // console.log("payload", data, 'likes payload');

    const Response = await PetDetailsApi(data);
    // console.log("Response PetDetailsApi", Response)
    if (Response.success == true) {
      AsyncStorage.setItem('email', Response.email);
      AsyncStorage.setItem('token', Response.jwt_token);
      AsyncStorage.setItem('userId', JSON.stringify(Response.user_id));
      AsyncStorage.setItem(
        'userEmailVerified',
        JSON.stringify(Response.email_verified),
      );
      AsyncStorage.setItem('userPetCount', JSON.stringify(Response.pet_count));
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
      // navigation.navigate('HomeStackNavigator',{screen:'Home'})

      if (value == 'addNow') {
        navigation.navigate('Onboarding1', {
          status: '',
        });
        const IsAddTrue = 1;
        AsyncStorage.setItem('IsAdd', JSON.stringify(IsAddTrue));
      }
      if (value == 'finish') {
        const IsAddTrue = 0;
        AsyncStorage.setItem('IsAdd', JSON.stringify(IsAddTrue));
        navigation.navigate('HomeStackNavigator', {screen: 'Home'});
      }
      AsyncStorage.setItem('PetId', JSON.stringify(Response.data));
      // //////-->onboarding2
      AsyncStorage.removeItem('profileImg');
      AsyncStorage.removeItem('petName');
      AsyncStorage.removeItem('breed');
      AsyncStorage.removeItem('sex');
      AsyncStorage.removeItem('location');
      // //////-->onboarding3
      AsyncStorage.removeItem('birthday');
      // //////-->onboarding4
      AsyncStorage.removeItem('weight');
      AsyncStorage.removeItem('weightUnit');
      // //////-->onboarding5
      AsyncStorage.removeItem('height');
      AsyncStorage.removeItem('heightUnit');
      // //////-->onboarding6
      AsyncStorage.removeItem('ImeiNumber');
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
      <SafeAreaView>
        <ScrollView
          style={styles.fleamain}
          showsVerticalScrollIndicator={false}>
          {/* <View style={styles.navheader}>
            <TouchableOpacity
              onPress={() => navigation.navigate('HomeStackNavigator', { screen: 'AddLikesDislikes' })}>
              <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
            </TouchableOpacity>
          </View> */}
          {/* <View style={styles.space20}></View> */}
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.createacc}>Add another family member?</Text>
          </View>
          <View style={styles.space20}></View>
          <View style={styles.finish}>
            {/* <TouchableOpacity
              style={styles.bluebtn}
              onPress={() => handleFinish('addNow')}>
              <Text style={styles.bluebtntext}>ADD NOW</Text>
            </TouchableOpacity> */}
            {/* <View style={styles.space20}></View> */}
            <TouchableOpacity
              style={styles.bluebtn}
              onPress={() => handleFinish('finish')}>
              <Text style={styles.bluebtntext}>FINISH</Text>
            </TouchableOpacity>
          </View>
          <View></View>
          <View style={styles.dotmain}>
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dotactive} />
          </View>
          <Text style={styles.onboardtext}>Add another family member?</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Onboarding8;
