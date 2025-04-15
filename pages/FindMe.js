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
import React, { useEffect, useState } from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import TopHeader from './TopHeader';
import ProfileScreen from './CommonScreens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  FindMeApi,
  GetDashboardApi,
  chatHighlightApi,
  userSubscriptionInfoApi,
} from './API/ApiCalls';
import MapViewDirections from 'react-native-maps-directions';
import Loader from './CommonScreens/Loader';
import Toast from 'react-native-root-toast';
import Moment from 'moment';
import {
  CommonHeaderRight,
  FindMeHeaderLeft,
} from '../navigation/CustomBackNavigation';
import moment from 'moment-timezone';
import { GOOGLE_MAPS_API_KEY } from './API/Constant';

const FindMe = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  const [petlatitude, setpetlatitude] = useState(0);
  const [petlongitude, setpetlongitude] = useState(0);
  const [loading, setLoading] = useState(false);
  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState('');
  const [trackerstatus, setTracketStatus] = useState(false);
  const [liveLatitude, setLivelatitude] = useState(0);
  const [liveLongitude, setLivelongitude] = useState(0);
  const [findMePlan, setFindMePlan] = useState('');
  const [positionTime, setPositionTime] = useState('');
  const [chatNotify, setChatnotify] = useState(0);
  const currentTimeZone = moment.tz.guess();
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [errorMsg, setErrorMsg] = useState('');
  //location permission
  const [locationPermission, setLocationPermission] = useState('');
  const [is24Hours, setis24Hours] = useState('');
  const [nearbyPetStorePlaces, setNearbyPetStorePlaces] = useState([]);
  const [nearbyVetHospitals, setNearbyVetHospitals] = useState([]);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <FindMeHeaderLeft navigation={navigation} />,
      headerRight: () => (
        <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
      ),
    });
    if (isFocused) {
      setLoading(true);
      handleSubscriptionInfo();
      notificationHilightHandler();
      setLoading(false);
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

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      if (findMePlan > 0) {
        requestPermissions().then(() => {
          handleFindMe().finally(() => {
            setLoading(false);
          });
        });
      } else {
        // setErrorMsg('Finding your dog is available with Premium Subscription');
      }
      setLoading(false);
    }
  }, [isFocused, findMePlan]);

  useEffect(() => {
    getName();
  }, [petName, petImg])

  useEffect(() => {
    fetchNearbyPlaces('pet_store', setNearbyPetStorePlaces);
    fetchNearbyPlaces('veterinary_care', setNearbyVetHospitals);
  }, [latitude, longitude]);

  const handleSubscriptionInfo = async () => {
    setLoading(true);
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    const getUserSubscriptionPlan = await userSubscriptionInfoApi(payload);
    if (getUserSubscriptionPlan.status === 200) {
      setFindMePlan(
        getUserSubscriptionPlan.data.subscription_info.func_find_dog_location,
      );
    } else {
      setErrorMsg('Finding your dog is available with Premium Subscription');
    }
    setLoading(false);
  };

  const handleFindMe = async () => {
    try {
      setLoading(true);
      let payload = {
        user_id: await AsyncStorage.getItem('userId'),
        pet_id: await AsyncStorage.getItem('PetId'),
        timezone: currentTimeZone,
      };
      const dataFindMe = await FindMeApi(payload);
      // console.log("dataFindMe",dataFindMe,payload)
      try {
        if (dataFindMe.status === 200) {
          if (dataFindMe.data.data.lng && dataFindMe.data.data.lat) {
            setlongitude(dataFindMe.data.data.lng);
            setlatitude(dataFindMe.data.data.lat);
          } else {
            setErrorMsg(
              'Unable fetch pet location, please check your tracker..!!',
            );
          }
          setPositionTime(dataFindMe.data.data.positionTime);
          setTracketStatus(false);
          setLoading(false);
        } else {
          setLoading(false);
          setTracketStatus(true);
          setErrorMsg(
            'Unable fetch pet location, please check your tracker..!!',
          );
        }
      } catch (e) {
        console.error(e);
      }
    } catch (err) {
      console.log('FindMeApi err', err);
    }
  };

  const getName = async () => {
    const gettimeformat = await AsyncStorage.getItem('selected_time_format');
    const is24Hour = JSON.parse(gettimeformat);

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
      timezone: currentTimeZone,
    };
    const Response = await GetDashboardApi(payload);

    setPetName(Response?.data[0]?.pet_name);
    setPetImg(Response?.data[0]?.pet_image_path);
    setis24Hours(is24Hour.time_format_name);
  };

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        setLocationPermission('');
        Geolocation.getCurrentPosition(
          position => {
            // handleFindMe()
            console.log(position.coords.latitude, 'latitude');
            console.log(position.coords.longitude, 'longitude');
            setLivelatitude(latitude ? latitude : position.coords.latitude);
            setLivelongitude(longitude ? longitude : position.coords.longitude);
          },
          error => {
            setLocationPermission(error.code);
            console.log('Geolocation', error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
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
          setLocationPermission('');
          Geolocation.getCurrentPosition(
            position => {
              // handleFindMe()
              setLivelatitude(position.coords.latitude);
              setLivelongitude(position.coords.longitude);
            },
            error => {
              setLocationPermission(error.code);
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
          );
        }
      });
    } else {
      console.log('permission not granted');
    }
  }


  const fetchNearbyPlaces = async (type, setState) => {
    const radius = 3000; // Search radius in meters
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      let response = await fetch(url);
      let data = await response.json();
      if (data.results) {
        setState(data.results);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {loading ? (
        <Loader loading={loading} />
      ) : locationPermission ? (
        <Text style={styles.friendErrText}>
          Please enable location permission to access your location.
        </Text>
      ) : (
        <>
          <SafeAreaView style={styles.container}>
            {findMePlan === 1 && !errorMsg ? (
              <>
                {/* <TopHeader/> */}
                <View style={styles.space20}></View>
                <ProfileScreen />
                <Text style={styles.familytext}>
                  Where is {petName ? petName : null} now?
                </Text>
                <View style={styles.space20}></View>

                {trackerstatus ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 180,
                      fontFamily: 'Montserrat-Medium',
                      fontWeight: '800',
                    }}>
                    Sorry..! please add valid Tracker Number.{' '}
                  </Text>
                ) : (
                  <>
                    <View>
                      <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        region={{
                          latitude: latitude !== 0 ? latitude : liveLatitude,
                          longitude:
                            longitude !== 0 ? longitude : liveLongitude,
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
                          // draggable
                          // onDragEnd={e => console.log(JSON.stringify(e.nativeEvent.coordinate))}
                          coordinate={{
                            latitude: latitude ? latitude : liveLatitude,
                            longitude: longitude ? longitude : liveLongitude,
                          }}
                          title={petName}
                          description={
                            is24Hours === '12-hour'
                              ? Moment(positionTime).format(
                                'MMMM Do YYYY, hh:mm:ss a',
                              )
                              : Moment(positionTime).format(
                                'MMMM Do YYYY, HH:mm:ss',
                              )
                          }>
                          <Image
                            source={{ uri: petImg }}
                            style={{
                              height: 70,
                              width: 70,
                              borderRadius: 50,
                              borderColor: '#fff',
                              borderWidth: 4,
                            }}
                          />
                        </Marker>

                        {/* Nearby Pet Stores (Blue Markers) */}
                        {nearbyPetStorePlaces.map((place, index) => (
                          <Marker
                            key={`store-${index}`}
                            coordinate={{
                              latitude: place.geometry.location.lat,
                              longitude: place.geometry.location.lng,
                            }}
                            title={place.name}
                            description={place.vicinity}

                            pinColor="blue" // Blue for Pet Stores

                          >
                            <View
                              style={{
                                backgroundColor: "#FFFFFF",
                                padding: 2,
                                borderRadius: 10,
                              }}
                            >
                              <Image
                                source={{ uri: place.icon }} // Use Google's Default Icon
                                style={{ height: 20, width: 20 ,tintColor:'#92bcbf'}}
                              />
                            </View>

                          </Marker>
                        ))}

                        {/* Nearby Veterinary Hospitals (Red Markers) */}
                        {nearbyVetHospitals.map((place, index) => (
                          <Marker
                            key={`hospital-${index}`}
                            coordinate={{
                              latitude: place.geometry.location.lat,
                              longitude: place.geometry.location.lng,
                            }}
                            title={place.name}
                            description={place.vicinity}
                            // pinColor="red" // Red for Vet Hospitals
                          >
                          <View
                              style={{
                                backgroundColor: "#FFFFFF",
                                padding: 2,
                                borderRadius: 10,
                              }}
                            >
                              <Image
                                source={{ uri: place.icon }} // Use Google's Default Icon
                                style={{ height: 20, width: 20,tintColor:'#CE5757' }}
                              />
                            </View>
                          </Marker>
                        ))}
                      </MapView>
                    </View>
                    <TouchableOpacity
                      style={styles.homecardvalueSmall}
                      onPress={() => handleFindMe()}>
                      <Text style={styles.homecardNoSmall}>Refresh</Text>
                    </TouchableOpacity>
                  </>
                )}
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
      )}
    </>
  );
};
export default FindMe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  friendErrText: {
    textAlign: 'center',
    margin: 50,
    paddingTop: 250,
    fontWeight: '800',
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
    fontSize: 15,
    textAlign: 'center',
  },
});
