import React from 'react';
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

const ActiveTimeMonth = props => {
  const {monthly} = props;
  const barData = monthly.monthy_report;
  const data = [
    {value: 15, label: 'Jan'},
    {value: 40, label: 'Feb'},
    {value: 10, label: 'Mar'},
    {value: 30, label: 'Apr'},
    {value: 15, label: 'Jan'},
    {value: 40, label: 'Feb'},
    {value: 10, label: 'Mar'},
    {value: 30, label: 'Apr'},
    {value: 15, label: 'Jan'},
    {value: 40, label: 'Feb'},
    {value: 10, label: 'Mar'},
    {value: 30, label: 'Apr'},
    {value: 15, label: 'Jan'},
    {value: 40, label: 'Feb'},
    {value: 10, label: 'Mar'},
    {value: 30, label: 'Apr'},

    // console.log("barData", barData)
  ];
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.charttitle}>Average</Text>
        <Text style={styles.chartsubtitle}>
          {monthly.avg_monthly_result} Minutes
        </Text>
      </View>
      <LinearGradient
          colors={['#ffffff', '#ffffff', '#ffffff']}
          style={styles.gradientBackground}>
      <View style={styles.chart}>
        <BarChart
          barWidth={16}
          width={290}
          barBorderRadius={4}
          frontColor="lightgray"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          spacing={10}
          labelTextStyle={styles.chartlabel}
          showScrollIndicator={true}
          // yAxisTextStyle={{color:'#000000'}}
          stepValue={36}
          noOfSections={10}
          indicatorColor="black"
          maxValue={360}
          renderTooltip={(item, index) => {
            return (
              <View
                style={{
                  marginBottom: 20,
                  marginLeft: -6,
                  backgroundColor: 'lightgray',
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}>
                <Text>{item.value} minutes</Text>
              </View>
            );
          }}
          // showYAxisIndices={false}
        />

        {/* <BarChart
        data={data}
        width={300}
        showVerticalLines={false}      
        barWidth={40}
        sideWidth={15}
        showScrollIndicator={true}
        indicatorColor='black'
        backgroundColor='#fff'
        stepValue={2}
        scrollAnimation={true}
        renderTooltip={data.value}
        showArrow= {true}
      /> */}
      </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default ActiveTimeMonth;
