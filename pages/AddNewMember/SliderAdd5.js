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
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import {Avatar, Badge, Icon, withBadge, Input} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import styles from '../../Common.css';
import PetNameImg from '../PetNameImg';
import Regex from '../Regex/Regex';
import ErrorText from '../ErrorText/ErrorText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SliderAdd5HeaderLeft} from '../../navigation/CustomBackNavigation';
import HeightComponent from '../Components/HeightComponent';

const SliderAdd5 = ({navigation}) => {
  const HeightUnit = [
    {label: 'cm', value: '1'},
    {label: 'in', value: '2'},
  ];

  const [height, setHeight] = useState(0);
  const [heightErr, setHeightErr] = useState('');
  const [heightMeasurement, setHeightMeasurement] = useState(null);
  const [SelectedHeightUnit, setSelectedHeightUnit] = useState('');

  const handleChange = (value, event) => {
    if (value == 'height') {
      setHeight(event.nativeEvent.text);
      if (Regex.HeightWeightTest.test(event.nativeEvent.text) === false) {
        setHeightErr(ErrorText.HeightValidError);
      } else {
        setHeightErr('');
      }
    }
  };

  const handleNext = () => {
    AsyncStorage.setItem('height', JSON.stringify(height));
    AsyncStorage.setItem('heightUnit', SelectedHeightUnit);
    navigation.navigate('SliderAdd6');
  };

  const [Name, setName] = useState('');
  const [selectedMeasureUnit, setSelectedMeasureUnit] = useState('');
  const isFocused = useIsFocused();
  // show-name
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <SliderAdd5HeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      getName();
    }
  }, [isFocused]);

  const getName = async () => {
    const petName = await AsyncStorage.getItem('petName');
    const measureUnit = await AsyncStorage.getItem('selected_unit_of_measure');
    setSelectedMeasureUnit(JSON.parse(measureUnit).height_unit);
    setName(petName);
    //  to-detect-add now
    const status = await AsyncStorage.getItem('IsAdd');
    if (status == 1) {
      setHeight('');
      setHeightErr('');
      setHeightMeasurement('');
      setSelectedHeightUnit('');
    }
  };

  return (
    <>
      <ScrollView style={styles.fleamain} showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          <PetNameImg />
          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.createacc}>How tall is {Name}?</Text>
          </View>
          <View style={styles.space20}></View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // marginHorizontal: 0,
                // marginBottom: 50,
              }}>
              <Image source={require('../../assets/DogHeight2.png')}></Image>
              <HeightComponent height={height} setHeight={setHeight} />
            </View>
            <View style={styles.space20}></View>
            <View style={styles.unitmain}>
              <View style={styles.unitinner1}>
                <View style={[styles.inputContainer1]}>
                  <Text style={styles.selectedTextStyle2}>{height}</Text>
                </View>
                {heightErr && <Text style={styles.errormsg}>{heightErr}</Text>}
              </View>

              <View style={styles.unitinner2}>
                {selectedMeasureUnit ? (
                  <View style={[styles.inputunitContainer3]}>
                    <Text
                      style={[
                        styles.selectedTextStyle2,
                        {textAlign: 'justify'},
                      ]}>
                      {selectedMeasureUnit}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.inputunitContainer3]}>
                    <Dropdown
                      search={true}
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyleunit}
                      selectedTextStyle={styles.selectedTextStyleunit}
                      data={HeightUnit}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={HeightUnit[0].label}
                      value={heightMeasurement}
                      onChange={item => {
                        setHeightMeasurement(item.value);
                        setSelectedHeightUnit(item.label);
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.dotmain}>
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dotactive} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
          </View>
          <Text style={styles.onboardtext}>
            Measure your pet from shoulders to paws. Keep the measuring stick
            straight down
          </Text>
          <View style={styles.arrowright}>
            <TouchableOpacity onPress={() => handleNext()}>
              <Svg
                width={70}
                height={70}
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <G clipPath="url(#clip0_574_643)">
                  <Path
                    d="M35 70c19.33 0 35-15.67 35-35S54.33 0 35 0 0 15.67 0 35s15.67 35 35 35z"
                    fill="#436077"
                  />
                  <Path
                    d="M42.575 35a1.1 1.1 0 01-.063.375.871.871 0 01-.212.325l-6.6 6.6c-.2.2-.438.3-.713.3a.973.973 0 01-.712-.3.96.96 0 01-.3-.7c0-.267.1-.5.3-.7l4.9-4.9h-11.2a.926.926 0 01-.7-.288A.99.99 0 0127 35a.97.97 0 01.287-.713A.97.97 0 0128 34h11.175l-4.9-4.9a.96.96 0 01-.3-.7c0-.267.1-.5.3-.7.2-.2.437-.3.712-.3.275 0 .513.1.713.3l6.6 6.6c.1.1.17.208.212.325a1.1 1.1 0 01.063.375z"
                    fill="#fff"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_574_643">
                    <Path fill="#fff" d="M0 0H70V70H0z" />
                  </ClipPath>
                </Defs>
              </Svg>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </>
  );
};

export default SliderAdd5;
