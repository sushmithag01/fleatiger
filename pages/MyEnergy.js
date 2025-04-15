import React, {useEffect, useState} from 'react';
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

const MyEnergy = props => {
  const {EnergyData} = props;

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={[styles.homecardinner1, styles.energyspace]}>
          <Text style={styles.homecardtext1}>My Energy</Text>
          <View style={styles.healthcircle}>
            <View style={styles.homecardvalue4}>
              <Text>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="icons-RZ_Weiss"
                  viewBox="0 0 50 50"
                  width={100}
                  height={100}>
                  <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                  <Path
                    d="M35.83 31.95c.98-4.65-.88-6.85-2.67-8.98-2.2-2.61-4.27-5.07-1.27-12.27.04-.08.05-.18.03-.27a.508.508 0 00-.11-.25.503.503 0 00-.49-.18c-2.95.58-5.64 2.17-7.56 4.49a13.192 13.192 0 00-3.02 8.26v1.02l-.77-.67a6.46 6.46 0 01-2.02-3.3c-.03-.1-.1-.2-.2-.26a.538.538 0 00-.28-.08h-.06a.47.47 0 00-.31.16 12.085 12.085 0 00-3.2 8.56c.09 3.18 1.39 6.15 3.67 8.37 2.28 2.22 5.29 3.44 8.47 3.44.2 0 .39 0 .59-.01 2.19-.17 4.3-1.05 5.94-2.49 1.64-1.44 2.8-3.41 3.25-5.55zm-3.45-8.34c1.72 2.04 3.34 3.96 2.46 8.13a9.377 9.377 0 01-1.71 3.69A9.236 9.236 0 0130 38.02l-1.55.79.95-1.45c.33-.5.56-1.06.68-1.64.47-2.21-.45-3.29-1.25-4.24-.96-1.14-1.79-2.12-.52-5.17.05-.11.05-.24.01-.35a.495.495 0 00-.22-.27c-.1-.06-.23-.08-.35-.06-1.14.22-2.18.76-3.03 1.56-.84.8-1.44 1.81-1.72 2.94l-.38 1.49-.51-1.45a.513.513 0 00-.37-.33.491.491 0 00-.47.15c-.77.83-1.27 1.86-1.44 2.98-.17 1.12 0 2.25.47 3.28l.95 1.86-1.51-1.04c-2.44-1.68-4.09-4.2-4.64-7.11s.05-5.86 1.7-8.32l.45-.67.35.72c.73 1.51 2 2.68 3.56 3.29a.5.5 0 00.5-.07c.14-.11.21-.29.19-.46-.36-2.71.22-5.5 1.64-7.84s3.61-4.15 6.18-5.09l.91-.33-.31.92c-2.18 6.45 0 9.03 2.1 11.52"
                    fill="#fff"
                    fillRule="evenodd"
                  />
                </Svg>
              </Text>
            </View>
            <Text style={styles.caltext1}>
              {EnergyData.energy_used_since_midnight == ''
                ? '0'
                : EnergyData.energy_used_since_midnight}{' '}
              CALS
            </Text>
          </View>
        </View>
        <View style={styles.piccenter}>
          <Image source={require('../assets/pic1.png')}></Image>
        </View>
      </ScrollView>
    </>
  );
};

export default MyEnergy;
