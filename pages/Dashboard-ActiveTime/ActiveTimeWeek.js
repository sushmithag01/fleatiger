import React, {useState, useEffect} from 'react';
import {BarChart} from 'react-native-gifted-charts';
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
import LinearGradient from 'react-native-linear-gradient';

const ActiveTimeWeek = props => {
  const {weekly} = props;
  const barData = weekly.week_report;

  const [maxValue, setMaxValue] = useState(100); // Initial maxValue
  const [stepValue, setStepValue] = useState(10);
  const [noOfSections, setNoOfSections] = useState(10);

  useEffect(() => {
    // Ensure that maxValue is non-negative
    const nonNegativeMaxValue = Math.max(0, maxValue);

    // Calculate stepValue and noOfSections based on your logic
    const calculatedStepValue = nonNegativeMaxValue / noOfSections;
    const calculatedNoOfSections = nonNegativeMaxValue / stepValue;

    setMaxValue(nonNegativeMaxValue);
    setStepValue(calculatedStepValue);
    setNoOfSections(calculatedNoOfSections);
  }, [maxValue]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.charttitle}>Average</Text>
        <Text style={styles.chartsubtitle}>
          {weekly.avg_weekly_activity} Minutes
        </Text>
      </View>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#ffffff']}
        style={styles.gradientBackground}
      >
      <View style={styles.chart}>
        <BarChart
          width={290}
          barWidth={22}
          noOfSections={10}
          barBorderRadius={4}
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          maxValue={360} //6*60
          stepValue={36}
          textColor={'#000000'}
          // yAxisTextStyle={{color:'#000000'}} // Change the color of the x-axis labels
          // xAxisLabelColor='#256262'
          withCustomBarColorFromData={true}
          renderTooltip={(item, index) => {
            return (
              <View
                style={{
                  marginBottom: 20,
                  marginLeft: -6,
                  backgroundColor: 'lightgrey',
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}>
                <Text>{item.value} minutes</Text>
              </View>
            );
          }}
        />
      </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default ActiveTimeWeek;
