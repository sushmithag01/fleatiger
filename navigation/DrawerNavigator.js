import React, {useEffect, useState, useCallback} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import TabNavigator, {
  BottomTabNavigator,
  InnerBottomTabNavigator,
} from './TabNavigator';
import SignIn from '../pages/SignIn';
import AllPages from '../pages/AllPages';
import SignUp from '../pages/SignUp';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Button,
  Image,
  Linking,
  Alert,
} from 'react-native';
import Otp from '../pages/Otp';
import CreateNewPassword from '../pages/CreateNewPassword';
import CreateAccount from '../pages/CreateAccount';
import Onboarding1 from '../pages/Onboarding1';
import Onboarding2 from '../pages/Onboarding2';
import Onboarding3 from '../pages/Onboarding3';
import Onboarding4 from '../pages/Onboarding4';
import Onboarding5 from '../pages/Onboarding5';
import Onboarding6 from '../pages/Onboarding6';
import Onboarding7 from '../pages/Onboarding7';
import Onboarding8 from '../pages/Onboarding8';
import AddNewProfile from '../pages/AddNewProfile';
import AddToys from '../pages/AddToys';
import AddPersonality from '../pages/AddPersonality';
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
import styles from '../Common.css';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import ProfileDetail from '../pages/ProfileDetail';
import AddFriend from '../pages/AddFriend';
import EditProfile from '../pages/EditProfile';
import EditBasicDetails from '../pages/EditBasicDetails';
import AddManually from '../pages/AddManually';
import AddFood from '../pages/AddFood';
import AddLikesDislikes from '../pages/AddLikesDislikes';
import Compare from '../pages/Compare';
import Activities from '../pages/Activities';
import Health from '../pages/Health';
import CompletedActivity from '../pages/CompletedActivity';
import Loader from '../pages/CommonScreens/Loader';
import Toast from 'react-native-root-toast';
import MapsRecording from '../pages/Maps/MapsRecording';
import AnimatedMarkers from '../pages/Maps/Tracking';
import Maps from '../pages/Maps/Maps';
import Tracking from '../pages/Maps/Tracking';
import MapDirection from '../pages/Maps/MapDirection';

import CompletedActivityTracker from '../pages/CompletedActivityTracker';

import ChatListing from '../pages/ChatListing';
import AddNewChat from '../pages/AddNewChat';
import Chat from '../pages/Chat';
import FriendsMap from '../pages/Maps/FriendsMap';
import UnFriendList from '../pages/UnFriendList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MessagesStackNavigator} from './StackNavigator';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  LOGOUT,
} from '@invertase/react-native-apple-authentication';

const Drawer = createDrawerNavigator();

// open-link - new tabs
const supportedURL = 'https://fleatiger.com/';
const LegalURL = 'https://fleatiger.com/terms-and-conditions/';

