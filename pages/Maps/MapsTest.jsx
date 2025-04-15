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
import React, {useEffect, useRef, useState} from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {GetDashboardApi} from '../API/ApiCalls';
import moment from 'moment-timezone';

const MapsTest = ({navigation}) => {
  const currentTimeZone = moment.tz.guess();
  const [latitudeInitial, setlatitudeInitial] = useState(0);
  const [longitudeInitial, setlongitudeInitial] = useState(0);
  const [coordinates, setcoordinates] = useState([{latitude: 0, longitude: 0}]);

  const [latitudeFinal, setlatitudeFinal] = useState(0);
  const [longitudeFinal, setlongitudeFinal] = useState(0);

  const [distanceTravelled, setdistanceTravelled] = useState(0);

  const markerRef = useRef();
  const ref = useRef(null);

  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState('');

  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  useEffect(() => {
    requestPermissions();
  }, []);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getName();
    }
  }, [isFocused]);

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
            setlatitudeInitial(position.coords.latitude);
            setlongitudeInitial(position.coords.longitude);
            setcoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => {
            console.log(error.code, error.message);
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
          Geolocation.getCurrentPosition(
            position => {
              console.log(position.coords.latitude, 'latitude');
              console.log(position.coords.longitude, 'longitude');
              setlatitudeInitial(position.coords.latitude);
              setlongitudeInitial(position.coords.longitude);
              setcoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            error => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      handleStart();
      // console.log('started')
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    // console.log('checking')
    Geolocation.watchPosition(position => {
      // alert(JSON.stringify(position))
      setlatitudeFinal(position.coords.latitude);
      setlongitudeFinal(position.coords.longitude);
      animate(position.coords.latitude, position.coords.longitude);
      const obj = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setcoordinates([...coordinates, obj]);
      calcDistance(
        latitudeInitial,
        position.coords.latitude,
        longitudeInitial,
        position.coords.longitude,
      );
    }),
      error => {
        console.log(error);
        // alert(error)
      };
  };

  function calcDistance(lat1, lat2, lon1, lon2) {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = (lon1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;
    setdistanceTravelled(c * r);
    // calculate the result
    return c * r;
  }

  const handleStop = async () => {
    Geolocation.clearWatch();
    Geolocation.stopObserving();
    const payload = {
      coordinates: coordinates,
    };
    //  const Response = await GetDashboardApi(payload)
    console.log(payload, 'payload');
    navigation.navigate('Tracking', {
      latitudeInitial: latitudeInitial,
      longitudeInitial: longitudeInitial,
      latitudeFinal: latitudeFinal,
      longitudeFinal: longitudeFinal,
      coordinates: coordinates,
      petImg: petImg,
    });
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
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
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: latitudeInitial,
          longitude: longitudeInitial,
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
        <Marker
          coordinate={{
            longitude: longitudeInitial ? longitudeInitial : 0,
            latitude: latitudeInitial ? latitudeInitial : 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        />

        {/* line */}
        <Polyline
          coordinates={[
            {
              latitude: latitudeInitial ? latitudeInitial : 0,
              longitude: longitudeInitial ? longitudeInitial : 0,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            {
              latitude: latitudeFinal ? latitudeFinal : 0,
              longitude: longitudeFinal ? longitudeFinal : 0,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
          ]}
          strokeColor={'#000'}
          strokeWidth={2}
          geodesic={true}
        />

        {/* moving */}
        <Marker
          ref={markerRef}
          draggable
          onDragEnd={e => {
            // alert(JSON.stringify(e.nativeEvent.coordinate))
            console.log(latitudeInitial, longitudeInitial);
            setlatitudeFinal(e.nativeEvent.coordinate.latitude);
            setlongitudeFinal(e.nativeEvent.coordinate.longitude);

            // const obj = {latitude:e.nativeEvent.coordinate.latitude,longitude:e.nativeEvent.coordinate.longitude}
            // setcoordinates([...coordinates,obj])
          }}
          //   onDragStart={e => {
          //     // alert(JSON.stringify(e.nativeEvent.coordinate))
          //     console.log(JSON.stringify(e.nativeEvent.coordinate))
          //     setlatitudeFinal(e.nativeEvent.coordinate.latitude)
          //     setlongitudeFinal(e.nativeEvent.coordinate.longitude)
          //   }
          // }
          coordinate={{
            latitude: latitudeInitial ? latitudeInitial : 0,
            longitude: longitudeInitial ? longitudeInitial : 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
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

      <Text style={{margin: 10}}>
        {parseFloat(distanceTravelled).toFixed(2)} km
      </Text>
    </>

    //     <SafeAreaView style={styles.container}>

    // {/* <View style={{margin:5,alignItems:'center',padding:6,flexDirection:'row',justifyContent:'space-around'}}>
    // <TouchableOpacity  style={{borderColor:'red',borderWidth:2,alignItems:'center',padding:10}}
    // // onPress={()=>navigation.navigate('MapsRecording')}
    // onPress={()=>handleStart()}
    // >
    //                 <Text>
    //                  START
    //                 </Text>
    // </TouchableOpacity>
    // <TouchableOpacity  style={{borderColor:'red',borderWidth:2,alignItems:'center',padding:10}}
    // // onPress={()=>navigation.navigate('MapsRecording')}
    // onPress={()=>handleStop()}
    // >
    //                 <Text>
    //                  STOP
    //                 </Text>
    // </TouchableOpacity>
    // </View> */}

    // {/* <View style={{margin:5,borderColor:'red',borderWidth:2,alignItems:'center',padding:5}}>
    // <Text> Start : {latitudeInitial} , {longitudeInitial}</Text>
    // <Text> Stop : {latitudeFinal} , {longitudeFinal}</Text>
    // </View>

    // <View style={{margin:5,borderColor:'blue',borderWidth:2,alignItems:'center',padding:5}}>
    // <Text> coordinates: {JSON.stringify(coordinates)}</Text>
    // </View> */}
    // </SafeAreaView>
  );
};
export default MapsTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: 'red',
    width: '100%',
    height: 300,
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
    height: 250,
    width: '100%',
  },
  // Callout bubble
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
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
