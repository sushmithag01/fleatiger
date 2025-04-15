import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FindmyFrndsByNameApi, FindmyFrndCoordinatesApi } from '../API/ApiCalls';
import { SafeAreaView } from 'react-native';

const MapWithMarkerCounts = props => {
  let {
    findMyFrndsList,
    latitude,
    longitude,
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
    PROVIDER_GOOGLE,
    requestPermissions,
    setlatitude,
    setlongitude,
    handleFindmyFriends,
    stateMarkerCount,
    countryMarkerCount,
    regionMarkerCount,
    setLoading,
    findMyFrndsListErr,
    setFindMyFrndsErr,
  } = props;
  const [markers, setMarkers] = useState([]);
  const [isRegionLat, setRegionLatitude] = useState('');
  const [serachResult, setSearchRes] = useState([]);
  const [statecountsOfMarker, setstateCountsOfMarker] = useState([]);
  const [countryCountsOfMarker, setCountryCountsOfMarker] = useState([]);
  const [regionCountsOfMarker, setRegionCountsOfMarker] = useState([]);
  // const [markers, setMarkers] = useState([
  //     { id: 1, title: 'Marker 1', coordinate: { latitude: 37.78825, longitude: -122.4324 } },
  //     // Add more markers as needed
  // ]);

  const [markerCount, setMarkerCount] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(null);

  const [markersInRegion, setMarkersInRegion] = useState([]);

  const [ActivityName, setActivityName] = useState('');
  const [isSearchMap, isSetSearchMap] = useState(false);
  const [petName, setPetName] = useState('');
  const [petImg, setPetImg] = useState('');
  const [location, setpetLocation] = useState('');

  useEffect(() => {
    setMarkers(findMyFrndsList);
    setstateCountsOfMarker(stateMarkerCount);
    setCountryCountsOfMarker(countryMarkerCount);
    setRegionCountsOfMarker(regionMarkerCount);
  }, [markers, props]);

  useEffect(() => {
    if (isRegionLat > 20) {
      setMarkerCount(countryCountsOfMarker);
    } else if (isRegionLat <= 20 && isRegionLat >= 0.1) {
      setMarkerCount(statecountsOfMarker);
    } else if (isRegionLat < 0.1 && isRegionLat >= 0.021) {
      setMarkerCount(regionCountsOfMarker);
    } else if (isRegionLat < 0.021) {
      setMarkerCount([]);
      setRegionLatitude('');
    }
  }, [isRegionLat]);

  const handleChange = (value, event) => {
    if (event.nativeEvent.text === '') {
      setSearchRes([]);
      requestPermissions();
      handleFindmyFriends();
      setActivityName('');
      isSetSearchMap(false);
    } else if (value == 'activityName' && event.nativeEvent.text) {
      setActivityName(event.nativeEvent.text);
      handleSearchByName(event.nativeEvent.text);
    }
  };

  const handleSearchByName = async data => {
    let payload1 = {
      user_id: await AsyncStorage.getItem('userId'),
      pet_id: await AsyncStorage.getItem('PetId'),
      pet_name: data,
    };
    const serachresponse = await FindmyFrndsByNameApi(payload1);
    // console.log("serachresponse.data", serachresponse.data, payload1)
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

  const getFriendCoordinates = async data => {
    setLoading(true);
    setSearchRes([]);
    setActivityName('');
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
      pet_id: await AsyncStorage.getItem('PetId'),
      friend_pet_id: data.pet_id,
    };
    const getCoordinate = await FindmyFrndCoordinatesApi(payload).finally(
      () => {
        setLoading(false);
      },
    );
    if (getCoordinate.status === 200) {
      isSetSearchMap(true);
      if (getCoordinate.data[0].length > 0) {
        setlatitude(getCoordinate.data[0][0].latitude);
        setlongitude(getCoordinate.data[0][0].longitude);
        setPetName(getCoordinate?.data[0][0]?.pet_name);
        setPetImg(getCoordinate?.data[0][0]?.pet_image_path);
        setpetLocation(getCoordinate?.data[0][0]?.location);
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

  const handleRegionChange = region => {
    setSelectedRegion(region);
    const markersWithinRegion = markers.filter(
      marker =>
        marker.latitude < region.latitude + region.latitudeDelta / 2 &&
        marker.latitude > region.latitude - region.latitudeDelta / 2 &&
        marker.longitude < region.longitude + region.longitudeDelta / 2 &&
        marker.longitude > region.longitude - region.longitudeDelta / 2,
    );
    setMarkersInRegion(markersWithinRegion);
    // Set a threshold to determine zoom level
    const zoomThreshold = 0.01;

    // Check if the difference in latitude and longitude deltas is below the threshold
    if (
      region.latitudeDelta < zoomThreshold &&
      region.longitudeDelta < zoomThreshold
    ) {
      // setIsZoomed(true);
      // Alert.alert("Zoom IN")
      // console.log("zoom status", true)
    } else {
      // console.log("region.latitudeDelta", region.latitudeDelta)
      // console.log("region.longitudeDelta", region.longitudeDelta)
      // Alert.alert("zoom Out", JSON.stringify(region.latitudeDelta))
      setRegionLatitude(region.latitudeDelta);
    }
  };

  const renderSearchItem = item => {
    // console.log("item",item)
    return (
      <>
        <ScrollView>
          <TouchableOpacity onPress={() => getFriendCoordinates(item.item)}>
            <Text style={{ color: '#000' }}>{item.item.pet_name}</Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    );
  };

  return (
    <>
      <>
        <View style={styles.searchBarContainer1}>
          <TextInput
            placeholder="Find your BFF here"
            style={autoCompleteStyles.textInput1}
            maxLength={30}
            value={ActivityName}
            onChange={event => {
              handleChange('activityName', event);
            }}
          />
          {serachResult && serachResult.length > 0 ? (
            <SafeAreaView>
              <View
                style={
                  serachResult.length <= 2
                    ? [styles.container1, { height: '50%' }]
                    : styles.container1
                }>
                <FlatList
                  data={serachResult}
                  renderItem={renderSearchItem}
                  keyExtractor={item => item.pet_id}
                  nestedScrollEnabled={true}
                />
              </View>
            </SafeAreaView>

          ) : (
            ''
          )}
        </View>
        <View style={styles.container}>
          {isSearchMap ? (
            <>
              <MapView
                provider={PROVIDER_GOOGLE}
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
                  // draggable
                  // onDragEnd={e => console.log(JSON.stringify(e.nativeEvent.coordinate))}
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  title={petName}
                  description={location}>
                  <Image
                    source={{ uri: petImg }}
                    style={{
                      height: 55,
                      width: 55,
                      borderRadius: 50,
                      borderColor: '#fff',
                      borderWidth: 4,
                    }}
                  />
                </Marker>
              </MapView>
            </>
          ) : (
            <>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                onRegionChangeComplete={handleRegionChange}
              // maxZoomLevel={4.0}
              // maxDelta={4.0}
              >
                {isRegionLat
                  ? markerCount.map(markCount => (
                    <>
                      {markCount.count === 1 ? (
                        <>
                          {markers
                            .filter(
                              item =>
                                item.latitude === markCount.latitude &&
                                item.longitude === markCount.longitude,
                            )
                            .map((item, index) => (
                              <Marker
                                coordinate={{
                                  latitude: item.latitude
                                    ? item.latitude
                                    : latitude,
                                  longitude: item.longitude
                                    ? item.longitude
                                    : longitude,
                                }}
                                title={item.pet_name}
                                description={item.location}>
                                <Image
                                  source={{ uri: item.pet_image_path }}
                                  style={{
                                    height: 55,
                                    width: 55,
                                    borderRadius: 50,
                                    borderColor: '#fff',
                                    borderWidth: 4,
                                  }}
                                />
                              </Marker>
                            ))}
                        </>
                      ) : (
                        <>
                          <Marker
                            coordinate={{
                              latitude: markCount.latitude
                                ? markCount.latitude
                                : latitude,
                              longitude: markCount.longitude
                                ? markCount.longitude
                                : longitude,
                            }}>
                            <View
                              style={{
                                backgroundColor: '#436077',
                                borderRadius: 50,
                                height: 55,
                                width: 55,
                                // paddingHorizontal: 30,
                                // paddingVertical: 26,
                                borderColor: '#fff',
                                borderWidth: 4,
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 12,
                                  textAlign: 'center',
                                  marginTop: 14,
                                  fontWeight: 800,
                                }}>
                                {markCount.count}
                              </Text>
                            </View>
                          </Marker>
                        </>
                      )}
                    </>
                  ))
                  : markers.map(marker => (
                    <Marker
                      key={marker.pet_id}
                      coordinate={{
                        latitude: marker.latitude
                          ? marker.latitude
                          : latitude,
                        longitude: marker.longitude
                          ? marker.longitude
                          : longitude,
                      }}
                      title={marker.pet_name}
                      description={marker.location}>
                      <Image
                        source={{ uri: marker.pet_image_path }}
                        style={{
                          height: 55,
                          width: 55,
                          borderRadius: 50,
                          borderColor: '#fff',
                          borderWidth: 4,
                        }}
                      />
                    </Marker>
                  ))}
              </MapView>
            </>
          )}
        </View>
      </>
    </>
  );
};

const styles = StyleSheet.create({
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
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    top: 35,
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
    height: '80%',
    backgroundColor: '#fff',
    paddingLeft: 10,
    borderColor: '#f2f2f2',
    borderWidth: 3,
    // zIndex: 9,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutContainer: {
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCountContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
});

export default MapWithMarkerCounts;

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
