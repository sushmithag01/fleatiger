import React, {useState} from 'react';
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

const ResetPassword = props => {
  return (
    <>
      <SafeAreaView>
        <ScrollView
          style={styles.mainform}
          showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.orangetitletext}>ResetPassword</Text>
          </View>
          <View style={styles.space20}></View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>
              Old Password <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter Old Password"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity style={styles.eyeicon}>
              <MaterialCommunityIcons
                name="eye-outline"
                size={22}
                color="#E66100"></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={[styles.label, styles.blacktext]}>
              New Password <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter New Password"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity style={styles.eyeicon}>
              <MaterialCommunityIcons
                name="eye-outline"
                size={22}
                color="#E66100"></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={[styles.label, styles.blacktext]}>
              Confirm Password <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Re-enter New Password"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity style={styles.eyeicon}>
              <MaterialCommunityIcons
                name="eye-outline"
                size={22}
                color="#E66100"></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity style={styles.submitbtn}>
              <Text style={styles.submitbtntext}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space20}></View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ResetPassword;
