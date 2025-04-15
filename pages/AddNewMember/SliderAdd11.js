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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Avatar, Badge, Icon, withBadge, Input} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import {PetDetailsApi} from '../API/ApiCalls';
import styles from '../../Common.css';
import Loader from '../CommonScreens/Loader';
import {SliderAdd11HeaderLeft} from '../../navigation/CustomBackNavigation';

const SliderAdd11 = ({navigation}) => {
  const [Name, setName] = useState('');
  const [IsAddNewPetStatus, setIsAddNewPetStatus] = useState('');
  const [ProfileImage, setProfileImage] = useState('');

  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <SliderAdd11HeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      getName();
    }
  }, [isFocused]);

  const getName = async () => {
    const petName = await AsyncStorage.getItem('petName');
    const petImg = await AsyncStorage.getItem('profileImg');
    const IsAddNewPet = await AsyncStorage.getItem('AddFriend');

    setName(petName);
    setProfileImage(
      petImg
        ? petImg
        : 'https://devapi.fleatiger.com/pets/pet_profile_default.png',
    );
    setIsAddNewPetStatus(IsAddNewPet);
    // console.log(IsAddNewPet,"IsAddNewPet")
  };

  // add-pet
  // onClick-finish-button
  const handleFinish = async value => {
    setLoading(true);
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
    const userName = await AsyncStorage.getItem('user_name');

    const data = {
      user_id: parseInt(UserID),
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
      //"pet_image_path": ProfileImg == '' ? "" : "",
      location: Location == null ? '' : Location,
      status: 1,
      imei_tracker_id: ImeiNumber == null || NaN ? '' : parseInt(ImeiNumber),
      personality_id: parseInt(Personality),
      toy_box_values: JSON.parse(Toys),
      food_box_values: JSON.parse(Food),
      pet_likesdislikesbox_values: JSON.parse(LikesDislikes),
      user_name: userName,
    };

    console.log('datadatadata', data);
    const Response = await PetDetailsApi(data);

    if (Response.success == true) {
      setLoading(false);
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
      navigation.navigate('HomeStackNavigator', {screen: 'Home'});
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
      AsyncStorage.removeItem('user_name');
    } else {
      setLoading(false);
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
      <SafeAreaView>
        <ScrollView
          style={styles.fleamain}
          showsVerticalScrollIndicator={false}>
          {/* <View style={styles.navheader}>
     <TouchableOpacity onPress={()=>navigation.navigate('SliderAdd10')}>
        <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('Onboarding8')}>
        <Text style={styles.skiptext}>Skip</Text>
      </TouchableOpacity>
    </View> */}
          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.createacc}>Profile Created</Text>
            <Text style={styles.onboardtext}>
              Welcome, {Name == null ? 'Lucky' : Name}
            </Text>
          </View>
          {/* <View style={styles.space20}></View> */}
          <View style={[styles.logosection]}>
            {/* ProfileImage */}
            <Image
              // source={require('../assets/profile.png')}
              style={[styles.ProfileLogoBig, styles.addupload]}
              source={{uri: ProfileImage}}></Image>
          </View>
          <View></View>
          <Text style={styles.onboardtext}>You can edit this at any time</Text>
          <View style={styles.arrowright}>
            {/* {IsAddNewPetStatus == 1 && (
  <TouchableOpacity style={styles.bluebtn} onPress={()=>handleAddNewpet()}>
  <Text style={styles.bluebtntext}>FINISH</Text>
</TouchableOpacity>
)} */}
            <View style={styles.dotmain}>
              <Badge status="success" badgeStyle={styles.dot} />
              <Badge status="success" badgeStyle={styles.dot} />
              <Badge status="success" badgeStyle={styles.dot} />
              <Badge status="success" badgeStyle={styles.dot} />
              <Badge status="success" badgeStyle={styles.dot} />
              <Badge status="success" badgeStyle={styles.dot} />
              <Badge status="success" badgeStyle={styles.dot} />
              {/* <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} /> */}
              <Badge status="success" badgeStyle={styles.dotactive} />
              <Badge status="success" badgeStyle={styles.dot} />
            </View>
            {/* {IsAddNewPetStatus != 1 && (
       <TouchableOpacity  onPress={()=>navigation.navigate('Onboarding8')}>
       <Svg
            width={70}
            height={70}
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <G clipPath="url(#clip0_574_643)">
                <Path
                d="M35 70c19.33 0 35-15.67 35-35S54.33 0 35 0 0 15.67 0 35s15.67 35 35 35z"
                fill="#436077"
                />
                <Path
                d="M42.575 35a1.1 1.1 0 01-.063.375.871.871 0 01-.212.325l-6.6 6.6c-.2.2-.438.3-.713.3a.973.973 0 01-.712-.3.96.96 0 01-.3-.7c0-.267.1-.5.3-.7l4.9-4.9h-11.2a.926.926 0 01-.7-.288A.99.99 0 0127 35a.97.97 0 01.287-.713A.97.97 0 0128 34h11.175l-4.9-4.9a.96.96 0 01-.3-.7c0-.267.1-.5.3-.7.2-.2.437-.3.712-.3.275 0 .513.1.713.3l6.6 6.6c.1.1.17.208.212.325a1.1 1.1 0 01.063.375z"
                fill="#fff"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_574_643">
                <Path fill="#fff" d="M0 0H70V70H0z" />
                </ClipPath>
            </Defs>
            </Svg>
            </TouchableOpacity>
       )} */}
            <View style={styles.space50}></View>

            {/* <TouchableOpacity  onPress={()=>navigation.navigate('Onboarding8')}>
       <Svg
            width={70}
            height={70}
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <G clipPath="url(#clip0_574_643)">
                <Path
                d="M35 70c19.33 0 35-15.67 35-35S54.33 0 35 0 0 15.67 0 35s15.67 35 35 35z"
                fill="#436077"
                />
                <Path
                d="M42.575 35a1.1 1.1 0 01-.063.375.871.871 0 01-.212.325l-6.6 6.6c-.2.2-.438.3-.713.3a.973.973 0 01-.712-.3.96.96 0 01-.3-.7c0-.267.1-.5.3-.7l4.9-4.9h-11.2a.926.926 0 01-.7-.288A.99.99 0 0127 35a.97.97 0 01.287-.713A.97.97 0 0128 34h11.175l-4.9-4.9a.96.96 0 01-.3-.7c0-.267.1-.5.3-.7.2-.2.437-.3.712-.3.275 0 .513.1.713.3l6.6 6.6c.1.1.17.208.212.325a1.1 1.1 0 01.063.375z"
                fill="#fff"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_574_643">
                <Path fill="#fff" d="M0 0H70V70H0z" />
                </ClipPath>
            </Defs>
            </Svg>
            </TouchableOpacity> */}
          </View>

          {/* add pet  */}
          <View>
            <TouchableOpacity
              style={styles.bluebtnsmallSave}
              onPress={() => handleFinish('finish')}>
              <Text style={styles.bluebtnsmalltextSave}>FINISH</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default SliderAdd11;
