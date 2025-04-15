import React, { useState, useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/TabNavigator';
import {
  AddActivityStackNavigator,
  AddNewMemberStackNavigator,
  CommonStackNavigator,
  FriendsStackNavigator,
  HomeStackNavigator, MessagesStackNavigator, PublicStackNavigator, SubscriptionStackNavigator,
} from './navigation/StackNavigator'
import DrawerNavigator from './navigation/DrawerNavigator'
import 'react-native-gesture-handler';
import { Text, View, StyleSheet, ScrollView, SafeAreaView, LogBox, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from './navigation/TabNavigator';
import Home from './pages/Home';
import Onboarding1 from './pages/Onboarding1';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import messaging from '@react-native-firebase/messaging';
import { NotificationListner, storeFCMTokenApi } from './pages/API/ApiCalls';
import { Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { withIAPContext } from 'react-native-iap';
import SignUp from './pages/SignUp';
import CreateAccount from './pages/CreateAccount';
import EmailVerification from './pages/EmailVerification';
import SignUpEmailVerification from './pages/SignUpEmailVerification';

let getAuthToken;
let getAuthPetCount;
let getAuthEmailVerified;
let getAuthEmail;

async function checkAuthUser() {
  getAuthToken = await AsyncStorage.getItem("token");
  getAuthEmailVerified = await AsyncStorage.getItem("userEmailVerified");
  getAuthPetCount = await AsyncStorage.getItem("userPetCount");
  getAuthEmail = await AsyncStorage.getItem("email");
}

const App = () => {

  LogBox.ignoreAllLogs(true);

  const Stack = createNativeStackNavigator();
  const [authToken, setAuthToken] = useState('');
  const [authEmailVerified, setAuthEmailverified] = useState('');
  const [authPetCount, setAuthPetCount] = useState('');
  const [getCheckInternet, setCheckInternet] = useState(true);
  const [authEmail, setAuthEmail] = useState('')
  useEffect(() => {
    // notifee.setBadgeCount(5).then(() => console.log('Badge count removed'));

    checkAuthUser().then(() => {
      setAuthToken(getAuthToken);
      setAuthEmailverified(getAuthEmailVerified);
      setAuthPetCount(getAuthPetCount);
      setAuthEmail(getAuthEmail);
    })

  }, [getCheckInternet])


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setCheckInternet(state.isConnected);
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
  }, [NetInfo, getCheckInternet]);
  // console.log("authEmail", authEmail)
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* {
        getCheckInternet === true ? */}
      <NavigationContainer>
        <Stack.Navigator>
          {authToken && authEmailVerified && authPetCount > 0 ? (
            <Stack.Group>
              <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} navigation={undefined} options={{ headerShown: false }} />
            </Stack.Group>
          ) : authEmail && !authEmailVerified ?
            (
              <Stack.Group>
                <Stack.Screen name="SignUpEmailVerification" component={SignUpEmailVerification} options={{ headerShown: true, title: "", }} initialParams={{ status: '' }}
                />
              </Stack.Group>
            ) : authToken != null && authEmailVerified != null && authPetCount <= 0 ? (
              <Stack.Group>
                <Stack.Screen name="Onboarding1" component={Onboarding1} options={{ headerShown: false }} initialParams={{ status: '' }}
                />
              </Stack.Group>
            ) : (
              <Stack.Group>
                <Stack.Screen name="public" component={PublicStackNavigator} options={{ headerShown: false }} />
              </Stack.Group>
            )
          }
          <Stack.Group>
            <Stack.Screen name="Home" component={DrawerNavigator} navigation={undefined} options={{ headerShown: false }} />
            <Stack.Screen name="HomeStackNavigator" component={DrawerNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AddNewMember" component={AddNewMemberStackNavigator} navigation={undefined} options={{ headerShown: false }} />
            <Stack.Screen name="Public" component={PublicStackNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AddActivityStackNavigator" component={AddActivityStackNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="SubscriptionStackNavigator" component={SubscriptionStackNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="CommonStackNavigatore" component={CommonStackNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Friends" component={FriendsStackNavigator} options={{ headerShown: false }} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      {/* : <Text style={{ textAlign: "center", marginTop: 400, fontWeight: 800 }}>Please Check your internet connection...!!!</Text> */}
      {/* } */}

    </GestureHandlerRootView>
  );
};

export default withIAPContext(App);