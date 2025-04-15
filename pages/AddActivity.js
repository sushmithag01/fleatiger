import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GetDashboardApi,
  chatHighlightApi,
  userSubscriptionInfoApi,
} from './API/ApiCalls';
import ProfileScreen from './CommonScreens/ProfileScreen';
import Loader from './CommonScreens/Loader';
import {State} from 'react-native-gesture-handler';
import {
  AddActivityHeaderLeft,
  AddActivityHeaderRight,
  CommonHeaderRight,
  CompletedActivityHeaderLeft,
  CompletedActivityHeaderRight,
} from '../navigation/CustomBackNavigation';
import MotivationalMessage from './Popups/MotivationalMessage';
import ActivityProfileScreen from './CommonScreens/ActivityProfileScreen';

const AddActivity = props => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [trackerPlan, setTrackerPlan] = useState('');
  const [gpsPlan, setGpsPlan] = useState('');
  const [ShowPopUp, setShowPopUp] = useState(false);
  const [chatNotify, setChatnotify] = useState(0);
  const MessagePop = 'Upgrade your plan to use this feature';

  useEffect(() => {
    notificationHilightHandler();
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      navigation.setOptions({
        headerLeft: () => <AddActivityHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      handleSubscriptionInfo();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [isFocused, chatNotify, gpsPlan, trackerPlan]);

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
      setTrackerPlan(
        getUserSubscriptionPlan.data.subscription_info
          .func_track_activity_with_tracker,
      );
      setGpsPlan(
        getUserSubscriptionPlan.data.subscription_info
          .func_track_activity_with_gps,
      );
    } else {
      setTrackerPlan(0);
      setGpsPlan(0);
    }
  };

  const handleGPSTrack = data => {
    if (data) {
      if (trackerPlan > 0) {
        navigation.navigate('Maps', {pageName: 'trackByIMEI'});
      } else if (trackerPlan === 0) {
        setShowPopUp(true);
      }
    } else {
      if (gpsPlan > 0) {
        navigation.navigate('Maps', {pageName: 'trackByGPS'});
      } else if (gpsPlan === 0) {
        setShowPopUp(true);
      }
    }
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>
        {/* <View style={styles.space20}></View> */}
        <View style={styles.space20}></View>
        {/* <TopHeader/> */}
        <ActivityProfileScreen />
        <Text style={styles.familytext}>Family Member</Text>
        <View style={styles.space20}></View>

        <View style={[styles.homecardinner1, styles.homecardinner2]}>
          <View style={styles.act3}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width={70}
              height={70}>
              <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
              <Path
                d="M34.32 26.89l-8.06-6.8a3.494 3.494 0 00-4.51 0l-8.06 6.8a5.503 5.503 0 00-1.96 4.2c0 1.85.93 3.57 2.49 4.6l2.73 1.8c1.08.72 2.47.77 3.61.15l2.57-1.41c.55-.3 1.21-.3 1.76 0l2.57 1.41a3.5 3.5 0 003.61-.15l2.73-1.8a5.48 5.48 0 002.49-4.6c0-1.62-.71-3.15-1.96-4.2zM13.46 24.43c.21 0 .42-.03.62-.07 1.4-.33 2.45-1.78 2.45-3.52s-1.05-3.18-2.45-3.52c-.2-.05-.41-.07-.62-.07-.42 0-.83.1-1.19.28-.55.27-1.02.73-1.35 1.3a3.997 3.997 0 00-.52 2.01c0 1.24.54 2.33 1.35 2.98.49.39 1.08.61 1.71.61zM36.7 18.3c-.55-.65-1.32-1.05-2.17-1.05-1.69 0-3.06 1.61-3.06 3.59s1.37 3.59 3.06 3.59 3.06-1.61 3.06-3.59c0-.99-.34-1.89-.9-2.54zM19.53 18.05c.49 0 .95-.11 1.37-.31.42-.2.8-.49 1.12-.86.64-.72 1.03-1.72 1.03-2.82 0-2.2-1.58-3.99-3.53-3.99s-3.53 1.79-3.53 3.99 1.58 3.99 3.53 3.99zM28.39 18.05c1.95 0 3.53-1.79 3.53-3.99s-1.58-3.99-3.53-3.99c-.49 0-.95.11-1.37.31-.42.2-.8.49-1.12.86-.64.72-1.03 1.72-1.03 2.82 0 2.2 1.58 3.99 3.53 3.99z"
                fill="#223656"
                strokeWidth={0}
              />
            </Svg>
          </View>
          <View style={styles.space20}></View>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginLeft: 20,
            }}>
            <TouchableOpacity
              style={styles.bluebtnsmall1}
              onPress={() => handleGPSTrack(0)}>
              {/* <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height={30} width={30}>
                                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                                <Path
                                    d="M29.49 9H18.51c-1.41 0-2.56 1.15-2.56 2.56v24.88c0 1.41 1.15 2.56 2.56 2.56h10.98c1.41 0 2.56-1.15 2.56-2.56V11.56c0-1.41-1.15-2.56-2.56-2.56zm-1.31 1.82c.35 0 .63.28.63.63s-.28.63-.63.63-.63-.28-.63-.63.28-.63.63-.63zm-6.47.23h4.58c.22 0 .4.18.4.4s-.18.4-.4.4h-4.58c-.22 0-.4-.18-.4-.4s.18-.4.4-.4zM24 37.98c-.78 0-1.41-.63-1.41-1.41s.63-1.41 1.41-1.41 1.41.63 1.41 1.41-.63 1.41-1.41 1.41zm-6.3-3.97V13.99h12.6v20.03H17.7z"
                                    fill="#223656"
                                    strokeWidth={0}
                                />
                            </Svg> */}
              <Text style={styles.bluebtnsmalltext}>Track By Phone</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bluebtnsmall1}
              onPress={() => handleGPSTrack(1)}>
              {/* <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height={30} width={30}>
                                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                                <Path
                                    d="M38.37 18.94l-3.02-.73c-.77-1.02-2.14-1.71-3.71-1.71H16.35c-1.57 0-2.94.69-3.71 1.71l-3.02.73c-.36.09-.63.52-.63 1.02v8.09c0 .5.26.93.63 1.02l3.02.73c.77 1.02 2.14 1.71 3.71 1.71h15.29c1.57 0 2.94-.69 3.71-1.71l3.02-.73c.36-.09.63-.52.63-1.02v-8.09c0-.5-.26-.93-.63-1.02zM23.96 28.99c-.56 0-1.01-.45-1.01-1.01s.45-1.01 1.01-1.01 1.01.45 1.01 1.01-.45 1.01-1.01 1.01zm2.73-2.27c-.14.14-.33.2-.52.2-.2 0-.4-.08-.55-.23-.03-.03-.05-.06-.07-.08-.89-.87-2.35-.87-3.25.02-.3.29-.78.29-1.07 0a.758.758 0 01.01-1.08c1.5-1.49 3.94-1.47 5.43.03.03.03.05.05.07.08.13.15.2.33.19.53 0 .2-.09.39-.24.53zm1.88-1.86a.74.74 0 01-.53.21h-.02c-.2 0-.39-.09-.52-.23l-.04-.05a4.935 4.935 0 00-3.5-1.47h-.03c-1.32 0-2.55.51-3.49 1.43-.3.29-.78.29-1.07 0a.767.767 0 010-1.07c2.54-2.51 6.65-2.49 9.16.05.03.03.05.05.06.07.13.13.21.32.2.52 0 .2-.08.39-.23.54zm1.98-1.96a.74.74 0 01-.53.21H30c-.2 0-.39-.09-.52-.23l-.05-.06a7.706 7.706 0 00-5.46-2.29h-.04c-2.06 0-3.99.79-5.45 2.24a.75.75 0 01-.53.22.79.79 0 01-.54-.22.755.755 0 01-.22-.54c0-.2.08-.39.22-.54 3.63-3.59 9.51-3.56 13.1.07.03.03.05.06.07.08.13.13.2.31.2.52 0 .2-.08.39-.23.54z"
                                    fill="#223656"
                                    strokeWidth={0}
                                />
                            </Svg> */}
              <Text style={styles.bluebtnsmalltext}>Track By Tracker</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.homecardinner1, styles.homecardinner2]}>
          <View style={styles.act3}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width={70}
              height={70}>
              <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
              <Path
                d="M34.32 26.89l-8.06-6.8a3.494 3.494 0 00-4.51 0l-8.06 6.8a5.503 5.503 0 00-1.96 4.2c0 1.85.93 3.57 2.49 4.6l2.73 1.8c1.08.72 2.47.77 3.61.15l2.57-1.41c.55-.3 1.21-.3 1.76 0l2.57 1.41a3.5 3.5 0 003.61-.15l2.73-1.8a5.48 5.48 0 002.49-4.6c0-1.62-.71-3.15-1.96-4.2zM13.46 24.43c.21 0 .42-.03.62-.07 1.4-.33 2.45-1.78 2.45-3.52s-1.05-3.18-2.45-3.52c-.2-.05-.41-.07-.62-.07-.42 0-.83.1-1.19.28-.55.27-1.02.73-1.35 1.3a3.997 3.997 0 00-.52 2.01c0 1.24.54 2.33 1.35 2.98.49.39 1.08.61 1.71.61zM36.7 18.3c-.55-.65-1.32-1.05-2.17-1.05-1.69 0-3.06 1.61-3.06 3.59s1.37 3.59 3.06 3.59 3.06-1.61 3.06-3.59c0-.99-.34-1.89-.9-2.54zM19.53 18.05c.49 0 .95-.11 1.37-.31.42-.2.8-.49 1.12-.86.64-.72 1.03-1.72 1.03-2.82 0-2.2-1.58-3.99-3.53-3.99s-3.53 1.79-3.53 3.99 1.58 3.99 3.53 3.99zM28.39 18.05c1.95 0 3.53-1.79 3.53-3.99s-1.58-3.99-3.53-3.99c-.49 0-.95.11-1.37.31-.42.2-.8.49-1.12.86-.64.72-1.03 1.72-1.03 2.82 0 2.2 1.58 3.99 3.53 3.99z"
                fill="#223656"
                strokeWidth={0}
              />
            </Svg>
          </View>
          <View style={styles.space20}></View>
          <TouchableOpacity
            style={styles.bluebtnsmall}
            onPress={() => navigation.navigate('AddManually')}>
            <Text style={styles.bluebtnsmalltext}>Add Manually</Text>
          </TouchableOpacity>
        </View>
        {ShowPopUp == true ? (
          <MotivationalMessage
            MessagePop={MessagePop}
            congratsMsg={ShowPopUp}
            setCongratsMsg={setShowPopUp}
            status="activity"
          />
        ) : (
          ''
        )}
      </ScrollView>
    </>
  );
};

export default AddActivity;
