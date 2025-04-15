import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import styles from '../../Common.css';

function LikeListRenderItem({ item }) {
  return (
    <TouchableOpacity key={item.index}>
      <View style={styles.logmain2}>
        <Image
          source={item?.item ? { uri: item?.item?.liked_profile || item?.item?.pet_image } : require('../../assets/pic9.png')}
          style={styles.newsimg1}></Image>

        <View style={{ width: 125 }}>
          <Text style={[styles.homecardtext1]}>{item.item?.pet_name}</Text>
          {/* <Text style={styles.logdate}>Location</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default LikeListRenderItem;
