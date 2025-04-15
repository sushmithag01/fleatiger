import React, {useState} from 'react';
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

const EditLikesDisLikesList = ({
  navigation,
  item,
  toysSelceted,
  setToysSelected,
  data,
  setData,
}) => {
  const [tab, setTab] = useState(item.pet_like_value);

  const handleText = (e, val, item) => {
    if (val == 'No Way') {
      setTab('No Way');
      setData(value => {
        const newArr = value.slice();
        item.pet_like_value = 'No Way';
        return newArr;
      });
    }
    if (val == 'May Be') {
      setTab('May Be');
      setData(value => {
        const newArr = value.slice();
        item.pet_like_value = 'May Be';
        return newArr;
      });
    }
    if (val == 'Love') {
      setTab('Love');
      setData(value => {
        const newArr = value.slice();
        item.pet_like_value = 'Love';
        return newArr;
      });
    }
  };

  return (
    <>
      <View style={styles.selectswitch}>
        <Text style={styles.switchtext}>{item.title}</Text>
        <View style={styles.tabmain4}>
          <View style={styles.tabSec}>
            <Text
              onPress={e => handleText(e, 'No Way', item)}
              style={tab === 'No Way' ? styles.activeTab : styles.InactiveTab}>
              No way
            </Text>
            <View
              style={
                tab == 'May Be'
                  ? styles.mayBeactiveTab
                  : styles.mayBeInactiveTab
              }>
              <Text
                style={
                  tab == 'May Be'
                    ? {color: '#fff', textAlign: 'center'}
                    : {color: '#495F75', textAlign: 'center'}
                }
                onPress={e => handleText(e, 'May Be', item)}>
                Maybe
              </Text>
            </View>
            <Text
              onPress={e => handleText(e, 'Love', item)}
              style={tab == 'Love' ? styles.activeTab : styles.InactiveTab}>
              Love
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default EditLikesDisLikesList;
