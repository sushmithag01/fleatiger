{
  /* <script src="http://localhost:8097"></script> */
}
import React, {useEffect, useState, useRef} from 'react';
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
  Platform,
  TouchableOpacity,
  AppState,
} from 'react-native';
import TopHeader from '../TopHeader';
import styles from '../../Common.css';
import ProfileScreen from '../CommonScreens/ProfileScreen';
import {Circle} from 'react-native-animated-spinkit';
//import {Stopwatch, Timer} from 'react-native-stopwatch-timer';
// import MapsTest from './MapsTest';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
//import Geolocation from '@react-native-community/geolocation';
import moment from 'moment-timezone';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {GetDashboardApi, SendWaypointsAPI} from '../API/ApiCalls';
import Toast from 'react-native-root-toast';
import MapViewDirections from 'react-native-maps-directions';
import Loader from '../CommonScreens/Loader';
import NetInfo from '@react-native-community/netinfo';
import KeepAwake from 'react-native-keep-awake';
import InternetFailure from '../InternetFailure';
import Moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';
import BackgroundActions from 'react-native-background-actions';
import {
  MapRecordingHeaderLeft,
  MapRecordingHeaderRight,
} from '../../navigation/CustomBackNavigation';
import ActivityNameType from '../Popups/ActivityNameType';
import ActivityProfileScreen from '../CommonScreens/ActivityProfileScreen';
// const sleep = (time: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const MapsRecording = ({navigation, route}) => {
  const mapRef = React.useRef(null);
  const data = route.params.data;
  const currentTimeZone = moment.tz.guess();
  const startActivityBy = route.params.startActivityBy;
  const startActivityTime = route.params.startActivityTime;
  const travelMode = 'walking'; // Change this to 'walking', 'driving' or 'bicycling' as needed

  const [StopSpinner, setStopSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timerStart, settimerStart] = useState(true);
  const [stopwatchStart, setstopwatchStart] = useState(false);
  const [stopwatchReset, setstopwatchReset] = useState(false);
  const [currentTime, setcurrentTime] = useState('');
  const [isInternetReachable, setisInternetReachable] = useState(true);
  // maps

  const [latitudeInitial, setlatitudeInitial] = useState(0);
  const [longitudeInitial, setlongitudeInitial] = useState(0);
  const [coordinates, setcoordinates] = useState([]);

  const [latitudeFinal, setlatitudeFinal] = useState(0);
  const [longitudeFinal, setlongitudeFinal] = useState(0);

  const [distanceTravelled, setdistanceTravelled] = useState('');
  const [durationTravelled, setdurationTravelled] = useState('');

  const markerRef = useRef();

  const [getCheckInternet, setCheckInternet] = useState(true);

  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState(null);
  const [static_coordinates, setStatictCoordinates] = useState([]);
  const [userLocation, setUserLocation] = useState({});

  const [initialLocationFetched, setInitialLocationFetched] = useState(false);

  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const isFocused = useIsFocused();

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentAppstate, setCurrentState] = useState('active');
  const staticcoordinates = {latitude: 0.0, longitude: 0.0};
  const CurrentDateTime = new Date();
  const date = CurrentDateTime.getDate();
  const month = CurrentDateTime.getMonth() + 1;
  const year = CurrentDateTime.getFullYear();

  // stopwatch
  const [time, setTime] = useState(0); // time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const backgroundStartTime = useRef(0);

  const [selectedMeasureUnit, setSelectedMeasureUnit] = useState('');

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

  let playing = BackgroundActions.isRunning();
  const [watchTime, setWatchTime] = useState('');

  useEffect(() => {
    if (timerStart) {
      navigation.setOptions({
        headerLeft: () => <MapRecordingHeaderLeft navigation={navigation} />,
      });
      toggleBackground();
    }
    return () => BackgroundActions.stop();
  }, [timerStart]);

  const startWatch = () => {
    setIsRunning(true);
    const startTime = Date.now() - time; // Adjust time to continue from the last point

    intervalRef.current = BackgroundTimer.setInterval(() => {
      setTime(Date.now() - startTime); // Update the time state
    }, 10); // Update every 10 ms for precision
  };

  // Convert milliseconds to hh:mm:ss:ms format
  const StopWatchformatTime = milliseconds => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10); // two-digit ms

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // :${ms
    // .toString()
    // .padStart(2, '0')}
  };

  const optionsTask = {
    taskName: 'trackingTask',
    taskTitle: 'Tracking Task',
    taskDesc: 'Running in the background',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#436077',
    parameters: {
      delay: 1000, // Interval in milliseconds
    },
  };

  const trackingTask = async taskData => {
    await new Promise(async resolve => {
      // For loop with a delay
      const {delay} = taskData;
      // console.log(BackgroundActions.isRunning(), delay);
      for (let i = timeElapsed; BackgroundActions.isRunning(); i++) {
        // console.log('Runned -> ', i);
        setTimeElapsed(i);
        await BackgroundActions.updateNotification({
          taskDesc: 'Tacking activity running in the background',
        });
        await sleep(delay);
      }
    });
  };

  const toggleBackground = async () => {
    playing = !playing;
    if (playing) {
      try {
        console.log('Trying to start background service');
        await BackgroundActions.start(trackingTask, optionsTask);
        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundActions.stop();
    }
  };

  useEffect(() => {
    KeepAwake.activate();
    if (isFocused) {
      getName();
      const unsubscribe = NetInfo.addEventListener(state => {
        setCheckInternet(state.isConnected);
        setisInternetReachable(state.isInternetReachable);
      });
      return () => {
        unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    startTracking();
    startWatch();
  }, [isFocused]);

  // useEffect(() => {
  //   // setLoading(true)
  //   // setTimeout(() => {
  //   startTracking();
  //   //   setLoading(false)
  //   // }, 500);
  // }, [isFocused, coordinates]);

  // useEffect(() => {
  //   let focusListener = navigation.addListener("focus", async () => {
  //     startTracking();
  //   });
  //   return focusListener;
  // }, [navigation,isFocused]);

  const startTracking = async () => {
    const watchId = await Geolocation.watchPosition(
      position => {
        const {speed} = position.coords;
        try {
          let obj = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          mapRef?.current?.animateToRegion(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            2000,
          );

          const {latitude, longitude} = position.coords;
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setcoordinates(prevCoordinates => [...prevCoordinates, obj]);
        } catch (error) {
          console.log('map error', error);
        }
        // Other operations with user's location...
      },
      error => {
        switch (error.code) {
          case 1:
            console.log('Permission denied');
            break;
          case 2:
            console.log('Position unavailable');
            break;
          case 3:
            console.log('Timeout');
            break;
          default:
            console.log('Unknown error', error.message);
        }
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 20, // Update location every 20 meters
        interval: 5000, // Milliseconds between location updates
        fastestInterval: 2000, // Minimum interval between updates
        timeout: 0, // No timeout
        maximumAge: 10000,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  };

  // console.log(currentDate + ' ' + TimeValue)

  const getName = async () => {
    const measureUnit = await AsyncStorage.getItem('selected_unit_of_measure');
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const payload = {
      user_id: parseInt(UserID),
      id: parseInt(PetId),
      date: currentDate,
      timezone: currentTimeZone,
    };
    const Response = await GetDashboardApi(payload);
    // console.log(Response?.data[0], 'profileApi');
    setSelectedMeasureUnit(JSON.parse(measureUnit).distance_unit);
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

  const handleStop = async () => {
    setLoading(true);

    try {
      const UserID = await AsyncStorage.getItem('userId');
      const PetId = await AsyncStorage.getItem('PetId');

      toggleStopwatch();
      Geolocation.clearWatch();
      Geolocation.stopObserving();

      // console.log("durationTravelled", durationTravelled)
      const durationTravelledArr = durationTravelled.split(':');
      // console.log("durationTravelledArr", durationTravelledArr[0] + ':' + durationTravelledArr[1] + ':' + durationTravelledArr[2])
      const staticcoordinates = {latitude: 0.0, longitude: 0.0};

      const lastCoordinates = [
        {latitude: latitudeInitial, longitude: longitudeInitial},
        {latitude: latitudeFinal, longitude: longitudeFinal},
      ];
      const payload = {
        map_coordinates:
          coordinates && coordinates.length > 0
            ? coordinates
            : staticcoordinates,
        user_id: parseInt(UserID),
        user_pet_id: parseInt(PetId),
        // time: currentDate + ' ' + TimeValue,
        time: startActivityBy,
        // duration: durationTravelledArr[1] + ':' + durationTravelledArr[2],
        duration: StopWatchformatTime(time),
        start_time: startActivityTime,
        stop_time: new Date().toISOString(),
        distance: distanceTravelled
          ? parseFloat(distanceTravelled).toFixed(2) + ' ' + selectedMeasureUnit
          : 0 + ' ' + selectedMeasureUnit,
      };
      const Response = await SendWaypointsAPI(payload).finally(() => {
        setLoading(false);
      });
      if (Response.success == true) {
        Toast.show(Response.messsage, {
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
      } else if (Response.message === 'Map Coordinates is required') {
        Toast.show('Unable to fetach your location...!!', {
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
        Toast.show('Something went wrong...!!', {
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
    } catch (error) {
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
    }
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    // console.log(newCoordinate, "newCoordinate")
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      // console.log("kk")
    }
  };

  const formatTime = time => {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const secs = (time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <>
      {getCheckInternet && isInternetReachable ? (
        <>
          {loading ? <Loader loading={loading} /> : null}
          <ScrollView>
            <SafeAreaView>
              {/* <TopHeader /> */}
              <View style={styles.space10}></View>
              <ActivityProfileScreen />
              <Text style={styles.familytext}>Family Member</Text>
              <View style={styles.space10}></View>

              <View style={[styles.cardsShadow, {flex: 1}]}>
                <View style={styles.cardsShadowInner}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 20,
                      alignItems: 'center',
                    }}>
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
                  {/* -------maps------- */}
                  <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                      latitude: userLocation.latitude
                        ? userLocation.latitude
                        : staticcoordinates?.latitude,
                      longitude: userLocation.longitude
                        ? userLocation.longitude
                        : staticcoordinates?.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    region={{
                      latitude: userLocation.latitude
                        ? userLocation.latitude
                        : staticcoordinates?.latitude,
                      longitude: userLocation.longitude
                        ? userLocation.longitude
                        : staticcoordinates?.longitude,
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
                    {/* pinpoint */}
                    {/* <Marker
                    coordinate={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                      // latitudeDelta: LATITUDE_DELTA,
                      // longitudeDelta: LONGITUDE_DELTA
                    }}
                  /> */}

                    {/* line */}
                    <Polyline
                      coordinates={
                        coordinates ? coordinates : staticcoordinates
                      }
                      strokeWidth={5}
                      strokeColor="#CE5757"
                    />

                    {/* moving */}
                    <Marker
                      ref={markerRef}
                      coordinate={{
                        latitude: userLocation.latitude
                          ? userLocation.latitude
                          : staticcoordinates?.latitude,
                        longitude: userLocation.longitude
                          ? userLocation.longitude
                          : staticcoordinates?.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                      }}
                      title={petName}
                      description="Family member">
                      {petImg != '' && petImg != null ? (
                        <Image
                          source={{uri: petImg}}
                          style={{
                            height: 70,
                            width: 70,
                            borderRadius: 50,
                            borderColor: '#fff',
                            borderWidth: 4,
                          }}
                        />
                      ) : null}
                    </Marker>
                  </MapView>

                  <Text style={styles.mapTimerText}>
                    {StopWatchformatTime(time)}
                  </Text>
                  <Text style={styles.recText}>Minutes</Text>
                  <View style={styles.space10}></View>

                  {/* stop text */}
                  <TouchableOpacity
                    style={[styles.stopRec]}
                    onPress={() => handleStop()}>
                    <Text style={styles.stopRecText}>STOP</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </>
      ) : (
        <InternetFailure />
      )}
    </>
  );
};

export default MapsRecording;
