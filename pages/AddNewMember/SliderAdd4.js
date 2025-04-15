import React, {useState, useEffect} from 'react';
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
import ErrorText from '../ErrorText/ErrorText';
import Regex from '../Regex/Regex';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SliderAdd4HeaderLeft} from '../../navigation/CustomBackNavigation';
import WeightComponent from '../Components/WeightComponent';

const SliderAdd4 = ({navigation}) => {
  const WeightUnit = [
    {label: 'kg', value: '1'},
    {label: 'pound', value: '2'},
  ];

  const [weight, setWeight] = useState(0);
  const [weightErr, setWeightErr] = useState('');
  const [weightMeasurement, setWeightMeasurement] = useState(null);
  const [SelectedweightUnit, setSelectedweightUnit] = useState('');

  const handleChange = (value, event) => {
    if (value == 'weight') {
      setWeight(event.nativeEvent.text);
      if (Regex.HeightWeightTest.test(event.nativeEvent.text) === false) {
        setWeightErr(ErrorText.WeightValidError);
      } else {
        setWeightErr('');
      }
    }
  };

  const handleNext = () => {
    AsyncStorage.setItem('weight', JSON.stringify(weight));
    AsyncStorage.setItem('weightUnit', SelectedweightUnit);
    navigation.navigate('SliderAdd5');
    // setWeight('')
    // setWeightErr('')
    // setWeightMeasurement(null)
    // setSelectedweightUnit('')
  };

  const [Name, setName] = useState('');
  const [selectedMeasureUnit, setSelectedMeasureUnit] = useState('');
  const isFocused = useIsFocused();
  // show-name
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <SliderAdd4HeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      getName();
    }
  }, [isFocused]);

  const getName = async () => {
    const measureUnit = await AsyncStorage.getItem('selected_unit_of_measure');
    setSelectedMeasureUnit(JSON.parse(measureUnit).weight_unit);
    const petName = await AsyncStorage.getItem('petName');
    setName(petName);

    //  to-detect-add now
    const status = await AsyncStorage.getItem('IsAdd');
    if (status == 1) {
      setWeight('');
      setWeightErr('');
      setWeightMeasurement(null);
      setSelectedweightUnit('');
    }
  };
  console.log('SelectedweightUnit', SelectedweightUnit);
  return (
    <>
      <ScrollView style={styles.fleamain} showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          <View style={styles.space20}></View>
          <PetNameImg />
          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.createacc}>How much does {Name} weigh?</Text>
          </View>
          <View style={styles.space20}></View>

          <View style={styles.imgcenter}>
            <Image source={require('../../assets/pic11.png')}></Image>
          </View>
          {/* <View style={styles.imgcenter}>
            <Image source={require('../../assets/Weight1.png')}></Image>
          </View> */}
          <Text style={styles.weightHeightVal}>
            {weight ? parseInt(weight) + '' + selectedMeasureUnit : null}
          </Text>
          <View style={styles.unitmain}></View>

          <View style={styles.unitmain}>
            <View style={styles.unitinner1}>
              {/* <View style={[styles.inputContainer1]}> */}
              <WeightComponent
                weight={weight}
                WeightUnit={SelectedweightUnit}
                setWeight={setWeight}
              />
              {/* </View>
              {weightErr && <Text style={styles.errormsg}>{weightErr}</Text>} */}
            </View>

            <View style={styles.unitinner2}>
              {selectedMeasureUnit ? (
                <View style={[styles.inputunitContainer3]}>
                  <Text style={styles.selectedTextStyle2}>
                    {selectedMeasureUnit}
                  </Text>
                </View>
              ) : (
                <View style={[styles.inputunitContainer3]}>
                  <Dropdown
                    search={true}
                    style={[styles.dropdown, {width: 200}]}
                    placeholderStyle={styles.placeholderStyleunit}
                    selectedTextStyle={styles.selectedTextStyleunit}
                    data={WeightUnit}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={
                      selectedMeasureUnit
                        ? selectedMeasureUnit
                        : WeightUnit[0].label
                    }
                    value={
                      selectedMeasureUnit
                        ? selectedMeasureUnit
                        : weightMeasurement
                    }
                    onChange={item => {
                      setWeightMeasurement(item.value);
                      setSelectedweightUnit(item.label);
                    }}
                  />
                </View>
              )}
            </View>
          </View>

          <View style={styles.dotmain}>
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dotactive} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
          </View>
          <Text style={styles.onboardtext}>
            This will be used to calculate diets for {Name}
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

export default SliderAdd4;
