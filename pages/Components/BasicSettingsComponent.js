import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import styles from '../../Common.css';
import {Dropdown} from 'react-native-element-dropdown';
import Settings from '../Settings';

function BasicSettingsComponent({
  timeFormat,
  unitsOfMeasurement,
  handleUpdateSettings,
  selectedMeasurement,
  selectedTime,
  setSelectedMesurement,
  setSelectedTime,
}) {
  // useEffect(() => {}, [handleUpdateSettings]);

  return (
    <View>
      <Text style={styles.settingmainText}>General Settings</Text>
      <View style={styles.settingsContainer}>
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Units of measures</Text>
          <View>
            <Dropdown
              style={[
                styles.dropdown,
                {
                  width: 125,
                  padding: 2,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                },
              ]}
              placeholderStyle={styles.placeholderStyleunit}
              selectedTextStyle={styles.selectedTextStyleunit}
              data={unitsOfMeasurement}
              maxHeight={300}
              labelField="unit_name"
              valueField="unit_id"
              placeholder={
                selectedMeasurement.name ? selectedMeasurement.name : 'Unit'
              }
              onChange={item => [
                setSelectedMesurement({
                  name: item.unit_name,
                  value: item.unit_id,
                }),
                handleUpdateSettings({
                  name: item.unit_name,
                  value: item.unit_id,
                  item:item,
                  update_part: 'unit_of_measurement',
                }),
              ]}
            />
          </View>
        </View>
        <View style={styles.settingsCard1}>
          <Text style={styles.settingsTitle}>Time Format</Text>
          <View>
            <Dropdown
              style={[
                styles.dropdown,
                {width: 125, backgroundColor: '#fff', borderRadius: 10},
              ]}
              placeholderStyle={styles.placeholderStyleunit}
              selectedTextStyle={styles.selectedTextStyleunit}
              data={timeFormat}
              maxHeight={300}
              labelField="time_format_name"
              valueField={
                selectedTime.value ? selectedTime.value : 'time_format_id'
              }
              placeholder={selectedTime.name ? selectedTime.name : 'Format'}
              onChange={item => [
                handleUpdateSettings({
                  name: item.time_format_name,
                  value: item.time_format_id,
                  item:item,
                  update_part: 'time_format',
                }),
                setSelectedTime({
                  name: item.time_format_name,
                  value: item.time_format_id,
                }),
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default BasicSettingsComponent;
