import React, { useEffect } from 'react';
import {View, Text, FlatList, SafeAreaView} from 'react-native';
import styles from '../../Common.css';
import CommentRenderItem from '../RenderComponents/CommentRenderItem';

function CommentLists({commentsData}) {
  useEffect(()=>{

  },[commentsData])
  return (
    <SafeAreaView>
      <FlatList
      keyExtractor={(item) => item}
      data={commentsData}
      renderItem={(item)=><CommentRenderItem item={item}/>}
      nestedScrollEnabled={true}
      />
      {/* <CommentRenderItem /> */}
    </SafeAreaView>
  );
}

export default CommentLists;
