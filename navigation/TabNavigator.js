import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  ExploreStackNavigator,
  DashboardStackNavigator,
  AccountStackNavigator,
  NotificationsStackNavigator,
  MessagesStackNavigator,
  SignInNavigator,
  HomeStackNavigator,
  AddActivitiesNavigator,
  AddActivityStackNavigator,
  FriendsStackNavigator,
  SwitchProfileStackNavigator,
  FindMeStackNavigator,
  AddNewActivityStackNavigator,
} from './StackNavigator';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import AllPages from '../pages/AllPages';
import styles from '../Common.css';
import Onboarding1 from '../pages/Onboarding1';
import Svg, {
  Path,
  G,
  Defs,
  ClipPath,
  Circle,
  Mask,
  Pattern,
  Use,
  xlinkHref,
  style,
} from 'react-native-svg';
import AddActivity from '../pages/AddActivity';
import AddFriend from '../pages/AddFriend';
import AllFriends from '../pages/AllFriends';
import SwitchProfiles from '../pages/SwitchProfiles';
import Activities from '../pages/Activities';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UnFriendList from '../pages/UnFriendList';
import FindMe from '../pages/FindMe';
import { userSubscriptionInfoApi } from '../pages/API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MotivationalMessage from '../pages/Popups/MotivationalMessage';

const Tab = createBottomTabNavigator();

