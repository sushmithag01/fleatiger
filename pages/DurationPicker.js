import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../Common.css';
import {BottomSheet} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import {useIsFocused} from '@react-navigation/native';

const DurationPicker = props => {
  const {DurationFinal, setDurationFinal, DurationErr, setDurationErr} = props;

  const [isVisible, setIsVisible] = useState(false);

  const [durationHours, setDurationHours] = useState([]);
  const [durationMin, setDurationMin] = useState([]);
  const [durationSec, setDurationSec] = useState([]);

  const [hourInput, sethourInput] = useState(null);
  const [minInput, setMinInput] = useState(null);
  const [secInput, setSecInput] = useState(null);

  const [HH, setHH] = useState('00');
  const [MIN, setMIN] = useState('00');

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const hoursArr = [{label: '0', value: '0'}];
      const minArr = [{label: '0', value: '0'}];

      const foo = [...Array(24).keys()];
      foo.map((item, k) => {
        return hoursArr.push({label: `${item + 1}`, value: `${item + 1}`});
      });
      // console.log(hoursArr,"hoursArr")
      setDurationHours(hoursArr);

      // min
      const foo1 = [...Array(60).keys()];
      foo1.map((item, k) => {
        return minArr.push({label: `${item + 1}`, value: `${item + 1}`});
      });
      setDurationMin(minArr);
    }
  }, [isFocused]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOpen = () => {
    setIsVisible(true);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    const finalVal = HH + ':' + MIN;
    setDurationFinal(finalVal);
    setDurationErr('');
  };

  const handleCancel = () => {
    setIsVisible(false);
    sethourInput(hourInput);
    setMinInput(minInput);
    setSecInput(secInput);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleOpen()}>
        <View style={styles.addmanuallyFeilds}>
          <Text style={styles.selectedTextStylePlace}>{DurationFinal}</Text>
        </View>
      </TouchableOpacity>
      {DurationErr && <Text style={styles.errormsg}>{DurationErr}</Text>}

      {/* upload popup */}
      <BottomSheet modalProps={{}} isVisible={isVisible}>
        <ScrollView
          style={[styles.bottomsheetmainsmallDuration]}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => handleClose()}>
            <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
          </TouchableOpacity>
          <View>
            <Text style={styles.timerHead}>Select duration</Text>
          </View>
          <View style={styles.space50}></View>

          <View style={styles.uploadphotomain}>
            {/* hr */}
            <View style={styles.uploadphotoinner}>
              <View>
                <Text style={styles.addmanuallytext}>Hour</Text>
                <View style={styles.inputunitContainer4}>
                  <Dropdown
                    search={true}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyleunit}
                    selectedTextStyle={styles.selectedTextStyleunit}
                    inputSearchStyle={styles.inputSearchStyle1}
                    data={durationHours}
                    maxHeight={180}
                    labelField="label"
                    valueField="value"
                    placeholder="00"
                    value={hourInput}
                    onChange={item => {
                      sethourInput(item.value);
                      if (item.value <= 9) {
                        setHH('0' + item.value);
                      } else {
                        setHH(item.value);
                      }
                    }}
                  />
                </View>
              </View>
            </View>

            {/* mm */}
            <View style={styles.uploadphotoinner}>
              <View>
                <Text style={styles.addmanuallytext}>Min</Text>
                <View style={styles.inputunitContainer4}>
                  <Dropdown
                    search={true}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyleunit}
                    selectedTextStyle={styles.selectedTextStyleunit}
                    inputSearchStyle={styles.inputSearchStyle1}
                    data={durationMin}
                    maxHeight={180}
                    labelField="label"
                    valueField="value"
                    placeholder="00"
                    value={minInput}
                    onChange={item => {
                      setMinInput(item.value);
                      if (item.value <= 9) {
                        setMIN('0' + item.value);
                      } else {
                        setMIN(item.value);
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.space50}></View>

          <View style={styles.uploadphotomain}>
            <View style={styles.uploadphotoinner}>
              <TouchableOpacity
                style={styles.bluebtnsmall}
                onPress={() => handleConfirm()}>
                <Text style={styles.bluebtnsmalltextSave}>Confirm</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.uploadphotoinner}>
              <TouchableOpacity
                style={styles.bluebtnsmall}
                onPress={() => handleCancel()}>
                <Text style={styles.bluebtnsmalltextSave}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

export default DurationPicker;
