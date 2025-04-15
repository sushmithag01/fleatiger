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
  TextInput,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  FindMyFriendsApi,
  GetDashboardApi,
  FindmyFrndCoordinatesApi,
  FindmyFrndsByNameApi,
  chatHighlightApi,
} from '../API/ApiCalls';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {StatusBar} from 'react-native';
import Toast from 'react-native-root-toast';
import moment from 'moment-timezone';
import Loader from '../CommonScreens/Loader';
import MapWithMarkerCounts from './MapWithMarkerCounts';
import {
  CommonHeaderRight,
  FriendsMapHeaderLeft,
  FriendsMapHeaderRight,
} from '../../navigation/CustomBackNavigation';

const FriendsMap = ({navigation}) => {
  // console.log('statusBarHeight: ', StatusBar.currentHeight);
  const currentTimeZone = moment.tz.guess();
  //location permission 
  const [locationPermission,setLocationPermission]=useState('')
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  const [loading, setLoading] = useState(false);
  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState('');
  const [findMyFrndsList, setFindMyFrnds] = useState([]);
  const [findMyFrndsListErr, setFindMyFrndsErr] = useState('');
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [mapData, setMapData] = useState([]);
  const [countMarkers, setCountMarkers] = useState([]);
  const [serachResult, setSearchRes] = useState([]);
  const [searchedCoordinates, setSearchedCoordinate] = useState([]);
  const [showFriendMap, setshowFriendMap] = useState(false);
  const [stateMarkerCount, setstateMarkerCount] = useState([]);
  const [countryMarkerCount, setCountryMarkerCount] = useState([]);
  const [regionMarkerCount, setRegionMarkerCount] = useState([]);
  //   name
  const [ActivityName, setActivityName] = useState('');
  const isFocused = useIsFocused();
  const [chatNotify, setChatnotify] = useState(0);

  const handleChange = (value, event) => {
    if (event.nativeEvent.text === '') {
      console.log('inside if');
      setSearchRes([]);
      requestPermissions();
      handleFindmyFriends();
    } else if (value == 'activityName' && event.nativeEvent.text) {
      setActivityName(event.nativeEvent.text);
      handleSearchByName(event.nativeEvent.text);
    }
  };

  useEffect(
    () => {
      navigation.setOptions({
        headerLeft: () => <FriendsMapHeaderLeft navigation={navigation} />,
        headerRight: () => (
          <CommonHeaderRight navigation={navigation} chatNotify={chatNotify} />
        ),
      });
      requestPermissions();
      notificationHilightHandler();
    },
    [isFocused],
    chatNotify,
  );

  useEffect(() => {
    if (isFocused) {
      getName();
      handleFindmyFriends();
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
            console.log(position.coords.latitude, 'latitude');
            console.log(position.coords.longitude, 'longitude');
            setlatitude(position.coords.latitude);
            setlongitude(position.coords.longitude);
          },
          error => {
            setLocationPermission(error.code)
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
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
              // console.log(position.coords.latitude, 'latitude');
              // console.log(position.coords.longitude, 'longitude');
              setlatitude(position.coords.latitude);
              setlongitude(position.coords.longitude);
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
  const extractDataFromApiResponse = apiResponse => {
    // Extract pet coordinates and names from the API response
    const petData = apiResponse.data[0];
    const countriesData = apiResponse.data[1];
    // Create a dictionary to store markers with the same coordinates
    const markersDictionary = {};

    // Add pet markers to the dictionary
    petData.forEach(pet => {
      const coordinatesKey = `${pet.latitude}_${pet.longitude}`;
      if (!markersDictionary[coordinatesKey]) {
        markersDictionary[coordinatesKey] = {
          id: pet.id,
          coordinates: {
            latitude: pet.latitude,
            longitude: pet.longitude,
          },
          petName: pet.pet_name,
          isCountMarker: false,
        };
      }
    });

    // Initialize countMarkers as an empty array
    const countMarkers = [];

    // Add count markers to the dictionary
    for (const country in countriesData) {
      const countryCount = countriesData[country];
      const coordinatesKey = `${countryCount.coordinates[0]}_${countryCount.coordinates[1]}`;
      if (!markersDictionary[coordinatesKey]) {
        markersDictionary[coordinatesKey] = {
          id: country,
          coordinates: {
            latitude: countryCount.coordinates[0],
            longitude: countryCount.coordinates[1],
          },
          petName: `Count: ${countryCount.count}`,
          countryName: country,
          isCountMarker: true,
        };
      } else {
        // If a marker already exists at this location, just update its petName and countryName
        markersDictionary[
          coordinatesKey
        ].petName = `Count: ${countryCount.count}`;
        markersDictionary[coordinatesKey].countryName = country;
        markersDictionary[coordinatesKey].isCountMarker = true;
      }
      // Push the count marker to countMarkers
      countMarkers.push({
        count: countryCount.count,
        countryName: country,
      });
    }

    // Convert dictionary values to an array
    const markers = Object.values(markersDictionary);

    return {petMarkers: markers, countMarkers: countMarkers};
  };

  const handleSearchByName = async data => {
    let payload1 = {
      user_id: await AsyncStorage.getItem('userId'),
      pet_id: await AsyncStorage.getItem('PetId'),
      pet_name: data,
    };
    const serachresponse = await FindmyFrndsByNameApi(payload1);
    // console.log("serachresponse.data", serachresponse.data)
    if (serachresponse.status === 200) {
      setSearchRes(serachresponse.data);
    } else {
      Toast.show(serachresponse.message, {
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

  const handleFindmyFriends = async () => {
    setLoading(true);
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
      pet_id: await AsyncStorage.getItem('PetId'),
    };

    const getFriends = await FindMyFriendsApi(payload).finally(() => {
      setLoading(false);
    });
    if (getFriends.status === 200) {
      setLoading(false);
      if (Object.keys(getFriends.data). length !== 0) {
        setFindMyFrndsErr('')
        setFindMyFrnds(getFriends.data.get_pet_friend_details);
        setCountryMarkerCount(getFriends.data.country_data);
        setstateMarkerCount(getFriends.data.state_data);
        setRegionMarkerCount(getFriends.data.region_data);
      } else {
        setFindMyFrndsErr('Make friends, no friends in your list.');
      }
    } else {
      setFindMyFrndsErr('')
      Toast.show(getFriends.message, {
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
  const getFriendCoordinates = async data => {
    setSearchRes([]);
    let payload = {
      pet_id: data.pet_id,
    };
    // console.log("payload",payload)
    const getCoordinate = await FindmyFrndCoordinatesApi(payload);
    // console.log("etCoordinate.data.latitude", getCoordinate.data, payload)
    if (getCoordinate.status === 200) {
      if (getCoordinate.data.length > 0) {
        setlatitude(getCoordinate.data[0].latitude);
        setlongitude(getCoordinate.data[0].longitude);
      } else {
        Toast.show(getCoordinate.message, {
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
    // console.log("getCoordinate", getCoordinate)
  };

  return (
    <>
      {loading ? (
        <Loader loading={loading} pagename="friendsmap" />
      ) : findMyFrndsListErr ? (
        <Text style={styles.friendErrText}>{findMyFrndsListErr}</Text>
      ) : locationPermission ?<Text style={styles.friendErrText}>Please enable location permission to access your friends location.</Text> : (
        <MapWithMarkerCounts
          findMyFrndsList={findMyFrndsList}
          latitude={latitude}
          longitude={longitude}
          LATITUDE_DELTA={LATITUDE_DELTA}
          LONGITUDE_DELTA={LONGITUDE_DELTA}
          PROVIDER_GOOGLE={PROVIDER_GOOGLE}
          requestPermissions={requestPermissions}
          setlatitude={setlatitude}
          setlongitude={setlongitude}
          handleFindmyFriends={handleFindmyFriends}
          stateMarkerCount={stateMarkerCount}
          countryMarkerCount={countryMarkerCount}
          regionMarkerCount={regionMarkerCount}
          setLoading={setLoading}
          findMyFrndsListErr={findMyFrndsListErr}
          setFindMyFrndsErr={setFindMyFrndsErr}
        />
      )}
    </>
  );
};
export default FriendsMap;

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    paddingTop: '170%',
    paddingBottom: 0,

    //   borderColor:'red',
    //   borderWidth:2
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
    height: '100%',
  },
  searchBarContainer: {
    width: '90%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 9,
    top: 10,
    //   borderColor:'red',
    //   borderWidth:3
  },
  friendErrText: {
    textAlign: 'center',
    margin:50,
    paddingTop:250,
    fontWeight:'800',
    fontFamily: 'Montserrat-Medium',
  },
  searchBarContainer1: {
    width: '90%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    top: 65,
    // borderColor:'green',
    // borderWidth:3,
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    flex: 5,
    alignItems: 'center',
  },

  container1: {
    // flex: 1,
    // alignItems: 'center',
    paddingTop: 4,
    width: 335,
    height: '100%',
    backgroundColor: '#fff',
    paddingLeft: 10,
    borderColor: '#f2f2f2',
    borderWidth: 3,
    // zIndex: 9,
  },
});

const autoCompleteStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  listView: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#CDD4D9',
  },
  textInputContainer: {
    backgroundColor: '#f4f4f4',
    marginLeft: 6,
    marginRight: 10,
  },
  textInput: {
    color: '#436077',
    fontFamily: 'Montserrat-Medium',
    borderColor: '#CDD4D9',
    borderWidth: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.41,
    elevation: 23,
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    fontSize: 15,
  },
  textInput1: {
    color: '#436077',
    fontFamily: 'Montserrat-Medium',
    borderColor: '#CDD4D9',
    borderWidth: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.41,
    elevation: 23,
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    fontSize: 15,
    padding: 12,
    width: '96%',
    marginTop: 10,
  },
});
