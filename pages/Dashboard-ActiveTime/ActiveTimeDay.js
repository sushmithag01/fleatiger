import React from 'react';
import {PieChart} from 'react-native-gifted-charts';
import {Text, View, Image, ScrollView} from 'react-native';
import styles from '../../Common.css';
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

const ActiveTimeDay = props => {
  const {daily} = props;
  const pieData = daily;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.charttitle}>Total</Text>
        <Text style={styles.chartsubtitle}>{daily[0]?.value} Minutes</Text>
      </View>
      <View style={styles.chart}>
        <PieChart
          donut
          innerRadius={100}
          data={pieData}
          centerLabelComponent={() => {
            return (
              <Text style={{fontSize: 30}}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={75.935}
                  height={69.278}
                  viewBox="0 0 75.935 69.278">
                  <Path
                    d="M12.543 38.154a8.434 8.434 0 01-6.075-2.37A7.771 7.771 0 014 29.95a7.771 7.771 0 012.468-5.834 8.434 8.434 0 016.075-2.37 8.434 8.434 0 016.075 2.37 7.771 7.771 0 012.468 5.834 7.771 7.771 0 01-2.468 5.834 8.434 8.434 0 01-6.075 2.37zm17.56-15.5a8.434 8.434 0 01-6.075-2.37 7.771 7.771 0 01-2.468-5.834 7.771 7.771 0 012.468-5.83A8.434 8.434 0 0130.1 6.25a8.434 8.434 0 016.075 2.37 7.771 7.771 0 012.468 5.834 7.771 7.771 0 01-2.468 5.834 8.434 8.434 0 01-6.075 2.37zm23.73 0a8.434 8.434 0 01-6.075-2.37 7.771 7.771 0 01-2.468-5.834 7.771 7.771 0 012.467-5.83 8.97 8.97 0 0112.15 0 7.771 7.771 0 012.468 5.834 7.771 7.771 0 01-2.468 5.834 8.434 8.434 0 01-6.075 2.37zm17.56 15.5a8.434 8.434 0 01-6.075-2.37 7.771 7.771 0 01-2.468-5.834 7.771 7.771 0 012.468-5.834 8.97 8.97 0 0112.15 0 7.771 7.771 0 012.468 5.834 7.771 7.771 0 01-2.468 5.834 8.434 8.434 0 01-6.076 2.37zM21.655 75.528a8.386 8.386 0 01-6.549-2.871 9.863 9.863 0 01-2.563-6.791 10.431 10.431 0 012.42-6.791 74.232 74.232 0 015.173-5.7 45.544 45.544 0 003.892-4.239q1.8-2.233 3.417-4.6a54.685 54.685 0 016.17-7.475 11.284 11.284 0 018.352-3.461 11.44 11.44 0 018.4 3.464 50.32 50.32 0 016.217 7.566q1.616 2.37 3.37 4.554a44 44 0 003.846 4.193 74.232 74.232 0 015.173 5.7 10.431 10.431 0 012.42 6.791 9.863 9.863 0 01-2.563 6.791 8.386 8.386 0 01-6.549 2.871 63 63 0 01-10.156-.82 63.275 63.275 0 00-20.312 0 63 63 0 01-10.158.818z"
                    transform="translate(-4 -6.25)"
                    fill="#495f75"
                  />
                </Svg>
              </Text>
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

export default ActiveTimeDay;
