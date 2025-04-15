import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import styles from '../Common.css';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { LikesListingLeftHeader } from '../navigation/CustomBackNavigation';
import { NewsFeedAllLikesApi } from './API/ApiCalls';
import LikeListRenderItem from './RenderComponents/LikeListRenderItem';

function LikesListing({ route }) {
  const navigation = useNavigation();
  const [likesProfileData, setLikesProfileData] = useState('');
  const [noDataErr, setNodataErr] = useState('')
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <LikesListingLeftHeader navigation={navigation} />,
    });
    handleLikesList();
  }, [route]);
  const handleLikesList = async () => {
    let payload = {
      activity_id: route.params.ActivityId
    }
    const responseData = await NewsFeedAllLikesApi(payload)
    if (responseData.status === 200) {
      setLikesProfileData(responseData.data)
    } else {
      setNodataErr('')
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ margin: 20 }}>
        <SafeAreaView>
          <FlatList
            data={likesProfileData}
            keyExtractor={item => item}
            renderItem={item => <LikeListRenderItem item={item} />}
            nestedScrollEnabled={true}
          />
        </SafeAreaView>

      </View>
    </ScrollView>
  );
}

export default LikesListing;
