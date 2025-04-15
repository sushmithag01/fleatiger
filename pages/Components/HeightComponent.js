import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Platform} from 'react-native';
import Slider from '@react-native-community/slider';

const HeightComponent = ({setHeight, height}) => {
  const [sliderValue, setSliderValue] = useState(0);
  useEffect(() => {
    setSliderValue(height);
  }, [height]);
  return (
    <View style={styles.container}>
      {Platform.OS === 'android' ? (
        <TouchableOpacity
          onPress={() => [
            setSliderValue(sliderValue - 1),
            setHeight(sliderValue - 1),
          ]}
          style={{margin: 25}}>
          <Text style={styles.button}>-</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.customTrackContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={sliderValue}
          onValueChange={value => {
            setSliderValue(value);
            setHeight(parseInt(value));
          }}
          minimumTrackTintColor="#436077" // Make default minimum track transparent
          maximumTrackTintColor="#CE5757"
          thumbTintColor="#436077"
          thumbImage={
            Platform.OS === 'android'
              ? require('../../assets/logoDefault.png')
              : require('../../assets/appIcon30*30.png')
          }
        />
      </View>
      {Platform.OS === 'android' ? (
        <TouchableOpacity
          onPress={() => [
            setSliderValue(sliderValue + 1),
            setHeight(sliderValue + 1),
          ]}
          style={{margin: 10}}>
          <Text style={styles.button}>+</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTrackContainer: {
    width: 40, // Adjusted width for the vertical track container
    height: 300, // Height for the vertical slider and tracks
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    width: 350, // Slider's height (after rotation) matches the container's height
    height: 40, // Width of the slider before rotation
    transform: [{rotate: '-90deg'}], // Rotate to make the slider vertical
    top: 120, // Align the top edge of the slider to the container
    left: -155, // Shift left to make the slider thumb visible inside the container
  },
  minimumTrack: {
    position: 'absolute',
    backgroundColor: '#436077',
    width: 10, // Increased thickness for the minimum track
    left: 15.5, // Adjusted for centering the track
    bottom: 0, // Track grows from the bottom
    borderRadius: 10,
  },
  maximumTrack: {
    position: 'absolute',
    backgroundColor: '#d3d3d3',
    width: 10, // Default thickness for the maximum track
    height: '100%', // Fill the entire height of the container
    left: 17, // Align with the minimum track
    borderRadius: 10,
  },
  button: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#436077',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
});

export default HeightComponent;
