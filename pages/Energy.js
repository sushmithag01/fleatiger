import React, {useEffect, useState} from 'react';
import {Tab, TabView} from '@rneui/themed';
import {Text, View, Image, ScrollView, TouchableOpacity} from 'react-native';
import styles from '../Common.css';
import MeHome from './MeHome';
import Profile from './Profile';
import MyEnergy from './MyEnergy';
import MySuggestedDiet from './MySuggestedDiet';
import TopHeader from './TopHeader';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  GetDashboardApi,
  GetTotalEnergyApi,
  userSubscriptionInfoApi,
} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorText from './ErrorText/ErrorText';
import ProfileScreen from './CommonScreens/ProfileScreen';
import Loader from './CommonScreens/Loader';
import {
  CommonHeaderRight,
  EnergyHeaderLeft,
  EnergyHeaderRight,
} from '../navigation/CustomBackNavigation';
import MotivationalMessage from './Popups/MotivationalMessage';
import moment from 'moment-timezone';

const Energy = ({navigation, route}) => {
  const {dateClicked} = route.params;
  const currentTimeZone = moment.tz.guess();
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [EnergyData, setEnergyData] = useState([]);
  const [FoodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [foodDietPlan, setFoodDietPlan] = useState('');
  const [chatNotify, setChatnotify] = useState(0);
  const MessagePop = 'Upgrade your plan to use this feature';
  const [ShowPopUp, setShowPopUp] = useState(false);

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <EnergyHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      setLoading(true);
      // GetDashboard();
      GetEnergyData();
      handleSubscriptionInfo();
      notificationHilightHandler();
    }
  }, [isFocused, chatNotify]);

  // hightlight chat based on unread notification
  const notificationHilightHandler = async () => {
    let payload = {
      pet_id: parseInt(await AsyncStorage.getItem('PetId')),
      user_id: await AsyncStorage.getItem('userId'),
      notify_type_id: 'chat',
    };
    const gethiglight = await chatHighlightApi(payload);
    setChatnotify(gethiglight.data.length > 0 ? 1 : 0);
  };

  const handleSubscriptionInfo = async () => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    const getUserSubscriptionPlan = await userSubscriptionInfoApi(payload);
    if (getUserSubscriptionPlan.status === 200) {
      if (
        getUserSubscriptionPlan.data.subscription_info
          .func_diet_recommendation === 1
      ) {
        setFoodDietPlan(
          getUserSubscriptionPlan.data.subscription_info
            .func_diet_recommendation,
        );
      } else {
        setShowPopUp(true);
      }
    } else {
      setFoodDietPlan('');
    }
  };

  const GetDashboard = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      id: PetId,
      // user_id: 53,
      // id: 126,
      timezone : currentTimeZone
    };
    const Response = await GetDashboardApi(payload);
    if (Response == false) {
      setLoading(false);
      Toast.show(ErrorText.InternalError, {
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
      if (Response.success == true) {
        setLoading(false);
        setData(Response.data[0]);
      } else {
        setLoading(false);
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
      }
    }
  };

  const GetEnergyData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const currentDate = year + '-' + month + '-' + date;
    console.log(currentDate, 'currentDate');

    const payload = {
      user_id: UserID,
      pet_id: PetId,
      // "user_id" : 53,
      // "pet_id":127,
      current_date: dateClicked == undefined ? currentDate : dateClicked,
      timezone_str : currentTimeZone
    };

    const Response = await GetTotalEnergyApi(payload);
    // console.log(Response, 'pteeettt');
    setLoading(false);
    setEnergyData(Response);
    setFoodData(Response.food_category_grams);
  };

  const [index, setIndex] = useState(0);

  const handleViewProfile = id => {
    console.log(id, 'mypetzid');
    AsyncStorage.setItem('PetId', JSON.stringify(id));
    navigation.navigate('HomeStackNavigator', {screen: 'Home'});
  };

  // console.log('ShowPopUp', ShowPopUp);
  const handleClosePopUp = () => {
    setShowPopUp(false);
    setIndex(0);
  };
  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <View style={styles.mainpage}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        {/* <TopHeader/> */}
        <View style={styles.space30}></View>

        <View style={styles.tabmain1}>
          <ProfileScreen />
          <Text style={styles.familytext}>Family Member</Text>
          <View style={styles.space50}></View>
          {/* <TouchableOpacity onPress={()=>handleViewProfile(data.id)}>
    <ProfileScreen/>
    <Text style={styles.familytext}>Family Member</Text>
    <View style={styles.space20}></View>
    </TouchableOpacity> */}
        </View>

        <View style={styles.tabmain2}>
          <Tab
            value={index}
            onChange={e => [setIndex(e), setShowPopUp(true)]}
            indicatorStyle={{
              backgroundColor: '#495F75',
            }}>
            <Tab.Item
              title="Energy"
              titleStyle={active => ({
                fontSize: 12,
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 25,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#CED4D8',
                padding: 2,
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
                padding: 0,
                margin: 0,
              })}
            />

            <Tab.Item
              title="Food"
              titleStyle={active => ({
                fontSize: 12,
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 25,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#CED4D8',
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
              })}
            />
          </Tab>

          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{backgroundColor: '#fff', flex: 1}}>
              <MyEnergy EnergyData={EnergyData} />
            </TabView.Item>
            <TabView.Item style={{backgroundColor: '#fff', width: '100%'}}>
              {index === 1 && foodDietPlan > 0 ? (
                <MySuggestedDiet
                  FoodData={FoodData}
                  loading={loading}
                  setLoading={setLoading}
                  foodDietPlan={foodDietPlan}
                />
              ) : index === 1 && foodDietPlan <= 0 ? (
                <>
                  {ShowPopUp ? (
                    <MotivationalMessage
                      MessagePop={MessagePop}
                      congratsMsg={ShowPopUp}
                      setCongratsMsg={handleClosePopUp}
                      status="activity"
                    />
                  ) : null}
                </>
              ) : null}
            </TabView.Item>
          </TabView>
        </View>
      </View>
    </>
  );
};

export default Energy;
