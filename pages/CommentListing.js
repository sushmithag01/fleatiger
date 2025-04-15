import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CommentsListApi } from './API/ApiCalls';
import CommentRenderItem from './RenderComponents/CommentRenderItem';
import ErrorText from './ErrorText/ErrorText';
import { LikesListingLeftHeader } from '../navigation/CustomBackNavigation';
import { ScrollView } from 'react-native';
import styles from '../Common.css';

function CommentListing({ route }) {
  const navigation = useNavigation();
  const [commentList, setcommentList] = useState([]);
  const [commentListErr, setcommentListErr] = useState('');
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <LikesListingLeftHeader navigation={navigation} />,
    });
    handleCommentListing();
  }, [route]);
  const handleCommentListing = async () => {
    let payload = {
      activity_id: route.params.ActivityId,
    };
    const responseData = await CommentsListApi(payload);
    if (responseData.status === 200) {
      setcommentList(responseData?.data);
    } else {
      setcommentListErr(ErrorText.NoData);
    }
  };
  return (
    <ScrollView>
      <View style={{ margin: 50 }}>
        {commentList.length > 0 ? (
          <SafeAreaView>
            <FlatList
              keyExtractor={item => item.pet_id}
              data={commentList}
              renderItem={item => <CommentRenderItem item={item} />}
              nestedScrollEnabled={true}
            />
          </SafeAreaView>

        ) : (
          <Text style={[styles.nodatatext, { marginTop: 200 }]}>
            {commentListErr}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

export default CommentListing;
