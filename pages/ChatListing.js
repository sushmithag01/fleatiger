import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import styles from '../Common.css';
import Entypo from 'react-native-vector-icons/Entypo';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DeletePetChatLogApi,
  chatHighlightApi,
  getChatListApi,
} from './API/ApiCalls';
import ProfileScreen from './CommonScreens/ProfileScreen';
import Loader from './CommonScreens/Loader';
import Search from './SearchBar';
import ChatTopHeader from './ChatTopHeader';
import moment from 'moment';
import ErrorText from './ErrorText/ErrorText';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-root-toast';
import {
  ChatListingHeaderLeft,
  ChatListingHeaderRight,
} from '../navigation/CustomBackNavigation';
import ChatComponent from './Components/ChatComponent';

const ChatListing = ({ route }) => {
  const index = route?.params?.index;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');

  const [NoData, setNoData] = useState('');

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <ChatListingHeaderLeft navigation={navigation} />,
        // headerRight: () => <ChatListingHeaderRight navigation={navigation} />,
      });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [isFocused]);

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>

        {/* <View style={styles.space20}></View> */}
        <SafeAreaView>
          <ChatComponent index_val={index} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default ChatListing;
