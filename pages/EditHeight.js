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
  KeyboardAvoidingView,
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
import {UpdateHeightApi} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EditHeightHeaderLeft} from '../navigation/CustomBackNavigation';
import HeightComponent from './Components/HeightComponent';

const EditHeight = ({navigation, route}) => {
  const {heightValue, heightUnitValue, PetName, EditPetImg} = route.params;

  const HeightUnit = [
    {label: 'in', value: '1'},
    {label: 'cm', value: '2'},
  ];

  const [height, setHeight] = useState(`${heightValue}`);
  const [heightErr, setHeightErr] = useState('');
  const [heightMeasurement, setHeightMeasurement] = useState(
    `${heightUnitValue}`,
  );
  const [SelectedHeightUnit, setSelectedHeightUnit] = useState(
    `${heightUnitValue}`,
  );

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

  const handleSave = async () => {
    if (height.length == 0) {
      setHeightErr(ErrorText.HeightRequirdError);
    }
    if (height.length != 0 && heightErr.length == 0) {
      const UserID = await AsyncStorage.getItem('userId');
      const PetId = await AsyncStorage.getItem('PetId');
      const payload = {
        user_id: parseInt(UserID),
        pet_id: parseInt(PetId),
        height: parseFloat(height),
        height_unit: SelectedHeightUnit,
      };
      console.log(payload, 'payload');
      const Response = await UpdateHeightApi(payload);
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
      headerLeft: () => <EditHeightHeaderLeft navigation={navigation} />,
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
          {/* <View style={styles.space20}></View> */}
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

          <Text style={styles.familytext}>Family Member</Text>
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.createacc}>How tall is {PetName}?</Text>
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
              <Image source={require('../assets/DogHeight2.png')}></Image>
              <HeightComponent height={heightValue} setHeight={setHeight} />
            </View>

            <View style={styles.space20}></View>
            <View style={styles.unitmain}>
              <View style={styles.unitinner1}>
                <View style={[styles.inputContainer1]}>
                  {/* <Text>{height}</Text> */}
                  <Text
                    style={[styles.selectedTextStyle2, {textAlign: 'justify'}]}>
                    {parseInt(height)}
                  </Text>
                </View>
                {heightErr && <Text style={styles.errormsg}>{heightErr}</Text>}
              </View>

              <View style={styles.unitinner2}>
                {SelectedHeightUnit ? (
                  <View style={[styles.inputunitContainer3]}>
                    <Text
                      style={[
                        styles.selectedTextStyle2,
                        {textAlign: 'justify'},
                      ]}>
                      {SelectedHeightUnit}
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

export default EditHeight;
