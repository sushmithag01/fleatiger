<script src="http://localhost:8097"></script>

import { Alert, StyleSheet, Text, View, PermissionsAndroid, Button, Image, ScrollView, SafeAreaView, Dimensions, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react';
import TopHeader from '../TopHeader';
import styles from '../../Common.css';
import ProfileScreen from '../CommonScreens/ProfileScreen';
import { Circle } from 'react-native-animated-spinkit';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer'
// import MapsTest from './MapsTest';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polyline } from 'react-native-maps';
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { GetDashboardApi, SendWaypointsAPI } from '../API/ApiCalls';
import Toast from 'react-native-root-toast';
import MapViewDirections from 'react-native-maps-directions';
import Loader from '../CommonScreens/Loader';
import NetInfo from "@react-native-community/netinfo";
import KeepAwake from 'react-native-keep-awake';
import InternetFailure from '../InternetFailure';
import moment from 'moment-timezone';

const MapsRecording = ({ navigation }) => {
    const travelMode = 'walking'; // Change this to 'walking', 'driving' or 'bicycling' as needed
    const GOOGLE_MAPS_APIKEY = 'AIzaSyDfQuZZMjqxfQB7LWNf7czj-r1sF7RRVSE'
    const [StopSpinner, setStopSpinner] = useState(false)
    const [loading, setLoading] = useState(false)
    const [timerStart, settimerStart] = useState(false)
    const [stopwatchStart, setstopwatchStart] = useState(false)
    const [stopwatchReset, setstopwatchReset] = useState(false)
    const [currentTime, setcurrentTime] = useState('')
    const [isInternetReachable, setisInternetReachable] = useState(true)
    // maps
    const currentTimeZone = moment.tz.guess();

    const [latitudeInitial, setlatitudeInitial] = useState(0)
    const [longitudeInitial, setlongitudeInitial] = useState(0)
    const [coordinates, setcoordinates] = useState([])

    const [latitudeFinal, setlatitudeFinal] = useState(0)
    const [longitudeFinal, setlongitudeFinal] = useState(0)

    const [distanceTravelled, setdistanceTravelled] = useState('')
    const [durationTravelled, setdurationTravelled] = useState('')

    const markerRef = useRef()

    const [getCheckInternet, setCheckInternet] = useState(true);

    const [petName, setPetName] = useState('')
    const [petImg, setPetImg] = useState('')
    const [static_coordinates, setStatictCoordinates] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    const screen = Dimensions.get('window');
    const ASPECT_RATIO = screen.width / screen.height;
    const LATITUDE_DELTA = 0.010;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const isFocused = useIsFocused();


    useEffect(() => {
        KeepAwake.activate();
        if (isFocused) {
            const unsubscribe = NetInfo.addEventListener(state => {
                // console.log("state", state)
                setCheckInternet(state.isConnected);
                setisInternetReachable(state.isInternetReachable);
                // if (state.isConnected) {
                //   Alert.alert("online")
                //   console.log("state.isConnected", state.isConnected)
                //   // Trigger a re-render or some action here
                // }
                // else {
                //   Alert.alert("offline")
                // }
            });

            return () => {
                unsubscribe();
            };
        }
    }, [getCheckInternet, isInternetReachable]);
    useEffect(() => {
        if (isFocused) {
            getName()
            settimerStart(true)
            // setdurationTravelled(durationTravelled)
            const timeinterval = setInterval(() => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserLocation({ latitude: latitude, longitude: longitude })
                        // console.log(position.coords.latitude, "latitude");
                        // console.log(position.coords.longitude, "longitude");
                        setlatitudeInitial(position.coords.latitude)
                        setlongitudeInitial(position.coords.longitude)
                        let obj = { latitude: position.coords.latitude, longitude: position.coords.longitude }
                        setcoordinates([...coordinates, obj])
                        // console.log([...coordinates, obj], "[...coordinates,obj]")
                        // Alert.alert(JSON.stringify([...coordinates, obj]))
                    },
                    (error) => {
                        // Alert.alert(error.message);
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                );
            }, 2000);
            return () => clearInterval(timeinterval);
            // requestPermissions()
        }
    }, [isFocused, latitudeFinal, longitudeFinal, getCheckInternet, latitudeInitial, longitudeInitial, isInternetReachable]);


    const CurrentDateTime = new Date()
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
    const TimeValue = getHours + ':' + getMin
    // console.log(currentDate + ' ' + TimeValue)

    const getName = async () => {
        const UserID = await AsyncStorage.getItem('userId');
        const PetId = await AsyncStorage.getItem('PetId');
        const payload = {
            "user_id": parseInt(UserID),
            "id": parseInt(PetId),
            "date": currentDate,
            timezone : currentTimeZone
        };
        const Response = await GetDashboardApi(payload);
        // console.log(Response?.data[0], 'profileApi');
        setPetName(Response?.data[0]?.pet_name)
        setPetImg(Response?.data[0]?.pet_image_path)
    }


    const toggleStopwatch = () => {
        // console.log("kkkkkk")
        setstopwatchStart(true)
        settimerStart(false)
        setStopSpinner(true)
    }


    const getFormattedTime = (time) => {
        // console.log("time",time)
        setcurrentTime(time)
        setdurationTravelled(time)
    };
    const options = {
        container: {
            backgroundColor: '#fff',
            padding: 5,
            borderRadius: 5,
            paddingTop: 10
        },
        text: {
            color: '#495F75',
            fontFamily: 'Montserrat',
            fontWeight: '500',
            fontSize: 27,
        }
    };

    async function requestPermissions() {
        if (Platform.OS === 'ios') {
            const auth = await Geolocation.requestAuthorization('whenInUse');
            if (auth === 'granted') {
                console.log('granted')
                Geolocation.getCurrentPosition(
                    (position) => {
                        console.log(position.coords.latitude, "latitude");
                        console.log(position.coords.longitude, "longitude");
                        setlatitudeInitial(position.coords.latitude)
                        setlongitudeInitial(position.coords.longitude)
                        setcoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                    },
                    (error) => {
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            }
        }
        // if (Platform.OS === 'android') {
        //   await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //   )
        // }
        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                .then(granted => {
                    if (granted) {
                        Geolocation.getCurrentPosition(
                            (position) => {
                                console.log(position.coords.latitude, "latitude");
                                console.log(position.coords.longitude, "longitude");

                                setlatitudeInitial(position.coords.latitude)
                                setlongitudeInitial(position.coords.longitude)
                                setcoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                                // setOrigin({latitude:position.coords.latitude , longitude:position.coords.longitude})
                            },
                            (error) => {
                                console.log(error.code, error.message);
                            },
                            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                        );
                    }
                });
        } else {
            console.log('permission not granted')
        }
    }



    const handleStart = () => {

        Geolocation.watchPosition((position) => {
            // alert(JSON.stringify(position))
            setlatitudeFinal(position.coords.latitude)
            // console.log("handleStart")
            setlongitudeFinal(position.coords.longitude)
            setStatictCoordinates([{ "latitude": position.coords.longitude, "longitude": position.coords.longitude }, { "latitude": position.coords.longitude, "longitude": position.coords.longitude }]);
            animate(position.coords.latitude, position.coords.longitude)
            const obj = { latitude: position.coords.latitude, longitude: position.coords.longitude }
            // console.log("obj",obj)
            setcoordinates([...coordinates, obj])
            // Alert.alert(JSON.stringify([...coordinates, obj]))
            // console.log([...coordinates, obj], "[...coordinates,obj]")
        }),
            error => {
                console.log(error);
                // alert(error)
            }

    }

    const handleStop = async () => {
        setLoading(true);
        try {
            const UserID = await AsyncStorage.getItem('userId');
            const PetId = await AsyncStorage.getItem('PetId');

            toggleStopwatch()
            Geolocation.clearWatch()
            Geolocation.stopObserving()

            // console.log("durationTravelled", durationTravelled)
            const durationTravelledArr = durationTravelled.split(':')
            // console.log("durationTravelledArr", durationTravelledArr[0] + ':' + durationTravelledArr[1] + ':' + durationTravelledArr[2])
            const staticcoordinates = [{ "latitude": 0.00, "longitude": 0 }, { "latitude": 0.00, "longitude": 0.00 }];
            const lastCoordinates = [{ "latitude": latitudeInitial, "longitude": longitudeInitial }, { "latitude": latitudeFinal, "longitude": longitudeFinal }]
            const payload = {
                map_coordinates: coordinates && coordinates.length > 0 ? coordinates : staticcoordinates,
                user_id: parseInt(UserID),
                user_pet_id: parseInt(PetId),
                time: currentDate + ' ' + TimeValue,
                // duration: durationTravelledArr[1] + ':' + durationTravelledArr[2],
                duration: durationTravelled,
                distance: distanceTravelled ? parseFloat(distanceTravelled).toFixed(2) + ' ' + "km" : 0 + ' ' + "km"
            };
            // console.log("payload", coordinates + lastCoordinates)
            const Response = await SendWaypointsAPI(payload).finally(() => {
                setLoading(false);
            })
            // console.log(payload, "SendWaypointsAPI", Response)
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
                navigation.navigate('CompletedActivityTracker',
                    {
                        item: { "activity_id": Response.data },
                        dateClicked: currentDate,
                        status: ''
                    });
            } else {
                Toast.show("Something went wrong, please check your internet connection...!!", {
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
            Toast.show("Something went wrong, please check your internet connection or restart your application...!!", {
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

    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        // console.log(newCoordinate, "newCoordinate")
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
            }
        } else {
            // console.log("kk")
        }
    }

    // console.log("lat and long", latitudeInitial, longitudeInitial)

    return (
        <>
            {
                getCheckInternet && isInternetReachable ? (
                    <>
                        {loading ? <Loader loading={loading} /> : null}
                        <SafeAreaView>
                            {/* <TopHeader /> */}
                            <View style={styles.space10}></View>
                            <ProfileScreen />
                            <Text style={styles.familytext}>Family Member</Text>
                            <View style={styles.space10}></View>

                            <View style={styles.cardsShadow}>
                                <View style={styles.cardsShadowInner}>
                                    <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                                        <Text style={styles.recText}>Recording in progress</Text>
                                        {/* spinner */}
                                        {StopSpinner == true ? '' : <View>
                                            <Circle size={33} color="#9BBBBE" />
                                        </View>}
                                    </View>
                                    <View style={styles.space10}></View>
                                    {/* <Image source={require('../../assets/dog1.png')} style={styles.dogimg1}>
        </Image>  */}


                                    {/* -------maps------- */}
                                    <MapView
                                        provider={PROVIDER_GOOGLE}
                                        style={styles.map}
                                        region={{
                                            latitude: latitudeInitial,
                                            longitude: longitudeInitial,
                                            latitudeDelta: LATITUDE_DELTA,
                                            longitudeDelta: LONGITUDE_DELTA
                                        }}
                                        zoomEnabled={true}
                                        showsUserLocation={true}
                                        showsMyLocationButton={true}
                                        userLocationCalloutEnabled={true}
                                        showsCompass={true}
                                        followsUserLocation={true}
                                        enableHighAccuracy={true}
                                    >
                                        {/* pinpoint */}
                                        <Marker
                                            coordinate={{
                                                longitude: longitudeInitial,
                                                latitude: latitudeInitial,
                                                latitudeDelta: LATITUDE_DELTA,
                                                longitudeDelta: LONGITUDE_DELTA
                                            }}
                                        />


                                        {/* line */}
                                        <Polyline
                                            coordinates={coordinates?.length > 2 ? coordinates : static_coordinates}
                                            strokeWidth={5}
                                            strokeColor="#CE5757"
                                        />
                                        {/* <MapViewDirections
                origin={coordinates[0]}
                waypoints={coordinates}
                destination={{ latitude: latitudeFinal, longitude: longitudeFinal }}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor="#CE5757"
                optimizeWaypoints={false}
                mode={travelMode}
                onStart={params => {
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`,
                  );
                }}
                onReady={result => {
                  console.log(`Distance: ${result.distance} km`);
                  setdistanceTravelled(result.distance);
                  console.log(`Duration: ${result.duration} min.`);
                }}
                onError={errorMessage => {
                  console.log('GOT AN ERROR', errorMessage);
                }}
              /> */}

                                        {/* moving */}
                                        <Marker
                                            ref={markerRef}
                                            // draggable
                                            // onDragEnd={e => {
                                            //   setlatitudeFinal(e.nativeEvent.coordinate.latitude)
                                            //   setlongitudeFinal(e.nativeEvent.coordinate.longitude)

                                            //   const obj = { latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude }
                                            //   setcoordinates([...coordinates, obj])
                                            //   // console.log([...coordinates, obj], "[...coordinates,obj]")
                                            // }
                                            // }
                                            coordinate={{
                                                latitude: latitudeInitial ? latitudeInitial : 0,
                                                longitude: longitudeInitial ? longitudeInitial : 0,
                                                latitudeDelta: LATITUDE_DELTA,
                                                longitudeDelta: LONGITUDE_DELTA
                                            }}
                                            title={petName}
                                            description="Family member"
                                        >

                                            <Image source={{ uri: petImg }} style={{
                                                height: 70, width: 70, borderRadius: 50, borderColor: '#fff',
                                                borderWidth: 4
                                            }} />

                                        </Marker>
                                    </MapView>
                                    {/* ------- */}
                                    {/* timer */}
                                    <Stopwatch
                                        start={timerStart}
                                        reset={stopwatchReset}
                                        options={options}
                                        getTime={setdurationTravelled}
                                    />
                                    <Text style={styles.recText}>Minutes</Text>
                                    <View style={styles.space10}></View>

                                    {/* stop text */}
                                    <TouchableOpacity style={styles.stopRec}
                                        onPress={() => handleStop()}>
                                        <Text style={styles.stopRecText}>STOP</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    </>
                )
                    : <InternetFailure />
            }

        </>
    );
};

export default MapsRecording;