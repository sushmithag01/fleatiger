import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ActivityDescriptionLeftHeader} from '../navigation/CustomBackNavigation';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import styles from '../Common.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Svg, {
  Path,
  G,
  Defs,
  ClipPath,
  Circle,
  Mask,
  Pattern,
  Use,
  xlinkHref,
  style,
} from 'react-native-svg';
import Toast from 'react-native-root-toast';
import ErrorText from './ErrorText/ErrorText';
import {
  ActivityDescriptionApi,
  AddNewsFeedCommentApi,
  GetDashboardApi,
} from './API/ApiCalls';
import ProfileComponent from './Components/ProfileComponent';
import AcitivityDescriprionComponent from './Components/AcitivityDescriprionComponent';

function ActivityDescription({route}) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentErr, setCommentError] = useState('');

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => (
          <ActivityDescriptionLeftHeader navigation={navigation} />
        ),
      });
    }
    ActivityHandler();
  }, [isFocused]);

  const ActivityHandler = async () => {
    const userId = await AsyncStorage.getItem('userId');
    let payload = {
      friend_user_id: route.params.state.user_id,
      friend_pet_id: route.params.state.user_pet_id,
      activity_id: route.params.state.activity_id,
      user_id: parseInt(userId),
    };
    const result = await ActivityDescriptionApi(payload);
    if (result.message) {
      Toast.show(result.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    } else if (result.status === 200) {
      setData(result.data[0]);
    }
  };

  const handleCommentFun = async data => {
    if (commentText) {
      const userId = await AsyncStorage.getItem('userId');
      const petId = await AsyncStorage.getItem('PetId');
      let payload = {
        user_id: parseInt(userId),
        pet_id: parseInt(petId),
        activity_id: data.activity_id,
        reply_text: commentText,
      };

      const resultData = await AddNewsFeedCommentApi(payload);
      if (resultData.status === 200) {
        setCommentText('');
        ActivityHandler();
      } else {
        setCommentError(resultData.message);
      }
    } else {
      setCommentError(ErrorText.CommentTextRequired);
    }
  };

  return (
    <ScrollView>
      <View style={styles.profileContainer}>
        <ProfileComponent data={data} />
        <AcitivityDescriprionComponent
          data={data}
          handleCommentFun={handleCommentFun}
          setCommentText={setCommentText}
          commentText={commentText}
          commentErr={commentErr}
          setCommentError={setCommentError}
        />
      </View>
    </ScrollView>
  );
}

export default ActivityDescription;
