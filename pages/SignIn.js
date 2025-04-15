import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import styles from '../Common.css';
import { SvgXml } from 'react-native-svg';
import Logo from '../assets/fleatiger-logo.svg';
import Svg, { Path, G, Defs, ClipPath, Circle, Mask } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import OTPTextInput from 'react-native-otp-textinput';
import ErrorText from './ErrorText/ErrorText';
import Regex from './Regex/Regex';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import {
  ForgotPasswordApi,
  OtpApi,
  ResetPasswordApi,
  SignInApi,
  SocialLoginApi,
} from './API/ApiCalls';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  appleAuthAndroid,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import { useIsFocused } from '@react-navigation/native';

const SignIn = ({ navigation }) => {
  const isFouse = useIsFocused();
  useEffect(() => {
    if (isFouse) {
      // AsyncStorage.clear();
      GoogleSignin.configure({
        webClientId:
          '208553372865-dq8oovdf8pktlteuvnpr60d7n49n1lj5.apps.googleusercontent.com',
        iosClientId:
          '208553372865-s6a8g00lfsv0d9thhitfb6etm1pf6gsv.apps.googleusercontent.com',
      });
    }
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // err
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  // otp
  const [Otp, setOTP] = useState('');
  const [OtpErr, setOTPErr] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  // popup
  const [isVisible, setIsVisible] = useState(false);
  const [otpPopUp, setOtpPopUp] = useState(false);
  const [resetPasswordPopup, setResetPasswordPopup] = useState(false);
  // Reset-password
  const [newpassword, setNewpassword] = useState('');
  const [resetpassword, setResetpassword] = useState('');
  const [isMatchPassword, setIsMatchPassword] = useState('');
  const [newpasswordErr, setNewpasswordErr] = useState('');
  const [resetpasswordErr, setResetpasswordErr] = useState('');
  // showOrHide-password
  const [passwordShow, setPasswordShow] = useState(true);
  const handleShowPassword = () => {
    setPasswordShow(!passwordShow);
  };
  //  showOrHide- new password
  const [newpasswordShow, setNewpasswordShow] = useState(true);
  const handleNewShowPassword = () => {
    setNewpasswordShow(!newpasswordShow);
  };
  //  showOrHide- repeat password
  const [resetpasswordShow, setResetpasswordShow] = useState(true);
  const handleResetShowPassword = () => {
    setResetpasswordShow(!resetpasswordShow);
  };
  //  forgot-password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailErr, setForgotEmailErr] = useState('');
  // handleinput
  const handleFormFeild = (value, event) => {
    if (value == 'email') {
      setEmail(event.nativeEvent.text);
      if (Regex.EmailTest.test(event.nativeEvent.text) === false) {
        setEmailErr(ErrorText.EmailValidError);
      } else {
        setEmailErr('');
      }
    }
    if (value == 'password') {
      setPassword(event.nativeEvent.text);
      if (Regex.PasswordTest.test(event.nativeEvent.text) === false) {
        setPasswordErr(ErrorText.PasswordValidError);
      } else {
        setPasswordErr('');
      }
    }
  };
  //  save-signin
  const handleSignIn = async () => {
    if (email.length == 0) {
      setEmailErr(ErrorText.EmailRequiredError);
    }
    if (password.length == 0) {
      setPasswordErr(ErrorText.PasswordRequiredError);
    }
    if (
      email.length != 0 &&
      password.length != 0 &&
      emailErr.length == 0 &&
      passwordErr.length == 0
    ) {
      setEmailErr('');
      setPasswordErr('');
      const data = {
        email: email,
        password: password,
      };
      const Response = await SignInApi(data);
      // console.log('Login Response', Response);
      if (Response.status === 200) {
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
        await AsyncStorage.setItem('selected_time_format', JSON.stringify(Response.time_format));
        await AsyncStorage.setItem('PetName', Response.pet_name);
        await AsyncStorage.setItem('email', Response.email);
        await AsyncStorage.setItem('token', Response.jwt_token);
        await AsyncStorage.setItem('userId', JSON.stringify(Response.user_id));
        await AsyncStorage.setItem('firstName', Response.first_name);
        await AsyncStorage.setItem('lastName', Response.last_name);
        await AsyncStorage.setItem('PetId', JSON.stringify(Response.active_pet_id));
        await AsyncStorage.setItem(
          'userEmailVerified',
          JSON.stringify(Response.email_verified),
        );
        await AsyncStorage.setItem(
          'userPetCount',
          JSON.stringify(Response.pet_count),
        );
        if (Response.pet_count >= 1) {
          setEmail('');
          setPassword('');
          console.log(Response.pet_count, 'more than 1');
          navigation.replace('HomeStackNavigator', { screen: 'Home' });
        } else {
          console.log(Response.pet_count, 'lesser');
          navigation.navigate('Onboarding1', {
            status: '',
          });
        }
      } else {
        if (Response.message === 'Network Error') {
          Toast.show('Something went wrong..!!', {
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
      }
    }
  };
  // password
  const handleChange = (value, event) => {
    if (value == 'forgotEmail') {
      setForgotEmail(event.nativeEvent.text);
      if (Regex.EmailTest.test(event.nativeEvent.text) === false) {
        setForgotEmailErr(ErrorText.EmailValidError);
      } else {
        setForgotEmailErr('');
      }
    }
    // create-new-password
    if (value == 'newpassword') {
      setNewpassword(event.nativeEvent.text);
      if (Regex.PasswordTest.test(event.nativeEvent.text) === false) {
        setNewpasswordErr(ErrorText.PasswordValidError);
      } else {
        setNewpasswordErr('');
      }
    }
    // repeat-password
    if (value == 'resetpassword') {
      setResetpassword(event.nativeEvent.text);
      if (Regex.PasswordTest.test(event.nativeEvent.text) === false) {
        setResetpasswordErr(ErrorText.PasswordValidError);
      } else {
        setResetpasswordErr('');
      }
    }
  };
  // forgot-api
  const handleForgot = async () => {
    setOTP('');
    if (forgotEmail.length == 0) {
      setForgotEmailErr(ErrorText.EmailRequiredError);
    }
    if (forgotEmail.length != 0 && forgotEmailErr.length == 0) {
      setForgotEmailErr('');
      setIsVisible(false);
      const data = {
        email: forgotEmail,
      };
      const Response = await ForgotPasswordApi(data);
      console.log(Response, 'Response dfghjkjhgf');
      if (Response.success == true) {
        setOTP('');
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
        setOtpPopUp(true);
        setOtpToken(Response.token);
        AsyncStorage.setItem('OtpToken', Response.token);
        AsyncStorage.setItem('userId', JSON.stringify(Response.user_id));
        console.log(Response.otp);
        console.log(Response.token);
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
    }
  };

  // otp-api
  const handleOtpSave = async () => {
    if (Otp.length == 0) {
      setOTPErr(ErrorText.OtpRequiredError);
    }
    if (Otp.length != 0 && OtpErr.length == 0) {
      setOTPErr('');
      const UserID = await AsyncStorage.getItem('userId');
      const data = {
        otp: parseInt(Otp),
        token: otpToken,
        user_id: parseInt(UserID),
      };
      const Response = await OtpApi(data);
      // console.log(Response, "Response")
      setOtpPopUp(false);
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
        // console.log(Response)
        setResetPasswordPopup(true);
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
    }
  };
  // reset-password-api
  const handleResetPassword = async () => {
    if (newpassword.length == 0) {
      setNewpasswordErr(ErrorText.PasswordRequiredError);
    }
    if (resetpassword.length == 0) {
      setResetpasswordErr(ErrorText.PasswordRepeatRequiredError);
    }
    if (newpassword != resetpassword) {
      setIsMatchPassword(ErrorText.PasswordMatchError);
    }
    console.log(
      newpassword.length,
      resetpassword.length,
      newpasswordErr.length,
      resetpasswordErr.length,
      isMatchPassword.length,
      'resetpasswordErr',
      resetpassword,
      newpassword,
    );
    if (
      newpassword.length != 0 &&
      resetpassword.length != 0 &&
      newpasswordErr.length == 0 &&
      resetpasswordErr.length == 0 &&
      isMatchPassword.length == 0
    ) {
      const UserID = await AsyncStorage.getItem('userId');
      const OtpToken = await AsyncStorage.getItem('OtpToken');
      const data = {
        token: OtpToken,
        password: resetpassword,
        user_id: parseInt(UserID),
      };
      const Response = await ResetPasswordApi(data);
      console.log(Response, 'Response');
      setResetPasswordPopup(false);
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
        console.log(Response);
        setTimeout(() => {
          navigation.navigate('SignIn');
        }, 2000);
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
    }
  };
  // Google Sign-in
  const handleGoogleSignin = async () => {
    await GoogleSignin.signOut();
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        SocialLoginApiHandler(userInfo.idToken);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        console.log('Google Sign in error', error);
      }
    }
  };
  //  Apple Sigin
  async function onAppleButtonPress() {
    if (Platform.OS !== 'android') {
      // for ios
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      console.log("appleAuthRequestResponse", appleAuthRequestResponse)
      if (appleAuthRequestResponse.identityToken) {
        await AsyncStorage.setItem(
          'apple_identityToken',
          JSON.stringify(appleAuthRequestResponse.identityToken),
        );
        SocialLoginApiHandler(appleAuthRequestResponse.identityToken);
      } else {
        Toast.show('Something went wrong Please try again..!!', {
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
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );
      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
      }
    }
    // else{
    //  for android
    // appleAuthAndroid.configure({
    //   // The Service ID you registered with Apple
    //   clientId: 'com.example.client-android',

    //   // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
    //   // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
    //   redirectUri: 'https://example.com/auth/callback',

    //   // The type of response requested - code, id_token, or both.
    //   responseType: appleAuthAndroid.ResponseType.ALL,

    //   // The amount of user information requested from Apple.
    //   scope: appleAuthAndroid.Scope.ALL,

    //   // Random nonce value that will be SHA256 hashed before sending to Apple.
    //   nonce: rawNonce,

    //   // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
    //   state,
    // });
    // console.log("appleAuthAndroid",appleAuthAndroid.signIn())

    // Open the browser window for user sign in
    // const response = await appleAuthAndroid.signIn();

    // Send the authorization code to your backend for verification
    // }
  }
  const SocialLoginApiHandler = async data => {
    let payload = {
      auth_token: data,
    };
    const socialResponse = await SocialLoginApi(payload);
    // console.log(socialResponse, "socialResponse")
    if (socialResponse.status === 200) {
      AsyncStorage.setItem('PetName', socialResponse.pet_name);
      AsyncStorage.setItem('email', socialResponse.email);
      AsyncStorage.setItem('token', socialResponse.jwt_token);
      AsyncStorage.setItem('userId', JSON.stringify(socialResponse.user_id));
      AsyncStorage.setItem('firstName', socialResponse.first_name);
      AsyncStorage.setItem('lastName', socialResponse.last_name);
      AsyncStorage.setItem(
        'PetId',
        JSON.stringify(socialResponse.active_pet_id),
      );
      AsyncStorage.setItem(
        'userEmailVerified',
        JSON.stringify(socialResponse.email_verified),
      );
      AsyncStorage.setItem(
        'userPetCount',
        JSON.stringify(socialResponse.pet_count),
      );
      Toast.show(socialResponse.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
      if (socialResponse.pet_count >= 1) {
        // console.log(socialResponse.pet_count, "more than 1")
        navigation.navigate('HomeStackNavigator', { screen: 'Home' });
      } else {
        // console.log(socialResponse.pet_count, "lesser")
        navigation.navigate('Onboarding1', {
          status: '',
        });
      }
    } else {
      Toast.show(socialResponse.message, {
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
      <SafeAreaView>
        <ScrollView
          style={styles.fleamain}
          showsVerticalScrollIndicator={false}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
          </TouchableOpacity>*/}
          <View style={styles.space10}></View>
          <View>
            <Text style={styles.createacc}>Sign in to</Text>
            <Text style={styles.createacc}>your account</Text>
          </View>
          <View style={styles.space50}></View>
          <View style={styles.inputmain}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                Email Address<Text style={{ color: '#f00732' }}>*</Text>
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter email address"
                style={styles.input}
                value={email}
                onChange={e => {
                  handleFormFeild('email', e);
                }}
              />
            </View>
            {emailErr && <Text style={styles.errormsg}>{emailErr}</Text>}
          </View>
          <View style={styles.inputmain}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                Enter Password<Text style={{ color: '#f00732' }}>*</Text>
              </Text>
            </View>
            <View style={[styles.inputContainer, styles.passwordmain]}>
              <TextInput
                placeholder="Enter Password"
                style={styles.input}
                value={password}
                onChange={e => {
                  handleFormFeild('password', e);
                }}
                secureTextEntry={passwordShow}
                autoCapitalize="none"
              />
              {passwordShow ? (
                <TouchableOpacity
                  style={styles.password}
                  onPress={() => handleShowPassword()}>
                  <Entypo
                    name="eye-with-line"
                    size={30}
                    color="#CDD4D9"></Entypo>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.password}
                  onPress={() => handleShowPassword()}>
                  <Entypo name="eye" size={30} color="#CDD4D9"></Entypo>
                </TouchableOpacity>
              )}
            </View>
            {passwordErr && <Text style={styles.errormsg}>{passwordErr}</Text>}
          </View>
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <Text style={styles.forgottext}>Forgot your password?</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.forgotmain} onPress={() => setResetPasswordPopup(true)}>
            <Text style={styles.forgottext}>create</Text>
          </TouchableOpacity> */}
          {/* popup-forgot-password */}
          <BottomSheet modalProps={{}} isVisible={isVisible}>
            <ScrollView
              style={[styles.bottomsheetmain]}
              showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons
                  name="close-outline"
                  size={30}
                  color="#B85A57"></Ionicons>
              </TouchableOpacity>
              <View style={styles.space20}></View>
              <View>
                <Text style={styles.createacc}>Forgot password?</Text>
              </View>
              <Text style={styles.forgotcontent}>
                Enter your email below and we will send OTP to your email for
                resetting the password.
              </Text>
              <View style={styles.space20}></View>
              <View style={styles.inputmain}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>
                    Email Address<Text style={{ color: '#f00732' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Enter email address"
                    style={styles.input}
                    value={forgotEmail}
                    onChange={e => {
                      handleChange('forgotEmail', e);
                    }}
                  />
                </View>
                {forgotEmailErr && (
                  <Text style={styles.errormsg}>{forgotEmailErr}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.bluebtn} onPress={handleForgot}>
                <Text style={styles.bluebtntext}>Submit</Text>
              </TouchableOpacity>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
            </ScrollView>
          </BottomSheet>
          {/* popup-otp */}
          <BottomSheet modalProps={{}} isVisible={otpPopUp}>
            <ScrollView
              style={[styles.bottomsheetmain]}
              showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  setOtpPopUp(false);
                  setOTP('');
                  setOTPErr('');
                }}>
                <Ionicons
                  name="close-outline"
                  size={30}
                  color="#B85A57"></Ionicons>
              </TouchableOpacity>
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
              <View style={styles.space20}></View>
              <View>
                <OTPTextInput
                  // value={Otp}
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
                <TouchableOpacity onPress={handleForgot}>
                  <Text style={styles.signuptext}>Click here</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.space30}></View>
              {/* <View style={styles.space20}></View>
              <View style={styles.space20}></View> */}
              <TouchableOpacity
                style={styles.bluebtn}
                onPress={() => handleOtpSave()}>
                <Text style={styles.bluebtntext}>Verify & Proceed</Text>
              </TouchableOpacity>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
            </ScrollView>
          </BottomSheet>
          {/* popup-reset */}
          <BottomSheet modalProps={{}} isVisible={resetPasswordPopup}>
            <ScrollView
              style={[styles.bottomsheetmain]}
              showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={() => setResetPasswordPopup(false)}>
                <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
              </TouchableOpacity>
              <View style={styles.space20}></View>
              <View>
                <Text style={styles.createacc}>Create a new password</Text>
              </View>
              <Text style={styles.forgotcontent}>
                Choose a strong password.
              </Text>
              <View style={styles.space20}></View>
              <View style={styles.inputmain}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>
                    Password<Text style={{ color: '#f00732' }}>*</Text>
                  </Text>
                </View>
                <View style={[styles.inputContainer, styles.passwordmain]}>
                  <TextInput
                    placeholder="Password"
                    style={styles.input}
                    value={newpassword}
                    onChange={e => {
                      handleChange('newpassword', e);
                    }}
                    secureTextEntry={newpasswordShow}
                  />
                  {newpasswordShow ? (
                    <TouchableOpacity
                      style={styles.password}
                      onPress={() => handleNewShowPassword()}>
                      <Entypo
                        name="eye-with-line"
                        size={30}
                        color="#CDD4D9"></Entypo>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.password}
                      onPress={() => handleNewShowPassword()}>
                      <Entypo name="eye" size={30} color="#CDD4D9"></Entypo>
                    </TouchableOpacity>
                  )}
                </View>
                {newpasswordErr && (
                  <Text style={styles.errormsg}>{newpasswordErr}</Text>
                )}
              </View>
              <View style={styles.inputmain}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>
                    Repeat Password<Text style={{ color: '#f00732' }}>*</Text>
                  </Text>
                </View>
                <View style={[styles.inputContainer, styles.passwordmain]}>
                  <TextInput
                    placeholder="Repeat Password"
                    style={styles.input}
                    value={resetpassword}
                    onChange={e => {
                      handleChange('resetpassword', e);
                    }}
                    secureTextEntry={resetpasswordShow}
                  />
                  {resetpasswordShow ? (
                    <TouchableOpacity
                      style={styles.password}
                      onPress={() => handleResetShowPassword()}>
                      <Entypo
                        name="eye-with-line"
                        size={30}
                        color="#CDD4D9"></Entypo>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.password}
                      onPress={() => handleResetShowPassword()}>
                      <Entypo name="eye" size={30} color="#CDD4D9"></Entypo>
                    </TouchableOpacity>
                  )}
                </View>
                {resetpasswordErr && (
                  <Text style={styles.errormsg}>{resetpasswordErr}</Text>
                )}
                {isMatchPassword && (
                  <Text style={styles.errormsg}>{isMatchPassword}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.bluebtn}
                onPress={() => handleResetPassword()}>
                <Text style={styles.bluebtntext}>Sign in</Text>
              </TouchableOpacity>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
            </ScrollView>
          </BottomSheet>
          <TouchableOpacity
            style={styles.bluebtn}
            onPress={() => handleSignIn()}>
            <Text style={styles.bluebtntext}>Continue</Text>
          </TouchableOpacity>
          <Text style={styles.ortext}>OR</Text>
          <TouchableOpacity
            style={styles.graybtn}
            onPress={() => handleGoogleSignin()}>
            <Text style={styles.graybtntext}>Continue with Google</Text>
          </TouchableOpacity>
          {Platform.OS !== 'android' ? (
            <TouchableOpacity
              style={styles.graybtn}
              onPress={() => onAppleButtonPress()}>
              <Text style={styles.graybtntext}>Continue with Apple</Text>
            </TouchableOpacity>
          ) : null}
          {/* <TouchableOpacity style={styles.graybtn} onPress={() => onAppleButtonPress()}>
              <Text style={styles.graybtntext}>Continue with Apple</Text>
            </TouchableOpacity> */}
          <View style={styles.space10}></View>
          <View style={styles.noaccountmain}>
            <Text style={styles.noaccount}>Don’t have account yet? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signuptext}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space50}></View>
          <View style={[styles.noaccountmain, styles.noaccountmain1]}>
            <Text style={[styles.noaccount, styles.termtext]}>
              By signing up you agree to our{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.signuptext, styles.termtext]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text style={[styles.noaccount, styles.termtext]}> and </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.signuptext, styles.termtext]}>Terms</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default SignIn;
