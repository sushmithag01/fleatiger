import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
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
import Regex from './Regex/Regex';
import ErrorText from './ErrorText/ErrorText';
import PetNameImg from './PetNameImg';
import {useIsFocused} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {checkImeiExixtsApi} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import {Onboarding6HeaderLeft} from '../navigation/CustomBackNavigation';

const Onboarding6 = ({navigation}) => {
  const [ImeiNumber, setImeiNumber] = useState('');
  const [ImeiNumberErr, setImeiNumberErr] = useState('');

  const handleChange = (value, event) => {
    if (value == 'ImeiNumber') {
      setImeiNumber(event.nativeEvent.text);
      if (Regex.OnlyNumberTest.test(event.nativeEvent.text) === false) {
        setImeiNumberErr(ErrorText.ImeiNumberValidError);
      } else {
        setImeiNumberErr('');
      }
    }
  };

  // to detect - add now or finish
  const isFocused = useIsFocused();
  // show-name
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Onboarding6HeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      getAddStatus();
    }
  }, [isFocused]);

  const getAddStatus = async () => {
    const status = await AsyncStorage.getItem('IsAdd');
    if (status == 1) {
      setImeiNumber('');
      setImeiNumberErr('');
    }
  };

  const handleNext = async () => {
    if (ImeiNumber) {
      checkImeiNum();
    } else {
      navigation.navigate('AddPersonality');
    }

    // if(IsAddNewPet == true){
    // navigation.navigate('HomeStackNavigator',{screen:'AddPersonality'})
    // }else{
    //   navigation.navigate('Onboarding7')
    //   AsyncStorage.setItem("AddFriend", isClickedPlus)
    // }
  };

  const checkImeiNum = async () => {
    if (ImeiNumber) {
      let payload = {
        imei: ImeiNumber,
      };
      const checkImei = await checkImeiExixtsApi(payload);
      if (checkImei.status === 200) {
        AsyncStorage.setItem('ImeiNumber', ImeiNumber);
        // check-button-click for addFriend or new pet
        const IsAddNewPet = await AsyncStorage.getItem('AddFriend');
        const isClickedPlus = JSON.stringify(0);
        //  navigation.navigate('Onboarding7')
        navigation.navigate('AddPersonality');
        setImeiNumber('');
        setImeiNumberErr('');
      } else {
        Toast.show(checkImei.message, {
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
      console.log(checkImei);
    } else {
      setImeiNumberErr(ErrorText.ImeiNumberValidError);
    }
  };
  return (
    <>
      <ScrollView style={styles.fleamain} showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          <View style={styles.space20}></View>
          {/* <View style={styles.space20}></View> */}
          {/* <View style={styles.space20}></View>
          <View style={styles.navheader}>
            <TouchableOpacity onPress={() => navigation.navigate('Onboarding5')}>
              <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddPersonality')}>
              <Text style={styles.skiptext}>Skip</Text>
            </TouchableOpacity>
          </View>
 */}

          {/* <View style={styles.space20}></View> */}
          <PetNameImg />
          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.createacc}>Add Device</Text>
            {/* <Text style={styles.forgotcontent1}>Enter Tracker Number provided {"\n"} by the tracker</Text> */}
            <Text style={styles.forgotcontent1}>
              If you do not have fleaTag tracker yet, skip this step for now
            </Text>
          </View>
          <View>
            <View style={styles.inputContainer1}>
              <TextInput
                placeholder="Enter Tracker Number"
                style={styles.selectedTextStyle2}
                maxLength={15}
                value={ImeiNumber}
                onChange={event => {
                  handleChange('ImeiNumber', event);
                }}
              />
            </View>
            {ImeiNumberErr && (
              <Text style={styles.errormsg}>{ImeiNumberErr}</Text>
            )}
          </View>
          <View style={styles.dotmain}>
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dotactive} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
          </View>
          <Text style={styles.onboardtext}>
            The tracker number can be found underneath the tracker itself.
          </Text>
          <View style={styles.arrowright}>
            <TouchableOpacity onPress={() => handleNext()}>
              <Svg
                width={70}
                height={70}
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <G clipPath="url(#clip0_574_643)">
                  <Path
                    d="M35 70c19.33 0 35-15.67 35-35S54.33 0 35 0 0 15.67 0 35s15.67 35 35 35z"
                    fill="#436077"
                  />
                  <Path
                    d="M42.575 35a1.1 1.1 0 01-.063.375.871.871 0 01-.212.325l-6.6 6.6c-.2.2-.438.3-.713.3a.973.973 0 01-.712-.3.96.96 0 01-.3-.7c0-.267.1-.5.3-.7l4.9-4.9h-11.2a.926.926 0 01-.7-.288A.99.99 0 0127 35a.97.97 0 01.287-.713A.97.97 0 0128 34h11.175l-4.9-4.9a.96.96 0 01-.3-.7c0-.267.1-.5.3-.7.2-.2.437-.3.712-.3.275 0 .513.1.713.3l6.6 6.6c.1.1.17.208.212.325a1.1 1.1 0 01.063.375z"
                    fill="#fff"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_574_643">
                    <Path fill="#fff" d="M0 0H70V70H0z" />
                  </ClipPath>
                </Defs>
              </Svg>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </>
  );
};

export default Onboarding6;
