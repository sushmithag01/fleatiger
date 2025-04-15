import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from "../Common.css"
import Entypo from "react-native-vector-icons/Entypo"
import Svg, { Path, G, Defs, ClipPath, Circle, Mask, Pattern, Use, xlinkHref, style } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons"
import Profile from './Profile';
import TopHeader from './TopHeader';
import { GetActivitiesApi, GetDashboardApi, chatHighlightApi } from './API/ApiCalls';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Grid from 'react-native-grid-component';
import Toast from 'react-native-root-toast';
import ErrorText from './ErrorText/ErrorText';
import ProfileScreen from './CommonScreens/ProfileScreen';
import Loader from './CommonScreens/Loader';
import { ActiveTimeHeaderRight, ActivitiesHeaderLeft, CommonHeaderRight } from '../navigation/CustomBackNavigation';

const Activities = ({ navigation, route }) => {
  const { dateClicked } = route.params;

  // const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [DateToShow, setDateToShow] = useState('');

  const [ActivitiesCount, setActivitiesCount] = useState([])
  const [TotalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)



  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const currentDate = year + '-' + month + '-' + date;
  console.log(currentDate, "currentDate")
  const [chatNotify, setChatnotify] = useState(0);

  useEffect(() => {
    notificationHilightHandler();
  }, [isFocused,chatNotify])


  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <ActivitiesHeaderLeft navigation={navigation} />,
        headerRight: () => <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />,
      });
      setLoading(true)
      GetActivitiesData()
    }
  }, [isFocused, chatNotify]);

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

  // get data
  const GetActivitiesData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');


    const payload = {
      "user_id": UserID,
      "pet_id": PetId,
      time: dateClicked == undefined ? currentDate : dateClicked
    };

    // console.log(payload, "payload")
    const Response = await GetActivitiesApi(payload);
    // console.log(Response, "Response")
    if (Response.success == true) {
      setLoading(false)
      // Toast.show(Response.message, {
      //   duration: Toast.durations.LONG,
      //   position: 50,
      //   shadow: false,
      //   animation: true,
      //   hideOnPress: true,
      //   delay: 0,
      //   backgroundColor: '#fff',
      //   textColor: '#000'
      // });
      // console.log(Response?.data, "Response?.data")
      setActivitiesCount(Response?.data);
      setTotalCount(Response?.data?.length)

      // const DateValue = new Date(Response?.data[0]?.time);
      // const shortMonth =
      //   DateValue.toLocaleString('en-US', {
      //     month: 'short',
      //   });
      // const day = DateValue.toLocaleString(
      //   'en-US',
      //   {
      //     day: 'numeric',
      //   },
      // );
      // const year = DateValue.toLocaleString(
      //   'en-US',
      //   {
      //     year: 'numeric',
      //   },
      // );
      // const formattedDate = day+ ' ' +  shortMonth + ' ' + year;
      // console.log(formattedDate,"formattedDate",day,date)
      //   if(day != date){
      //     setDateToShow(formattedDate)
      //   }else{
      //     setDateToShow('Today')
      //   }    
    } else {
      setLoading(false)
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000'
      });
      setTotalCount(0)
    }

  };

  const renderItemActivitiesList = (item, i) => {
    const TimeVAl = item.duration;
    const getTime = TimeVAl.split(':')
    // console.log(getTime,"getTime")
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AddActivity', {
            screen: 'CompletedActivity', params: {
              item: item,
              dateClicked: dateClicked == undefined ? currentDate : dateClicked,
              status: ''
            }
          })
        }}
      >
        <View style={styles.listGridActivities} key={i}>

          <View style={styles.homecardinner}>
            <Text style={styles.homecardtext1}>{item.activity_type_name}</Text>
            <View style={styles.aligncenter}>
              <View style={[styles.brownbtnActivities, styles.brownbtnaligncenter]}>
                {/* <Text style={styles.brownbtntext}>10 hr 30 min</Text> */}
                <Text style={styles.brownbtntext}>
                  {getTime[0] == "00" ? "00" : `${getTime[0]}`}:{getTime[1] == "00" ? "00" : `${getTime[1]}`}</Text>

              </View>
            </View>
            <View style={styles.space10}></View>
            <Image
              // source={require('../assets/profile.png')}
              style={[styles.activityImg]}
              source={{ uri: item.activity_image_path }}
            ></Image>
          </View>

        </View>
      </TouchableOpacity>
    )
  }

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        {/* <TopHeader /> */}
        <View style={styles.space20}></View>
        <ProfileScreen />
        <Text style={styles.familytext}>Family Member</Text>
        <View>
          <View style={styles.space20}></View>
          <Text style={styles.maintitle}>Activities</Text>
        </View>
        <View style={styles.homecardinner1}>
          <Text style={styles.homecardtext1}>Today</Text>
          <Text style={styles.forgotcontent2}>{TotalCount == '' ? 0 : TotalCount} out of 4 completed</Text>

          <View style={styles.aligncenter}>
            {TotalCount == 0 ? <View>
              <View style={[styles.activitymain, styles.actmain]}>
                <Text style={styles.activityunfill}></Text>
                <Text style={styles.activityunfill}></Text>
              </View>
              <View style={styles.activitymain}>
                <Text style={styles.activityunfill}></Text>
                <Text style={styles.activityunfill}></Text>
              </View>
            </View> :
              <View style={styles.aligncenter}>

                {TotalCount == 0 && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}

                {TotalCount == 1 && (
                  <View style={styles.activitiesView}>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}

                {TotalCount == 2 && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {TotalCount == 3 && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {TotalCount == 4 && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                  </View>
                )}
              </View>
            }
          </View>


        </View>
        <View style={styles.space20}></View>

        {/* <Text style={[styles.homecardtext1,styles.padhoz15]}>
    View {DateToShow == 'Today' ? `Today's` : DateToShow} Activities</Text> */}
        <Text style={[styles.homecardtext1, styles.padhoz15]}>View Today's Activities</Text>
        {TotalCount == 0 ? <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
          <Text style={styles.forgotcontent2}>{ErrorText.NoAcitivity}</Text>
        </View> :
          <Grid
            style={styles.list}
            renderItem={renderItemActivitiesList}
            data={ActivitiesCount}
            numColumns={2}
          />
        }
        <View style={styles.space30}></View>

        <View>
          {/* {TotalCount == 0 ? <TouchableOpacity
            style={styles.bluebtnsmallDiscover}
            name="AddActivity"
            onPress={() => navigation.navigate('AddActivity', { screen: 'AddActivity' })}>
            <Text style={styles.bluebtnsmalltextDiscover}>Add Activities</Text>
          </TouchableOpacity>
            : */}
            <TouchableOpacity
              style={styles.bluebtnsmallDiscover}

              onPress={() => navigation.navigate('AddActivity', { screen: 'DiscoverActivities' })}>
              <Text style={styles.bluebtnsmalltextDiscover}>Discover More</Text>
            </TouchableOpacity>
            {/* } */}
        </View>
        <View style={styles.space50}></View>


      </ScrollView>
    </>
  )
}

export default Activities