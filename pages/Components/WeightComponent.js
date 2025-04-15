import React, {useEffect, useState} from 'react';
import {Platform, Text, View} from 'react-native';
// import Svg, {Path, Circle, Line} from 'react-native-svg';
// import {AnimatedCircularProgress} from 'react-native-circular-progress';
import styles from '../../Common.css';
import Slider from '@react-native-community/slider';

function WeightComponent({weight, setWeight}) {
  const [sliderValue, setSliderValue] = useState(0);
useEffect(()=>{
  setSliderValue(parseInt(weight));
},[weight])
  return (
    <>
      <View style={[styles.customTrackContainer]}>
        {/* Maximum Track (default track) */}
        <View style={styles.maximumTrack} />

        {/* Minimum Track (custom track with increased thickness) */}
        <View
          style={[styles.minimumTrack, {width: `${(sliderValue / 100) * 100}%`}]}
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={0.5}
          value={sliderValue}
          onValueChange={value => [setWeight(parseInt(value)),setSliderValue(value)]}
          minimumTrackTintColor="transparent" // Make default minimum track transparent
          maximumTrackTintColor="transparent"
          thumbTintColor="#436077"
          thumbImage={Platform.OS==='android'? require('../../assets/logoDefault.png'):require('../../assets/appIcon30*30.png')}
        />
      </View>
    </>

    //
  );
}

export default WeightComponent;
