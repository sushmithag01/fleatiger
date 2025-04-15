import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Common.css';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { chatHighlightApi } from '../pages/API/ApiCalls';
import Settings from '../pages/Settings';
import Svg, {
  Path, Defs, Circle, Rect, G, ClipPath
} from 'react-native-svg';

const date = new Date().getDate();
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();

const currentDate = year + '-' + month + '-' + date;

// hightlight chat based on unread notification
const notificationHilightHandler = async () => {
  let payload = {
    pet_id: parseInt(await AsyncStorage.getItem('PetId')),
    user_id: await AsyncStorage.getItem('userId'),
    notify_type_id: 'chat',
  };
  const gethiglight = await chatHighlightApi(payload);
};

const ClearStroage = navigation => {
  AsyncStorage.clear();
  navigation.navigate('Public', { screen: 'SignIn' });
};

const handleAddPersonality = ({ navigation, selectedPersonality }) => {
  console.log('selectedPersonality', selectedPersonality);
  AsyncStorage.setItem('personality_id', JSON.stringify(selectedPersonality));
  navigation.navigate('AddToys');
};

const handleAddToys = ({ navigation, data }) => {
  console.log('handleAddToys data', data);
  AsyncStorage.setItem('toy_box_values', JSON.stringify(data));
  navigation.navigate('AddFood');
};

const handleAddFood = ({ navigation, data }) => {
  AsyncStorage.setItem('food_box_values', JSON.stringify(data));
  navigation.navigate('AddLikesDislikes');
};

const handleAddLikeDisLike = ({ navigation, data }) => {
  AsyncStorage.setItem('pet_likesdislikesbox_values', JSON.stringify(data));
  navigation.navigate('Onboarding7');
};


export const CommonHeaderRight = ({ navigation, chatNotify }) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('MessagesStackNavigator', { screen: 'ChatListing', params: { index: 0 } })
    }>
    {chatNotify ? (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        id="Circle-Turquoise-Blue"
        viewBox="0 0 48 48"
        height={40}
        width={40}>
        <Defs></Defs>
        <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
        <Path
          className="cls-1"
          d="M23.11 17.5c0-.85-.69-1.54-1.55-1.54s-1.55.69-1.55 1.54.69 1.54 1.55 1.54 1.55-.69 1.55-1.54z"
        />
        <Path
          className="cls-1"
          d="M34.06 23.3l-5.37-1.53 5.18-3.1c.81-.48 1.27-1.4 1.17-2.33l-.22-2.18c-.06-.51-.33-.97-.74-1.27-.41-.3-.93-.42-1.45-.31l-6.91 1.97-2.16-1a8.005 8.005 0 00-3.34-.73c-1.58 0-3.09.45-4.4 1.31l-1.71-3.66a.82.82 0 00-.74-.47c-.32 0-.6.19-.73.48l-1.68 3.77c-.3.67-.41 1.42-.32 2.15l.27 2.17L9 25.46a.803.803 0 00.58.93c.08.02.16.03.24.03.43 0 .68-.32.75-.6l.86-3.09.12.93c.05.4.39.71.8.71h.1c.21-.03.41-.14.54-.3a.85.85 0 00.17-.6l-.91-7.26c-.05-.44.01-.89.19-1.3l.96-2.15 2.83 6.05c.19.39.69.57 1.08.39.4-.19.58-.67.39-1.07l-1.18-2.51c1.82-1.29 4.32-1.53 6.36-.6l2.43 1.12c.18.08.38.1.56.04l5.04-1.44c.53.85 1.46 1.38 2.48 1.4l.04.35c.03.31-.12.62-.39.78l-6.78 4.06a.805.805 0 00.19 1.47l6.29 1.79-.13.31c-.22.54-.74.92-1.33.95l-6.21.46c-.29.02-.55.2-.67.47l-2.31 10.06c-.09.2-.1.42-.02.62s.22.36.41.45c.11.05.22.08.34.08.31 0 .6-.18.74-.47l2.11-9.63 5.73-.42c1.2-.08 2.26-.84 2.71-1.96l.47-1.15a.8.8 0 00-.53-1.08z"
        />
        <Path
          className="cls-1"
          d="M38.25 20.18h-2.9c-.41 0-.75.34-.75.75s.34.75.75.75h2.9c.41 0 .75-.34.75-.75s-.34-.75-.75-.75zM34.63 19.24c.09.33.39.55.72.55.07 0 .13 0 .2-.03l2.89-.8c.4-.11.63-.52.52-.92a.749.749 0 00-.92-.52l-2.89.8c-.4.11-.63.52-.52.92zM38.44 22.9l-2.89-.8c-.4-.11-.81.12-.92.52-.11.4.12.81.52.92l2.89.8c.07.02.13.03.2.03.33 0 .63-.22.72-.55.11-.4-.12-.81-.52-.92z"
        />
      </Svg>
    ) : (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        id="Circle-Turquoise-Blue"
        viewBox="0 0 48 48"
        height={40}
        width={40}>
        <Defs></Defs>
        <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
        <Circle className="cls-1" cx={23.51} cy={17.67} r={1.57} />
        <Path
          className="cls-1"
          d="M37.98 20.69l-.24-2.35c-.07-.54-.35-1.04-.79-1.35-.38-.28-.83-.31-1.23-.33l-7.65-.78-1.79-1.69a4.29 4.29 0 00-1.67-.98c-.83-.26-1.69-.39-2.56-.39-1.69 0-3.33.49-4.73 1.42l-1.85-3.96a.863.863 0 00-.78-.49c-.33 0-.64.2-.77.51l-1.8 4.06c-.32.72-.44 1.52-.34 2.31l.29 2.34-2.04 7.36v.05c-.04.2 0 .41.09.59.11.2.3.34.52.4.08.02.17.03.25.03.37 0 .69-.24.8-.63l.95-3.41.14 1.09c.03.23.14.44.32.58.17.14.4.19.63.16.23-.03.43-.14.57-.32.14-.18.2-.4.17-.63l-.98-7.83c-.06-.48.01-.97.21-1.41l1.04-2.35 3.06 6.55c.19.41.72.6 1.13.41.21-.1.36-.27.44-.48.08-.21.07-.44-.03-.65l-1.27-2.72c1.77-1.26 4.14-1.61 6.2-.92.38.13.73.33 1.05.61l2.11 1.86c.19.15.39.23.61.24l5.5.56c.3.55 1.35 2.28 2.72 2.32l.04.4c.03.3-.35.85-.68 1.05h-6.66c-.43 0-.79.35-.79.79s.35.79.79.79h6.43l-.18.81c-.24.59-.81 1-1.44 1.04l-6.46.5c-.31.02-.58.21-.72.5L24.1 37.03c-.1.21-.1.44-.02.65.08.21.24.38.44.48.11.05.23.08.36.08.33 0 .64-.2.78-.51l2.29-10.22 5.94-.46c1.28-.08 2.42-.9 2.9-2.1l.52-1.26c.06-.22.06-.41-.02-.63l-.02-.08c-.02-.06-.04-.13-.07-.21.64-.49.91-1.17.82-2.07z"
        />
      </Svg>
    )}
  </TouchableOpacity>
);

