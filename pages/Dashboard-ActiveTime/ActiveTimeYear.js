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

const ActiveTimeYear = props => {
  const {yearly} = props;
  const barData = yearly.yearly_report;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.charttitle}>Average</Text>
        <Text style={styles.chartsubtitle}>
          {yearly.avg_yearly_result} Minutes
        </Text>
      </View>
      <View style={styles.chart}>
        <Text style={{marginRight: 280, width: 55, marginBottom: 5}}>
          (Hours)
        </Text>
        <LinearGradient
          colors={['#ffffff', '#ffffff', '#ffffff']}
          style={styles.gradientBackground}>
          <BarChart
            barWidth={18}
            noOfSections={10}
            barBorderRadius={4}
            frontColor="lightgray"
            data={barData}
            yAxisThickness={0}
            xAxisThickness={0}
            spacing={20}
            // yAxisTextStyle={{color:'#000000'}}
            // onPress={(item, index) => console.log('item', item)}
            // labelTextStyle={styles.chartlabel1}
            maxValue={180} //6 * 30
            stepValue={18}
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
                  <Text>{item.value} hours</Text>
                </View>
              );
            }}
            // isThreeD
            // showYAxisIndices={false}
          />
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

export default ActiveTimeYear;
