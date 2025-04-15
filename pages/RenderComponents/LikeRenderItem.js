import React, {useEffect} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import styles from '../../Common.css';
import {useNavigation} from '@react-navigation/native';

function LikeRenderItem({item, ActivityId}) {
  const navigation = useNavigation();
  useEffect(() => {}, [item, ActivityId]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('LikesList', {ActivityId: ActivityId})
      }>
      <View
        style={
          item.index !== 0
            ? [styles.likesImage]
            : [styles.likesImage, {marginLeft: 8}]
        }>
        <Image
          source={{
            uri: item.item?.liked_profile
              ? item.item?.liked_profile
              : 'https://devapi.fleatiger.com/pets/pet_profile_default.png',
          }}
          style={[styles.ProfileLogoDes, styles.addupload]}
        />
      </View>
    </TouchableOpacity>
  );
}

export default LikeRenderItem;
