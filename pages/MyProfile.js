import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import styles from '../Common.css';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MyProfile = ({ }) => {
  const navigation = useNavigation();
  return (
    <>
      <SafeAreaView>
        <ScrollView
          style={styles.mainform}
          showsVerticalScrollIndicator={false}>
          {/* <View>
        <Text style={styles.orangetitletext}>MyProfile</Text>
      </View> */}
          <View style={styles.space20}></View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter First Name"
              placeholderTextColor="#ccc"
            />
          </View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter Last Name"
              placeholderTextColor="#ccc"
            />
          </View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>
              Mobile Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity
              style={styles.eyeicon}
              onPress={() => navigation.navigate('MobileVerification')}>
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color="#E66100"></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter Email Address"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity
              style={styles.eyeicon}
              onPress={() => navigation.navigate('EmailVerification')}>
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color="#E66100"></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity style={styles.submitbtn}>
              <Text style={styles.submitbtntext}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space20}></View>
          <View style={styles.noaccountmain}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={styles.signuptext}>Reset Password</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.checkbtnmain, styles.deatilsbtninner]}>
            <TouchableOpacity style={[styles.closebtn, styles.orgoutline]}>
              <Text style={[styles.closebtntext, styles.orgtext]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default MyProfile;
