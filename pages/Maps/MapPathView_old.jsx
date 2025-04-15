import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GetDashboardApi} from '../API/ApiCalls';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import { GOOGLE_MAPS_API_KEY } from '../API/Constant';

const MapPathView = props => {
  const {waypoints} = props;
  const travelMode = 'walking'; // Change this to 'walking', 'driving' or 'bicycling' as needed
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.035;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const currentTimeZone = moment.tz.guess();
  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState('');

  const [Distance, setDistance] = useState(0);
  const [Duration, setDuration] = useState(0);

  // const origin =
  // {latitude: 12.878647789551994,
  //  longitude: 77.6527957798082};
  // const destination = {
  //   latitude: 12.885492081742456,
  //   longitude: 77.65583105385303,
  // };
  const origin = {latitude: 37.3318456, longitude: -122.0296002};
  const destination = {latitude: 37.771707, longitude: -122.4053769};

  const WAYPOINTS1 = [
    {latitude: 12.8402075, longitude: 77.6633294},
    {latitude: 12.8402038, longitude: 77.6633325},
    {latitude: 12.8400593, longitude: 77.66242},
    {latitude: 12.8398321, longitude: 77.6615222},
    {latitude: 12.8391403, longitude: 77.6621156},
    {latitude: 12.8392776, longitude: 77.6630276},
  ];

  const WAYPOINTS = waypoints;
  // const WAYPOINTS = WAYPOINTS1;
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
    console.log(Response?.data[0], 'profileApi');
    setPetName(Response?.data[0]?.pet_name);
    setPetImg(Response?.data[0]?.pet_image_path);
  };

  return (
    <>
      <View>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: WAYPOINTS[0]?.latitude,
            longitude: WAYPOINTS[0]?.longitude,
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
            coordinate={{
              longitude: WAYPOINTS[0]?.longitude ? WAYPOINTS[0]?.longitude : 0,
              latitude: WAYPOINTS[0]?.latitude ? WAYPOINTS[0]?.latitude : 0,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          />
          <Marker
            // draggable
            // onDragEnd={e =>
            //   console.log("ertyui",JSON.stringify(e.nativeEvent.coordinate))
            // }

            coordinate={WAYPOINTS[WAYPOINTS?.length - 1]}
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
          {Platform.OS === 'ios' ? (
            <Polyline
              coordinates={WAYPOINTS?.length > 2 ? WAYPOINTS : undefined}
              strokeWidth={5}
              strokeColor="#CE5757"
            />
          ) : (
            <MapViewDirections
              origin={WAYPOINTS[0]}
              waypoints={WAYPOINTS?.length > 2 ? WAYPOINTS : undefined}
              destination={WAYPOINTS[WAYPOINTS?.length - 1]}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={5}
              strokeColor="#CE5757"
              mode={travelMode}
              optimizeWaypoints={true}
              onStart={params => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`,
                );
              }}
              onReady={result => {
                console.log(`Distance: ${result.distance} km`);
                setDistance(result.distance);

                console.log(`Duration: ${result.duration} min.`);
                setDuration(result.duration);
              }}
              onError={errorMessage => {
                console.log('GOT AN ERROR', errorMessage);
              }}
            />
          )}

          {/* <MapViewDirections
            origin={WAYPOINTS[0]}
            waypoints={WAYPOINTS?.length > 2 ? WAYPOINTS : undefined}
            destination={WAYPOINTS[WAYPOINTS?.length - 1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#CE5757"
            mode={travelMode}
          // optimizeWaypoints={true}
          // onStart={params => {
          //   console.log(
          //     `Started routing between "${params.origin}" and "${params.destination}"`,
          //   );
          // }}
          // onReady={result => {
          //   console.log(`Distance: ${result.distance} km`);
          //   setDistance(result.distance);

          //   console.log(`Duration: ${result.duration} min.`);
          //   setDuration(result.duration);
          // }}
          // onError={errorMessage => {
          //   console.log('GOT AN ERROR', errorMessage);
          // }}
          /> */}
        </MapView>
        {/* <MapView>
  <MapViewDirections
    origin={origin}
    destination={destination}
    apikey={GOOGLE_MAPS_APIKEY}
  />
</MapView> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
});
export default MapPathView;
