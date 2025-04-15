import React, { useState } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from "../Common.css"


const AddLikesDislikesList = ({ navigation, item, toysSelceted, setToysSelected, data, setData }) => {

  const [tab, setTab] = useState('0')



  const handleText = (e, val, item) => {
    if (val == '0') {
      setTab('0')
      setData((value) => {
        const newArr = value.slice();
        item.category_value = 'No way';
        return newArr;
      })
    }
    if (val == '1') {
      setTab('1')
      setData((value) => {
        const newArr = value.slice();
        item.category_value = 'May Be';
        return newArr;
      })
    }
    if (val == '2') {
      setTab('2')
      setData((value) => {
        const newArr = value.slice();
        item.category_value = 'Love';
        return newArr;
      })
    }
  }

  return (
    <>
      <View style={styles.selectswitch}>
        <Text style={styles.switchtext}>{item.category_name}</Text>
        <View style={styles.tabmain4}>
          <View style={styles.tabSec}>
            <Text
              onPress={e => handleText(e, '0', item)}
              style={tab === '0' ? styles.activeTab : styles.InactiveTab}>
              No way
            </Text>
            <View style={tab == '1' ? styles.mayBeactiveTab : styles.mayBeInactiveTab}>
            <Text
              onPress={e => handleText(e, '1',item)}
              style={tab == '1' ? { color: "#fff", textAlign: "center" } : { color: "#495F75", textAlign: "center" }}>
              Maybe
            </Text>
            </View>
            <Text
              onPress={e => handleText(e, '2', item)}
              style={tab == '2' ? styles.activeTab : styles.InactiveTab}>
              Love
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

export default AddLikesDislikesList
