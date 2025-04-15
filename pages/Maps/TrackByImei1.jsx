import {
  Alert,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import TopHeader from '../TopHeader';
import styles from '../../Common.css';
import ProfileScreen from '../CommonScreens/ProfileScreen';
import {Circle} from 'react-native-animated-spinkit';
import {Stopwatch, Timer} from 'react-native-stopwatch-timer';
// import MapsTest from './MapsTest';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  AddActivityByImeiApi,
  GetDashboardApi,
  SendWaypointsAPI,
  TrackerApi,
} from '../API/ApiCalls';
import Toast from 'react-native-root-toast';
import MapViewDirections from 'react-native-maps-directions';
import Loader from '../CommonScreens/Loader';
import MapPathView from './MapPathView';
import NetInfo from '@react-native-community/netinfo';
import KeepAwake from 'react-native-keep-awake';
import InternetFailure from '../InternetFailure';
import moment from 'moment-timezone';

const TrackByImei = ({navigation, route}) => {
  const mapRef = React.useRef(null);
  const TrackerImei = route.params.State;
  const [StopSpinner, setStopSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timerStart, settimerStart] = useState(false);
  const [stopwatchStart, setstopwatchStart] = useState(false);
  const [stopwatchReset, setstopwatchReset] = useState(false);
  const [currentTime, setcurrentTime] = useState('');
  const [hasTrackerCoordinates, setHasTrackerCoordinates] = useState(false);
  // maps
  const currentTimeZone = moment.tz.guess();
  const [isInternetReachable, setisInternetReachable] = useState(true);
  const [getCheckInternet, setCheckInternet] = useState(true);

  const [latitudeInitial, setlatitudeInitial] = useState(0);
  const [longitudeInitial, setlongitudeInitial] = useState(0);
  const [newCoordinates, setnewCoordinates] = useState([]);
  const [mapViewStatus, setMapViewStatus] = useState(false);

  const [latitudeFinal, setlatitudeFinal] = useState(0);
  const [longitudeFinal, setlongitudeFinal] = useState(0);

  const [distanceTravelled, setdistanceTravelled] = useState('');
  const [durationTravelled, setdurationTravelled] = useState('');

  const markerRef = useRef();

  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState('');

  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const isFocused = useIsFocused();

  useEffect(() => {
    KeepAwake.activate();
    if (isFocused) {
      getName();
      settimerStart(true);
      const unsubscribe = NetInfo.addEventListener(state => {
        console.log('state', state);
        setCheckInternet(state.isConnected);
        setisInternetReachable(state.isInternetReachable);
        // if (state.isConnected) {
        //   Alert.alert("online")
        //   console.log("state.isConnected", state.isConnected)
        //   // Trigger a re-render or some action here
        // }
        // else {
        //   Alert.alert("offline")
        // }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [
    isFocused,
    latitudeFinal,
    longitudeFinal,
    isInternetReachable,
    getCheckInternet,
    distanceTravelled,
  ]);

  const CurrentDateTime = new Date();
  const date = CurrentDateTime.getDate();
  const month = CurrentDateTime.getMonth() + 1;
  const year = CurrentDateTime.getFullYear();
  // hours
  const getHours =
    CurrentDateTime.getHours() <= 9
      ? `0${CurrentDateTime.getHours()}`
      : CurrentDateTime.getHours();
  // min
  const getMin =
    CurrentDateTime.getMinutes() <= 9
      ? `0${CurrentDateTime.getMinutes()}`
      : CurrentDateTime.getMinutes();
  // 2023-7-11 05:07
  const currentDate = year + '-' + month + '-' + date;
  const TimeValue = getHours + ':' + getMin;
  // console.log(currentDate + ' ' + TimeValue)

  const getName = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      id: parseInt(PetId),
      date: currentDate,
      timezone : currentTimeZone
    };
    const Response = await GetDashboardApi(payload);
    // console.log(Response?.data[0], 'profileApi');
    setPetName(Response?.data[0]?.pet_name);
    setPetImg(Response?.data[0]?.pet_image_path);
  };

  const toggleStopwatch = () => {
    // console.log("kkkkkk")
    setstopwatchStart(true);
    settimerStart(false);
    setStopSpinner(true);
  };

  const getFormattedTime = time => {
    // console.log("time",time)
    setcurrentTime(time);
    setdurationTravelled(time);
  };

  const options = {
    container: {
      backgroundColor: '#fff',
      padding: 5,
      borderRadius: 5,
      paddingTop: 10,
    },
    text: {
      color: '#495F75',
      fontFamily: 'Montserrat',
      fontWeight: '500',
      fontSize: 27,
    },
  };

  useEffect(() => {
    if (timerStart && !hasTrackerCoordinates) {
      handleStart();
      setHasTrackerCoordinates(true);
    }
    const interval = setInterval(() => {
      handleStart();
      // console.log('started')
    }, 20000);
    return () => clearInterval(interval);
  }, [
    timerStart,
    hasTrackerCoordinates,
    isInternetReachable,
    getCheckInternet,
  ]);

  const handleStart = async () => {
    // setLoading(true)
    try {
      // Make an API request to fetch coordinates from your tracker API
      const response = await TrackerApi(TrackerImei).finally(() => {
        setLoading(false);
      });
      // console.log("tracker response", response)
      if (response.code === 200) {
        let obj = {latitude: response.data.lat, longitude: response.data.lng};
        // mapRef?.current?.animateToRegion(
        //     {
        //         latitude: response.data.lat,
        //         longitude: response.data.lng,
        //         latitudeDelta: LATITUDE_DELTA,
        //         longitudeDelta: LONGITUDE_DELTA,
        //     },
        //     2000,
        // );
        setUserLocation({
          latitude: response.data.lat,
          longitude: response.data.lng,
        });
        setnewCoordinates(prevCoordinates => [...prevCoordinates, obj]);
        setlatitudeFinal(response.data.lat); // Transform latitude as needed
        setlongitudeFinal(response.data.lng); // Transform longitude as needed

        // Update the coordinates state with the new coordinate

        // console.log("[...coordinates, newCoordinate]", [...newCoordinates, obj])
      } else {
        console.error('API request failed:', response.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data from API:', error);
    }
  };
  const handleStop = async () => {
    setLoading(true);
    try {
      const UserID = await AsyncStorage.getItem('userId');
      const PetId = await AsyncStorage.getItem('PetId');

      toggleStopwatch();
      Geolocation.clearWatch();
      Geolocation.stopObserving();

      console.log('durationTravelled', durationTravelled);
      const durationTravelledArr = durationTravelled.split(':');
      console.log(
        'durationTravelledArr',
        durationTravelledArr[0] +
          ':' +
          durationTravelledArr[1] +
          ':' +
          durationTravelledArr[2],
      );
      const staticcoordinates = [
        {latitude: 0.0, longitude: 0},
        {latitude: 0.0, longitude: 0.0},
      ];
      const payload = {
        map_coordinates:
          newCoordinates && newCoordinates.length > 0
            ? newCoordinates
            : staticcoordinates,
        user_id: parseInt(UserID),
        user_pet_id: parseInt(PetId),
        time: currentDate + ' ' + TimeValue,
        //   duration: durationTravelledArr[1] + ':' + durationTravelledArr[2],
        duration: durationTravelled,
        //   distance: distanceTravelled ? parseFloat(distanceTravelled).toFixed(2) + ' ' + "km" : 0 + ' ' + "km"
      };
      console.log('payload', payload);
      const Response = await AddActivityByImeiApi(payload);
      console.log('Response', Response);
      if (Response.status === 200) {
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
        navigation.navigate('CompletedActivityTracker', {
          item: {activity_id: Response.data},
          dateClicked: currentDate,
          status: '',
        });
      } else {
        setLoading(false);
        Toast.show(
          'Something went wrong, please check your internet connection...!!',
          {
            duration: Toast.durations.LONG,
            position: 50,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: '#fff',
            textColor: '#000',
          },
        );
      }
    } catch (error) {
      console.log('error', error);
      Toast.show(
        'Something went wrong, please check your internet connection or restart your application...!!',
        {
          duration: Toast.durations.LONG,
          position: 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#fff',
          textColor: '#000',
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    console.log(newCoordinate, 'newCoordinate');
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      console.log('kk');
    }
  };

  return (
    <>
      {getCheckInternet && isInternetReachable ? (
        <>
          {loading ? <Loader loading={loading} /> : null}
          <SafeAreaView>
            {/* <TopHeader /> */}
            <View style={styles.space10}></View>
            <ProfileScreen />
            <Text style={styles.familytext}>Family Member</Text>
            <View style={styles.space10}></View>

            <View style={styles.cardsShadow}>
              <View style={styles.cardsShadowInner}>
                <View
                  style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
                  <Text style={styles.recText}>Recording in progress</Text>
                  {/* spinner */}
                  {StopSpinner == true ? (
                    ''
                  ) : (
                    <View>
                      <Circle size={33} color="#9BBBBE" />
                    </View>
                  )}
                </View>
                <View style={styles.space10}></View>
                {/* <Image source={require('../../assets/dog1.png')} style={styles.dogimg1}>
        </Image>  */}
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={{
                    latitude:
                      newCoordinates.length > 0
                        ? newCoordinates[0].latitude
                        : 0,
                    longitude:
                      newCoordinates.length > 0
                        ? newCoordinates[0].longitude
                        : 0,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                  zoomEnabled={true}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  userLocationCalloutEnabled={true}
                  showsCompass={true}
                  followsUserLocation={true}
                  enableHighAccuracy={true}>
                  {/* {newCoordinates.length > 1 && (
                                <Polyline
                                    coordinates={newCoordinates}
                                    strokeColor="#FF0000"
                                    strokeWidth={2}
                                />
                            )} */}
                  {newCoordinates.map((newCoordinates, index) => (
                    <Marker
                      key={index}
                      coordinate={newCoordinates}
                      title={`Marker ${index + 1}`}
                    />
                  ))}
                </MapView>

                {/* -------maps------- */}

                {/* ------- */}
                {/* timer */}
                <Stopwatch
                  start={timerStart}
                  reset={stopwatchReset}
                  options={options}
                  getTime={getFormattedTime}
                />
                <Text style={styles.recText}>Minutes</Text>
                <View style={styles.space10}></View>

                {/* stop text */}
                <TouchableOpacity
                  style={styles.stopRec}
                  onPress={() => {
                    handleStop();
                    setLoading(true);
                  }}>
                  <Text style={styles.stopRecText}>STOP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </>
      ) : (
        <InternetFailure />
      )}
    </>
  );
};

export default TrackByImei;