export const CompletedActivityHeaderLeft = ({ PageName, navigation }) => (
  <TouchableOpacity
    onPress={() => {
      PageName === 'LogBook'
        ? navigation.navigate('HomeStackNavigator', { screen: 'LogBook' })
        : navigation.navigate('HomeStackNavigator', { screen: 'Home' });
    }}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const AddActivityHeaderLeft = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('HomeStackNavigator', { screen: 'Home' })}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const NewRequestHeaderLeft = ({ navigation }) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('HomeStackNavigator', { screen: 'AllFriends' })
    }>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const AllFriendsHeaderLeft = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('HomeStackNavigator', { screen: 'Home' })}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const SignUpEmailVerificationHeaderLeft = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Public', { screen: 'SignUp' })}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const NewsFeedHeaderLeft = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('AllFriends')}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const HealthHeaderLeft = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const ActiveTimeHeaderLeft = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const ActivitiesHeaderLeft = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const EnergyHeaderLeft = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const ProfileDetailHeaderLeft = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const MyLocationHeaderLeft = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const UnFriendListHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() =>
        navigation.replace('MessagesStackNavigator', { screen: 'ChatListing', params: { index: 0 } })
      }>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const LogBookHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity onPress={() => navigation.replace('Home')}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const SubscriptionHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity onPress={() => navigation.replace('Home')}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const FriendProfileHeaderLeft = ({ PageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        PageName === 'allFriends'
          ? navigation.replace('AllFriends')
          : PageName === 'chatListing'
            ? navigation.replace('Messages', { screen: 'ChatList', params: { index: 0 } })
            : navigation.replace('Home');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const ChatListingHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('Home');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const DiscoverActivitiesHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('HomeStackNavigator', {
          screen: 'Activities',
          dateClicked: currentDate,
        });
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const AddManuallyHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('AddActivity');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const EditActivityHeaderLeft = ({ routeParams, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CompletedActivity', {
          item: routeParams.item,
          dateClicked: routeParams.dateClicked,
          status: '',
        });
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const FriendsMapHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AllFriends');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const MapsHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AddActivity');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const MapRecordingHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AddActivity');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const TrackByImeiHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AddActivity');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const CompletedActivityTrackerHeaderLeft = ({ pageName, navigation, handleBackPress }) => (

  <View>
    <TouchableOpacity
      onPress={() => {
        handleBackPress()
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const FriendCompletedActivityHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AddActivity');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const EditLikesDislikesHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EditProfile');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const EditFoodHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EditProfile');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const EditToysHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EditProfile');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const EditPersonalityHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EditProfile');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const EditWeightHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EditProfile');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const EditHeightHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EditProfile');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const EditBasicDetailsHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EditProfile');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const EditProfileHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ProfileDetail');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const CompareHeaderLeft = ({ pageName, navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ProfileDetail');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const SwitchProfilesHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('Home');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const SliderAdd1HeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('Home');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const SliderAdd2HeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd1');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const SliderAdd3HeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd2');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const SliderAdd4HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd3');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SliderAdd5')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const SliderAdd5HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd4');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SliderAdd6')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const SliderAdd6HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd5');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SliderAdd7')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const SliderAdd7HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd6');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SliderAdd8')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const SliderAdd8HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd7');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SliderAdd9')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const SliderAdd9HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd8');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SliderAdd10')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const SliderAdd10HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd9');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SliderAdd11')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const SliderAdd11HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('SliderAdd10');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const Onboarding1HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity onPress={() => ClearStroage(navigation)}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const Onboarding2HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Onboarding1', {
          status: '',
        })
      }>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const Onboarding3HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity onPress={() => navigation.navigate('Onboarding2')}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const Onboarding4HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('Onboarding3');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Onboarding5')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const Onboarding5HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('Onboarding4');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Onboarding6')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const Onboarding6HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('Onboarding5');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('AddPersonality')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const AddPersonalityHeaderLeft = ({ navigation, selectedPersonality }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('Onboarding6');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => handleAddPersonality({ navigation, selectedPersonality })}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const AddToysHeaderLeft = ({ navigation, data }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('AddPersonality');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleAddToys({ navigation, data })}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const AddFoodHeaderLeft = ({ navigation, data }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('AddToys');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleAddFood({ navigation, data })}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const AddLikesDislikesHeaderLeft = ({ navigation, data }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('AddFood');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleAddLikeDisLike({ navigation, data })}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const Onboarding7HeaderLeft = ({ navigation, data }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('AddLikesDislikes');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Onboarding8')}>
      <Text style={[styles.skiptext, { marginLeft: 270 }]}>Skip</Text>
    </TouchableOpacity>
  </View>
);

