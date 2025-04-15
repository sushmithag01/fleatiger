import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from "../Common.css"
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { CompareFamilyApi, GetDashboardApi, getSiblingListApi } from './API/ApiCalls';
import Svg, { Path, G, Defs, ClipPath, Circle, Mask, Pattern, Use, xlinkHref, style } from "react-native-svg";
import Grid from 'react-native-grid-component';
import ProfileScreen from './CommonScreens/ProfileScreen';
import { CompareHeaderLeft } from '../navigation/CustomBackNavigation';
import moment from 'moment-timezone';

const Compare = (props) => {
  // const{getPetId} = props;
  const currentTimeZone = moment.tz.guess();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [OtherPetdata, setOtherPetData] = useState([]);

  const [ActivePetId, setActivePetId] = useState('')
  const [SiblingName, setSiblingName] = useState('')
  const [SiblingId, setSiblingId] = useState('')

  //  const[activePet_activeTime,setactivePet_activeTime]
  const [health, setHealth] = useState([])
  const [activeTime, setActiveTime] = useState([])
  const [activity, setActivity] = useState([])
  const [energy, setEnergy] = useState([])
  const isFocused = useIsFocused()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CompareHeaderLeft navigation={navigation} />,

    });
    if (isFocused) {
      GetSiblingList()
    }
  }, [isFocused])


  const GetSiblingList = async () => {
    const UserID = await AsyncStorage.getItem('userId')
    const PetId = await AsyncStorage.getItem('PetId')
    const Seldate = await AsyncStorage.getItem('selectedDate')
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const currentDate = year + '-' + month + '-' + date;
    const payload = {
      "user_id": parseInt(UserID),
      "user_pet_id": parseInt(PetId),
      'date': Seldate ? Seldate : currentDate,
      timezone : currentTimeZone
    }
    // console.log(payload, "payload")
    const Response = await CompareFamilyApi(payload)
    // console.log("Response",Response)
    setHealth(Response?.data?.healthScore)
    setActiveTime(Response?.data?.activeTime)
    setActivity(Response?.data?.activities)
    setEnergy(Response?.data?.energy)
  }

  const renderItem = (item, i) => (
    <View style={styles.listGrid} key={i}>
      <View >
        {i % 2 == 0 ? (
          <View >
            <View style={styles.aligncenter} >
              <Image
                source={{ uri: item?.petImg }}
                style={[styles.ProfileLogo, styles.addupload]}></Image>
              <Text style={styles.comparetext}>{item?.petname}</Text>
            </View>
            {/* <View style={styles.homecardvalueSmallCompare}>
                    <Text style={styles.homecardNoSmallCompare}>{item?.petHealthscore}</Text>   
                 </View>  */}
            <View style={{ alignItems: "center",   marginTop: 10, }}>
              <Text style={styles.homecardvalue}>{item?.petHealthscore}</Text>
            </View>


          </View>
        ) : (
          <View >
            <View style={styles.aligncenter}>
              <Image
                source={{ uri: item?.petImg }}
                style={[styles.ProfileLogo, styles.addupload]}></Image>
              <Text style={styles.comparetext}>{item?.petname}</Text>

            </View>
            {/* <View style={styles.homecardvalueSmallCompare}>
                    <Text style={styles.homecardNoSmallCompare}>{item?.petHealthscore}</Text>   
                 </View>  */}
            <View style={{ alignItems: "center",   marginTop: 10, }}>
              <Text style={styles.homecardvalue}>{item?.petHealthscore}</Text>
            </View>

          </View>
        )}
      </View>

      {/* <View style={styles.homecardvalueSmallCompare}>
      <Text style={styles.homecardNoSmallCompare}>{item?.petHealthscore}</Text>
      </View> */}

    </View>
  );

  // active-time  
  const renderItemActiveTime = (item, i) => (
    <View style={styles.listGrid} key={i}>
      <View style={styles.aligncenter}>
        <Image source={{ uri: item?.petImg }}
          style={[styles.ProfileLogo, styles.addupload]}></Image>
        <Text style={styles.comparetext}>{item?.petname}</Text>
      </View>
      <Text style={styles.homecardvalue}>{item?.petActiveTime}</Text>
    </View>
  );

  // activities
  const renderItemActivities = (item, i) => (


    <View style={styles.listGrid} key={i}>
      <View style={styles.aligncenter}>
        <Image source={{ uri: item?.petImg }}
          style={[styles.ProfileLogo, styles.addupload]}></Image>
        <Text style={styles.comparetext}>{item?.petname}</Text>
        <View>

          {item.petActivities == 0 && (
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

          {item?.petActivities == 1 && (
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

          {item.petActivities == 2 && (
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
          {item.petActivities == 3 && (
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
          {item?.petActivities >= 4 && (
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
        <View style={styles.space20}></View>
        <View style={styles.space10}></View>
      </View>
    </View>

  );

  // energy
  const renderItemEnergy = (item, i) => (
    <View style={styles.listGrid} key={i}>
      <View style={styles.aligncenter}>
        <Image source={{ uri: item?.petImg }}
          style={[styles.ProfileLogo, styles.addupload]}></Image>
        <Text style={styles.comparetext}>{item?.petname}</Text>
      </View>
      {/* <View style={styles.energy}> */}
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 116 57"
        width={116}
        height={57}
      >
        <Path
          id="bones-pet-svgrepo-com"
          d="M102.9 36.8q0-1-.1-2-.2-.9-.5-1.8-.3-1-.7-1.8-.4-.9-.9-1.7.5-.8.9-1.7.4-.8.6-1.8.3-.9.4-1.8.1-1 .1-1.9c0-1.8-.4-3.5-1.1-5.1-.7-1.6-1.7-3.1-2.9-4.3-1.3-1.3-2.7-2.3-4.4-3-1.6-.7-3.3-1-5.1-1.1-1.5 0-3 .2-4.4.7-1.4.5-2.8 1.3-4 2.2-1.1 1-2.1 2.2-2.9 3.5-.7 1.3-1.2 2.7-1.5 4.2l-37.6-.6c-.3-1.5-.9-3-1.7-4.3-.8-1.3-1.8-2.5-3-3.5-1.1-1-2.5-1.8-3.9-2.4-1.5-.5-3-.8-4.6-.8-1.7-.1-3.4.2-5 .9-1.6.6-3.1 1.6-4.3 2.8-1.2 1.2-2.1 2.6-2.8 4.2-.6 1.6-.9 3.4-.9 5.1q0 .9.2 1.9.1 1 .4 1.9.3.9.7 1.8.5.9 1 1.7-.5.8-.9 1.6-.4.9-.7 1.8-.2.9-.3 1.9-.2.9-.1 1.9c0 1.7.4 3.5 1.1 5.1.7 1.6 1.6 3.1 2.9 4.3 1.2 1.2 2.7 2.2 4.3 2.9 1.6.7 3.4 1.1 5.1 1.1 1.5.1 3-.2 4.5-.7 1.4-.5 2.7-1.2 3.9-2.2 1.2-.9 2.2-2.1 2.9-3.4.8-1.3 1.3-2.8 1.5-4.3l37.6.7c.3 1.5.9 2.9 1.7 4.3.8 1.3 1.8 2.5 3 3.5s2.5 1.8 4 2.3c1.4.5 3 .8 4.5.9 1.7 0 3.5-.3 5.1-.9 1.6-.7 3-1.6 4.2-2.8 1.2-1.2 2.2-2.7 2.8-4.3.7-1.6 1-3.3.9-5z"
          fill="#9bbbbe"
        />
      </Svg>
      {/* </View> */}
      <Text style={styles.caltext}>{item.petEnergy} Cals</Text>
      <View style={styles.space30}></View>

    </View>
  );

  return (
    <>
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        {/* <TopHeader /> */}
        <View style={styles.marginhz15}>
          <ProfileScreen />
          <Text style={styles.familytext}>Family Member</Text>
          <View style={styles.space20}></View>
        </View>

        <View style={styles.space20}></View>
        <View style={styles.space20}></View>


        <View style={styles.marginhz15}>
          <View>
            <Text style={[styles.homecardtext1, styles.padhoz15]}>Health Score</Text>
          </View>

          <View style={styles.homecardinner1}>
            <View style={styles.dflex}>
              <Grid
                style={styles.list}
                renderItem={renderItem}
                data={health}
                numColumns={2}
              />
            </View>
          </View>
        </View>

        <View style={styles.space20}></View>
        <View style={styles.marginhz15}>
          <View>
            <Text style={[styles.homecardtext1, styles.padhoz15]}>Active Time</Text>
          </View>
          <View style={styles.homecardinner1}>
            <View style={styles.dflex}>

              <Grid
                style={styles.list}
                renderItem={renderItemActiveTime}
                data={activeTime}
                numColumns={2}
              />
            </View>
          </View>
        </View>


        <View style={styles.space20}></View>
        <View style={styles.marginhz15}>
          <View>
            <Text style={[styles.homecardtext1, styles.padhoz15]}>Activities</Text>
          </View>
          <View style={styles.homecardinner1}>

            <View style={styles.dflex}>

              <Grid
                style={styles.list}
                renderItem={renderItemActivities}
                data={activity}
                numColumns={2}
              />
            </View>

          </View>
        </View>



        <View style={styles.space20}></View>

        <View style={styles.marginhz15}>
          <View>
            <Text style={[styles.homecardtext1, styles.padhoz15]}>Energy</Text>
          </View>
          <View style={styles.homecardinner1}>

            <View style={styles.dflex}>

              <Grid
                style={styles.list}
                renderItem={renderItemEnergy}
                data={energy}
                numColumns={2}
              />
            </View>

          </View>
        </View>
        {/* energy */}
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>



        {/* end */}

      </ScrollView>
    </>
  )
}
export default Compare;








