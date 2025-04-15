// Swapnil Watkar

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import imageloc from '../../assets/pic3.png';
import imagepointer from '../../assets/pic9.png';
import imageIndicator from '../../assets/pic1.png';
import {useNavigation} from '@react-navigation/native';
import TopHeader from '../TopHeader';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '../API/Constant';

const Tracking = ({route}) => {
  const latitudeInitial = 12.876400400419165;
  const longitudeInitial = 77.65390522778034;
  const latitudeFinal = 12.891891392078549;
  const longitudeFinal = 77.64942426234484;
  const liveCoordinates = [
    {latitude: 12.876400400419165, longitude: 77.65390522778034},
    {latitude: 12.876716459296476, longitude: 77.65474073588848},
    {latitude: 12.879167454577676, longitude: 77.65487752854824},
    {latitude: 12.881667451604073, longitude: 77.65529528260231},
    {latitude: 12.889609491291676, longitude: 77.65655592083931},
    {latitude: 12.888935244784177, longitude: 77.65323501080276},
    {latitude: 12.889314365680761, longitude: 77.64987085014582},
    {latitude: 12.891891392078549, longitude: 77.64942426234484},
  ];
  const petImg =
    'https://devapi.fleatiger.com/pets/pet_images/pet_2023-05-31-04-49-10.jpg';

  const navigation = useNavigation();

  const origin = {latitude: 12.878647789551994, longitude: 77.6527957798082};
  const [destination, setDestination] = useState({
    latitude: 12.878647789551994,
    longitude: 77.6527957798082,
  });

  //console.log(liveCoordinates,"liveCoordinates")
  let {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.04;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const mapRef = useRef();
  const markerRef = useRef();

  const [state, setState] = useState({
    curLoc: {
      latitude: latitudeInitial,
      longitude: longitudeInitial,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: latitudeInitial,
      longitude: longitudeInitial,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  });

  const [count, setCount] = useState(0);
  const [locationCount, setlocationCount] = useState(0);
  const [locationFlag, setlocationFlag] = useState(0);

  const {curLoc, destinationCords, isLoading, coordinate} = state;
  useEffect(() => {
    getLiveLocation();
  }, []);

  const getLiveLocation = () => {
    console.log('get live location after 1 second');
    let i = count;
    i = count + 1;
    setCount(i);
    var locationArray = liveCoordinates;
    setlocationCount(locationArray.length);
    //   console.log('locationCount: ',locationCount +' - '+'count: ',count);
    if (locationArray.length !== count) {
      if (locationFlag !== 1) {
        const {latitude, longitude} = locationArray[i - 1];
        // console.log('latitude  ', latitude   );
        // console.log('longitude  ', longitude   );
        animate(latitude, longitude);
        setState({
          ...state,
          curLoc: {latitude, longitude},
          coordinate: new AnimatedRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        });
        setDestination({latitude: latitude, longitude: longitude});
      }
    } else {
      setlocationFlag(1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 1000);
    return () => clearInterval(interval);
  });

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  // const onCenter = () => {
  //   mapRef.current.animateToRegion({
  //     latitude: curLoc.latitude,
  //     longitude: curLoc.longitude,
  //     latitudeDelta: LATITUDE_DELTA,
  //     longitudeDelta: LONGITUDE_DELTA,
  //   });
  // };

  // const changeRegion = region => {
  //   region = {
  //     latitude: curLoc.latitude,
  //     longitude: curLoc.longitude,
  //     latitudeDelta: LATITUDE_DELTA,
  //     longitudeDelta: LONGITUDE_DELTA,
  //   };
  // };
  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        region={{
          ...curLoc,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        ref={mapRef}
        style={styles.map}>
        <Marker
          coordinate={{
            latitude: latitudeInitial,
            longitude: longitudeInitial,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        />
        {/* <Polyline
          liveCoordinates={[
            {
              latitude: latitudeInitial,
              longitude: longitudeInitial,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            {
              ...curLoc,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
          ]} //specify our liveCoordinates
          strokeColor={'#000'}
          strokeWidth={2}
          geodesic={true}
        /> */}
        <Marker.Animated
          draggable
          onDragEnd={e => {
            console.log(JSON.stringify(e.nativeEvent.coordinate));
            setDestination({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
          style={{
            paddingVertical: 1,
            paddingHorizontal: 1,
            borderRadius: 1,
            elevation: 1,
          }}
          ref={markerRef}
          coordinate={coordinate}>
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
        </Marker.Animated>

        <MapViewDirections
          origin={origin}
          waypoints={liveCoordinates.length > 2 ? liveCoordinates : undefined}
          destination={destination}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={3}
          strokeColor="#CE5757"
          optimizeWaypoints={false}
        />

        {Object.keys(destinationCords).length > 0 && (
          <MapViewDirections
            origin={origin}
            waypoints={liveCoordinates.length > 2 ? liveCoordinates : undefined}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="#CE5757"
            optimizeWaypoints={true}
          />
        )}
      </MapView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  bottomCard: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  inpuStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
  space20: {
    height: 20,
  },
});

export default Tracking;
