import React from 'react';
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
import Entypo from 'react-native-vector-icons/Entypo';
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
} from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const Profile = props => {
  const {petImage, petName, user_name} = props;
  const navigation = useNavigation();
  return (
    <>
      {petImage == 'https://devapi.fleatiger.com/' ? (
        <View>
          <View style={[styles.logosection]}>
            <View>
              <Svg
                width={80}
                height={80}
                viewBox="0 0 95 79"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <Path
                  d="M39.5 79C61.315 79 79 61.315 79 39.5S61.315 0 39.5 0 0 17.685 0 39.5 17.685 79 39.5 79z"
                  fill="#CCD2D4"
                />
                <Path
                  d="M70.614 31.77L52.222 18.403a2.23 2.23 0 00-2.352-.128 2.697 2.697 0 00-.292.182l-9.224 5.741a2.138 2.138 0 01-2.21 0L28.95 18.47a2.443 2.443 0 00-.352-.215 1.527 1.527 0 00-.412-.162 2.18 2.18 0 00-1.9.314L7.896 31.77a2.3 2.3 0 00-.588 2.971l7.546 13.944a2.273 2.273 0 004.086.078l1.127-2.416 9.655 8.932a13.947 13.947 0 0019.057 0l9.662-8.938 1.13 2.421a2.272 2.272 0 004.086-.078l7.54-13.945a2.3 2.3 0 00-.582-2.97l-.001.001zM47.782 54.203a12.564 12.564 0 01-7.8 3.348v-4.548c.107-.055.208-.122.3-.2L45.1 48.73a2.792 2.792 0 00-.268-4.473l-1.631-1.076a1.6 1.6 0 00-1.642-.067l-1.54.844a1.6 1.6 0 01-1.531 0l-1.54-.844a1.592 1.592 0 00-1.641.067l-1.63 1.076a2.794 2.794 0 00-.268 4.472l4.819 4.074c.089.075.186.14.289.192v4.555a12.565 12.565 0 01-7.8-3.348l-10-9.25 10.804-23.149 5.846 3.64.01.005.01.006a3.604 3.604 0 003.717 0l.01-.006.01-.006 5.857-3.645 10.8 23.151-10.003 9.255h.003z"
                  fill="#fff"
                />
                <G clipPath="url(#clip0_586_1180)">
                  <Path
                    d="M79 79c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16z"
                    fill="#CE5757"
                  />
                  <Path
                    d="M78.25 68.25v-4.5h-4.5v-1.5h4.5v-4.5h1.5v4.5h4.5v1.5h-4.5v4.5h-1.5z"
                    fill="#fff"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_586_1180">
                    <Path
                      fill="#fff"
                      transform="translate(63 47)"
                      d="M0 0H32V32H0z"
                    />
                  </ClipPath>
                </Defs>
              </Svg>
            </View>
          </View>
          <Text style={styles.profilename}>
            {petName == '' ? 'Lucky' : petName}
          </Text>
          {/* {user_name == '' ? (
            ''
          ) : (
            <Text style={styles.petusername}>{user_name}</Text>
          )} */}
        </View>
      ) : (
        <View>
          <View style={[styles.logosection]}>
            <Image
              source={{uri: petImage}}
              style={[styles.ProfileLogo, styles.addupload]}></Image>
          </View>
          <Text style={styles.profilename}>
            {petName == '' ? 'Lucky' : petName}
          </Text>
          {/* {user_name == '' ? (
            ''
          ) : (
            <Text style={styles.petusername}>{user_name}</Text>
          )} */}
        </View>
      )}
    </>
  );
};

export default Profile;
