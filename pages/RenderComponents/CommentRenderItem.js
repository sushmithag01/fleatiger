import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import styles from '../../Common.css';

function CommentRenderItem({item}) {
  useEffect(() => {}, [item]);
  return (
    <View key={item.index}>
      <View
        style={[
          styles.commentItem
        ]}>
        <Text style={[styles.commentTitle,{marginLeft:10,}]}>{item.item?.pet_name}</Text>
        <Text style={[styles.commentText,{marginLeft:10,}]}>{item.item?.reply_text}</Text>
      </View>
    </View>
  );
}

export default CommentRenderItem;
