import React,{useState} from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import styles from "../Common.css"
import { SvgXml } from 'react-native-svg';
import Logo from "../assets/fleatiger-logo.svg";
import Ionicons from "react-native-vector-icons/Ionicons"
import Svg, { Path, G, Defs, ClipPath , Circle, Mask, Pattern, Use, xlinkHref} from "react-native-svg";
import { Avatar, Badge, Icon, withBadge } from '@rneui/themed';


const AddNewProfile = ({navigation}) => {
  return (
    <>
    <SafeAreaView>
     <ScrollView style={styles.fleamain} showsVerticalScrollIndicator={false}>
     <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
      </TouchableOpacity>
      <View style={styles.space20}></View>
        <View>
            <Text style={styles.createacc}>Add a new{'\n'}profile</Text>
        </View>
        <View style={styles.space20}></View>
       <View style={styles.logosection}>
        <Image source={require('../assets/dog1.png')} style={styles.dogimg}></Image>
       </View>
       <View style={styles.dotmain}>
         <Badge status="success" badgeStyle={styles.dotactive} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
         <Badge status="success" badgeStyle={styles.dot} />
       </View>
       <Text style={styles.onboardtext}>Let’s add a new member to the family!</Text>
       <View style={styles.arrowright}>
       <TouchableOpacity onPress={()=>navigation.navigate('Onboarding2')}>
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



export default AddNewProfile
