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
import {SelectCountry} from 'react-native-element-dropdown';

const local_data = [
  {
    value: '1',
    lable: 'Country 1',
  },
  {
    value: '2',
    lable: 'Country 2',
  },
  {
    value: '3',
    lable: 'Country 3',
  },
  {
    value: '4',
    lable: 'Country 4',
  },
  {
    value: '5',
    lable: 'Country 5',
  },
];

const ContactSeller = props => {
  const [country, setCountry] = useState('1');
  return (
    <>
      <SafeAreaView>
        <ScrollView
          style={styles.mainform}
          showsVerticalScrollIndicator={false}>
          {/* <View>
        <Text style={styles.orangetitletext}>Contact Seller</Text>
      </View> */}
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.sellertext}>
              Contact Seller :
              <Text style={styles.sellertextbold}> Bijou Lash Extensions</Text>
            </Text>
            <Text style={styles.sellertext}>
              Voucher :
              <Text style={styles.sellertextbold}>
                {' '}
                Up to 15% OFF on Lipsticks
              </Text>
            </Text>
          </View>
          <View style={styles.space20}></View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>
              Need Help With <Text style={styles.required}></Text>
            </Text>
            <SelectCountry
              style={styles.dropdown1}
              selectedTextStyle={styles.selectedTextStyle1}
              placeholderStyle={styles.placeholderStyle1}
              maxHeight={200}
              value={country}
              data={local_data}
              valueField="value"
              labelField="lable"
              placeholder="Select country"
              searchPlaceholder="Search..."
              onChange={e => {
                setCountry(e.value);
              }}
            />
          </View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>Your Message</Text>
            <TextInput
              style={[styles.input, styles.blacktext, styles.textarea]}
              placeholder="Your Message"
              placeholderTextColor="#ccc"
              multiline={true}
              numberOfLines={4}
            />
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

export default ContactSeller;
