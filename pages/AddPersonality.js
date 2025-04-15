import React,{useState} from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView,Dimensions} from 'react-native';
import styles from "../Common.css"
import { SvgXml } from 'react-native-svg';
import Logo from "../assets/fleatiger-logo.svg";
import Ionicons from "react-native-vector-icons/Ionicons"
import Svg, { Path, G, Defs, ClipPath , Circle, Mask, Pattern, Use, xlinkHref, style} from "react-native-svg";
import { Avatar, Badge, Icon, withBadge, Input } from '@rneui/themed';
import FontAwesome from "react-native-vector-icons/Ionicons"
import { Dropdown } from 'react-native-element-dropdown';

import { PetPersonalitySliderApi } from './API/ApiCalls';
import Carousel from 'react-native-reanimated-carousel'; 
import PetNameImg from './PetNameImg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { AddPersonalityHeaderLeft } from '../navigation/CustomBackNavigation';

const AddPersonality = ({navigation}) => {
  const width = Dimensions.get('window').width;

  const[data,setData] = useState([])
  const [Name,setName] = useState('')

  const [selectedPersonality,setSelectedPersonality] = useState('1')
  const [autoPlay, setAutoplay] = useState(true);
  const isFocused = useIsFocused()
  // show-name
  useEffect(()=>{
    navigation.setOptions({
      headerLeft: () => <AddPersonalityHeaderLeft navigation={navigation} selectedPersonality={selectedPersonality}/>,
    })
  },[selectedPersonality])

  useEffect(()=>{
   
    if(isFocused){
      getSliderData();
      getName()
    }
 },[isFocused])

  const getSliderData = async()=>{
    const Response = await PetPersonalitySliderApi()
    setData(Response.data)
    setSelectedPersonality(Response.data[0].personality_id)
  }
  const getName = async()=>{
    const petName = await AsyncStorage.getItem("petName");
    setName(petName)
  }

  const handleNext =()=>{
    console.log(selectedPersonality,"selectedPersonality")
    AsyncStorage.setItem("personality_id",JSON.stringify(selectedPersonality));
    navigation.navigate('AddToys')
}
const handlePersonality = (data) => {
  setSelectedPersonality(data)
  setAutoplay(false);
}
  return (
    <>
    <SafeAreaView>
     <ScrollView style={styles.fleamain} showsVerticalScrollIndicator={false}>
   {/* <View style={styles.navheader}>
     <TouchableOpacity onPress={() => navigation.navigate('Onboarding6')}>
        <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNext()}>
        <Text style={styles.skiptext}>Skip</Text>
      </TouchableOpacity>
    </View> */}
      <View style={styles.space20}></View>
      <PetNameImg />
       <View style={styles.space20}></View>
       <View>
         <Text style={[styles.createacc,styles.createacc1,{textAlign:"center"}]}>Add Personality</Text>
         <Text style={[styles.forgotcontent2,{textAlign:"center"}]}>What is {Name} Like?</Text>
        </View>
        <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
            <Carousel
                loop
                width={width/1.5}
                height={width / 1.5}
                autoPlay={autoPlay}
                data={data}
                scrollAnimationDuration={200}
                // onSnapToItem={(index) =>setSelectedPersonality(data[index].personality_id)}
                renderItem={({ item,index }) => (
                    <View
                        style={selectedPersonality === data[index].personality_id  ? styles.selectedPersonalitystyle : styles.personalitystyle}
                    >
                       <TouchableOpacity onPress={() => handlePersonality(data[index].personality_id)}>
                        <View style={{ textAlign: 'center' }}>
                              <Image
                            source={{uri: item.pet_personality_image}}
                            style={[styles.personalityImg]}></Image>
                             <View style={styles.space20}></View>
                             <View style={styles.space10}></View>

                            <Text style={styles.personalityText}>{item.personality_name}</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
       <View style={styles.space20}></View>
      

       <View style={styles.dotmain}>
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dotactive} />
         <Badge status="success" badgeStyle={styles.dot} />
       </View>
       <View style={styles.arrowright}>
       <TouchableOpacity onPress={()=>handleNext()}>
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



export default AddPersonality
