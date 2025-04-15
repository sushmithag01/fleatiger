import React, {useRef, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import {NewsLikeDisLikeApi} from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

const PinchZoom = ({imageModalVisible,setImageModalVisible}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePinchEve = Animated.event([{nativeEvent: {scale: scale}}], {
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
    <ScrollView
      persistentScrollbar={true}
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={{flexGrow: 1}}
      horizontal={true}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => setImageModalVisible({state: false, url: ''})}
          style={styles.imgcloseBtn}>
          <Ionicons name="close" size={20} color="#B85A57"></Ionicons>
        </TouchableOpacity>
        <PinchGestureHandler
          onGestureEvent={handlePinchEve}
          onHandlerStateChange={handlePinchStateChange}>
          <Animated.Image
            source={{
              uri: imageModalVisible.url,
            }}
            style={[styles.expandimg, {transform: [{scale: scale}]}]}
            resizeMode="contain"
          />
        </PinchGestureHandler>
      </View>
    </ScrollView>
  );
};

export default PinchZoom;
