import React, { useRef, useState } from 'react';
import styles from '../Common.css';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  Animated,
} from 'react-native';
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
  Ellipse,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import { NewsLikeDisLikeApi } from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import PinchZoom from './PinchZoom';
import { TouchableHighlight } from 'react-native';
import moment from 'moment';

const NewsfeedList = props => {
  const { eachItem, GetNewsfeedData } = props;
  const navigation = useNavigation();
  const [imageModalVisible, setImageModalVisible] = useState({
    state: false,
    url: '',
  });
  const scale = useRef(new Animated.Value(1)).current;
  // Images-list
  const [SliderImages, setSliderImages] = useState(eachItem.activity_imglist);

  const [Like, setLike] = useState(false);
  // Duration
  const TimeVAl = eachItem.duration;
  const getTime = TimeVAl.split(':');

  // Date
  const DateValue = new Date(eachItem.activity_time);
  const shortMonth = DateValue.toLocaleString('en-US', {
    month: 'short',
  });
  const day = DateValue.toLocaleString('en-US', {
    day: 'numeric',
  });
  const year = DateValue.toLocaleString('en-US', {
    year: 'numeric',
  });
  const MonthNum = DateValue.toLocaleString('en-US', {
    month: 'numeric',
  });

  const formattedDate = day + ' ' + shortMonth + ' ' + year;
  const dateForCompltedActivity = year + '-' + MonthNum + '-' + day;

  const handleLike = name => {
    setLike(true);
    Toast.show(`You liked ${name} activity`, {
      duration: Toast.durations.LONG,
      position: 50,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: '#fff',
      textColor: '#000',
    });
  };

  const handleDisLike = data => {
    // console.log('eachItem', data);
    setLike(false);
    Toast.show(`You disliked ${name} activity`, {
      duration: Toast.durations.LONG,
      position: 50,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: '#fff',
      textColor: '#000',
    });
  };

  const handleLikeDislike = async data => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
      pet_id: await AsyncStorage.getItem('PetId'),
      activity_id: data.activity_id,
    };
    const likeDisResponse = await NewsLikeDisLikeApi(payload);
    GetNewsfeedData();
    // console.log('likeDisResponse', likeDisResponse,payload);
    if (likeDisResponse.status === 200) {
      Toast.show(likeDisResponse.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    } else {
      Toast.show(likeDisResponse.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    }
  };

  const handleChatRoom = data => {
    let props = {
      friend_list_id: data.friend_list_id,
      location: data.location,
      pet_id: data.user_pet_id,
      pet_image_path: data.pet_image_path,
      pet_name: data.pet_name,
    };
    navigation.navigate('MessagesStackNavigator', {
      screen: 'Chat',
      params: { userInfo: props },
    });
    //  navigation.navigate('Chat', { userInfo: props });
  };

  const renderSliderImages = item => {
    return (
      <TouchableOpacity
        onPress={() => setImageModalVisible({ state: true, url: item.item })}>
        <View style={styles.place}>
          <Image source={{ uri: item.item }} style={styles.placeimg}></Image>
        </View>
      </TouchableOpacity>
    );
  };

  const handleActivityDescription = () => {
    navigation.navigate('ActivityDescription', { state: eachItem });
  };

  const handlePinchEve = Animated.event([{ nativeEvent: { scale: scale } }], {
    useNativeDriver: true,
  });
  const handlePinchStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <TouchableOpacity onPress={() => handleActivityDescription(eachItem)}>
      <View style={styles.homecardinner1}>
        <View style={styles.logmain}>
          <View style={styles.logmain1}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('FriendProfile', {
                  friendId: eachItem.user_pet_id,
                });
              }}>
              <Image
                source={{ uri: eachItem?.pet_image_path }}
                style={[styles.newsimg]}></Image>
            </TouchableOpacity>
            <View style={{ width: 125 }}>
              <Text style={styles.homecardtext1}>{eachItem.pet_name}</Text>
              <Text style={styles.logdate}>
                {eachItem.activity_time.slice(4, 16)}
              </Text>
            </View>
          </View>
          <Image
            style={[styles.activityImgDis]}
            source={{ uri: eachItem.activity_image_path }}></Image>
        </View>

        <View style={styles.space20}></View>
        <Text style={[styles.logdate, styles.blue]}>
          {eachItem.activity_name}
        </Text>
        <View style={styles.brownbtnmain}>
          <View style={styles.brownbtnLog}>
            <Text style={styles.brownbtntext}>
              {' '}
              {getTime[0] == '00' ? '00' : `${getTime[0]}`}:
              {getTime[1] == '00' ? '00' : `${getTime[1]}`} hrs
            </Text>
            {/* <Text style={styles.brownbtntext}> {eachItem.duration} hrs</Text>  */}
          </View>
          <View style={styles.brownbtnLog}>
            <Text style={styles.brownbtntext}>{eachItem?.distance}</Text>
          </View>
        </View>
        <View style={styles.space20}></View>
        {SliderImages.length == 0 ? (
          ''
        ) : (
          <View style={[styles.dflex, styles.imgSliderAct]}>
            <ScrollView horizontal={true} showsVerticalScrollIndicator={true}>
              <View style={{ flexDirection: 'row' }}>
                <SafeAreaView>
                  <FlatList
                    keyExtractor={item => item.item}
                    data={SliderImages}
                    renderItem={renderSliderImages}
                    contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                    nestedScrollEnabled={true}
                  />

                </SafeAreaView>

              </View>
            </ScrollView>
          </View>
        )}
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <View>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{ padding: 2, fontSize: 16 }}>
                {eachItem.likes_count}
              </Text>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                id="icons-RZ_Weiss"
                viewBox="0 0 50 50"
                width={25}
                height={25}>
                <Path
                  d="M30.73 12.74l-3.83 2.1c-1.18.65-2.62.65-3.81 0l-3.83-2.1a3.96 3.96 0 00-4.08.17l-4.05 2.67a6.955 6.955 0 00-3.14 5.81c0 2.04.9 3.98 2.47 5.31l11.98 10.12a3.975 3.975 0 005.11 0L39.53 26.7A6.943 6.943 0 0042 21.39c0-2.34-1.18-4.52-3.14-5.81l-4.05-2.67c-1.22-.81-2.8-.87-4.08-.17z"
                  fill="#223656"
                />
              </Svg>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ padding: 2, fontSize: 16 }}>
                {eachItem.activity_comment}
              </Text>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={25}
                height={25}>
                <Path
                  d="M18.09 19.84a2.21 2.21 0 10.001 4.421 2.21 2.21 0 00-.001-4.421zM23.99 19.84a2.21 2.21 0 10.001 4.421 2.21 2.21 0 00-.001-4.421zM29.89 19.84a2.21 2.21 0 10.001 4.421 2.21 2.21 0 00-.001-4.421z"
                  fill="#223656"
                  strokeWidth={0}
                />
                <Path
                  d="M36.7 12.06H11.3a2.3 2.3 0 00-2.3 2.3v15.97a2.3 2.3 0 002.3 2.3h1.98v4.44c0 .35.21.66.53.79a.88.88 0 00.94-.19l5.05-5.05h16.9a2.3 2.3 0 002.3-2.3V14.35a2.3 2.3 0 00-2.3-2.3zm.58 4.17v14.1c0 .32-.26.58-.58.58H19.45a.88.88 0 00-.61.25L15.01 35v-3.23c0-.47-.39-.86-.86-.86h-2.84a.58.58 0 01-.58-.58V14.36c0-.32.26-.58.58-.58H36.7c.32 0 .58.26.58.58v1.87z"
                  fill="#223656"
                  strokeWidth={0}
                />
              </Svg>
            </View>
          </View>
          <View style={styles.likesec}>
            {eachItem.like_status === 0 ? (
              <TouchableOpacity onPress={() => handleLikeDislike(eachItem)}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width={40}
                  height={40}>
                  <Circle
                    cx={24}
                    cy={24}
                    r={24}
                    fill="#92bcbf"
                    strokeWidth={0}
                  />
                  <Path
                    d="M36 15.47l-3.37-2.21a4.16 4.16 0 00-4.29-.17l-3.18 1.74c-.73.4-1.6.4-2.33 0l-3.18-1.74c-1.35-.74-3-.67-4.29.17l-3.37 2.21a6.6 6.6 0 00-3 5.54c0 1.95.86 3.8 2.36 5.06l9.96 8.39c.78.65 1.73.98 2.68.98s1.9-.33 2.68-.98l9.96-8.39a6.603 6.603 0 002.36-5.06c0-2.23-1.12-4.3-3-5.54zm-.48 9.27l-9.96 8.39c-.91.76-2.22.76-3.13 0l-9.96-8.39a4.867 4.867 0 01-1.74-3.73c0-1.65.83-3.17 2.22-4.09l3.37-2.21c.4-.27.87-.4 1.33-.4.4 0 .8.1 1.17.3L22 16.35c1.25.68 2.74.68 4 0l3.18-1.74c.79-.43 1.75-.39 2.5.1l3.37 2.21a4.88 4.88 0 012.22 4.09c0 1.44-.64 2.8-1.74 3.73z"
                    fill="#223656"
                    strokeWidth={0}
                  />
                </Svg>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleLikeDislike(eachItem)}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="icons-RZ_Weiss"
                  viewBox="0 0 50 50"
                  width={40}
                  height={40}>
                  <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                  <Path
                    d="M30.73 12.74l-3.83 2.1c-1.18.65-2.62.65-3.81 0l-3.83-2.1a3.96 3.96 0 00-4.08.17l-4.05 2.67a6.955 6.955 0 00-3.14 5.81c0 2.04.9 3.98 2.47 5.31l11.98 10.12a3.975 3.975 0 005.11 0L39.53 26.7A6.943 6.943 0 0042 21.39c0-2.34-1.18-4.52-3.14-5.81l-4.05-2.67c-1.22-.81-2.8-.87-4.08-.17z"
                    fill="#223656"
                  />
                </Svg>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => handleActivityDescription(eachItem)}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={40}
                height={40}>
                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                <Path
                  d="M18.09 19.84a2.21 2.21 0 10.001 4.421 2.21 2.21 0 00-.001-4.421zM23.99 19.84a2.21 2.21 0 10.001 4.421 2.21 2.21 0 00-.001-4.421zM29.89 19.84a2.21 2.21 0 10.001 4.421 2.21 2.21 0 00-.001-4.421z"
                  fill="#223656"
                  strokeWidth={0}
                />
                <Path
                  d="M36.7 12.06H11.3a2.3 2.3 0 00-2.3 2.3v15.97a2.3 2.3 0 002.3 2.3h1.98v4.44c0 .35.21.66.53.79a.88.88 0 00.94-.19l5.05-5.05h16.9a2.3 2.3 0 002.3-2.3V14.35a2.3 2.3 0 00-2.3-2.3zm.58 4.17v14.1c0 .32-.26.58-.58.58H19.45a.88.88 0 00-.61.25L15.01 35v-3.23c0-.47-.39-.86-.86-.86h-2.84a.58.58 0 01-.58-.58V14.36c0-.32.26-.58.58-.58H36.7c.32 0 .58.26.58.58v1.87z"
                  fill="#223656"
                  strokeWidth={0}
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          visible={imageModalVisible.state}
          transparent={true}
          animationType="slide">
          <PinchZoom
            imageModalVisible={imageModalVisible}
            setImageModalVisible={setImageModalVisible}
          />
        </Modal>
      </View>
    </TouchableOpacity>
  );
};

export default NewsfeedList;
