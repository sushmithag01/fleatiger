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

const EditFoodList = ({
  navigation,
  item,
  toysSelceted,
  setToysSelected,
  data,
  setData,
}) => {
  const [tab, setTab] = useState(item.food_value);

  const handleText = (e, val, item) => {
    if (val == 'Yuck') {
      setTab('Yuck');
      setData(value => {
        const newArr = value.slice();
        item.food_value = 'Yuck';
        return newArr;
      });
    }
    if (val == 'Maybe') {
      setTab('Maybe');
      setData(value => {
        const newArr = value.slice();
        item.food_value = 'Maybe';
        return newArr;
      });
    }
    if (val == 'Yum') {
      setTab('Yum');
      setData(value => {
        const newArr = value.slice();
        item.food_value = 'Yum';
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
              onPress={e => handleText(e, 'Yuck', item)}
              style={tab === 'Yuck' ? styles.activeTab : styles.InactiveTab}>
              Yuck
            </Text>
            <View
              style={
                tab == 'Maybe' ? styles.mayBeactiveTab : styles.mayBeInactiveTab
              }>
              <Text
                style={
                  tab == 'Maybe'
                    ? {color: '#fff', textAlign: 'center'}
                    : {color: '#495F75', textAlign: 'center'}
                }
                onPress={e => handleText(e, 'Maybe', item)}>
                Maybe
              </Text>
            </View>
            <Text
              onPress={e => handleText(e, 'Yum', item)}
              style={tab == 'Yum' ? styles.activeTab : styles.InactiveTab}>
              Yum
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default EditFoodList;