function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const goToStack = stackName => {
    navigation.navigate(stackName);
  };

  const handlePress1 = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.show(`Server error to open this URL: ${url}`, {
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

  const handleLogout = async () => {
    AsyncStorage.clear();
    navigation.replace('Public', {screen: 'SignIn'});
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.closebtnmenu}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}>
          <MaterialCommunityIcons
            name="close"
            color="#CE5757"
            size={30}></MaterialCommunityIcons>
        </TouchableOpacity>
      </View>
      <View style={styles.menumain}>
        <DrawerItem
          label="Subscription"
          icon={() => (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              height={25}
              viewBox="0 96 960 960"
              width={25}>
              <Path
                d="M140 613v103h680V613H140zm0-437h680q24.75 0 42.375 17.625T880 236v480q0 24.75-17.625 42.375T820 776H626v200l-146-74-146 74V776H140q-24.75 0-42.375-17.625T80 716V236q0-24.75 17.625-42.375T140 176zm0 329h680V236H140v269zm0 211V236v480z"
                fill="#CE5757"
              />
            </Svg>
          )}
          labelStyle={styles.menutitle}
          onPress={() =>
            navigation.navigate('SubscriptionStackNavigator', {
              screen: 'Subscription',
            })
          }
        />
        <DrawerItem
          label="Order a Tag"
          icon={() => (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              height={25}
              viewBox="0 96 960 960"
              width={25}>
              <Path
                d="M524 794l140-140q11-11 16-24.5t5-28.5q0-32-22.5-54.5T608 524q-20 0-40 13t-44 42q-24-29-44-42t-40-13q-32 0-54.5 22.5T363 601q0 15 5 28.5t16 24.5l140 140zm35 165q-18 18-43.5 18T472 959L97 584q-10-10-13.5-21T80 540V236q0-26 17-43t43-17h304q12 0 24 3.5t22 13.5l373 373q19 19 19 44.5T863 655L559 959zm-41-41l304-304-378-378H140v304l378 378zM245 392q21 0 36.5-15.5T297 340q0-21-15.5-36.5T245 288q-21 0-36.5 15.5T193 340q0 21 15.5 36.5T245 392zM140 236z"
                fill="#CE5757"
              />
            </Svg>
          )}
          labelStyle={styles.menutitle}
          onPress={() => handlePress1(supportedURL)}
        />
        <DrawerItem
          label="Legal"
          icon={() => (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              height={25}
              viewBox="0 96 960 960"
              width={25}>
              <Path
                d="M480.204 662Q517 662 543 636.5t26-63q0-37.5-26.204-63.5-26.203-26-63-26Q443 484 417 510t-26 63.5q0 37.5 26.204 63 26.203 25.5 63 25.5zM480 914q47-16 96-50.5t79-78.5l-92-88q-19 11-40.161 18-21.162 7-42.839 7-62 0-105.5-43T331 573.5q0-62.5 43.5-106T480 424q62 0 105.5 43.5T629 574q0 21-6 42t-19 38l84 80q24-43 38-94.569 14-51.57 14-105.431V335.516L480 241l-260 94.516V534q0 131 72.5 236.5T480 914zm0 62q-140-35-230-162.5T160 534V296l320-120 320 120v238q0 152-90 279.5T480 976zm0-399z"
                fill="#CE5757"
              />
            </Svg>
          )}
          labelStyle={styles.menutitle}
          onPress={() => handlePress1(LegalURL)}
        />
        <DrawerItem
          label="Tracking"
          icon={() => (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              height={25}
              viewBox="0 96 960 960"
              width={25}>
              <Path
                d="M522 974v-60q45-6 87.5-23.5T689 844l41 44q-46 38-98 59t-110 27zm269-148l-43-41q27-36 45-77.5t25-89.5h61q-8 60-30.5 112.5T791 826zm27-292q-7-48-25-89t-45-78l43-41q38 50 58 99t30 109h-61zM437 974q-152-17-254-130.5T81 576q0-154 102-267.5T437 178v60q-127 17-211.5 113.5T141 576q0 128 84.5 224.5T437 914v60zm253-666q-39-27-81.5-44.5T524 238v-60q54 8 107 29t99 57l-40 44zM480 787q-85-72-126-133.5T313 540q0-79 50.5-125.5T480 368q66 0 116.5 46.5T647 540q0 52-41 113.5T480 787zm0-209q19 0 32-13t13-32q0-17-13-31t-32-14q-19 0-32 14t-13 31q0 19 13 32t32 13z"
                fill="#CE5757"
              />
            </Svg>
          )}
          labelStyle={styles.menutitle}
          onPress={() => goToStack('MyLocation')}
        />
        <DrawerItem
          label="Settings"
          icon={() => (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              height={25}
              viewBox="0 96 960 960"
              width={25}>
              <Path
                d="M388 976l-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185 576q0-9 .5-20.5T188 535L80 456l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669 346l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592 850l-20 126H388zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38zm0-60q-29 0-49.5-20.5T410 576q0-29 20.5-49.5T480 506q29 0 49.5 20.5T550 576q0 29-20.5 49.5T480 646zm0-70zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715 576q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538 348l-14-112h-88l-14 112q-34 7-63.5 24T306 414l-106-46-40 72 94 69q-4 17-6.5 33.5T245 576q0 17 2.5 33.5T254 643l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112z"
                fill="#CE5757"
              />
            </Svg>
          )}
          labelStyle={styles.menutitle}
          onPress={() => goToStack('Settings')}
        />
        {/* <DrawerItem
          label="Dummy"
          icon={() => (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              height={25}
              viewBox="0 96 960 960"
              width={25}>
              <Path
                d="M522 974v-60q45-6 87.5-23.5T689 844l41 44q-46 38-98 59t-110 27zm269-148l-43-41q27-36 45-77.5t25-89.5h61q-8 60-30.5 112.5T791 826zm27-292q-7-48-25-89t-45-78l43-41q38 50 58 99t30 109h-61zM437 974q-152-17-254-130.5T81 576q0-154 102-267.5T437 178v60q-127 17-211.5 113.5T141 576q0 128 84.5 224.5T437 914v60zm253-666q-39-27-81.5-44.5T524 238v-60q54 8 107 29t99 57l-40 44zM480 787q-85-72-126-133.5T313 540q0-79 50.5-125.5T480 368q66 0 116.5 46.5T647 540q0 52-41 113.5T480 787zm0-209q19 0 32-13t13-32q0-17-13-31t-32-14q-19 0-32 14t-13 31q0 19 13 32t32 13z"
                fill="#CE5757"
              />
            </Svg>
          )}
          labelStyle={styles.menutitle}
          onPress={() => goToStack('DummyPage')}
        /> */}
        <DrawerItem
          label="Logout"
          icon={() => (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              id="Linie-Red"
              viewBox="0 0 48 48"
              width={30}
              height={30}>
              <Defs></Defs>
              <Circle cx={24} cy={24} r={24} strokeWidth={0} fill="none" />
              <Path
                className="cls-2"
                d="M36.61 23.4l-7.11-7.17c-.16-.16-.37-.25-.6-.25s-.44.09-.6.25c-.33.33-.33.87 0 1.2l5.67 5.72H18.59c-.46 0-.84.38-.84.85s.38.85.84.85h15.38l-5.67 5.72a.87.87 0 000 1.2c.16.16.37.25.6.25s.44-.09.6-.25l7.11-7.17a.87.87 0 000-1.2z"
                fill="#CE5757"
              />
              <Path
                className="cls-2"
                d="M24.08 34.36h-9.6V13.64h9.6c.45 0 .82-.37.82-.82s-.37-.82-.82-.82H13.66c-.45 0-.82.37-.82.82v22.36c0 .45.37.82.82.82h10.42c.45 0 .82-.37.82-.82s-.37-.82-.82-.82z"
                fill="#CE5757"
              />
            </Svg>
          )}
          labelStyle={styles.menutitle}
          onPress={() => handleLogout()}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = ({navigation}) => {
  return (
    <Drawer.Navigator
      initialRouteName="TabNavigator"
      screenOptions={{
        drawerStyle: {
          color: '#000',
          backgroundColor: '#fff',
          headerShown: false,
          swipeEdgeWidth: 0,
          drawerLockMode: 'locked-open',
          swipeEnabled: false,
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      {/* <Drawer.Screen
        name="Onboarding3"
        component={Onboarding2}
        options={{ headerShown: false }}
      /> */}

      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="ProfileDetail"
        component={ProfileDetail}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="AddNewProfile"
        component={AddNewProfile}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Message"
        component={MessagesStackNavigator}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;
