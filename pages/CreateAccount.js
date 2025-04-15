import React, {useEffect, useRef, useState} from 'react';
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

const CreateAccount = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // err
  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastNameErr, setLastNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  // showOrHide-password
  const [passwordShow, setPasswordShow] = useState(true);

  const handleShowPassword = () => {
    setPasswordShow(!passwordShow);
  };
  // popup-success
  const [successPopup, setSuccessPopup] = useState(false);

  const [OtpPopup, setOtpPopup] = useState(false);
  // otp
  const [Otp, setOTP] = useState('');
  const [OtpErr, setOTPErr] = useState(false);

  const [loading, setLoading] = useState(false);
  const otpInputRef = useRef(null); // Ref for OTPTextInput
  const isFocused = useIsFocused();

  //    useEffect(()=>{
  //     if(isFocused){
  //       setFirstName('')
  //       setLastName('')
  //       setEmail('')
  //       setPassword('')
  //     }
  //  },[isFocused])

  // handleInput
  const handleChange = (value, event) => {
    if (value == 'firstname') {
      setFirstName(event.nativeEvent.text.trimStart());
      if (event.nativeEvent.text.length != 0) {
        setFirstNameErr('');
      } else {
        setFirstNameErr(ErrorText.FirstNameError);
      }
    }
    if (value == 'lastname') {
      setLastName(event.nativeEvent.text.trimStart());
      if (event.nativeEvent.text.length != 0) {
        setLastNameErr('');
      } else {
        setLastNameErr(ErrorText.LastNameError);
      }
    }
    if (value == 'email') {
      setEmail(event.nativeEvent.text.trimStart());
      if (Regex.EmailTest.test(event.nativeEvent.text) === false) {
        setEmailErr(ErrorText.EmailValidError);
      } else {
        setEmailErr('');
      }
    }
    if (value == 'password') {
      setPassword(event.nativeEvent.text.trimStart());
      if (event.nativeEvent.text.length < 8) {
        setPasswordErr(ErrorText.PasswordValidError);
      } else if (Regex.PasswordTest.test(event.nativeEvent.text) === false) {
        setPasswordErr(ErrorText.PasswordValidError);
      } else {
        setPasswordErr('');
      }
    }
  };

  // save
  const handleSave = async () => {
    // setSuccessPopup(true)
    // setLoading(true)
    if (firstName.trimStart().length == 0) {
      setFirstNameErr(ErrorText.FirstNameError);
      setLoading(false);
    }
    if (lastName.trimStart().length == 0) {
      setLastNameErr(ErrorText.LastNameError);
      setLoading(false);
    }
    if (email.trimStart().length == 0) {
      setEmailErr(ErrorText.EmailRequiredError);
      setLoading(false);
    }
    if (password.trimStart().length == 0 || password.trimStart().length < 8) {
      setPasswordErr(ErrorText.PasswordValidError);
      setLoading(false);
    }
    // console.log(firstName.trimStart().length, lastName.length, email.length, password.length, firstNameErr.length, lastNameErr.length, emailErr.length, passwordErr.length);
    if (
      firstName.trimStart().length != 0 &&
      lastName.trimStart().length != 0 &&
      email.trimStart().length != 0 &&
      password.trimStart().length != 0 &&
      password.trimStart().length >= 8 &&
      firstNameErr.length == 0 &&
      lastNameErr.length == 0 &&
      emailErr.length == 0 &&
      passwordErr.length == 0
    ) {
      setFirstNameErr('');
      setLastNameErr('');
      setEmailErr('');
      setPasswordErr('');

      const data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      };
      const Response = await SignUpApi(data);
      setLoading(false);
      if (Response.status === 200) {
        AsyncStorage.setItem('email', Response.email);
        // AsyncStorage.setItem("token", Response.jwt_token);
        AsyncStorage.setItem('userId', JSON.stringify(Response.user_id));
        AsyncStorage.setItem(
          'userEmailVerified',
          JSON.stringify(Response.email_verified),
        );
        AsyncStorage.setItem(
          'userPetCount',
          JSON.stringify(Response.pet_count),
        );
        setTimeout(() => {
          setSuccessPopup(true);
        }, 1000);
      } else {
        setLoading(false);
        Toast.show(Response.messsage, {
          duration: Toast.durations.LONG,
          position: 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#fff',
          textColor: '#000000',
        });
      }
    }
  };

  const handlePopClose = () => {
    setSuccessPopup(false);
    setOtpPopup(true);
  };

  // otp-api
  const handleOtpSave = async () => {
    if (Otp.length == 0 || Otp.length < 6) {
      setOTPErr(ErrorText.OtpRequiredError);
    }
    if (Otp.length != 0 && Otp.length === 6 && OtpErr.length == 0) {
      setOTPErr('');
      const UserID = await AsyncStorage.getItem('userId');
      const data = {
        user_id: parseInt(UserID),
        otp: parseInt(Otp),
      };
      const Response = await OtpSignUpApi(data);
      // console.log(Response, "OtpSignUpApi")
      if (Response.success == true) {
        AsyncStorage.setItem(
          'userEmailVerified',
          JSON.stringify(Response.email_verified),
        );
        AsyncStorage.setItem(
          'userPetCount',
          JSON.stringify(Response.pet_count),
        );
        setOtpPopup(false);
        setOTP('');
        setOTPErr('');
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('Onboarding1', {
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
    setOTP('');
    if (otpInputRef.current) {
      otpInputRef.current.clear(); // Clear OTP input
    }
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
      {loading ? <Loader loading={loading} /> : ''}
      {/* <SafeAreaView> */}
      <ScrollView
        style={styles.fleamain}
        // automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons color="#223656" name="chevron-back" size={30} />
            {/* <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons> */}
          </TouchableOpacity>
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.createacc}>Create an</Text>
            <Text style={styles.createacc}>account</Text>
          </View>
          <View style={styles.space50}></View>
          {/* first-name */}
          <View style={styles.inputmain}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                First Name<Text style={{color: '#f00732'}}>*</Text>
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter first name"
                style={styles.input}
                value={firstName}
                onChange={event => {
                  handleChange('firstname', event);
                }}
                maxLength={15}
              />
            </View>
            {firstNameErr && (
              <Text style={styles.errormsg}>{firstNameErr}</Text>
            )}
          </View>

          {/* last-name */}
          <View style={styles.inputmain}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                Last Name<Text style={{color: '#f00732'}}>*</Text>
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter last name"
                style={styles.input}
                value={lastName}
                onChange={event => {
                  handleChange('lastname', event);
                }}
                maxLength={15}
              />
            </View>
            {lastNameErr && <Text style={styles.errormsg}>{lastNameErr}</Text>}
          </View>

          <View style={styles.inputmain}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                Email Address<Text style={{color: '#f00732'}}>*</Text>
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter email address"
                style={styles.input}
                value={email}
                onChange={e => {
                  handleChange('email', e);
                }}
              />
            </View>
            {emailErr && <Text style={styles.errormsg}>{emailErr}</Text>}
          </View>
          <View style={styles.inputmain}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                Create Password<Text style={{color: '#f00732'}}>*</Text>
              </Text>
            </View>
            <View style={[styles.inputContainer, styles.passwordmain]}>
              <TextInput
                placeholder="Create Password"
                style={styles.input}
                value={password}
                onChange={e => {
                  handleChange('password', e);
                }}
                secureTextEntry={passwordShow}
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
          <TouchableOpacity style={styles.bluebtn} onPress={() => handleSave()}>
            <Text style={styles.bluebtntext}>Continue</Text>
          </TouchableOpacity>

          {/* popup-success */}

          <BottomSheet modalProps={{}} isVisible={successPopup}>
            <View style={[styles.bottomsheetmainMedium]}>
              <TouchableOpacity onPress={() => handlePopClose()}>
                <Ionicons name="close-outline" size={30} color="#CE5757"></Ionicons>
              </TouchableOpacity>
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
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View>
                <Text style={styles.createacc}>Success!</Text>
              </View>
              <Text style={styles.forgotcontent}>
                Please verify your email for OTP.
              </Text>
              <View style={styles.space20}></View>
            </View>
          </BottomSheet>

          {/* otp */}

          <BottomSheet modalProps={{}} isVisible={OtpPopup}>
            <ScrollView
              style={[styles.bottomsheetmainMediumbtn, styles.bottomsheetmain]}
              showsVerticalScrollIndicator={false}>
              {/* <TouchableOpacity onPress={() => 
                {setOtpPopup(false)
                setOTP('')
                setOTPErr('')
                }
                }>
                <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
              </TouchableOpacity> */}
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
                <TouchableOpacity onPress={handleResendOtpSave}>
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

          <View style={styles.space20}></View>
          <View style={styles.noaccountmain}>
            <Text style={styles.noaccount}>Don’t have account yet? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signuptext}>Sign In</Text>
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
        </KeyboardAwareScrollView>
      </ScrollView>
      {/* </SafeAreaView> */}
    </>
  );
};

export default CreateAccount;
