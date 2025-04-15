import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from "../Common.css"
import { SvgXml } from 'react-native-svg';
import Logo from "../assets/fleatiger-logo.svg";
import Ionicons from "react-native-vector-icons/Ionicons"
import Svg, { Path, G, Defs, ClipPath, Circle, Mask, Pattern, Use, xlinkHref, style } from "react-native-svg";
import { Avatar, Badge, Icon, withBadge, Input } from '@rneui/themed';
import FontAwesome from "react-native-vector-icons/Ionicons"
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Onboarding7HeaderLeft } from '../navigation/CustomBackNavigation';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];
const Onboarding7 = ({ navigation }) => {
  const [Name, setName] = useState('')
  const [IsAddNewPetStatus, setIsAddNewPetStatus] = useState('')
  const [ProfileImage, setProfileImage] = useState('')

  const isFocused = useIsFocused()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Onboarding7HeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      getName();
    }
  }, [isFocused])

  const getName = async () => {
    const petName = await AsyncStorage.getItem("petName");
    const petImg = await AsyncStorage.getItem("profileImg");
    const IsAddNewPet = await AsyncStorage.getItem("AddFriend");

    setName(petName)
    setProfileImage(petImg ? petImg : "https://devapi.fleatiger.com/pets/pet_profile_default.png")
    setIsAddNewPetStatus(IsAddNewPet)
    console.log(IsAddNewPet, "IsAddNewPet")
  }
  return (
    <>
      <SafeAreaView>
        <ScrollView style={styles.fleamain} showsVerticalScrollIndicator={false}>
          {/* <View style={styles.navheader}>
     <TouchableOpacity onPress={()=>navigation.navigate('HomeStackNavigator',{screen:'AddLikesDislikes'})}>
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
            <Text style={styles.onboardtext}>Welcome, {Name == null ? 'Lucky' : Name}</Text>
          </View>
          <View style={styles.space20}></View>
          <View style={[styles.logosection]}>
            {/* ProfileImage */}
            <Image
              // source={require('../assets/profile.png')}
              style={[styles.ProfileLogoBig, styles.addupload]}
              source={{ uri: ProfileImage }}
            ></Image>
          </View>
          <View>
          </View>
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
            <View style={styles.space20}></View>

            <TouchableOpacity onPress={() => navigation.navigate('Onboarding8')}>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}
export default Onboarding7