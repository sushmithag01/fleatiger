import React, {useState, useRef} from 'react';
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
import {CheckBox} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
import OTPTextInput from 'react-native-otp-textinput';
import styles from '../Common.css';

const Otp = ({navigation}) => {
  const otpInput = useRef(null);
  const clearText = () => {
    otpInput.current.clear();
  };
  const setText = () => {
    otpInput.current.setValue('1234');
  };
  return (
    <>
      <SafeAreaView>
        <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          <View style={styles.logosection}>
            <Image
              source={require('../assets/Logo-new.png')}
              style={styles.logo}
            />
          </View>
          <View>
            <Text style={styles.signintext}>Forgot Password</Text>
            <Text style={styles.receive}>
              Please enter the 6 digit code sent to you
            </Text>
          </View>
          <View>
            <OTPTextInput
              inputCount={6}
              inputCellLength={1}
              tintColor="#E66100"
              keyboardType="numeric"
              autoFocusOnLoad={false}
              textInputStyle={styles.otp}
              containerStyle={styles.otpmain}
            />
            {/* <Button title="clear" /> */}
          </View>
          <View>
            <TouchableOpacity
              style={styles.submitbtn}
              onPress={() => navigation.navigate('CreateNewPassword')}>
              <Text style={styles.submitbtntext}>Verify</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Otp;
