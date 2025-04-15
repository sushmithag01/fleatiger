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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import TopHeader from './TopHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LocationInfoAPI,
  LocationViewAPI,
  TrackerStatusApi,
} from './API/ApiCalls';
import {Switch} from '@rneui/themed';
import ProfileScreen from './CommonScreens/ProfileScreen';
import Loader from './CommonScreens/Loader';
import Toast from 'react-native-root-toast';
import {MyLocationHeaderLeft} from '../navigation/CustomBackNavigation';
import TrackerStatusComponent from './Components/TrackerStatusComponent';
import moment from 'moment-timezone';

const MyLocation = props => {
  // const{getPetId} = props;
  const navigation = useNavigation();
  const currentTimeZone = moment.tz.guess();
  const [trackerStatusData, setTrackerStatusData] = useState('');
  const [trackerStatusDataErr, setTrackerStatusErr] = useState('');
  const [checked, setChecked] = useState(false);
  const [checkedPublic, setCheckedPublic] = useState(false);

  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <MyLocationHeaderLeft navigation={navigation} />,
      });
      setLoading(true);
      GetLocationInfo();
      handleTrackerStatus();
    }
  }, [isFocused]);

  const handleTrackerStatus = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      timezone: currentTimeZone,
    };
    const ResponseData = await TrackerStatusApi(payload);
    if (ResponseData.status === 200) {
      setTrackerStatusData(ResponseData.data);
    } else {
      setTrackerStatusErr(ResponseData.message);
    }
  };

  const GetLocationInfo = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
    };

    const Response = await LocationViewAPI(payload);
    if (Response.success == true) {
      // console.log(Response.data[0]);
      setLoading(false);
      // tracker-btn
      if (Response.data[0].tracker == 0) {
        setChecked(false);
      } else {
        setChecked(true);
      }
      // public-btn
      if (Response.data[0].location == 0) {
        setCheckedPublic(false);
      } else {
        setCheckedPublic(true);
      }
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
  };

  const Tracker = async value => {
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      tracker: value == false ? 0 : 1,
      location: checkedPublic == false ? 0 : 1,
      toggle_type: 'tracker',
    };
    // console.log(payload);
    const Response = await LocationInfoAPI(payload);
    // console.log(Response, 'location info');
    if (Response.success == true) {
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
  };

  const PublicLocation = async value => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
      tracker: checked == false ? 0 : 1,
      location: value == false ? 0 : 1,
      toggle_type: 'location',
    };
    // console.log(payload);
    const Response = await LocationInfoAPI(payload);
    // console.log(Response, 'location info');
    if (Response.success == true) {
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
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <TopHeader />
        <View style={styles.marginhz15}>
          <View style={styles.space20}></View>
          <ProfileScreen />
          <Text style={styles.familytext}>Family Member</Text>
        </View>

        <View style={styles.space50}></View>
        <View style={styles.marginhz15}>
          <View style={styles.homecardinner1}>
            <Text style={[styles.homecardtext1]}>Allow device tracking </Text>
            <Text style={styles.comparetext1}>
              This is necessary if you would like to track activities using the
              tracking device
            </Text>
            <View style={styles.space20}></View>
            <View style={styles.aligncenter}>
              <Switch
                value={checked}
                onValueChange={value => {
                  setChecked(value);
                  Tracker(value);
                }}
                color="#436077"
              />
            </View>
          </View>
        </View>

        <View style={styles.space20}></View>
        <View style={styles.marginhz15}>
          <View style={styles.homecardinner1}>
            <Text style={[styles.homecardtext1]}>Public location</Text>
            <Text style={styles.comparetext1}>
              Set your location to public if you would like your friends to view
              your location
            </Text>
            <View style={styles.space20}></View>
            <View style={styles.aligncenter}>
              <Switch
                value={checkedPublic}
                onValueChange={value => {
                  setCheckedPublic(value);
                  PublicLocation(value);
                }}
                color="#436077"
              />
            </View>
          </View>
        </View>

        <View style={styles.space20}></View>
        <TrackerStatusComponent trackerStatusData={trackerStatusData} />
      </ScrollView>
    </>
  );
};
export default MyLocation;
