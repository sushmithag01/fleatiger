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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Regex from './Regex/Regex';
import ErrorText from './ErrorText/ErrorText';
import {BottomSheet, Button, ListItem} from '@rneui/themed';
import Svg, {Path, G, Defs, ClipPath, Circle, Mask} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import {
  OtpApi,
  OtpSignUpApi,
  ResendOtpSignUpApi,
  SignUpApi,
} from './API/ApiCalls';
import OTPTextInput from 'react-native-otp-textinput';
import {useIsFocused} from '@react-navigation/native';
import Loader from './CommonScreens/Loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SignUpEmailVerificationHeaderLeft} from '../navigation/CustomBackNavigation';
import {Screen} from 'react-native-screens';

const SignUpEmailVerification = ({navigation}) => {
  // otp
  const [Otp, setOTP] = useState('');
  const [OtpErr, setOTPErr] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <SignUpEmailVerificationHeaderLeft navigation={navigation} />
      ),
    });
  }, [navigation]);

  // otp-api
  const handleOtpSave = async () => {
    console.log('Otp.length', Otp.length);
    if (Otp.length == 0) {
      setOTPErr(ErrorText.OtpRequiredError);
    }
    if (Otp.length != 0 && OtpErr.length == 0) {
      setOTPErr('');
      const UserID = await AsyncStorage.getItem('userId');
      const data = {
        user_id: parseInt(UserID),
        otp: parseInt(Otp),
      };
      const Response = await OtpSignUpApi(data);
      console.log(Response, 'OtpSignUpApi');
      if (Response.success == true) {
        AsyncStorage.setItem(
          'userEmailVerified',
          JSON.stringify(Response.email_verified),
        );
        AsyncStorage.setItem(
          'userPetCount',
          JSON.stringify(Response.pet_count),
        );
        // setOtpPopup(false)
        setOTP('');
        setOTPErr('');
        // setLoading(true)
        setTimeout(() => {
          // setLoading(false)
          navigation.navigate('Public', {
            Screen: 'Onboarding1',
            status: 'new',
          });
        }, 1000);
      } else {
        setOTPErr(Response.message);
      }
    }
  };

  // ResendOtpSignUpApi
  const handleResendOtpSave = async () => {
    const email = await AsyncStorage.getItem('email');
    const data = {
      email: email,
    };
    const Response = await ResendOtpSignUpApi(data);
    console.log(Response, 'ResendOtpSignUpApi');
    if (Response.success == true) {
      Toast.show(Response.message, {
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
      Toast.show(Response.message, {
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

  return (
    <>
      <ScrollView
        style={[styles.emailmainMediumbtn, styles.emailsheetmain]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <View>
          <Text style={styles.otpText}>OTP Verification</Text>
        </View>
        <View style={styles.logosection}>
          <Svg
            width={100}
            height={100}
            viewBox="0 0 79 79"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            x>
            <G clipPath="url(#clip0_547_638)">
              <Path
                d="M39.5 79C61.315 79 79 61.315 79 39.5S61.315 0 39.5 0 0 17.685 0 39.5 17.685 79 39.5 79z"
                fill="#436077"
              />
            </G>
            <G clipPath="url(#clip1_547_638)">
              <Path
                d="M70.605 32.768L52.213 19.401a2.23 2.23 0 00-2.352-.128 2.666 2.666 0 00-.292.182l-9.224 5.741a2.138 2.138 0 01-2.21 0l-9.193-5.728a2.434 2.434 0 00-.352-.215 1.524 1.524 0 00-.412-.162 2.18 2.18 0 00-1.9.314L7.887 32.768a2.3 2.3 0 00-.588 2.971l7.546 13.944a2.273 2.273 0 004.086.078l1.127-2.416 9.655 8.932a13.947 13.947 0 0019.057 0l9.662-8.938 1.13 2.421a2.272 2.272 0 004.086-.078l7.541-13.945a2.3 2.3 0 00-.583-2.97l-.001.001zM47.773 55.201a12.564 12.564 0 01-7.8 3.348v-4.548c.107-.055.208-.122.3-.2l4.819-4.073a2.793 2.793 0 00-.268-4.473l-1.631-1.076a1.6 1.6 0 00-1.642-.067l-1.539.844a1.6 1.6 0 01-1.532 0l-1.539-.844a1.592 1.592 0 00-1.642.067l-1.63 1.076a2.793 2.793 0 00-.268 4.472l4.819 4.074c.09.075.186.14.289.192v4.555a12.564 12.564 0 01-7.8-3.348l-10-9.25 10.804-23.149 5.846 3.64.01.005.01.006a3.605 3.605 0 003.717 0l.01-.006.01-.006 5.857-3.645 10.8 23.151-10.003 9.255h.003z"
                fill="#fff"
              />
            </G>
            <Defs>
              <ClipPath id="clip0_547_638">
                <Path fill="#fff" d="M0 0H79V79H0z" />
              </ClipPath>
              <ClipPath id="clip1_547_638">
                <Path
                  fill="#fff"
                  transform="translate(7 19)"
                  d="M0 0H64.492V41.04H0z"
                />
              </ClipPath>
            </Defs>
          </Svg>
        </View>
        <Text style={styles.forgotcontent}>
          Enter the OTP sent to your email
        </Text>
        {/* <View style={styles.space20}></View> */}
        <View>
          <OTPTextInput
            inputCount={6}
            inputCellLength={1}
            tintColor="#495F75"
            keyboardType="numeric"
            autoFocusOnLoad={false}
            textInputStyle={styles.otp}
            containerStyle={styles.otpInput}
            handleTextChange={value => {
              setOTP(value);
              setOTPErr('');
            }}
          />
        </View>
        {OtpErr && <Text style={styles.errormsg}>{OtpErr}</Text>}
        <View style={styles.space20}></View>
        <View style={styles.noaccountmain}>
          <Text style={styles.noaccount}>Didn’t receive it? </Text>
          <TouchableOpacity onPress={handleResendOtpSave}>
            <Text style={styles.signuptext}>Click here</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.space30}></View>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <TouchableOpacity
          style={styles.bluebtn}
          onPress={() => handleOtpSave()}>
          <Text style={styles.bluebtntext}>Verify & Proceed</Text>
        </TouchableOpacity>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
      </ScrollView>
    </>
  );
};

export default SignUpEmailVerification;
