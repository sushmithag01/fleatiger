import React, {useState, useEffect} from 'react';
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
import {SvgXml} from 'react-native-svg';
import Logo from '../assets/fleatiger-logo.svg';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';
import {useIsFocused} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {SocialLoginApi} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  appleAuthAndroid,
  appleAuth,
} from '@invertase/react-native-apple-authentication';

const SignUp = ({navigation}) => {
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

  // Google Sign-in
  const handleGoogleSignin = async () => {
    await GoogleSignin.signOut();
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
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
      if (appleAuthRequestResponse.identityToken) {
        console.log('appleAuthRequestResponse', appleAuthRequestResponse);
        // await AsyncStorage.setItem("apple_identityToken", JSON.stringify(appleAuthRequestResponse.identityToken));
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
        navigation.navigate('HomeStackNavigator', {screen: 'Home'});
      } else {
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
      <View style={[styles.containers]}>
        <View style={styles.welcome1}>
          <View style={styles.welcomesec}>
            <View>
              <Text style={styles.signintext}>Welcome to</Text>
              <Text style={styles.signintextdown}>Fleatiger</Text>
            </View>
            <View style={styles.logosection}>
              <Svg
                width={79}
                height={79}
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
          </View>
        </View>
        <View style={styles.welcome2}>
          <Text style={styles.weltext1}>Create an account</Text>
          <TouchableOpacity
            style={styles.graybtn}
            onPress={() => {
              handleGoogleSignin();
            }}>
            <Text style={styles.graybtntext}>Continue with Google</Text>
          </TouchableOpacity>
          <Text style={styles.ortext}>OR</Text>
          {Platform.OS !== 'android' ? (
            <TouchableOpacity
              style={styles.graybtn}
              onPress={() => {
                onAppleButtonPress();
              }}>
              <Text style={styles.graybtntext}>Continue with Apple</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.bluebtn}
            onPress={() => navigation.navigate('CreateAccount')}>
            <Text style={styles.bluebtntext}>Sign up with email</Text>
          </TouchableOpacity>
          <View style={styles.space20}></View>
          <View style={styles.noaccountmain}>
            <Text style={styles.noaccount}>Don’t have account yet? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signuptext}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
        </View>
      </View>
    </>
  );
};

export default SignUp;
