import React, {useState} from 'react'
import { ButtonGroup } from '@rneui/themed'
import { Text, StyleSheet, ScrollView, View} from 'react-native';
import styles from "../Common.css"

import MyVoucherCard from './MyVoucherCard';

const Account = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState([0, 2, 3]);
  return (
    <>
    <ScrollView showsVerticalScrollIndicator={false}>
     <ButtonGroup
      buttons={['My Vouchers', 'My Coupons ']}
      selectedIndex={selectedIndex}
      onPress={(value) => {
        setSelectedIndex(value);
      }}
      containerStyle={styles.btncontainer}
      selectedButtonStyle={styles.selectedbtn}
      buttonContainerStyle={styles.buttonContainerStyle}
      buttonStyle={styles.buttonStyle}
      textStyle={styles.textStyle}
     />

     <View style={styles.space20}></View>
     <View style={styles.marginhz15}>
       <MyVoucherCard/> 
       <MyVoucherCard/> 
       <MyVoucherCard/> 
     </View>
     
     </ScrollView>
    </>
  )
}

export default Account
