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
  Button,
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
import DatePicker from 'react-native-date-picker';
import PetNameImg from './PetNameImg';
import {useIsFocused} from '@react-navigation/native';
import ErrorText from './ErrorText/ErrorText';
import {
  Onboarding3HeaderLeft,
  SliderAdd3HeaderLeft,
} from '../navigation/CustomBackNavigation';

const Onboarding3 = ({navigation}) => {
  // feilds
  const [birthday, setbirthday] = useState('Enter Birthday');
  const [birthdayErr, setbirthdayErr] = useState('');

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [Name, setName] = useState('');
  const isFocused = useIsFocused();
  // show-name
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Onboarding3HeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      getName();
    }
  }, [isFocused]);

  const getName = async () => {
    const petName = await AsyncStorage.getItem('petName');
    setName(petName);

    //  to-detect-add now
    const status = await AsyncStorage.getItem('IsAdd');
    if (status == 1) {
      setbirthday('Enter Birthday');
    }
  };

  const handleNext = () => {
    if (birthday == 'Enter Birthday') {
      setbirthdayErr(ErrorText.BirthdayRequired);
    } else {
      AsyncStorage.setItem('birthday', birthday);
      navigation.navigate('Onboarding4');
    }
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          style={styles.fleamain}
          showsVerticalScrollIndicator={false}>
          {/* <View style={styles.space20}></View>
          <View style={styles.space20}></View> */}
          {/* <View style={styles.navheader}>
            <TouchableOpacity onPress={() => navigation.navigate('Onboarding2')}>
              <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Onboarding4')}>
              <Text style={styles.skiptext}>Skip</Text>
            </TouchableOpacity>
          </View> */}

          {/* <View style={styles.space20}></View> */}

          <PetNameImg />

          {/* <View style={[styles.logosection,styles.profilesec]}>
        <Image source={require('../assets/profile.png')}></Image>        
       </View>
       
       <View style={styles.editnamemain}>
          <Text style={styles.editnametext}>{Name == '' || null ? 'Lucky': Name}</Text>
        </View> */}

          {/* <Text style={styles.familytext}>Family Member</Text>  */}

          <View style={styles.space20}></View>
          <View style={styles.space20}></View>

          <View>
            <View style={styles.inputmain}>
              <View style={[styles.labelContainer, styles.selecttext]}>
                <Text style={styles.label}>
                  Birthday<Text style={{color: '#f00732'}}>*</Text>
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.leftselect}>
                  <View style={styles.selecticon}>
                    <Svg
                      id="icons-RZ_Weiss"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 50 50"
                      width={45}
                      height={45}>
                      <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                      <Path
                        d="M11.87 27.62v11.89c0 .27.22.5.5.5h25.27c.27 0 .5-.22.5-.5V27.62c0-2.33-1.9-4.23-4.23-4.23h-6.85v-6.04c0-.26-.2-.44-.5-.44h-3.17c-.24 0-.44.2-.44.44v6.04H16.1c-2.33 0-4.23 1.9-4.23 4.23zm12.07-9.22c0-.3.25-.55.55-.55h1.01c.3 0 .55.25.55.55v4.99h-2.12V18.4zm-5.4 10.36c.52-.51.98-.95 1.54-.95.52 0 1.02.35 1.6.76.82.58 1.84 1.29 3.32 1.29s2.48-.71 3.3-1.27c.6-.42 1.12-.78 1.67-.78s.98.44 1.5.94c.66.64 1.4 1.36 2.48 1.36s2.11-.36 2.97-1.03l.2-.16v9.42c0 .37-.3.67-.67.67H13.53a.67.67 0 01-.67-.67v-9.42l.2.16c.86.68 1.89 1.03 2.97 1.03s1.86-.72 2.51-1.35zM22.7 13.24c0 1.28 1.05 2.36 2.3 2.36s2.3-1.04 2.3-2.36-.96-2.78-2.09-3.18h-.01a.42.42 0 00-.21-.06c-.15 0-.27.09-.33.15-.14.16-.3.34-.47.51-.73.79-1.49 1.6-1.49 2.57zm2.14-1.86c.07-.08.13-.15.19-.21l.07-.08.09.06c.66.46 1.17 1.38 1.17 2.09 0 .76-.61 1.37-1.37 1.37-.71 0-1.31-.63-1.31-1.37 0-.59.66-1.32 1.15-1.86z"
                        fill="#223656"
                      />
                    </Svg>
                  </View>
                </View>
                <View>
                  <Text
                    placeholder="Enter Birthday"
                    style={styles.selectedTextStyle}
                    onPress={() => setOpen(true)}>
                    {birthday}
                  </Text>
                </View>
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  mode="date"
                  title="Select Birthday"
                  value={date}
                  maximumDate={new Date()}
                  onConfirm={date => {
                    setOpen(false);
                    setDate(date);
                    var formattedDate =
                      date.getFullYear() +
                      '-' +
                      (date.getMonth() + 1) +
                      '-' +
                      date.getDate();
                    setbirthday(formattedDate);
                    setbirthdayErr('');
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </View>
              {birthdayErr && (
                <Text style={styles.errormsg}>{birthdayErr}</Text>
              )}
            </View>
          </View>

          <View style={styles.imgcenter}>
            <Image source={require('../assets/pic6.png')}></Image>
          </View>
          <View style={styles.dotmain}>
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dotactive} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
          </View>
          <Text style={styles.onboardtext}>When is {Name} birthday?</Text>
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
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Onboarding3;
