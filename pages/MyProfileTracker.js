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
  Linking,
} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import Regex from './Regex/Regex';
import ErrorText from './ErrorText/ErrorText';
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
  Ellipse,
} from 'react-native-svg';

const MyProfileTracker = props => {
  // open-link - new tabs
  const supportedURL = 'https://fleatiger.com/shop/';

  const navigation = useNavigation();
  const {ImeiNumber} = props;

  const [AddImeiNumber, setAddImeiNumber] = useState('');
  const [AddImeiNumberErr, setAddImeiNumberErr] = useState('');

  const handleChange = (value, event) => {
    if (value == 'ImeiNumber') {
      setAddImeiNumber(event.nativeEvent.text);
      if (Regex.OnlyNumberTest.test(event.nativeEvent.text) === false) {
        setAddImeiNumberErr(ErrorText.ImeiNumberValidError);
      } else if (AddImeiNumber.length < 14) {
        setAddImeiNumberErr(ErrorText.ImeiNumberMaxError);
      } else if (AddImeiNumber.length == 15) {
        setAddImeiNumberErr('');
      } else {
        setAddImeiNumberErr('');
      }
    }
  };

  const handlePress1 = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.show(`Server error to open this URL: ${url}`, {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.homecardinner1}>
          <View style={styles.iemEdit}>
            {/* <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height={30} width={30}>
              <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
              <Path
                d="M38.37 18.94l-3.02-.73c-.77-1.02-2.14-1.71-3.71-1.71H16.35c-1.57 0-2.94.69-3.71 1.71l-3.02.73c-.36.09-.63.52-.63 1.02v8.09c0 .5.26.93.63 1.02l3.02.73c.77 1.02 2.14 1.71 3.71 1.71h15.29c1.57 0 2.94-.69 3.71-1.71l3.02-.73c.36-.09.63-.52.63-1.02v-8.09c0-.5-.26-.93-.63-1.02zM23.96 28.99c-.56 0-1.01-.45-1.01-1.01s.45-1.01 1.01-1.01 1.01.45 1.01 1.01-.45 1.01-1.01 1.01zm2.73-2.27c-.14.14-.33.2-.52.2-.2 0-.4-.08-.55-.23-.03-.03-.05-.06-.07-.08-.89-.87-2.35-.87-3.25.02-.3.29-.78.29-1.07 0a.758.758 0 01.01-1.08c1.5-1.49 3.94-1.47 5.43.03.03.03.05.05.07.08.13.15.2.33.19.53 0 .2-.09.39-.24.53zm1.88-1.86a.74.74 0 01-.53.21h-.02c-.2 0-.39-.09-.52-.23l-.04-.05a4.935 4.935 0 00-3.5-1.47h-.03c-1.32 0-2.55.51-3.49 1.43-.3.29-.78.29-1.07 0a.767.767 0 010-1.07c2.54-2.51 6.65-2.49 9.16.05.03.03.05.05.06.07.13.13.21.32.2.52 0 .2-.08.39-.23.54zm1.98-1.96a.74.74 0 01-.53.21H30c-.2 0-.39-.09-.52-.23l-.05-.06a7.706 7.706 0 00-5.46-2.29h-.04c-2.06 0-3.99.79-5.45 2.24a.75.75 0 01-.53.22.79.79 0 01-.54-.22.755.755 0 01-.22-.54c0-.2.08-.39.22-.54 3.63-3.59 9.51-3.56 13.1.07.03.03.05.06.07.08.13.13.2.31.2.52 0 .2-.08.39-.23.54z"
                fill="#223656"
                strokeWidth={0}
              />
            </Svg> */}
            <Text style={styles.imeilabel}>Tracker Number</Text>
          </View>
          <Text style={styles.imeitext}>
            {ImeiNumber == '' ? '-' : ImeiNumber}
          </Text>
        </View>

        {/* <View>
          <Text style={styles.createacc2}>Add Device</Text>
          <Text style={styles.shortText}>
            Enter IMEI number provided with the tracker
          </Text>

          <View>
            <View style={styles.inputContainer1}>
              <TextInput
                placeholder="Enter IMEI number"
                style={styles.selectedTextStyle2}
                maxLength={15}
                value={AddImeiNumber}
                onChange={event => {
                  handleChange('ImeiNumber', event);
                }}
              />
            </View>
            {AddImeiNumberErr && (
              <Text style={styles.errormsg}>{AddImeiNumberErr}</Text>
            )}
          </View>
          <View style={styles.space20}></View>

          <View>
            <TouchableOpacity
              style={styles.bluebtnsmallSave}
              // onPress={()=>handleNext()}
            >
              <Text style={styles.bluebtnsmalltextSave}>Save</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <View style={styles.space20}></View>

        <View>
          <TouchableOpacity
            style={styles.bluebtnsmall}
            onPress={() => handlePress1(supportedURL)}>
            <Text style={styles.bluebtnsmalltext}>ORDER TAG</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default MyProfileTracker;
