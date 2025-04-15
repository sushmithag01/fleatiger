import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../pages/SignIn';
import {
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../Common.css';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon, withBadge } from '@rneui/themed';
import Home from '../pages/Home';
import Health from '../pages/Health';
import Energy from '../pages/Energy';
import ActiveTime from '../pages/Dashboard-ActiveTime/ActiveTime';
import LogBook from '../pages/LogBook';
import Activities from '../pages/Activities';
import NewsFeed from '../pages/NewsFeed';
import AllFriends from '../pages/AllFriends';
import AddFriend from '../pages/AddFriend';
import ProfileDetail from '../pages/ProfileDetail';
import EditProfile from '../pages/EditProfile';
import EditBasicDetails from '../pages/EditBasicDetails';
import EditHeight from '../pages/EditHeight';
import EditWeight from '../pages/EditWeight';
import AddManually from '../pages/AddManually';
import MyLocation from '../pages/MyLocation';
import EditPersonality from '../pages/EditPersonality';
import EditToys from '../pages/EditToys';
import EditFood from '../pages/EditFood';
import EditLikesDislikes from '../pages/EditLikesDislikes';
import AddToys from '../pages/AddToys';
import AddPersonality from '../pages/AddPersonality';
import AddLikesDislikes from '../pages/AddLikesDislikes';
import AddFood from '../pages/AddFood';
import SliderAdd1 from '../pages/AddNewMember/SliderAdd1';
import SliderAdd2 from '../pages/AddNewMember/SliderAdd2';
import SliderAdd3 from '../pages/AddNewMember/SliderAdd3';
import Compare from '../pages/Compare';
import SliderAdd4 from '../pages/AddNewMember/SliderAdd4';
import SliderAdd5 from '../pages/AddNewMember/SliderAdd5';
import SliderAdd6 from '../pages/AddNewMember/SliderAdd6';
import SliderAdd7 from '../pages/AddNewMember/SliderAdd7';
import SliderAdd8 from '../pages/AddNewMember/SliderAdd8';
import SliderAdd9 from '../pages/AddNewMember/SliderAdd9';
import SliderAdd10 from '../pages/AddNewMember/SliderAdd10';
import SliderAdd11 from '../pages/AddNewMember/SliderAdd11';
import CompletedActivity from '../pages/CompletedActivity';
import DiscoverActivities from '../pages/DiscoverActivities';
import FriendsiMet from '../pages/FrinedsiMet';
import AddActivity from '../pages/AddActivity';
import FriendRequest from '../pages/FriendRequest';
import FriendProfile from '../pages/FriendProfile';
import EditActivity from '../pages/EditActivity';
import NewRequest from '../pages/NewRequest';
import Maps from '../pages/Maps/Maps';
import GooglePlacesInput from '../pages/Maps/GooglePlacesInput';
import MapsRecording from '../pages/Maps/MapsRecording';
import Svg, {
  Path, Defs, Circle, Rect, G, ClipPath
} from 'react-native-svg';
import CompletedActivityTracker from '../pages/CompletedActivityTracker';
import TrackByImei from '../pages/Maps/TrackByImei';

import ChatListing from '../pages/ChatListing';
import AddNewChat from '../pages/AddNewChat';
import Chat from '../pages/Chat';
import FriendsMap from '../pages/Maps/FriendsMap';
import UnFriendList from '../pages/UnFriendList';
import SignUp from '../pages/SignUp';
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
import SwitchProfiles from '../pages/SwitchProfiles';
import FindMe from '../pages/FindMe';
import FriendCompletedActivity from '../pages/FriendCompletedActivity';
import InternetFailure from '../pages/InternetFailure';
import Subscription from '../pages/Subscription';
import ActivityDescription from '../pages/ActivityDescription';
import Settings from '../pages/Settings';
import DummyPage from '../pages/DummyPage';
import LikesListing from '../pages/LikesListing';
import CommentListing from '../pages/CommentListing';
import Notification from '../pages/Notification';
import GroupsList from '../pages/GroupsList';
import GroupInfo from '../pages/GroupInfo';
import AddMemberstoGroup from '../pages/AddMemberstoGroup';
import CreateGroup from '../pages/CreateGroup';
import GroupInner from '../pages/GroupInner';
import CreateEvent from '../pages/CreateEvent';
import EventInfo from '../pages/EventInfo';
import EditGroup from '../pages/EditGroup';
import GroupChat from '../pages/GroupChat';
import AddNewGroupChat from '../pages/Components/AddNewGroupChat';
import UserAccDeleteConfirmation from '../pages/Popups/UserAccDeleteConfirmation';

const BadgedIcon = withBadge(15)(Icon);
const Stack = createNativeStackNavigator();

const NotificationsStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notifications"
        component={Notifications}></Stack.Screen>
    </Stack.Navigator>
  );
};

