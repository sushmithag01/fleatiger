import React, { useRef, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../../Common.css';
import Svg, {
  Path,
  G,
  Defs,
  ClipPath,
} from 'react-native-svg';
import Entypo from 'react-native-vector-icons/Entypo';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import { DeleteAccountConfirmationApi, DeleteAccountVerifyApi, DeleteUserAccApi } from '../API/ApiCalls';
import OTPTextInput from 'react-native-otp-textinput';
import { BottomSheet, } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ErrorText from '../ErrorText/ErrorText';

const UserAccDeleteConfirmation = props => {
  const { setCongratsMsg, congratsMsg } = props;
  const navigation = useNavigation();
  const currentTimeZone = moment.tz.guess();
  const [OtpPopup, setOtpPopup] = useState(false);
  // otp
  const [Otp, setOTP] = useState('');
  const [OtpErr, setOTPErr] = useState(false);
  const otpInputRef = useRef(null);

  const [ApiErr,setApiErr]=useState('')

  const handleContinueBtn = async () => {
    setApiErr('')
    let payload = {
      user_id: parseInt(await AsyncStorage.getItem('userId')),
      time_zone: currentTimeZone,
    }
    const data = await DeleteAccountConfirmationApi(payload);
    console.log("data",data,payload)
    if (data.status === 200) {
      Toast.show(data.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    // Wait for toast to finish before showing the popup
    setTimeout(() => {
      setOtpPopup(true);
    }, 3500);
    } else {
      Toast.show(data.message, {
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

  const handleDeleteUserAcc = async () => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
      time_zone: currentTimeZone,
    };
    const deleteUser = await DeleteUserAccApi(payload);
    if (deleteUser === false) {
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
      if (deleteUser.status == 200) {
        setOtpPopup(false);
        Toast.show(deleteUser.message, {
          duration: Toast.durations.LONG,
          position: 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#fff',
          textColor: '#000',
        });
        navigation.replace('Public', { screen: 'SignIn' });
        AsyncStorage.clear();
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

  const handleVerifyOtp = async () => {
    setApiErr('')
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
      time_zone: currentTimeZone,
      otp: Otp
    }
    const responseData = await DeleteAccountVerifyApi(payload)
    // console.log("responseData",responseData,payload)
   
    if (responseData.status === 200) {
      setApiErr("")
      // Toast.show(responseData.message, {
      //   duration: Toast.durations.LONG,
      //   position: 50,
      //   shadow: true,
      //   animation: true,
      //   hideOnPress: true,
      //   delay: 0,
      //   backgroundColor: '#fff',
      //   textColor: '#000',
      // });
      handleDeleteUserAcc();
    } else {
      setApiErr(responseData.message)
      // Toast.show(ErrorText.InternalError, {
      //   duration: Toast.durations.LONG,
      //   position: 50,
      //   shadow: true,
      //   animation: true,
      //   hideOnPress: true,
      //   delay: 0,
      //   backgroundColor: '#fff',
      //   textColor: '#000',
      // });
    }
  }

  return (
    <View style={{ backgroundColor: 'transparent', marginTop: 200 }}>
      <View style={[styles.modalView]}>
        <View style={styles.logopopup}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={79}
            height={79}
            viewBox="0 0 79 79"
            fill="none">
            <G clipPath="url(#clip0_120_3)">
              <Path
                d="M39.5 79C61.315 79 79 61.315 79 39.5S61.315 0 39.5 0 0 17.685 0 39.5 17.685 79 39.5 79z"
                fill="#92BCBF"
              />
              <G clipPath="url(#clip1_120_3)">
                <Path
                  d="M72.662 32.29l-19.45-14.122a2.359 2.359 0 00-2.487-.136c-.107.058-.21.122-.309.193l-9.754 6.065a2.262 2.262 0 01-2.337 0l-9.721-6.052a2.576 2.576 0 00-.372-.227 1.611 1.611 0 00-.436-.17 2.305 2.305 0 00-2.01.331L6.339 32.29a2.43 2.43 0 00-.621 3.138l7.98 14.732a2.401 2.401 0 002.134 1.39 2.405 2.405 0 002.186-1.308l1.192-2.552 10.21 9.436a14.757 14.757 0 0020.152 0l10.218-9.443 1.195 2.558a2.4 2.4 0 003.453.92c.378-.246.678-.594.868-1.002l7.974-14.733a2.427 2.427 0 00-.616-3.139l-.001.003zm-24.145 23.7a13.293 13.293 0 01-8.248 3.536v-4.805c.113-.058.22-.128.317-.21l5.096-4.304a2.952 2.952 0 00-.283-4.725l-1.725-1.137a1.693 1.693 0 00-1.736-.07l-1.628.89a1.693 1.693 0 01-1.62 0l-1.627-.89a1.684 1.684 0 00-1.737.07l-1.724 1.137a2.951 2.951 0 00-.283 4.724l5.096 4.304c.094.079.197.147.306.203v4.812a13.293 13.293 0 01-8.249-3.537l-10.575-9.772L31.324 21.76l6.182 3.844.01.007.01.006a3.815 3.815 0 003.931 0l.01-.006.011-.007 6.194-3.85 11.421 24.458-10.578 9.777h.003z"
                  fill="#223656"
                />
              </G>
            </G>
            <Defs>
              <ClipPath id="clip0_120_3">
                <Path fill="#fff" d="M0 0H79V79H0z" />
              </ClipPath>
              <ClipPath id="clip1_120_3">
                <Path
                  fill="#fff"
                  transform="translate(5.4 17.744)"
                  d="M0 0H68.1992V43.3574H0z"
                />
              </ClipPath>
            </Defs>
          </Svg>
        </View>
        <Text style={styles.modalText}>
          Do you really want to delete your account?{' '}
        </Text>
        <Text style={styles.modalinnerText}>
          {' '}
          If you want to reuse your tracker, be sure to delete the
          IMEI/tracker ID in the profile before deleting the profile.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            padding: 0,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Pressable
            onPress={() => handleContinueBtn()}
            style={styles.buttonSubs}>
            <Text style={styles.btnText1}>YES</Text>
          </Pressable>
          <Pressable
            onPress={() => { navigation.navigate('ProfileDetail')}}
            style={styles.buttonSubs}>
            <Text style={styles.btnText1}>NO</Text>
          </Pressable>
        </View>
      </View>



      <BottomSheet modalProps={{}} isVisible={OtpPopup}>
        <ScrollView
          style={[styles.bottomsheetmainMediumbtn, styles.bottomsheetmain]}
          showsVerticalScrollIndicator={false}>
          {/* <TouchableOpacity onPress={() => setOtpPopup(false)}>
            <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
          </TouchableOpacity> */}
          {ApiErr && <Text style={[styles.errormsg,{textAlign:'center',fontSize:20,marginTop:20}]}>{ApiErr}</Text>}
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.otpText}>OTP Verification</Text>
          </View>
          <View style={styles.logosection}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={79}
              height={79}
              viewBox="0 0 79 79"
              fill="none">
              <G clipPath="url(#clip0_120_3)">
                <Path
                  d="M39.5 79C61.315 79 79 61.315 79 39.5S61.315 0 39.5 0 0 17.685 0 39.5 17.685 79 39.5 79z"
                  fill="#92BCBF"
                />
                <G clipPath="url(#clip1_120_3)">
                  <Path
                    d="M72.662 32.29l-19.45-14.122a2.359 2.359 0 00-2.487-.136c-.107.058-.21.122-.309.193l-9.754 6.065a2.262 2.262 0 01-2.337 0l-9.721-6.052a2.576 2.576 0 00-.372-.227 1.611 1.611 0 00-.436-.17 2.305 2.305 0 00-2.01.331L6.339 32.29a2.43 2.43 0 00-.621 3.138l7.98 14.732a2.401 2.401 0 002.134 1.39 2.405 2.405 0 002.186-1.308l1.192-2.552 10.21 9.436a14.757 14.757 0 0020.152 0l10.218-9.443 1.195 2.558a2.4 2.4 0 003.453.92c.378-.246.678-.594.868-1.002l7.974-14.733a2.427 2.427 0 00-.616-3.139l-.001.003zm-24.145 23.7a13.293 13.293 0 01-8.248 3.536v-4.805c.113-.058.22-.128.317-.21l5.096-4.304a2.952 2.952 0 00-.283-4.725l-1.725-1.137a1.693 1.693 0 00-1.736-.07l-1.628.89a1.693 1.693 0 01-1.62 0l-1.627-.89a1.684 1.684 0 00-1.737.07l-1.724 1.137a2.951 2.951 0 00-.283 4.724l5.096 4.304c.094.079.197.147.306.203v4.812a13.293 13.293 0 01-8.249-3.537l-10.575-9.772L31.324 21.76l6.182 3.844.01.007.01.006a3.815 3.815 0 003.931 0l.01-.006.011-.007 6.194-3.85 11.421 24.458-10.578 9.777h.003z"
                    fill="#223656"
                  />
                </G>
              </G>
              <Defs>
                <ClipPath id="clip0_120_3">
                  <Path fill="#fff" d="M0 0H79V79H0z" />
                </ClipPath>
                <ClipPath id="clip1_120_3">
                  <Path
                    fill="#fff"
                    transform="translate(5.4 17.744)"
                    d="M0 0H68.1992V43.3574H0z"
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
              ref={otpInputRef} // Ref for OTPTextInput
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
            <TouchableOpacity onPress={() => handleContinueBtn()}>
              <Text style={styles.signuptext}>Click here</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space30}></View>
          {/* <View style={styles.space20}></View>
                    <View style={styles.space20}></View> */}
          <TouchableOpacity
            style={styles.bluebtn}
            onPress={() => handleVerifyOtp()}
          >
            <Text style={styles.bluebtntext}>Verify & Proceed</Text>
          </TouchableOpacity>
          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

export default UserAccDeleteConfirmation;
