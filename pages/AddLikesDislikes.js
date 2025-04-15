import React from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from "../Common.css"
import Svg, { Path, G, Defs, ClipPath, Circle, Mask, Pattern, Use, xlinkHref, style } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import PetNameImg from './PetNameImg';
import { LikesDisLikesSliderApi } from './API/ApiCalls';
import ErrorText from './ErrorText/ErrorText';
import AddLikesDislikesList from './AddLikesDislikesList';
import { AddLikesDislikesHeaderLeft } from '../navigation/CustomBackNavigation';

const AddLikesDislikes = ({ navigation }) => {

  const [data, setData] = useState([])
  const [Name, setName] = useState('')



  const isFocused = useIsFocused()

  useEffect(()=>{
    navigation.setOptions({
      headerLeft: () => <AddLikesDislikesHeaderLeft navigation={navigation} data={data}/>,
    });
  },[data])
  // show-name
  useEffect(() => {
    
    if (isFocused) {
      getName()
      getSliderData()
    }
  }, [isFocused])

  const getName = async () => {
    const petName = await AsyncStorage.getItem("petName");
    setName(petName)
  }
  const getSliderData = async () => {
    const Response = await LikesDisLikesSliderApi()
    //   console.log(Response,"slidersss")
    setData(Response)
  }

  const handleNext = () => {
    AsyncStorage.setItem("pet_likesdislikesbox_values", JSON.stringify(data));
    // console.log(data,"data")
    navigation.navigate('Onboarding7')
  }

  return (
    <>
      <ScrollView style={[styles.mainpage, styles.padhoz15]} showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        {/* <View style={styles.space20}></View>
        <View style={styles.space20}></View> */}
        {/* <View style={styles.space20}></View> */}
        {/* <View style={styles.navheader}>
          <TouchableOpacity onPress={() => navigation.navigate('AddFood')}>
            <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNext()}>
            <Text style={styles.skiptext}>Skip</Text>
          </TouchableOpacity>
        </View> */}
        <PetNameImg />
        <View style={styles.space20}></View>

        <View>
          <Text style={[styles.createacc, styles.createacc1,{textAlign:"center"}]}>Add likes/dislikes</Text>
          <Text style={[styles.forgotcontent2,{textAlign:"center"}]}>
            What are {Name}  preferences?
          </Text>
        </View>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>

        {data?.length == 0 ? (
          <>
            <View style={{ flex: 1 }}>
              <Text style={styles.activestatetext}>{ErrorText.NoData}</Text>
            </View>
          </>
        ) : (

          <>
            {data.map((item, key) => {
              return (
                <AddLikesDislikesList
                  item={item}
                  data={data}
                  setData={setData}
                />
              );
            })}
          </>
        )}

        <View style={styles.arrowright}>
          <TouchableOpacity onPress={() => handleNext()}>
            <Svg
              width={70}
              height={70}
              viewBox="0 0 70 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
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
    </>
  );
}

export default AddLikesDislikes