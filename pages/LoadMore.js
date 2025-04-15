import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import styles from '../Common.css';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoadMore = props => {
  const {setOffset, offset, onPressTouch, EndOfList} = props;

  return (
    <View>
      {EndOfList == true ? (
        <View>
          <Text style={styles.bluebtnsmalltextSave}>End of result</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.bluebtnsmallSave}
          onPress={() => setOffset(offset + 1)}>
          <Text style={styles.bluebtnsmalltextSave}>Load More</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => onPressTouch()}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#CE5757',
            alignItems: 'center',
            borderRadius: 50,
            right: 20,
            position: 'absolute',
            bottom: 0,
            zIndex: 1,
          }}>
          <Ionicons
            name="arrow-up"
            size={22}
            color="#fff"
            style={{marginTop: 'auto', marginBottom: 'auto'}}></Ionicons>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LoadMore;