export { NotificationsStackNavigator };

const SubscriptionStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Subscription"
        component={Subscription}
        options={{ title: '' }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export { SubscriptionStackNavigator };

const CommonStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InternetFailure"
        component={InternetFailure}
        options={{
          title: '',
          headerShown: false,
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export { CommonStackNavigator };

const MessagesStackNavigator = ({ navigation }) => {
  const [openFriendList, setopenFriendList] = useState(false);
  const [is_myGroups, setis_myGroups] = useState(false);
  const handleRequestNewChat = () => {
    setopenFriendList(!openFriendList);
  };
  return (
    <Stack.Navigator initialRouteName="ChatList">
      <Stack.Screen
        name="ChatListing"
        component={ChatListing}
        options={{
          title: '',
          headerRight: () => (
            <>
              <View style={{ marginBottom: 0, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => handleRequestNewChat()}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width={35}
                    height={35}>
                    <Circle
                      cx={24}
                      cy={24}
                      r={24}
                      fill="#92bcbf"
                      strokeWidth={0}
                    />
                    <Path
                      d="M36.68 12.06h-25.4a2.3 2.3 0 00-2.3 2.3v15.97a2.3 2.3 0 002.3 2.3h1.98v4.44c0 .35.21.66.53.79a.88.88 0 00.94-.19l5.05-5.05h16.9a2.3 2.3 0 002.3-2.3V14.35a2.3 2.3 0 00-2.3-2.3zm.58 4.17v14.1c0 .32-.26.58-.58.58H19.43a.88.88 0 00-.61.25L14.99 35v-3.23c0-.47-.39-.86-.86-.86h-2.84a.58.58 0 01-.58-.58V14.36c0-.32.26-.58.58-.58h25.39c.32 0 .58.26.58.58v1.87z"
                      fill="#223656"
                      strokeWidth={0}
                    />
                    <Path
                      d="M28.59 23.68l-3.6-3.04c-.58-.49-1.43-.49-2.02 0l-3.6 3.04c-.56.47-.87 1.15-.87 1.88 0 .83.41 1.59 1.11 2.05l1.22.8c.48.32 1.1.34 1.61.07l1.15-.63c.25-.13.54-.13.79 0l1.15.63c.24.13.49.19.75.19.3 0 .6-.09.86-.26l1.22-.8c.7-.46 1.11-1.22 1.11-2.05 0-.72-.32-1.41-.87-1.88zM19.28 22.58c.09 0 .19-.01.28-.03.62-.15 1.09-.8 1.09-1.57s-.47-1.42-1.09-1.57c-.09-.02-.18-.03-.28-.03-.19 0-.37.04-.53.13-.25.12-.45.33-.6.58-.05.09-.09.18-.13.27-.07.19-.11.4-.11.62 0 .55.24 1.04.6 1.33.22.17.48.27.76.27zM29.65 19.85c-.25-.29-.59-.47-.97-.47-.76 0-1.37.72-1.37 1.6s.61 1.6 1.37 1.6 1.37-.72 1.37-1.6c0-.44-.15-.84-.4-1.13zM21.99 19.73c.22 0 .43-.05.61-.14.19-.09.36-.22.5-.38.29-.32.46-.77.46-1.26 0-.98-.71-1.78-1.58-1.78s-1.58.8-1.58 1.78.71 1.78 1.58 1.78zM25.94 19.73c.87 0 1.58-.8 1.58-1.78s-.71-1.78-1.58-1.78c-.22 0-.43.05-.61.14-.19.09-.36.22-.5.38-.29.32-.46.77-.46 1.26 0 .98.71 1.78 1.58 1.78z"
                      fill="#223656"
                      strokeWidth={0}
                    />
                  </Svg>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{ paddingLeft: 5 }} onPress={() => setis_myGroups(!is_myGroups)}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 53 53"
                    fill="none"
                    width={35}
                    height={35}
                  >
                    <Rect width={53} height={53} rx={26.5} fill="#92BCBF" />
                    <G clipPath="url(#clip0_97_96)" fill="#223656">
                      <Path d="M16.333 23a4 4 0 100-8 4 4 0 000 8zM20.72 25.76a9.321 9.321 0 00-4.387 7.907h-2.666A2.674 2.674 0 0111 31v-2.667a4.012 4.012 0 014-4h2.667a4 4 0 013.053 1.427zM37.667 23a4 4 0 100-8 4 4 0 000 8zM43 28.333V31a2.675 2.675 0 01-2.667 2.667h-2.666a9.321 9.321 0 00-4.387-7.907 4.002 4.002 0 013.053-1.427H39a4.012 4.012 0 014 4zM27 25.667A5.333 5.333 0 1027 15a5.333 5.333 0 000 10.667zM35 33.667V35a4.012 4.012 0 01-4 4h-8a4.012 4.012 0 01-4-4v-1.333A6.667 6.667 0 0125.667 27h2.666A6.667 6.667 0 0135 33.667z" />
                    </G>
                    <Defs>
                      <ClipPath id="clip0_97_96">
                        <Path fill="#fff" transform="translate(11 11)" d="M0 0H32V32H0z" />
                      </ClipPath>
                    </Defs>
                  </Svg>
                </TouchableOpacity> */}
              </View>

              {openFriendList && (
                <AddNewChat
                  openFriendList={openFriendList}
                  handleRequestNewChat={handleRequestNewChat}
                />
              )}

              {is_myGroups && (
                <AddNewGroupChat
                  is_myGroups={is_myGroups}
                  setis_myGroups={setis_myGroups}
                />
              )}
            </>
          ),
        }}></Stack.Screen>
      <Stack.Screen name="AddNewChat" component={AddNewChat}></Stack.Screen>
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="GroupChat"
        component={GroupChat}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="UnFriendList"
        component={UnFriendList}
        options={{
          title: '',
          headerShown: true,
        }}></Stack.Screen>
      <Stack.Screen
        name="GroupsList"
        component={GroupsList}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="GroupInfo"
        component={GroupInfo}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="GroupInner"
        component={GroupInner}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="AddMemberstoGroup"
        component={AddMemberstoGroup}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="EditGroup"
        component={EditGroup}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="CreateEvent"
        component={CreateEvent}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="EventInfo"
        component={EventInfo}
        options={{
          title: '',
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export { MessagesStackNavigator };

const HomeStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: '',
          headerShown: false,
          //  headerBackButtonMenuEnabled:true,
          //  headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="MessagesStackNavigator"
        component={MessagesStackNavigator}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: '',
          // headerShown: false,
          //  headerBackButtonMenuEnabled:true,
          //  headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="Health"
        component={Health}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: '',
          headerTitleAlign: 'center',
        }}></Stack.Screen>
      <Stack.Screen
        name="DummyPage"
        component={DummyPage}
        options={{
          title: '',
          headerShown: true,
        }}></Stack.Screen>
      <Stack.Screen
        name="Energy"
        component={Energy}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="ActiveTime"
        component={ActiveTime}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="LogBook"
        component={LogBook}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="Activities"
        component={Activities}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeed}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="ActivityDescription"
        component={ActivityDescription}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="LikesList"
        component={LikesListing}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="CommentList"
        component={CommentListing}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="AllFriends"
        component={AllFriends}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
        options={{
          title: '',
        }}></Stack.Screen>

      <Stack.Screen
        name="FriendRequest"
        component={FriendRequest}
        options={{
          title: '',
          // headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetail}
        options={{
          title: '',
        }}></Stack.Screen>
        <Stack.Screen
        name="UserAccDeleteConfirmation"
        component={UserAccDeleteConfirmation}
        options={{
          title: '',
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>

      <Stack.Screen
        name="EditBasicDetails"
        component={EditBasicDetails}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>

      <Stack.Screen
        name="EditHeight"
        component={EditHeight}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="EditWeight"
        component={EditWeight}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>

      <Stack.Screen
        name="EditPersonality"
        component={EditPersonality}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>

      <Stack.Screen
        name="EditToys"
        component={EditToys}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="EditFood"
        component={EditFood}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>

      <Stack.Screen
        name="EditLikesDislikes"
        component={EditLikesDislikes}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>

      {/* <Stack.Screen 
             name="Tracking" 
             component={Tracking}
             options={{
              title:"",
              headerShown: false,
             }}
             >
            </Stack.Screen> */}

      <Stack.Screen
        name="GooglePlacesInput"
        component={GooglePlacesInput}
        options={{
          title: '',
          // headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>

      <Stack.Screen
        name="NewRequest"
        component={NewRequest}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="Compare"
        component={Compare}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="MyLocation"
        component={MyLocation}
        options={{
          title: '',
          // headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>

      <Stack.Screen
        name="AddToys"
        component={AddToys}
        options={{
          title: '',
          // headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>

      <Stack.Screen
        name="AddPersonality"
        component={AddPersonality}
        options={{
          title: '',
          // headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>
      <Stack.Screen
        name="AddFood"
        component={AddFood}
        options={{
          title: '',
          // headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>
      <Stack.Screen
        name="AddLikesDislikes"
        component={AddLikesDislikes}
        options={{
          title: '',
          // headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>

      <Stack.Screen
        name="FriendsiMet"
        component={FriendsiMet}
        options={{
          title: '',
          //  headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>

      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{
          title: '',
        }}></Stack.Screen>

      <Stack.Screen
        name="FriendsMap"
        component={FriendsMap}
        options={{
          title: '',
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export { HomeStackNavigator };

const AddActivityStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="AddActivity">
      <Stack.Screen
        name="AddActivity"
        component={AddActivity}
        options={{
          title: '',
        }}></Stack.Screen>

      <Stack.Screen
        name="AddManually"
        component={AddManually}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="Maps"
        component={Maps}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="MapsRecording"
        component={MapsRecording}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="TrackByImei"
        component={TrackByImei}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="CompletedActivityTracker"
        component={CompletedActivityTracker}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="CompletedActivity"
        component={CompletedActivity}
        options={{
          title: '',
          headerShown: true,
        }}></Stack.Screen>
      <Stack.Screen
        name="FriendCompletedActivity"
        component={FriendCompletedActivity}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="DiscoverActivities"
        component={DiscoverActivities}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="EditActivity"
        component={EditActivity}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="UnFriendList"
        component={UnFriendList}
        options={{
          title: '',
          headerShown: true,
        }}></Stack.Screen>
      <Stack.Screen
        name="MessagesStackNavigator"
        component={MessagesStackNavigator}
        options={{
          title: '',
          headerShown: false,
        }}
      />

    </Stack.Navigator>

  );
};

export { AddActivityStackNavigator };

const PublicStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          title: '',
          headerShown: false,
        }}></Stack.Screen>

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          title: '',
          headerShown: false,
        }}></Stack.Screen>

      <Stack.Screen
        name="Otp"
        component={Otp}
        options={{
          title: '',
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="CreateNewPassword"
        component={CreateNewPassword}
        options={{
          title: '',
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{
          title: '',
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="Onboarding1"
        component={Onboarding1}
        options={{
          title: '',
          // headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="Onboarding2"
        component={Onboarding2}
        options={{
          title: '',
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="Onboarding3"
        component={Onboarding3}
        options={{
          title: '',
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="Onboarding4"
        component={Onboarding4}
        options={{
          title: '',
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="Onboarding5"
        component={Onboarding5}
        options={{
          title: '',
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="Onboarding6"
        component={Onboarding6}
        options={{
          title: '',
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="Onboarding7"
        component={Onboarding7}
        options={{
          title: '',
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="Onboarding8"
        component={Onboarding8}
        options={{
          title: '',
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddToys"
        component={AddToys}
        options={{
          title: '',
          // headerShown: false,
        }}></Stack.Screen>

      <Stack.Screen
        name="AddPersonality"
        component={AddPersonality}
        options={{
          title: '',
          // headerShown: falsse,
        }}></Stack.Screen>
      <Stack.Screen
        name="AddFood"
        component={AddFood}
        options={{
          title: '',
          // headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="AddLikesDislikes"
        component={AddLikesDislikes}
        options={{
          title: '',
          // headerShown: false,
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export { PublicStackNavigator };

const FriendsStackNavigator = ({ navigation }) => {
  const [openFriendList, setopenFriendList] = useState(false);
  const handleRequestNewChat = () => {
    navigation.navigate('MessagesStackNavigator', { screen: 'ChatListing', params: { index: 0 } });
  };
  return (
    <Stack.Navigator initialRouteName="AllFriends">
      <Stack.Screen
        name="AllFriends"
        component={AllFriends}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
        options={{
          title: '',
          //  headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>
      <Stack.Screen
        name="FriendRequest"
        component={FriendRequest}
        options={{
          title: '',
          //  headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
        }}></Stack.Screen>

      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{
          title: '',
        }}></Stack.Screen>

      <Stack.Screen
        name="FriendsMap"
        component={FriendsMap}
        options={{
          title: '',
          //  headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
          headerRight: () => (
            <>
              <TouchableOpacity onPress={() => handleRequestNewChat()}>
                <Svg
                  id="icons-RZ_Blau"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width={40}
                  height={40}>
                  <Defs></Defs>
                  <Circle cx={25.01} cy={25} r={24} fill="#92bcbf" />
                  <Path
                    className="cls-2"
                    d="M23.94 17.45a.939.939 0 10-1.88 0 .939.939 0 101.88 0z"
                  />
                  <Path
                    className="cls-2"
                    d="M35.19 16.45l-.2-2.01a1.432 1.432 0 00-1.7-1.25l-6.47 1.85-2.08-.96c-.94-.43-1.94-.65-2.98-.65-1.5 0-2.94.46-4.16 1.33l-1.7-3.65a.51.51 0 00-.45-.29c-.19 0-.37.12-.45.3l-1.55 3.48a3.58 3.58 0 00-.28 1.86l.26 2.05-1.76 6.36v.04c-.02.12 0 .24.06.34.07.12.17.2.3.23.05.02.11.02.16.02.26 0 .41-.2.46-.37l1.12-4.06.26 2.1c.03.25.24.44.49.44h.06c.13-.02.25-.08.33-.19.08-.1.12-.23.1-.37l-.84-6.72c-.05-.46.01-.92.2-1.33l1.1-2.49 2.84 6.09c.08.17.26.29.45.29.07 0 .14-.02.21-.05.25-.12.36-.41.24-.66l-1.17-2.51a6.19 6.19 0 013.73-1.26c.89 0 1.75.19 2.56.56l2.25 1.04c.11.05.23.06.35.03l4.84-1.38A2.51 2.51 0 0034 16h.17l.06.56c.04.39-.15.76-.48.96l-6.26 3.76c-.17.1-.26.29-.24.49.03.2.16.36.36.41l6.07 1.74-.22.55c-.24.59-.8 1-1.44 1.04l-5.73.43a.47.47 0 00-.41.29L20.22 38.5c-.06.12-.06.26-.02.38.05.12.14.22.26.28a.493.493 0 00.66-.24l5.54-12 5.43-.4c1.01-.06 1.91-.71 2.29-1.65l.43-1.06c.05-.13.05-.28-.01-.4a.5.5 0 00-.31-.26l-5.51-1.57 5.27-3.17c.66-.4 1.04-1.15.96-1.92zM36.7 17.93c.1 0 .19-.03.23-.05l2.36-1.42c.11-.07.2-.18.23-.31a.51.51 0 00-.06-.38.495.495 0 00-.43-.24c-.09 0-.18.02-.26.07l-2.36 1.42c-.24.14-.31.45-.17.68.15.18.32.22.45.22zM39.51 19.31h-2.36c-.27 0-.5.22-.5.5s.22.5.5.5h2.36c.27 0 .5-.22.5-.5s-.22-.5-.5-.5zM36.59 21.37a.623.623 0 00-.4-.15c-.15 0-.28.06-.37.17-.17.21-.1.55.15.76l2.21 1.77c.12.1.26.15.4.15.15 0 .28-.06.37-.17.17-.21.1-.55-.15-.76l-2.21-1.77z"
                  />
                  <Path
                    className="cls-2"
                    d="M15 29.16c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm3.12 5.5H15.5v2.62c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-2.62h-2.62c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2.62v-2.62c0-.28.22-.5.5-.5s.5.22.5.5v2.62h2.62c.28 0 .5.22.5.5s-.22.5-.5.5z"
                  />
                </Svg>
              </TouchableOpacity>
              {openFriendList && (
                <AddNewChat
                  openFriendList={openFriendList}
                  handleRequestNewChat={handleRequestNewChat}
                />
              )}
            </>
          ),
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export { FriendsStackNavigator };

const SwitchProfileStackNavigator = ({ navigation }) => {
  const [openFriendList, setopenFriendList] = useState(false);
  const handleRequestNewChat = () => {
    navigation.navigate('MessagesStackNavigator', { screen: 'ChatListing', params: { index: 0 } });
    // setopenFriendList(!openFriendList)
  };
  return (
    <Stack.Navigator initialRouteName="SwitchProfiles">
      <Stack.Screen
        name="SwitchProfiles"
        component={SwitchProfiles}
        options={{
          title: '',
          //  headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.replace('Home')}>
              <Ionicons
                color="#223656"
                name="chevron-back"
                style={styles.backicon}
                size={23}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <>
              <TouchableOpacity onPress={() => handleRequestNewChat()}>
                <Svg
                  id="icons-RZ_Blau"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width={40}
                  height={40}>
                  <Defs></Defs>
                  <Circle cx={25.01} cy={25} r={24} fill="#92bcbf" />
                  <Path
                    className="cls-2"
                    d="M23.94 17.45a.939.939 0 10-1.88 0 .939.939 0 101.88 0z"
                  />
                  <Path
                    className="cls-2"
                    d="M35.19 16.45l-.2-2.01a1.432 1.432 0 00-1.7-1.25l-6.47 1.85-2.08-.96c-.94-.43-1.94-.65-2.98-.65-1.5 0-2.94.46-4.16 1.33l-1.7-3.65a.51.51 0 00-.45-.29c-.19 0-.37.12-.45.3l-1.55 3.48a3.58 3.58 0 00-.28 1.86l.26 2.05-1.76 6.36v.04c-.02.12 0 .24.06.34.07.12.17.2.3.23.05.02.11.02.16.02.26 0 .41-.2.46-.37l1.12-4.06.26 2.1c.03.25.24.44.49.44h.06c.13-.02.25-.08.33-.19.08-.1.12-.23.1-.37l-.84-6.72c-.05-.46.01-.92.2-1.33l1.1-2.49 2.84 6.09c.08.17.26.29.45.29.07 0 .14-.02.21-.05.25-.12.36-.41.24-.66l-1.17-2.51a6.19 6.19 0 013.73-1.26c.89 0 1.75.19 2.56.56l2.25 1.04c.11.05.23.06.35.03l4.84-1.38A2.51 2.51 0 0034 16h.17l.06.56c.04.39-.15.76-.48.96l-6.26 3.76c-.17.1-.26.29-.24.49.03.2.16.36.36.41l6.07 1.74-.22.55c-.24.59-.8 1-1.44 1.04l-5.73.43a.47.47 0 00-.41.29L20.22 38.5c-.06.12-.06.26-.02.38.05.12.14.22.26.28a.493.493 0 00.66-.24l5.54-12 5.43-.4c1.01-.06 1.91-.71 2.29-1.65l.43-1.06c.05-.13.05-.28-.01-.4a.5.5 0 00-.31-.26l-5.51-1.57 5.27-3.17c.66-.4 1.04-1.15.96-1.92zM36.7 17.93c.1 0 .19-.03.23-.05l2.36-1.42c.11-.07.2-.18.23-.31a.51.51 0 00-.06-.38.495.495 0 00-.43-.24c-.09 0-.18.02-.26.07l-2.36 1.42c-.24.14-.31.45-.17.68.15.18.32.22.45.22zM39.51 19.31h-2.36c-.27 0-.5.22-.5.5s.22.5.5.5h2.36c.27 0 .5-.22.5-.5s-.22-.5-.5-.5zM36.59 21.37a.623.623 0 00-.4-.15c-.15 0-.28.06-.37.17-.17.21-.1.55.15.76l2.21 1.77c.12.1.26.15.4.15.15 0 .28-.06.37-.17.17-.21.1-.55-.15-.76l-2.21-1.77z"
                  />
                  <Path
                    className="cls-2"
                    d="M15 29.16c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm3.12 5.5H15.5v2.62c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-2.62h-2.62c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2.62v-2.62c0-.28.22-.5.5-.5s.5.22.5.5v2.62h2.62c.28 0 .5.22.5.5s-.22.5-.5.5z"
                  />
                </Svg>
              </TouchableOpacity>
            </>
          ),
        }}></Stack.Screen>

      <Stack.Screen
        name="MessagesStackNavigator"
        component={MessagesStackNavigator}
        options={{
          title: '',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export { SwitchProfileStackNavigator };

const FindMeStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="FindMe">
      <Stack.Screen
        name="FindMe"
        component={FindMe}
        options={{
          title: '',
        }}></Stack.Screen>


    </Stack.Navigator>
  );
};

export { FindMeStackNavigator };

const AddNewMemberStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="SliderAdd1">
      {/* add new profile */}
      <Stack.Screen
        name="SliderAdd1"
        component={SliderAdd1}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd2"
        component={SliderAdd2}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd3"
        component={SliderAdd3}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd4"
        component={SliderAdd4}
        options={{
          title: '',
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd5"
        component={SliderAdd5}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd6"
        component={SliderAdd6}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd7"
        component={SliderAdd7}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd8"
        component={SliderAdd8}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd9"
        component={SliderAdd9}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd10"
        component={SliderAdd10}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
      <Stack.Screen
        name="SliderAdd11"
        component={SliderAdd11}
        options={{
          title: '',
          // headerBackButtonMenuEnabled: true,
          // headerTintColor: '#223656'
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export { AddNewMemberStackNavigator };

const AddNewActivityStackNavigator = ({ navigation }) => {
  const [openFriendList, setopenFriendList] = useState(false);
  const handleRequestNewChat = () => {
    // setopenFriendList(!openFriendList)
    navigation.navigate('MessagesStackNavigator', { screen: 'ChatListing', params: { index: 0 } });
  };
  return (
    <Stack.Navigator initialRouteName="AddActivity">
      <Stack.Screen
        name="AddActivity"
        component={AddActivity}
        options={{
          title: '',
          //  headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#223656',
          headerRight: () => (
            <>
              <TouchableOpacity onPress={() => handleRequestNewChat()}>
                <Svg
                  id="icons-RZ_Blau"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width={40}
                  height={40}>
                  <Defs></Defs>
                  <Circle cx={25.01} cy={25} r={24} fill="#92bcbf" />
                  <Path
                    className="cls-2"
                    d="M23.94 17.45a.939.939 0 10-1.88 0 .939.939 0 101.88 0z"
                  />
                  <Path
                    className="cls-2"
                    d="M35.19 16.45l-.2-2.01a1.432 1.432 0 00-1.7-1.25l-6.47 1.85-2.08-.96c-.94-.43-1.94-.65-2.98-.65-1.5 0-2.94.46-4.16 1.33l-1.7-3.65a.51.51 0 00-.45-.29c-.19 0-.37.12-.45.3l-1.55 3.48a3.58 3.58 0 00-.28 1.86l.26 2.05-1.76 6.36v.04c-.02.12 0 .24.06.34.07.12.17.2.3.23.05.02.11.02.16.02.26 0 .41-.2.46-.37l1.12-4.06.26 2.1c.03.25.24.44.49.44h.06c.13-.02.25-.08.33-.19.08-.1.12-.23.1-.37l-.84-6.72c-.05-.46.01-.92.2-1.33l1.1-2.49 2.84 6.09c.08.17.26.29.45.29.07 0 .14-.02.21-.05.25-.12.36-.41.24-.66l-1.17-2.51a6.19 6.19 0 013.73-1.26c.89 0 1.75.19 2.56.56l2.25 1.04c.11.05.23.06.35.03l4.84-1.38A2.51 2.51 0 0034 16h.17l.06.56c.04.39-.15.76-.48.96l-6.26 3.76c-.17.1-.26.29-.24.49.03.2.16.36.36.41l6.07 1.74-.22.55c-.24.59-.8 1-1.44 1.04l-5.73.43a.47.47 0 00-.41.29L20.22 38.5c-.06.12-.06.26-.02.38.05.12.14.22.26.28a.493.493 0 00.66-.24l5.54-12 5.43-.4c1.01-.06 1.91-.71 2.29-1.65l.43-1.06c.05-.13.05-.28-.01-.4a.5.5 0 00-.31-.26l-5.51-1.57 5.27-3.17c.66-.4 1.04-1.15.96-1.92zM36.7 17.93c.1 0 .19-.03.23-.05l2.36-1.42c.11-.07.2-.18.23-.31a.51.51 0 00-.06-.38.495.495 0 00-.43-.24c-.09 0-.18.02-.26.07l-2.36 1.42c-.24.14-.31.45-.17.68.15.18.32.22.45.22zM39.51 19.31h-2.36c-.27 0-.5.22-.5.5s.22.5.5.5h2.36c.27 0 .5-.22.5-.5s-.22-.5-.5-.5zM36.59 21.37a.623.623 0 00-.4-.15c-.15 0-.28.06-.37.17-.17.21-.1.55.15.76l2.21 1.77c.12.1.26.15.4.15.15 0 .28-.06.37-.17.17-.21.1-.55-.15-.76l-2.21-1.77z"
                  />
                  <Path
                    className="cls-2"
                    d="M15 29.16c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm3.12 5.5H15.5v2.62c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-2.62h-2.62c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2.62v-2.62c0-.28.22-.5.5-.5s.5.22.5.5v2.62h2.62c.28 0 .5.22.5.5s-.22.5-.5.5z"
                  />
                </Svg>
              </TouchableOpacity>
            </>
          ),

          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                color="#223656"
                name="chevron-back"
                style={styles.backicon}
                size={23}
              />
            </TouchableOpacity>
          ),
        }}></Stack.Screen>
      <Stack.Screen
        name="AddActivityStackNavigator"
        component={AddActivityStackNavigator}
        options={{
          title: '',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="MessagesStackNavigator"
        component={MessagesStackNavigator}
        options={{
          title: '',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export { AddNewActivityStackNavigator };
