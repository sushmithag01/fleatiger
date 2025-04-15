import React, {useEffect, useState} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../Common.css';
import {GetDashboardApi} from '../API/ApiCalls';
import GetCurrentDate from './CurrentDate';
import moment from 'moment-timezone';

const ProfileScreen = ({props, route}) => {
  const navigation = useNavigation();
  const currentTimeZone = moment.tz.guess();
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isFocused) {
      GetDashboard();
    }
  }, [isFocused]);

  const GetDashboard = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const currentDate = year + '-' + month + '-' + date;
    const payload = {
      user_id: parseInt(UserID),
      id: parseInt(PetId),
      date: currentDate,
      timezone : currentTimeZone,
    };
    const Response = await GetDashboardApi(payload);
    // console.log(payload, 'profileApi');
    setData(Response?.data[0]);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('HomeStackNavigator', {screen: 'Home'})
        }>
        <View>
          {data?.pet_image_path == 'https://devapi.fleatiger.com/' ? (
            <View>
              <View style={[styles.logosection]}>
                <View>
                  <Svg
                    width={95}
                    height={79}
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
            </View>
          ) : (
            <View>
              <View style={[styles.logosection]}>
                <Image
                  source={{uri: data?.pet_image_path}}
                  style={[styles.ProfileLogo, styles.addupload]}></Image>
              </View>
              <Text style={styles.profilename}>
                {data?.pet_name == '' ? 'Lucky' : data?.pet_name}
              </Text>
              {/* {data?.user_name == '' ? (
                ''
              ) : (
                <Text style={styles.petusername}>{data?.user_name}</Text>
              )} */}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ProfileScreen;