export const Onboarding8HeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('AddLikesDislikes');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const FindMeHeaderLeft = ({ navigation }) => (
  <View style={styles.navheader}>
    <TouchableOpacity
      onPress={() => {
        navigation.replace('Home');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);
export const ActivityDescriptionLeftHeader = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => {
      navigation.replace('NewsFeed');
    }}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const SettingsLeftHeader = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => {
      navigation.goBack();
    }}>
    <Ionicons
      color="#223656"
      name="chevron-back"
      style={styles.backicon}
      size={30}
    />
  </TouchableOpacity>
);

export const LikesListingLeftHeader = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => {
      navigation.goBack();
    }}>
    <Ionicons color="#223656" name="chevron-back" size={30} />
  </TouchableOpacity>
);
export const NotificationLeftHeader = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => {
      navigation.goBack();
    }}>
    <Ionicons color="#223656" name="chevron-back" size={30} />
  </TouchableOpacity>
);

export const GroupInfoLeftHeader = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('GroupsList');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const GroupsListLeftHeader = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AllFriends');
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const CreateGroupHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.goBack()
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const GroupInnerHeaderLeft = ({ navigation }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('MessagesStackNavigator',{screen:'GroupsList'})
      }}>
      <Ionicons
        color="#223656"
        name="chevron-back"
        style={styles.backicon}
        size={30}
      />
    </TouchableOpacity>
  </View>
);

export const GroupInnerRightHeader = ({ navigation,chatProps }) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('GroupChat', { userInfo: chatProps, });
      }}>
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
  </View>
);