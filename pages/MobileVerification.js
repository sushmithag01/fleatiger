import React from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import styles from "../Common.css"
import { useNavigation } from '@react-navigation/native';

const MobileVerification = props => {
    const navigation = useNavigation();
  return (
    <>
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.redeemmain,styles.verfimain]}>
            <Image source={require('../assets/r2.png')}></Image>
            </View>
            <Text style={styles.redeemtext1}>Change Mobile Number</Text>
        <View style={styles.mainformnobg}>
                <Text style={[styles.label,styles.blacktext]}>Enter New Mobile Number <Text style={styles.required}>*</Text></Text>
                <TextInput
                style={[styles.input,styles.blacktext]}
                placeholder="Enter New Mobile Number"
                placeholderTextColor="#ccc"
                />
                <View style={[styles.checkbtnmain,styles.deatilsbtninner]}>
                <TouchableOpacity style={[styles.applybtn,styles.orgoutline]} onPress={()=>navigation.navigate('RedeemVerification')}><Text style={styles.applytext}>Send Verification code</Text></TouchableOpacity>
             </View>
         </View> 
    </ScrollView>
    </>
  )
}

export default MobileVerification