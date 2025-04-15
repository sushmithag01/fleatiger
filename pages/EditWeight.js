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
import styles from '../Common.css';
import {SvgXml} from 'react-native-svg';
import Logo from '../assets/fleatiger-logo.svg';
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
import FontAwesome from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Regex from './Regex/Regex';
import ErrorText from './ErrorText/ErrorText';
import PetNameImg from './PetNameImg';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import {UpdateWeightApi} from './API/ApiCalls';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EditWeightHeaderLeft} from '../navigation/CustomBackNavigation';
import WeightComponent from './Components/WeightComponent';

const EditWeight = ({navigation, route}) => {
  const {weightValue, weightUnitValue, PetName, EditPetImg} = route.params;
  const WeightUnit = [
    {label: 'kg', value: '1'},
    {label: 'pound', value: '2'},
  ];

  const [weight, setWeight] = useState(`${weightValue}`);
  const [weightErr, setWeightErr] = useState('');
  const [weightMeasurement, setWeightMeasurement] = useState(
    `${weightUnitValue}`,
  );
  const [SelectedweightUnit, setSelectedweightUnit] = useState(
    `${weightUnitValue}`,
  );

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

  const handleSave = async () => {
    if (weight.length == 0) {
      setWeightErr(ErrorText.WeightRequirdError);
    }
    if (weight.length != 0 && weightErr.length == 0) {
      const UserID = await AsyncStorage.getItem('userId');
      const PetId = await AsyncStorage.getItem('PetId');
      const payload = {
        user_id: parseInt(UserID),
        pet_id: parseInt(PetId),
        weight: parseInt(weight),
        weight_unit: SelectedweightUnit,
      };
      console.log(payload, 'payload');
      const Response = await UpdateWeightApi(payload);
      console.log(Response, 'Response');
      if (Response.success == true) {
        Toast.show(Response.messsage, {
          duration: Toast.durations.LONG,
          position: 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#fff',
          textColor: '#000',
        });
        navigation.navigate('EditProfile');
      } else {
        Toast.show(Response.messsage, {
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
    }
  };

  const [Name, setName] = useState('');
  const isFocused = useIsFocused();
  // show-name
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <EditWeightHeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      getName();
    }
  }, [isFocused]);

  const getName = async () => {
    const petName = await AsyncStorage.getItem('petName');
    setName(petName);
  };
  return (
    <>
      <ScrollView style={styles.fleamain} showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          {/* <View style={styles.navheader}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
            </TouchableOpacity>
          </View> */}
          <View style={[styles.logosection]}>
            {/* ProfileImage */}
            <Image
              // source={require('../assets/profile.png')}
              style={[styles.ProfileLogo, styles.addupload]}
              source={{uri: EditPetImg}}></Image>
          </View>

          <View style={styles.editnamemain}>
            <Text style={styles.editnametext}>
              {PetName == null ? 'Lucky' : PetName}
            </Text>
          </View>
          <View>
            <Text style={styles.createacc}>How much does {PetName} weigh?</Text>
          </View>
          <View style={styles.space20}></View>

          <View style={styles.imgcenter}>
            <Image source={require('../assets/pic11.png')}></Image>
          </View>
          <Text style={styles.weightHeightVal}>
            {weight ? parseInt(weight) + '' + SelectedweightUnit : null}
          </Text>
          {/* <View style={styles.imgcenter}>
            <Image source={require('../assets/Weight1.png')}></Image>
          </View> */}

          <View style={styles.unitmain}>
            <View style={styles.unitinner1}>
              <WeightComponent
                weight={weightValue}
                WeightUnit={SelectedweightUnit}
                setWeight={setWeight}
              />
            </View>

            <View style={styles.unitinner2}>
              {SelectedweightUnit ? (
                <View style={[styles.inputunitContainer3]}>
                  <Text style={styles.selectedTextStyle2}>
                    {SelectedweightUnit}
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

          <View style={styles.savebtn}>
            <TouchableOpacity
              style={styles.bluebtnsmallSave}
              onPress={() => handleSave()}>
              <Text style={styles.bluebtnsmalltextSave}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </>
  );
};

export default EditWeight;
