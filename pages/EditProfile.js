import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ImageBackground,
} from 'react-native';
import styles from '../Common.css';
import {SvgXml} from 'react-native-svg';
import Logo from '../assets/fleatiger-logo.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import {Avatar, Badge, Icon, withBadge, Input} from '@rneui/themed';
import FontAwesome from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import {
  EditPetDetailsApi,
  GetBreadDropdownApi,
  UpdateProfileImgApi,
} from './API/ApiCalls';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {BottomSheet, Button, ListItem} from '@rneui/themed';
import UpdateProfileImageName from './UpdateProfileimageName';
import ViewBasicDetails from './ViewBasicDetails';
import {useIsFocused} from '@react-navigation/native';
import Profile from './Profile';
import ErrorText from './ErrorText/ErrorText';
import Loader from './CommonScreens/Loader';
import {EditProfileHeaderLeft} from '../navigation/CustomBackNavigation';

const EditProfile = ({navigation}) => {
  const [data, setData] = useState([]);
  const [PetName, setPetName] = useState('');
  const [EditPetImg, setEditPetImg] = useState('https://devapi.fleatiger.com/');
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <EditProfileHeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      GetProfileData();
    }
  }, [isFocused]);

  const GetProfileData = async () => {
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      id: PetId,
    };
    const Response = await EditPetDetailsApi(payload);
    if (Response == false) {
      setLoading(false);
      Toast.show(ErrorText.InternalError, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    } else {
      if (Response.success == true) {
        setData(Response?.data[0]);
        setPetName(Response?.data[0]?.pet_name);
        setEditPetImg(Response?.data[0]?.pet_image_path);
        setLoading(false);
      } else {
        setLoading(false);
        Toast.show(ErrorText.InternalError, {
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
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <SafeAreaView>
        <ScrollView
          style={styles.fleamain}
          showsVerticalScrollIndicator={false}>
          {/* <View style={styles.navheader}>
            <TouchableOpacity onPress={() => navigation.navigate('HomeStackNavigator', { screen: 'Home' })}>
              <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
            </TouchableOpacity>
          </View> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EditBasicDetails')}>
            <Profile
              petImage={data?.pet_image_path}
              petName={data?.pet_name}
              user_name={data?.user_name == '' ? '' : data?.user_name}
            />
            <Text style={styles.familytext}>Family Member</Text>
          </TouchableOpacity>

          <View>
            <ViewBasicDetails
              data={data}
              PetName={PetName}
              EditPetImg={EditPetImg}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default EditProfile;
