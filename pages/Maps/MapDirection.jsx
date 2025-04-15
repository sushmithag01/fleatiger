import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View, Text, Image} from 'react-native';
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

const MapDirection = (props) => {
  const {waypoints} = props;
  const currentTimeZone = moment.tz.guess();
  const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_API_KEY;
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.035
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState('');

  const [Distance, setDistance] = useState(0);
  const [Duration, setDuration] = useState(0);

  const origin = 
  {latitude: 12.878647789551994,
   longitude: 77.6527957798082};
  const destination = {
    latitude: 12.885492081742456,
    longitude: 77.65583105385303,
  };

  const WAYPOINTS1 = [
    {latitude: 12.876400400419165, longitude: 77.65390522778034},
    {latitude: 12.876716459296476, longitude: 77.65474073588848},
    {latitude: 12.879167454577676, longitude: 77.65487752854824},
    {latitude: 12.881667451604073, longitude: 77.65529528260231},
    {latitude: 12.889609491291676, longitude: 77.65655592083931},
    {latitude: 12.888935244784177, longitude: 77.65323501080276},
    {latitude: 12.889314365680761, longitude: 77.64987085014582},
    {latitude: 12.891891392078549, longitude: 77.64942426234484},
  ];

  const WAYPOINTS = waypoints;

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
          // showsUserLocation={true}
          // showsMyLocationButton={true}
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
            draggable
            onDragEnd={e =>
              console.log("ertyui",JSON.stringify(e.nativeEvent.coordinate))
            }
           
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
          <MapViewDirections
            origin={WAYPOINTS[0]}
            waypoints={WAYPOINTS?.length > 2 ? WAYPOINTS : undefined}
            destination={WAYPOINTS[WAYPOINTS?.length - 1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="#CE5757"
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
        </MapView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
    borderRadius:20
  },
});
export default MapDirection;