function BottomTabNavigator({ navigation, props }) {
  const [trackerPlan, setTrackerPlan] = useState('');
  const [ShowPopUp, setShowPopUp] = useState(false);
  const MessagePop = 'Upgrade your plan to use this feature';
  useEffect(() => {
    handleSubscriptionInfo();
  }, []);
  const handleSubscriptionInfo = async () => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    const getUserSubscriptionPlan = await userSubscriptionInfoApi(payload);
    if (getUserSubscriptionPlan.status === 200) {
      setTrackerPlan(
        getUserSubscriptionPlan.data.subscription_info
          .func_track_activity_with_tracker,
      );
    } else {
      setTrackerPlan('');
    }
  };
  const handleFindMe = () => {
    if (trackerPlan > 0) {
      navigation.navigate('FindMe', { pageName: 'FindMe' });
    } else {
      setShowPopUp(true);
    }
  };
  return (
    <>
      <View>
        {ShowPopUp == true ? (
          <MotivationalMessage
            MessagePop={MessagePop}
            congratsMsg={ShowPopUp}
            setCongratsMsg={setShowPopUp}
            status="activity"
          />
        ) : (
          ''
        )}
      </View>
      <Tab.Navigator
        initialRouteName="HomeStackNavigator"
        activeColor="#eee"
        labelStyle={{ fontSize: 12 }}
        screenOptions={({ route }) => ({
          headerShown: false,
          activeTintColor: '#eee',
          tabBarStyle: {
            backgroundColor: '#CED4D8',
            borderTopColor: 'transparent',
            paddingTop: 10,
            borderRadius: 30,
            paddingBottom: 0,
            height: 54,
            ...Platform.select({
              ios: {
                marginBottom: 20,
              },
              android: {
                marginBottom: 0,
              },
            }),
          },
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) => {
            // Dashboard
            if (route.name === 'FindMe' && focused) {
              return (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                  height={30}
                  viewBox="0 0 30 30">
                  <G data-name="Fleatiger-Icons-turquoise-blue_Location Dog">
                    <G data-name="Group 3458" fill="#CE5757">
                      <Path
                        data-name="Path 11576"
                        d="M25 21.59a2.033 2.033 0 011.3.47l9.12 7.71a4.287 4.287 0 01-.41 6.87l-3.09 2.03a1.98 1.98 0 01-1.11.33 2.059 2.059 0 01-.97-.25l-2.91-1.6a4.046 4.046 0 00-3.86 0l-2.91 1.6a2.059 2.059 0 01-.97.25 1.98 1.98 0 01-1.11-.33l-3.09-2.03a4.287 4.287 0 01-.41-6.87l9.12-7.71a1.979 1.979 0 011.3-.47m0-1a3.017 3.017 0 00-1.94.71l-9.12 7.71a5.282 5.282 0 00.51 8.46l3.09 2.03a3.018 3.018 0 001.66.5 2.98 2.98 0 001.45-.37l2.91-1.6a3.026 3.026 0 012.9 0l2.91 1.6a2.98 2.98 0 001.45.37 3.018 3.018 0 001.66-.5l3.09-2.03a5.294 5.294 0 002.39-4.42 5.3 5.3 0 00-1.88-4.04l-9.12-7.71a3.017 3.017 0 00-1.94-.71z"
                        transform="translate(-130 57) translate(120 -67)"
                      />
                      <Path
                        data-name="Path 11577"
                        d="M13.38 18.94a2.728 2.728 0 012.38 2.97 2.728 2.728 0 01-2.38 2.97A2.728 2.728 0 0111 21.91a2.728 2.728 0 012.38-2.97m0-1A3.71 3.71 0 0010 21.91a3.71 3.71 0 003.38 3.97 3.71 3.71 0 003.38-3.97 3.71 3.71 0 00-3.38-3.97z"
                        transform="translate(-130 57) translate(120 -67)"
                      />
                      <Path
                        data-name="Path 11578"
                        d="M36.62 18.94A2.728 2.728 0 0139 21.91a2.728 2.728 0 01-2.38 2.97 2.728 2.728 0 01-2.38-2.97 2.728 2.728 0 012.38-2.97m0-1a3.71 3.71 0 00-3.38 3.97 3.71 3.71 0 003.38 3.97A3.71 3.71 0 0040 21.91a3.71 3.71 0 00-3.38-3.97z"
                        transform="translate(-130 57) translate(120 -67)"
                      />
                      <Path
                        data-name="Path 11579"
                        d="M20.07 11a3.189 3.189 0 012.9 3.41 3.189 3.189 0 01-2.9 3.41 3.189 3.189 0 01-2.9-3.41 3.189 3.189 0 012.9-3.41m0-1a4.185 4.185 0 00-3.9 4.41 4.178 4.178 0 003.9 4.41 4.178 4.178 0 003.9-4.41 4.178 4.178 0 00-3.9-4.41z"
                        transform="translate(-130 57) translate(120 -67)"
                      />
                      <Path
                        data-name="Path 11580"
                        d="M29.84 11a3.189 3.189 0 012.9 3.41 3.189 3.189 0 01-2.9 3.41 3.189 3.189 0 01-2.9-3.41 3.189 3.189 0 012.9-3.41m0-1a4.185 4.185 0 00-3.9 4.41 4.178 4.178 0 003.9 4.41 4.178 4.178 0 003.9-4.41 4.178 4.178 0 00-3.9-4.41z"
                        transform="translate(-130 57) translate(120 -67)"
                      />
                    </G>
                  </G>
                </Svg>
              );
            } else if (route.name === 'FindMe' && !focused) {
              return (
                // <Ionicons
                //   name="arrow-back"
                //   size={30}
                //   color="#CE5757"
                //    onPress={() => navigation.navigate("HomeStackNavigator")}
                //   >
                //   </Ionicons>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width={48}
                  height={48}>
                  <Circle cx={24} cy={24} r={24} fill="none" strokeWidth={0} />
                  <Path
                    d="M34.26 26.95l-8.02-6.76c-1.3-1.1-3.19-1.1-4.49 0l-8.02 6.76a5.459 5.459 0 00.52 8.75l2.71 1.79c1.08.71 2.45.77 3.59.15l2.56-1.4c.55-.3 1.2-.3 1.75 0l2.56 1.4c.52.29 1.1.43 1.67.43.67 0 1.33-.19 1.92-.58l2.71-1.79a5.459 5.459 0 00.52-8.75zm-1.44 7.37l-2.71 1.79c-.56.37-1.28.4-1.88.08l-2.56-1.4c-1.05-.57-2.3-.57-3.35 0l-2.56 1.4c-.59.32-1.31.3-1.88-.08l-2.71-1.79a3.81 3.81 0 01-1.73-3.19c0-1.12.5-2.19 1.36-2.92l8.02-6.76a1.803 1.803 0 012.34 0l8.02 6.76a3.82 3.82 0 011.36 2.91c0 1.28-.65 2.48-1.73 3.19zM16.53 20.84c0-1.98-1.37-3.59-3.06-3.59s-3.06 1.61-3.06 3.59 1.37 3.59 3.06 3.59 3.06-1.61 3.06-3.59zm-4.61 0c0-1.13.71-2.08 1.55-2.08s1.55.95 1.55 2.08-.71 2.08-1.55 2.08-1.55-.95-1.55-2.08zM34.54 17.25c-1.69 0-3.06 1.61-3.06 3.59s1.37 3.59 3.06 3.59 3.06-1.61 3.06-3.59-1.37-3.59-3.06-3.59zm0 5.67c-.84 0-1.55-.95-1.55-2.08s.71-2.08 1.55-2.08 1.55.95 1.55 2.08-.71 2.08-1.55 2.08zM19.53 18.05c1.95 0 3.53-1.79 3.53-3.99s-1.58-3.99-3.53-3.99S16 11.86 16 14.06s1.58 3.99 3.53 3.99zm0-6.47c1.11 0 2.02 1.11 2.02 2.48s-.9 2.48-2.02 2.48-2.02-1.11-2.02-2.48.9-2.48 2.02-2.48zM28.39 18.05c1.95 0 3.53-1.79 3.53-3.99s-1.58-3.99-3.53-3.99-3.53 1.79-3.53 3.99 1.58 3.99 3.53 3.99zm0-6.47c1.11 0 2.02 1.11 2.02 2.48s-.9 2.48-2.02 2.48-2.02-1.11-2.02-2.48.9-2.48 2.02-2.48z"
                    fill="#223656"
                    strokeWidth={0}
                  />
                </Svg>
              );
            }

            // AllFriends
            if (route.name === 'AllFriends' && focused) {
              return (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width={48}
                  height={48}>
                  <Circle cx={24} cy={24} r={24} fill="none" strokeWidth={0} />
                  <Path
                    d="M23.52 28.57l-1.91-1.26c-.58-.38-1.32-.41-1.92-.08l-1.8.99c-.56.31-1.23.31-1.79 0l-1.8-.99c-.6-.33-1.35-.3-1.92.08l-1.91 1.26a3.28 3.28 0 00-1.48 2.73c0 .96.42 1.88 1.16 2.5l5.64 4.76c.69.59 1.71.59 2.4 0l5.64-4.76c.74-.62 1.16-1.54 1.16-2.5 0-1.1-.55-2.13-1.48-2.73zM27.48 16.05c0-.77-.63-1.4-1.4-1.4s-1.4.63-1.4 1.4.63 1.4 1.4 1.4 1.4-.63 1.4-1.4z"
                    fill="#CE5757"
                    strokeWidth={0}
                  />
                  <Path
                    d="M39.01 18.74l-.21-2.1c-.06-.48-.32-.93-.71-1.21-.34-.25-.74-.27-1.09-.29l-6.83-.7-1.6-1.51c-.42-.4-.94-.71-1.49-.88a7.663 7.663 0 00-6.52.92l-1.65-3.54a.763.763 0 00-.7-.44c-.3 0-.57.18-.69.45l-1.61 3.62a3.93 3.93 0 00-.31 2.06l.26 2.09-1.82 6.57v.05c-.04.18 0 .37.08.53.1.18.26.3.46.36.08.02.15.03.22.03.33 0 .62-.21.71-.56l.84-3.05.12.97c.03.21.13.39.29.52.16.12.36.17.56.15.2-.02.38-.13.51-.29.13-.16.18-.36.16-.56l-.87-6.99c-.05-.43.01-.87.19-1.26l.93-2.1 2.73 5.85c.17.37.64.54 1.01.37.18-.09.32-.24.39-.43s.06-.4-.03-.58l-1.14-2.43a6.225 6.225 0 015.53-.82c.34.12.65.3.93.55l1.89 1.66c.17.13.35.2.55.21l4.91.5c.27.49 1.2 2.03 2.43 2.07l.04.35c.03.27-.32.76-.61.94h-5.95c-.39 0-.7.31-.7.7s.32.7.7.7h5.74l-.16.72a1.5 1.5 0 01-1.29.93l-5.76.44c-.28.02-.52.19-.64.45l-2.23 8.53c-.08.19-.09.39-.02.58.07.19.21.34.39.43.1.05.21.07.32.07.3 0 .57-.18.7-.45l2.04-8.13 5.3-.41a3.02 3.02 0 002.59-1.87l.46-1.13a.83.83 0 00-.02-.56l-.02-.07c-.02-.05-.04-.12-.07-.19.58-.44.81-1.05.73-1.85z"
                    fill="#CE5757"
                    strokeWidth={0}
                  />
                </Svg>
              );
            } else if (route.name === 'AllFriends' && !focused) {
              return (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width={48}
                  height={48}>
                  <Circle cx={24} cy={24} r={24} fill="none" strokeWidth={0} />
                  <Path
                    d="M23.52 28.57l-1.91-1.26c-.58-.38-1.32-.41-1.92-.08l-1.8.99c-.56.31-1.23.31-1.79 0l-1.8-.99c-.6-.33-1.35-.3-1.92.08l-1.91 1.26a3.28 3.28 0 00-1.48 2.73c0 .96.42 1.88 1.16 2.5l5.64 4.76c.69.59 1.71.59 2.4 0l5.64-4.76c.74-.62 1.16-1.54 1.16-2.5 0-1.1-.55-2.13-1.48-2.73zM27.48 16.05c0-.77-.63-1.4-1.4-1.4s-1.4.63-1.4 1.4.63 1.4 1.4 1.4 1.4-.63 1.4-1.4z"
                    fill="#223656"
                    strokeWidth={0}
                  />
                  <Path
                    d="M39.01 18.74l-.21-2.1c-.06-.48-.32-.93-.71-1.21-.34-.25-.74-.27-1.09-.29l-6.83-.7-1.6-1.51c-.42-.4-.94-.71-1.49-.88a7.663 7.663 0 00-6.52.92l-1.65-3.54a.763.763 0 00-.7-.44c-.3 0-.57.18-.69.45l-1.61 3.62a3.93 3.93 0 00-.31 2.06l.26 2.09-1.82 6.57v.05c-.04.18 0 .37.08.53.1.18.26.3.46.36.08.02.15.03.22.03.33 0 .62-.21.71-.56l.84-3.05.12.97c.03.21.13.39.29.52.16.12.36.17.56.15.2-.02.38-.13.51-.29.13-.16.18-.36.16-.56l-.87-6.99c-.05-.43.01-.87.19-1.26l.93-2.1 2.73 5.85c.17.37.64.54 1.01.37.18-.09.32-.24.39-.43s.06-.4-.03-.58l-1.14-2.43a6.225 6.225 0 015.53-.82c.34.12.65.3.93.55l1.89 1.66c.17.13.35.2.55.21l4.91.5c.27.49 1.2 2.03 2.43 2.07l.04.35c.03.27-.32.76-.61.94h-5.95c-.39 0-.7.31-.7.7s.32.7.7.7h5.74l-.16.72a1.5 1.5 0 01-1.29.93l-5.76.44c-.28.02-.52.19-.64.45l-2.23 8.53c-.08.19-.09.39-.02.58.07.19.21.34.39.43.1.05.21.07.32.07.3 0 .57-.18.7-.45l2.04-8.13 5.3-.41a3.02 3.02 0 002.59-1.87l.46-1.13a.83.83 0 00-.02-.56l-.02-.07c-.02-.05-.04-.12-.07-.19.58-.44.81-1.05.73-1.85z"
                    fill="#223656"
                    strokeWidth={0}
                  />
                </Svg>
              );
            }

            //  AddActivity
            if (route.name === 'AddActivity' && focused) {
              return (
                <View style={styles.addicon}>
                  <Svg
                    width={70}
                    height={60}
                    viewBox="0 0 50 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <Path
                      d="M49.8 14.9a24.9 24.9 0 01-49.8 0h11.885a13.016 13.016 0 0026.03 0H49.8z"
                      fill="#fff"
                    />
                    <Path
                      d="M25 29.4c7.953 0 14.4-6.447 14.4-14.4S32.953.6 25 .6 10.6 7.047 10.6 15 17.047 29.4 25 29.4z"
                      fill="#CE5757"
                    />
                    <Path
                      d="M30.408 14.404h-4.8V9.6a.6.6 0 10-1.2 0v4.8H19.6a.6.6 0 100 1.2h4.8v4.8a.6.6 0 101.2 0v-4.8h4.8a.6.6 0 100-1.2l.008.004z"
                      fill="#fff"
                    />
                  </Svg>
                </View>
              );
            } else if (route.name === 'AddActivity' && !focused) {
              return (
                <View style={styles.addicon}>
                  <Svg
                    width={70}
                    height={60}
                    viewBox="0 0 50 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <Path
                      d="M49.8 14.9a24.9 24.9 0 01-49.8 0h11.885a13.016 13.016 0 0026.03 0H49.8z"
                      fill="#fff"
                    />
                    <Path
                      d="M25 29.4c7.953 0 14.4-6.447 14.4-14.4S32.953.6 25 .6 10.6 7.047 10.6 15 17.047 29.4 25 29.4z"
                      fill="#CE5757"
                    />
                    <Path
                      d="M30.408 14.404h-4.8V9.6a.6.6 0 10-1.2 0v4.8H19.6a.6.6 0 100 1.2h4.8v4.8a.6.6 0 101.2 0v-4.8h4.8a.6.6 0 100-1.2l.008.004z"
                      fill="#fff"
                    />
                  </Svg>
                </View>
              );
            }

            //  Activities-#CE5757
            if (route.name === 'HomeStackNavigator' && focused) {
              return (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width={45}
                  height={45}>
                  <Circle cx={24} cy={24} r={24} fill="none" strokeWidth={0} />
                  <Path
                    d="M23.46 17.82l-1.12-.61c-.38-.21-.86-.19-1.23.05l-1.18.78c-.58.38-.93 1.03-.93 1.73 0 .61.27 1.18.73 1.58l3.5 2.96c.22.19.5.28.77.28s.55-.09.77-.28l3.5-2.96c.47-.39.73-.97.73-1.58 0-.7-.35-1.34-.93-1.73l-1.18-.78c-.37-.24-.84-.26-1.23-.05l-1.12.61c-.33.18-.74.18-1.08 0z"
                    fill="#CE5757"
                    strokeWidth={0}
                  />
                  <Path
                    d="M38.68 21.32L25.09 11.06c-.64-.48-1.54-.49-2.18 0L9.32 21.32c-.35.27-.42.77-.16 1.12.26.35.76.42 1.12.16l2.99-2.26 2.22 15.43c.06.43.28.83.61 1.11.33.28.74.44 1.19.44h2.16a1.809 1.809 0 001.81-1.81v-4.94c0-.8.34-1.57.93-2.13.5-.5 1.18-.77 1.91-.77.72.02 1.39.32 1.89.84s.77 1.19.77 1.91v5.08a1.809 1.809 0 001.81 1.81h2.19c.42 0 .83-.15 1.15-.41.33-.27.56-.65.63-1.07l2.62-15.16 2.56 1.93c.14.11.31.16.48.16.25 0 .49-.12.64-.32.26-.35.19-.85-.16-1.12zm-7.69 14.34c-.02.1-.1.18-.19.18h-2.23c-.12 0-.21-.1-.21-.22v-5.21c0-1.13-.43-2.21-1.22-3.02a4.321 4.321 0 00-2.98-1.32h-.11c-1.11 0-2.19.45-2.98 1.22-.87.85-1.38 2.03-1.39 3.25v5.08a.204.204 0 01-.21.21h-2.16c-.11 0-.2-.08-.22-.2l-2.37-16.4 9.14-6.9.08-.04h.13l.06.03 9.62 7.27-2.76 16.06z"
                    fill="#CE5757"
                    strokeWidth={0}
                  />
                </Svg>
              );
            } else if (route.name === 'HomeStackNavigator' && !focused) {
              return (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width={45}
                  height={45}>
                  <Circle cx={24} cy={24} r={24} fill="none" strokeWidth={0} />
                  <Path
                    d="M23.46 17.82l-1.12-.61c-.38-.21-.86-.19-1.23.05l-1.18.78c-.58.38-.93 1.03-.93 1.73 0 .61.27 1.18.73 1.58l3.5 2.96c.22.19.5.28.77.28s.55-.09.77-.28l3.5-2.96c.47-.39.73-.97.73-1.58 0-.7-.35-1.34-.93-1.73l-1.18-.78c-.37-.24-.84-.26-1.23-.05l-1.12.61c-.33.18-.74.18-1.08 0z"
                    fill="#223656"
                    strokeWidth={0}
                  />
                  <Path
                    d="M38.68 21.32L25.09 11.06c-.64-.48-1.54-.49-2.18 0L9.32 21.32c-.35.27-.42.77-.16 1.12.26.35.76.42 1.12.16l2.99-2.26 2.22 15.43c.06.43.28.83.61 1.11.33.28.74.44 1.19.44h2.16a1.809 1.809 0 001.81-1.81v-4.94c0-.8.34-1.57.93-2.13.5-.5 1.18-.77 1.91-.77.72.02 1.39.32 1.89.84s.77 1.19.77 1.91v5.08a1.809 1.809 0 001.81 1.81h2.19c.42 0 .83-.15 1.15-.41.33-.27.56-.65.63-1.07l2.62-15.16 2.56 1.93c.14.11.31.16.48.16.25 0 .49-.12.64-.32.26-.35.19-.85-.16-1.12zm-7.69 14.34c-.02.1-.1.18-.19.18h-2.23c-.12 0-.21-.1-.21-.22v-5.21c0-1.13-.43-2.21-1.22-3.02a4.321 4.321 0 00-2.98-1.32h-.11c-1.11 0-2.19.45-2.98 1.22-.87.85-1.38 2.03-1.39 3.25v5.08a.204.204 0 01-.21.21h-2.16c-.11 0-.2-.08-.22-.2l-2.37-16.4 9.14-6.9.08-.04h.13l.06.03 9.62 7.27-2.76 16.06z"
                    fill="#223656"
                    strokeWidth={0}
                  />
                </Svg>
              );
            }
            //  SwitchProfiles
            if (route.name === 'SwitchProfiles' && focused) {
              return (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width={45}
                  height={45}>
                  <Circle cx={24} cy={24} r={24} fill="none" strokeWidth={0} />
                  <Path
                    d="M26.82 19.64a.46.46 0 00-.26-.1c-.04 0-.09 0-.13.03L24 20.97l-2.43-1.4s-.08-.03-.13-.03a.49.49 0 00-.26.1l-2.73 1.93-.11.08s-.01 0-.02.02l-.97.69c-.23.16-.47.36-.3.72l1.59 3.04c.18.29.54.43 1.04-.54l2.47 2.2c.5.45 1.15.69 1.84.69s1.33-.25 1.84-.69l2.48-2.2c.5.96.85.83 1.04.54l1.59-3.04c.17-.35-.07-.56-.3-.72l-3.83-2.71zm-1.27 7.83c-.37.33-.83.53-1.33.57v-.95s.04-.02.05-.04l1.26-1.03c.16-.13.26-.33.26-.54 0-.24-.12-.46-.33-.59l-.43-.27a.44.44 0 00-.43-.02l-.4.21c-.12.07-.27.07-.4 0l-.4-.21a.416.416 0 00-.43.02l-.43.27c-.21.13-.33.35-.33.59 0 .21.09.41.26.54l1.26 1.03s.03.03.05.04v.95c-.49-.05-.96-.24-1.33-.57l-2.57-2.29 2.3-4.73s0-.02.01-.03l1.69.98c.07.04.15.04.22 0l1.69-.98s0 .02.01.03l2.3 4.73-2.58 2.29z"
                    fill="#CE5757"
                    strokeWidth={0}
                  />
                  <Path
                    d="M35.52 23.12c-.49 0-.88.39-.88.88 0 5.87-4.77 10.65-10.64 10.65-1.85 0-3.64-.5-5.24-1.41l3.08-.67c.48-.1.78-.57.67-1.05a.887.887 0 00-1.05-.68l-5.08 1.1c-.46.1-.76.54-.68 1l.82 5.3c.07.44.44.75.87.75h.14c.48-.07.81-.52.74-1.01l-.5-3.27c1.89 1.1 4.04 1.69 6.24 1.69 6.84 0 12.4-5.57 12.4-12.41 0-.49-.39-.88-.88-.88zM24 13.35c1.85 0 3.65.5 5.24 1.41l-3.08.67a.886.886 0 00.18 1.75c.06 0 .12 0 .19-.02l5.09-1.1c.46-.1.76-.54.69-1l-.82-5.31a.885.885 0 10-1.75.27l.5 3.27c-1.89-1.11-4.04-1.7-6.25-1.7-6.84 0-12.4 5.57-12.4 12.41 0 .49.39.88.88.88s.88-.39.88-.88c0-5.87 4.77-10.65 10.64-10.65z"
                    fill="#CE5757"
                    strokeWidth={0}
                  />
                </Svg>
              );
            } else if (route.name === 'SwitchProfiles' && !focused) {
              return (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width={45}
                  height={45}>
                  <Circle cx={24} cy={24} r={24} fill="none" strokeWidth={0} />
                  <Path
                    d="M26.82 19.64a.46.46 0 00-.26-.1c-.04 0-.09 0-.13.03L24 20.97l-2.43-1.4s-.08-.03-.13-.03a.49.49 0 00-.26.1l-2.73 1.93-.11.08s-.01 0-.02.02l-.97.69c-.23.16-.47.36-.3.72l1.59 3.04c.18.29.54.43 1.04-.54l2.47 2.2c.5.45 1.15.69 1.84.69s1.33-.25 1.84-.69l2.48-2.2c.5.96.85.83 1.04.54l1.59-3.04c.17-.35-.07-.56-.3-.72l-3.83-2.71zm-1.27 7.83c-.37.33-.83.53-1.33.57v-.95s.04-.02.05-.04l1.26-1.03c.16-.13.26-.33.26-.54 0-.24-.12-.46-.33-.59l-.43-.27a.44.44 0 00-.43-.02l-.4.21c-.12.07-.27.07-.4 0l-.4-.21a.416.416 0 00-.43.02l-.43.27c-.21.13-.33.35-.33.59 0 .21.09.41.26.54l1.26 1.03s.03.03.05.04v.95c-.49-.05-.96-.24-1.33-.57l-2.57-2.29 2.3-4.73s0-.02.01-.03l1.69.98c.07.04.15.04.22 0l1.69-.98s0 .02.01.03l2.3 4.73-2.58 2.29z"
                    fill="#223656"
                    strokeWidth={0}
                  />
                  <Path
                    d="M35.52 23.12c-.49 0-.88.39-.88.88 0 5.87-4.77 10.65-10.64 10.65-1.85 0-3.64-.5-5.24-1.41l3.08-.67c.48-.1.78-.57.67-1.05a.887.887 0 00-1.05-.68l-5.08 1.1c-.46.1-.76.54-.68 1l.82 5.3c.07.44.44.75.87.75h.14c.48-.07.81-.52.74-1.01l-.5-3.27c1.89 1.1 4.04 1.69 6.24 1.69 6.84 0 12.4-5.57 12.4-12.41 0-.49-.39-.88-.88-.88zM24 13.35c1.85 0 3.65.5 5.24 1.41l-3.08.67a.886.886 0 00.18 1.75c.06 0 .12 0 .19-.02l5.09-1.1c.46-.1.76-.54.69-1l-.82-5.31a.885.885 0 10-1.75.27l.5 3.27c-1.89-1.11-4.04-1.7-6.25-1.7-6.84 0-12.4 5.57-12.4 12.41 0 .49.39.88.88.88s.88-.39.88-.88c0-5.87 4.77-10.65 10.64-10.65z"
                    fill="#223656"
                    strokeWidth={0}
                  />
                </Svg>
              );
            }
            if (route.name === 'Back' && focused) {
              return (
                <Ionicons
                  name="arrow-back"
                  size={30}
                  color="#CE5757"
                  onPress={() =>
                    navigation.navigate('HomeStackNavigator')
                  }></Ionicons>
              );
            } else if (route.name === 'Back' && !focused) {
              return (
                <Ionicons
                  name="arrow-back"
                  size={30}
                  color="#223656"
                  onPress={() =>
                    navigation.navigate('HomeStackNavigator')
                  }></Ionicons>
              );
            }
          },
        })}>
        <Tab.Screen
          name="FindMe"
          component={FindMeStackNavigator}
          listeners={{
            tabPress: e => {
              // Prevent default action
              e.preventDefault();
              handleFindMe();
              //Any custom code here
              // navigation.navigate('AllFriends', {screen: 'AllFriends'});
            },
          }}
        />
        <Tab.Screen
          name="AllFriends"
          component={FriendsStackNavigator}
          listeners={{
            tabPress: e => {
              // Prevent default action
              e.preventDefault();

              //Any custom code here
              navigation.navigate('AllFriends', { screen: 'AllFriends' });
            },
          }}
        />
        <Tab.Screen
          name="AddActivity"
          component={AddActivityStackNavigator}
          listeners={{
            tabPress: e => {
              // Prevent default action
              e.preventDefault();

              //Any custom code here
              navigation.navigate('AddActivity', { screen: 'AddActivity' });
            },
          }}
        />
        <Tab.Screen
          name="HomeStackNavigator"
          component={HomeStackNavigator}
          initialParams={{ dateClicked: undefined }}
        // listeners={{
        //   tabPress: e => {
        //     // Prevent default action
        //     e.preventDefault();
        //     //Any custom code here
        //     navigation.navigate('HomeStackNavigator', { screen: 'Home' })
        //   },
        // }}
        />
        <Tab.Screen
          name="SwitchProfiles"
          component={SwitchProfileStackNavigator}
          listeners={{
            tabPress: e => {
              // Prevent default action
              e.preventDefault();

              //Any custom code here
              navigation.navigate('SwitchProfiles', { screen: 'SwitchProfiles' });
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default BottomTabNavigator;
