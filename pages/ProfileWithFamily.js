import React from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import styles from "../Common.css"

const ProfileWithFamily = (props) => {
  const {petImage,petName} = props
  return (
    <>
   
       <View style={[styles.logosection]}>
       <Image source={{uri: petImage}}  
         style={[styles.ProfileLogo,styles.addupload]}></Image>    
       </View>
       <View style={styles.editnamemain}>
          <Text style={styles.editnametext}>{petName}</Text>
        </View>
       <Text style={styles.familytext}>Family Member</Text>
       <View style={styles.space20}></View>
       <View style={styles.space20}></View>
    </>
  )
}

export default ProfileWithFamily