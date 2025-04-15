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
import React, { useEffect, useState } from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import TopHeader from '../TopHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { FindMyFriendsApi, GetDashboardApi } from '../API/ApiCalls';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { StatusBar } from 'react-native';
import Toast from 'react-native-root-toast';
import moment from 'moment-timezone';


const FriendsMap = ({ navigation }) => {
  // console.log('statusBarHeight: ', StatusBar.currentHeight);
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  const [loading, setLoading] = useState(false);
  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState('');
  const [findMyFrndsList, setFindMyFrnds] = useState([]);
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [mapData, setMapData] = useState([]);
  const [countMarkers, setCountMarkers] = useState([]);
  const currentTimeZone = moment.tz.guess();

  //   name
  const [ActivityName, setActivityName] = useState('');

  const handleChange = (value, event) => {
    if (value == 'activityName') {
      setActivityName(event.nativeEvent.text);
    }
  }


  useEffect(() => {
    requestPermissions();
  }, []);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // getName();
      handleFindmyFriends();
    }
  }, [isFocused]);


  const handleFindmyFriends = async () => {
    setLoading(true)
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
      pet_id: await AsyncStorage.getItem('PetId')
    }
    const getFriends = await FindMyFriendsApi(payload);

    if (getFriends.status === 200) {
      setLoading(false)
      setFindMyFrnds(getFriends.data);
      // console.log("apiResponse.data[0]",getFriends.data[0])
      // console.log("apiResponse.data[1]",getFriends.data[1])
      const extractedData = extractDataFromApiResponse(getFriends);
      setMapData(extractedData.petMarkers);
      setCountMarkers(extractedData.countMarkers);


    } else {
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


  }



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
        console.log('granted');
        Geolocation.getCurrentPosition(
          position => {
            console.log(position.coords.latitude, 'latitude');
            console.log(position.coords.longitude, 'longitude');
            setlatitude(position.coords.latitude);
            setlongitude(position.coords.longitude);
          },
          error => {
            console.log(error.code, error.message);
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
          Geolocation.getCurrentPosition(
            position => {
              console.log(position.coords.latitude, 'latitude');
              console.log(position.coords.longitude, 'longitude');
              setlatitude(position.coords.latitude);
              setlongitude(position.coords.longitude);
            },
            error => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        }
      });
    } else {
      console.log('permission not granted');
    }
  }
  const extractDataFromApiResponse = (apiResponse) => {
    // Extract pet coordinates and names from the API response
    const petData = apiResponse.data[0];
    const countriesData = apiResponse.data[1];
    console.log("petData", petData)
    // Create a dictionary to store markers with the same coordinates
    const markersDictionary = {};

    // Add pet markers to the dictionary
    petData.forEach((pet) => {
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
        markersDictionary[coordinatesKey].petName = `Count: ${countryCount.count}`;
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

    return { petMarkers: markers, countMarkers: countMarkers };
  };
  return (
    <>
      <SafeAreaView>
        {/* <TopHeader /> */}
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        {findMyFrndsList && findMyFrndsList.length > 0 ? (<View style={styles.container}>
          {/* <View style={styles.searchBarContainer}>
          <GooglePlacesAutocomplete
            placeholder="SNIFF by Location"
            query={{
              key: 'AIzaSyDfQuZZMjqxfQB7LWNf7czj-r1sF7RRVSE',
              language: 'en',
              types: '(cities)',
            }}
            styles={autoCompleteStyles}
            enablePoweredByContainer={false}
          />
        </View> */}

          <View style={styles.searchBarContainer1}>
            <TextInput
              placeholder="SNIFF by Name"
              style={autoCompleteStyles.textInput1}
              maxLength={30}
              value={ActivityName}
              onChange={event => {
                handleChange('activityName', event);
              }}
            />
          </View>

          <View style={styles.contentContainer}>
            {/*  maps  */}
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
              {findMyFrndsList && findMyFrndsList.map((item) =>
                <Marker
                  // draggable
                  // onDragEnd={e =>
                  //   console.log(JSON.stringify(e.nativeEvent.coordinate))
                  // }
                  coordinate={{
                    latitude: item.latitude ? item.latitude : latitude,
                    longitude: item.longitude ? item.longitude : longitude,
                  }}
                  title={item.pet_name}
                  description="Family member">
                  <Image
                    source={{ uri: item.pet_image_path }}
                    style={{
                      height: 70,
                      width: 70,
                      borderRadius: 50,
                      borderColor: '#fff',
                      borderWidth: 4,
                    }}
                  />
                </Marker>
              )}

            </MapView>
            

            {/* end */}
          </View>
          <View style={{ backgroundColor: 'transparent', position: 'absolute', bottom: 10, left: 10, marginBottom: 40 }}>
          </View>
          <View style={{ backgroundColor: 'transparent', position: 'absolute', bottom: 10, left: 10, marginBottom: 40 }}>
            {countMarkers.map((countryCount, index) => (
              <View key={index}>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>{`${countryCount.countryName} : ${countryCount.count}`}</Text>
              </View>
            ))}
          </View>
        </View>

        ) : <Text style={{ textAlign: "center", marginTop: 200, fontFamily: 'Montserrat-Medium', fontWeight: '800' }}>Sorry..! no friends added in your friend list.</Text>}

        {/* .. */}
      </SafeAreaView>
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
