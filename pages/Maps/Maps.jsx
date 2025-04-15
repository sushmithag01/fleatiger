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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import TopHeader from '../TopHeader';
import ProfileScreen from '../CommonScreens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {GetDashboardApi, chatHighlightApi} from '../API/ApiCalls';
import MapViewDirections from 'react-native-maps-directions';
import {FindMeApi} from '../API/ApiCalls';
import Toast from 'react-native-root-toast';
import Loader from '../CommonScreens/Loader';
import {
  CommonHeaderRight,
  MapsHeaderLeft,
  MapsHeaderRight,
} from '../../navigation/CustomBackNavigation';
import moment from 'moment-timezone';
import ActivityProfileScreen from '../CommonScreens/ActivityProfileScreen';

const Maps = ({navigation, route}) => {
  //location permission 
  const [locationPermission,setLocationPermission]=useState('')
  const currentTimeZone = moment.tz.guess();
  const {pageName} = route.params;
  const StartDateTime= new Date().toISOString();
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

  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);

  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState('');
  const [petImeiNum, setPetImei] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const isFocused = useIsFocused();
  const [chatNotify, setChatnotify] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MapsHeaderLeft navigation={navigation} pageName={pageName} />
      ),
      headerRight: () => (
        <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
      ),
    });
    requestPermissions();
  }, [chatNotify, isFocused]);

  useEffect(() => {
    if (isFocused) {
      notificationHilightHandler();
      if (pageName === 'trackByIMEI') {
        checkImeiNumber();
      } else {
        getName();
      }
    }
  }, [isFocused]);

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

  const checkImeiNumber = async () => {
    setLoading(true);
    try {
      let payload = {
        user_id: await AsyncStorage.getItem('userId'),
        pet_id: await AsyncStorage.getItem('PetId'),
      };
      const dataFindMe = await FindMeApi(payload);
      console.log('dataFindMe', dataFindMe, payload);
      if (dataFindMe.status === 200 && dataFindMe.data.data.imei) {
        setLoading(false);
        getName();
        setPetImei(dataFindMe.data.data.imei);
        if (dataFindMe.data.data.lat && dataFindMe.data.data.lng) {
          setlatitude(dataFindMe.data.data.lat);
          setlongitude(dataFindMe.data.data.lng);
          setErrorMsg('');
        } else {
          requestPermissions();
          setErrorMsg(
            'Unable fetch pet location, please check your tracker..!!',
          );
        }
      } else {
        setLoading(false);
        setErrorMsg('Sorry..! please add valid Tracker Number.');
        // navigation.navigate('AddActivity', {screen: 'AddActivity'});
        Toast.show(dataFindMe.message, {
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
    } catch (err) {
      console.log('err', err);
    }
  };
  const getName = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const currentDate = year + '-' + month + '-' + date;
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

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        setLocationPermission('')
        Geolocation.getCurrentPosition(
          position => {
            console.log('granted position');
            if (position.coords.latitude && position.coords.longitude) {
              setlatitude(position.coords.latitude);
              setlongitude(position.coords.longitude);
            } else {
              setErrorMsg(
                'Unable fetch pet location, please check your tracker..!!',
              );
            }
          },
          error => {
            setLocationPermission(error.code)
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
        );
      }
    }
    // if (Platform.OS === 'android') {
    //   await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   )
    // }
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(granted => {
        if (granted) {
          setLocationPermission('')


          Geolocation.getCurrentPosition(
            position => {
              if (
                position.coords.latitude !== 0 &&
                position.coords.longitude !== 0
              ) {
                setlatitude(position.coords.latitude);
                setlongitude(position.coords.longitude);
              } else {
                setErrorMsg(
                  'Unable fetch pet location, please check your tracker..!!',
                );
              }
            },
            error => {
              setLocationPermission(error.code)
              console.log(error.code, error.message);
            },
            {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
          );
        }
      });
    } else {
      console.log('permission not granted');
    }
  }

  const handleStart = () => {
    if (pageName === 'trackByGPS') {
      navigation.navigate('MapsRecording', {
        startActivityBy: currentDate + ' ' + TimeValue,
        startActivityTime: StartDateTime,
      });
    } else {
      navigation.navigate('TrackByImei', {
        State: petImeiNum,
        startActivityBy: currentDate + ' ' + TimeValue,
        startActivityTime: StartDateTime,
      });
    }
  };



  return (
    <>
      {loading ? <Loader loading={loading} /> :locationPermission ?<Text style={styles.friendErrText}>Please enable location permission to access your location.</Text>: 
      <>
      <SafeAreaView style={styles.container}>
        {!errorMsg  ? (
          <>
            {/* <TopHeader/> */}
            <View style={styles.space20}></View>
            {/* <ProfileScreen /> */}
            <ActivityProfileScreen/>
            <Text style={styles.familytext}>Family Member</Text>
            <View style={styles.space20}></View>

            <View>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                  latitude: latitude,
                  longitude: longitude,
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
                <Marker
                  draggable
                  // onDragEnd={e =>
                  //   console.log(JSON.stringify(e.nativeEvent.coordinate))
                  // }
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  title={petName}
                  description="Family member">
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
                </Marker>
              </MapView>
            </View>
            <TouchableOpacity
              style={styles.homecardvalueSmall}
              onPress={() => handleStart()}>
              <Text style={styles.homecardNoSmall}>START</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              marginTop: 300,
              fontFamily: 'Montserrat-Medium',
              fontWeight: '800',
            }}>
            {' '}
            {errorMsg}
          </Text>
        )}
      </SafeAreaView>
      </>
      }
      
    </>
  );
};
export default Maps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  friendErrText: {
    textAlign: 'center',
    margin:50,
    paddingTop:250,
    fontWeight:'800',
    fontFamily: 'Montserrat-Medium',
  },
  familytext: {
    color: '#000000',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.4,
  },
  space20: {
    height: 20,
  },
  map: {
    height: '75%',
    width: '100%',
  },
  // Callout bubble
  bubble: {
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    // marginTop: -12,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    // marginTop: 5,
    // marginBottom: -15
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 0,
  },
  // Character image
  image: {
    width: 30,
    height: 30,
  },
  homecardvalueSmall: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#CE5757',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 4,
    borderColor: '#CE5757',
    textAlign: 'center',
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: -170,
    zIndex: 1,
  },
  homecardNoSmall: {
    color: '#FFF',
    fontFamily: 'Montserrat-Medium',
    fontSize: 17,
    textAlign: 'center',
  },
});

//   <Callout tooltip>
//   <View>
//     <View style={styles.bubble}>
//     <Image source={{uri:petImg}} style={{height: 50, width:50,borderRadius:50}} />
//       <Text style={styles.name}>{petName}</Text>
//       <Text style={{margin:5}}>Family member</Text>

//     </View>
//     <View style={styles.arrowBorder} />
//     <View style={styles.arrow} />
//   </View>
// </Callout>
