import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {SettingsLeftHeader} from '../navigation/CustomBackNavigation';
import BasicSettingsComponent from './Components/BasicSettingsComponent';
import {getSettingsApi, updateBasicSettingsApi} from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';

function Settings() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [settingsData, setSettings] = useState({});
  const [timeFormat, setTimeFormat] = useState([]);
  const [unitsOfMeasurement, setUnitsOfMeasurement] = useState([]);
  const [selectedMeasurement, setSelectedMesurement] = useState({
    name: '',
    value: '',
  });
  const [selectedTime, setSelectedTime] = useState({name: '', value: ''});
  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <SettingsLeftHeader navigation={navigation} />,
      });
      handleGetSettings();
    }
  }, [isFocused]);

  const handleGetSettings = async () => {
    const userId = await AsyncStorage.getItem('userId');
    let payload = {
      user_id: parseInt(userId),
    };
    const settingsList = await getSettingsApi(payload);
    if (settingsList.status === 200) {
      setSettings(settingsList?.data);
      setTimeFormat(settingsList?.data?.time_formats);
      setUnitsOfMeasurement(settingsList?.data?.units_of_measurement);
      setSelectedMesurement({
        name: settingsList?.data?.units_of_measurement_selected_details
          ?.unit_name,
        value:
          settingsList?.data.units_of_measurement_selected_details?.unit_id,
      });
      setSelectedTime({
        name: settingsList?.data?.time_format_selected_details
          ?.time_format_name,
        value:
          settingsList?.data?.units_of_measurement_selected_details
            ?.time_format_id,
      });

      await AsyncStorage.setItem(
        'selected_time_format',
        JSON.stringify(settingsList?.data?.time_format_selected_details),
      );

      await AsyncStorage.setItem(
        'selected_unit_of_measure',
        JSON.stringify(
          settingsList?.data?.units_of_measurement_selected_details,
        ),
      );
    } else {
      Toast.show(settingsList.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    }
  };

  const handleUpdateSettings = async data => {
    const userId = await AsyncStorage.getItem('userId');
    if (data.update_part === 'unit_of_measurement') {
      await AsyncStorage.setItem(
        'selected_unit_of_measure',
        JSON.stringify(data?.item),
      );
    } else {
      await AsyncStorage.setItem(
        'selected_time_format',
        JSON.stringify(data?.item),
      );
    }
    let payload = {
      user_id: parseInt(userId),
      unit_id: data.update_part === 'unit_of_measurement' ? data.value : '',
      time_format_id:
        data.update_part === 'time_format' ? JSON.stringify(data.value) : '',
      update_part: data.update_part,
    };
    const updateSetting = await updateBasicSettingsApi(payload);
    if (updateSetting.status === 200) {
      // handleGetSettings();
      Toast.show(updateSetting.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    } else {
      Toast.show(updateSetting.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    }
  };
  return (
    <View>
      <BasicSettingsComponent
        settingsData={settingsData}
        handleUpdateSettings={handleUpdateSettings}
        selectedMeasurement={selectedMeasurement}
        selectedTime={selectedTime}
        setSelectedMesurement={setSelectedMesurement}
        setSelectedTime={setSelectedTime}
        unitsOfMeasurement={unitsOfMeasurement}
        timeFormat={timeFormat}
      />
    </View>
  );
}

export default Settings;
