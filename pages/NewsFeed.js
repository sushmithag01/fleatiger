import React, { useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from "../Common.css"
import Entypo from "react-native-vector-icons/Entypo"
import Svg, { Path, G, Defs, ClipPath, Circle, Mask, Pattern, Use, xlinkHref, style } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons"
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import { NewsfeedAPI, chatHighlightApi } from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import Loader from './CommonScreens/Loader';
import LoadMore from './LoadMore';
import ErrorText from './ErrorText/ErrorText';
import NewsfeedList from './NewsfeedList';
import { CommonHeaderRight, NewRequestHeaderRight, NewsFeedHeaderLeft } from '../navigation/CustomBackNavigation';

const NewsFeed = props => {
  const navigation = useNavigation();

  const [newsfeedData, setNewsfeedData] = useState([])
  const [loading, setLoading] = useState(false)

  const [EndOfList, setEndOfList] = useState(false)

  const [offset, setOffset] = useState(1);

  const scrollRef = useRef(null);

  const onPressTouch = () => {
    return (
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
    )
  }

  const isFocused = useIsFocused();
  const [chatNotify, setChatnotify] = useState(0);

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <NewsFeedHeaderLeft navigation={navigation} />,
        headerRight: () => <CommonHeaderRight navigation={navigation} chatNotify={chatNotify}/>,
      })
      setLoading(true)
      GetNewsfeedData()
      notificationHilightHandler();
    }
  }, [isFocused,chatNotify])
  // hightlight chat based on unread notification
  const notificationHilightHandler = async () => {
    let payload = {
      pet_id: parseInt(await AsyncStorage.getItem("PetId")),
      user_id: await AsyncStorage.getItem("userId"),
      notify_type_id: "chat"
    }
    const gethiglight = await chatHighlightApi(payload);
    setChatnotify(gethiglight.data.length > 0 ? 1 : 0)
  }


  const GetNewsfeedData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      "page_no": 1,
      "limit": 5
    };
    const Response = await NewsfeedAPI(payload);
    if (Response == false) {
      setLoading(false)
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
      setNewsfeedData([])
    } else {
      setLoading(false)
      setNewsfeedData(Response?.data);
    }
  };

  // load more
  useEffect(() => {
    GetFeedData()
  }, [offset])

  const GetFeedData = async () => {
    setLoading(true)
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      user_pet_id: parseInt(PetId),
      "page_no": offset,
      "limit": 5
    };
    setLoading(false)
    const Response = await NewsfeedAPI(payload);
    if (Response == false) {
      setLoading(false)
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    } else if (Response.data.length == 0) {
      setLoading(false)
      setEndOfList(true)
    } else {
      setLoading(false)
      setNewsfeedData([...newsfeedData, ...Response?.data]);
    }
  };



  return (
    <>

      {loading ? <Loader loading={loading} /> : ''}
      <View style={styles.mainpage}>
        {/* <TopHeader/> */}
        <View style={styles.newsfeedhead}>
          <Text style={[styles.maintitle, styles.newsfeedhead1]}>What are my friends up to</Text>
          <TouchableOpacity style={[styles.brownbtn, styles.newsfeedhead2]}
            onPress={() => navigation.navigate('AllFriends')}>
            <Text style={styles.brownbtntext}>All Friends</Text>
          </TouchableOpacity>
        </View>

        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>

          {newsfeedData && newsfeedData.length == 0 ? (
            <View>
              <Text style={styles.nodatatext}>{ErrorText.NoData}</Text>
            </View>
          ) : (
            <View>
              {newsfeedData && newsfeedData.map((eachItem, key) => {
                return (
                  <NewsfeedList eachItem={eachItem} GetNewsfeedData={GetNewsfeedData} />
                )
              })}
            </View>
          )}



          <View style={styles.space20}></View>

          {newsfeedData && newsfeedData.length === 0 ? '' :
            <LoadMore onPressTouch={onPressTouch}
              setOffset={setOffset}
              offset={offset}
              EndOfList={EndOfList} />
          }
        </ScrollView>
        <View style={styles.space50}></View>

      </View>

    </>
  )
}

export default NewsFeed