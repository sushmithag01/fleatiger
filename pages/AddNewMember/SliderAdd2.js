import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ImageBackground,
} from 'react-native';
import styles from '../../Common.css';
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
import Toast from 'react-native-root-toast';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {BottomSheet, Button, ListItem} from '@rneui/themed';
import {useIsFocused} from '@react-navigation/native';
import ErrorText from '../ErrorText/ErrorText';
import {CheckUserNameApi, GetBreadDropdownApi} from '../API/ApiCalls';
import GooglePlacesInput from '../Maps/GooglePlacesInput';
import Octicons from 'react-native-vector-icons/Octicons';
import MotivationalMessage from '../Popups/MotivationalMessage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SliderAdd2HeaderLeft} from '../../navigation/CustomBackNavigation';

const SliderAdd2 = ({navigation}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [issVisible, setIssVisible] = useState(false);

  const [MessagePop, setMessagePop] = useState('');
  const [congratsMsg, setCongratsMsg] = useState(false);

  const data = [
    {label: 'Item 1', value: '1'},
    {label: 'Item 2', value: '2'},
    {label: 'Item 3', value: '3'},
    {label: 'Item 4', value: '4'},
    {label: 'Item 5', value: '5'},
    {label: 'Item 6', value: '6'},
    {label: 'Item 7', value: '7'},
    {label: 'Item 8', value: '8'},
  ];

  const gender = [
    {label: 'Male', value: '1'},
    {label: 'Female', value: '2'},
    {label: 'Prefer not to say', value: '3'},
  ];
  const [value, setValue] = useState(null);
  const textInputRef = useRef(null);
  const [gendervalue, setGenderValue] = useState(null);

  const [profileImg, setProfileImg] = useState('');
  const [petName, setPetName] = useState('');
  const [petUserName, setpetUserName] = useState('');
  const [petNameText, setPetNameText] = useState('');
  const [petUserNameText, setpetUserNameText] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('');
  const [location, setLocation] = useState('');
  const [breadArray, setBreadArray] = useState([]);
  const [filePath, setFilePath] = useState('');

  // err-feild
  const [petNameErr, setPetNameErr] = useState('');
  const [breedErr, setBreedErr] = useState('');
  const [sexErr, setSexErr] = useState('');
  const [petUserNameErr, setpetUserNameErr] = useState('');
  const [CheckpetUserName, setCheckpetUserName] = useState(false);
  const [IsSubmit, setIsSubmit] = useState(false);
  const [petNameUserNameErr, setpetNameUserNameErr] = useState('');

  // to detect - add now or finish
  const isFocused = useIsFocused();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <SliderAdd2HeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      getAddStatus();
      GetDropdowndata();
    }
  }, [isFocused]);

  const getAddStatus = async () => {
    const status = await AsyncStorage.getItem('IsAdd');
    if (status == 1) {
      setLocation('');
      setGenderValue('');
      setPetName('Name');
      setBreadArray([]);
      setFilePath('');
      setProfileImg('');
      AsyncStorage.removeItem('petName');
      AsyncStorage.removeItem('profileImg');
    }
  };

  const refInput = useRef(null);

  const options = {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.5,
    mediaType: 'photo',
    includeBase64: true,
    presentationStyle: 'pageSheet',
    cameraType: 'back',
  };

  const chooseCamera = async () => {
    const result = await launchCamera(options);
    setIsVisible(false);
    // Toast.show(result.errorCode, {
    //     duration: Toast.durations.LONG,
    //     position: 50,
    //     shadow: true,
    //     animation: true,
    //     hideOnPress: true,
    //     delay: 0,
    //     backgroundColor:'#fff',
    //     textColor:'#000'
    //   });
    // if (result.assets[0].fileSize > 300000) {
    //   setMessagePop('Please provide an image that is less than 400 KB in size')
    //   setTimeout(() => {
    //     setCongratsMsg(true)
    //   }, 500);
    // } else {
    setMessagePop('');
    setCongratsMsg(false);
    setFilePath(`data:image/jpeg;base64,${result.assets[0].base64}`);
    setProfileImg(`data:image/jpeg;base64,${result.assets[0].base64}`);

    // }
  };

  const chooseGallery = async () => {
    const result = await launchImageLibrary(options);
    setIsVisible(false);
    //  console.log(result,"result1")
    // Toast.show(result.errorCode, {
    //     duration: Toast.durations.LONG,
    //     position: 50,
    //     shadow: true,
    //     animation: true,
    //     hideOnPress: true,
    //     delay: 0,
    //     backgroundColor:'#fff',
    //     textColor:'#000'
    //   });
    // if (result.assets[0].fileSize > 300000) {
    //   setMessagePop('Please provide an image that is less than 400 KB in size')
    //   setTimeout(() => {
    //     setCongratsMsg(true)
    //   }, 500);
    // } else {
    setMessagePop('');
    setCongratsMsg(false);
    setFilePath(`data:image/jpeg;base64,${result.assets[0].base64}`);
    setProfileImg(`data:image/jpeg;base64,${result.assets[0].base64}`);

    // }
  };

  // get dropdown for breed
  const GetDropdowndata = async () => {
    const Response = await GetBreadDropdownApi(data);
    if (Response.success === true) {
      setBreadArray(Response.data);
    } else {
      Toast.show(Response.message, {
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

  // input-feild
  const handleChange = (value, event) => {
    if (value == 'location') {
      setLocation(event.nativeEvent.text);
    }
    if (value == 'petName') {
      setPetName(event.nativeEvent.text);
      if (event.nativeEvent.text.length != 0) {
        setPetNameErr('');
        setpetNameUserNameErr('');
      } else {
        setPetNameErr(ErrorText.PetNameRequired);
      }
    }
    // if (value == "petUserName") {
    //   setpetUserName(event.nativeEvent.text)
    //   if (event.nativeEvent.text.length != 0) {
    //     setpetUserNameErr("")
    //   } else {
    //     setpetUserNameErr(ErrorText.PetuserNameRequired)
    //   }
    // }
  };
  // next-button

  const handleNext = () => {
    if (petName.length == 0) {
      setpetNameUserNameErr(ErrorText.PetNameRequired);
    }
    if (breed.length == 0) {
      setBreedErr(ErrorText.PetBreedrequired);
    }
    if (sex.length == 0) {
      setSexErr(ErrorText.PetSexrequired);
    }

    if (
      petName.length != 0 &&
      breed.length != 0 &&
      sex.length != 0 &&
      petNameErr.length == 0 &&
      breedErr.length == 0 &&
      sexErr.length == 0
    ) {
      AsyncStorage.setItem('profileImg', profileImg);
      AsyncStorage.setItem('petName', petName);
      AsyncStorage.setItem('breed', JSON.stringify(breed));
      AsyncStorage.setItem('sex', sex);
      AsyncStorage.setItem('location', location);
      // AsyncStorage.setItem("user_name", petUserName);
      navigation.navigate('SliderAdd3');
    }
  };

  const handleNameSubmit = () => {
    if (petName.length == 0) {
      setPetNameErr(ErrorText.PetNameRequired);
    }
    // if (petUserName.length == 0) {
    //   setpetUserNameErr(ErrorText.PetuserNameRequired)
    // }
    if (
      petName.length != 0 &&
      //&& petUserName.length != 0
      petNameErr.length == 0
      // && petUserNameErr.length == 0
    ) {
      setPetNameText(petName);
      // setpetUserNameText(petUserName)
      closeNamePopup();
      setIsSubmit(true);
      // setpetNameUserNameErr('')
    }
  };

  // useEffect(() => {
  //   if (petUserName.length != 0) {
  //     checkUserName()
  //   } else {
  //     setpetUserNameErr('')
  //   }
  // }, [petUserName])

  const checkUserName = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const payload = {
      user_id: parseInt(UserID),
      user_name: petUserName,
      pet_id: 0,
    };
    console.log(payload, 'payload');
    const Response = await CheckUserNameApi(payload);
    console.log(Response, 'Response-check-name');
    if (Response.success == false) {
      setpetUserNameErr(Response.message);
      setCheckpetUserName(false);
    } else {
      setpetUserNameErr('');
      setCheckpetUserName(true);
    }
  };

  const closeNamePopup = () => {
    setIssVisible(false);
    setPetNameErr('');
    setpetUserNameErr('');
    setCheckpetUserName(false);
  };

  return (
    <>
      <ScrollView style={styles.fleamain} showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          {/* <View style={styles.navheader}>
            <TouchableOpacity onPress={() => navigation.navigate('SliderAdd1')}>
              <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Onboarding3')}>
        <Text style={styles.skiptext}>Skip</Text>
      </TouchableOpacity>
          </View> */}

          {/* <View style={styles.space20}></View> */}
          <View style={styles.logosection}>
            {filePath.length != 0 ? (
              <>
                <View style={styles.adduploadmain}>
                  {/* <View>
        <Text>Upload</Text>
        </View> */}
                  <TouchableOpacity
                    onPress={() => setIsVisible(true)}
                    style={styles.adduploadmain}>
                    <ImageBackground
                      style={[styles.ProfileLogo, styles.addupload]}
                      source={{uri: filePath}}></ImageBackground>
                  </TouchableOpacity>
                  <View styles={styles.addupload1}>
                    {/* <Svg
      xmlns="http://www.w3.org/2000/svg"
      id="icons-RZ_Blau"
      viewBox="0 0 50 50"
      width={30}
      height={30}
      styles={styles.addupload1}
      >
      <Circle cx={25} cy={25} r={24} fill="#CE5757" />
      <Path
          d="M38.5 23.5H26.51v-12c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v11.99H11.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h11.99v11.99c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V26.49h11.99c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"
          fill="#fff"
      />
      </Svg> */}
                  </View>
                </View>
              </>
            ) : (
              <TouchableOpacity onPress={() => setIsVisible(true)}>
                <View>
                  <Svg
                    width={95}
                    height={79}
                    viewBox="0 0 95 79"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <Path
                      d="M39.5 79C61.315 79 79 61.315 79 39.5S61.315 0 39.5 0 0 17.685 0 39.5 17.685 79 39.5 79z"
                      fill="#CCD2D4"
                    />
                    <Path
                      d="M70.614 31.77L52.222 18.403a2.23 2.23 0 00-2.352-.128 2.697 2.697 0 00-.292.182l-9.224 5.741a2.138 2.138 0 01-2.21 0L28.95 18.47a2.443 2.443 0 00-.352-.215 1.527 1.527 0 00-.412-.162 2.18 2.18 0 00-1.9.314L7.896 31.77a2.3 2.3 0 00-.588 2.971l7.546 13.944a2.273 2.273 0 004.086.078l1.127-2.416 9.655 8.932a13.947 13.947 0 0019.057 0l9.662-8.938 1.13 2.421a2.272 2.272 0 004.086-.078l7.54-13.945a2.3 2.3 0 00-.582-2.97l-.001.001zM47.782 54.203a12.564 12.564 0 01-7.8 3.348v-4.548c.107-.055.208-.122.3-.2L45.1 48.73a2.792 2.792 0 00-.268-4.473l-1.631-1.076a1.6 1.6 0 00-1.642-.067l-1.54.844a1.6 1.6 0 01-1.531 0l-1.54-.844a1.592 1.592 0 00-1.641.067l-1.63 1.076a2.794 2.794 0 00-.268 4.472l4.819 4.074c.089.075.186.14.289.192v4.555a12.565 12.565 0 01-7.8-3.348l-10-9.25 10.804-23.149 5.846 3.64.01.005.01.006a3.604 3.604 0 003.717 0l.01-.006.01-.006 5.857-3.645 10.8 23.151-10.003 9.255h.003z"
                      fill="#fff"
                    />
                    <G clipPath="url(#clip0_586_1180)">
                      <Path
                        d="M79 79c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16z"
                        fill="#CE5757"
                      />
                      <Path
                        d="M78.25 68.25v-4.5h-4.5v-1.5h4.5v-4.5h1.5v4.5h4.5v1.5h-4.5v4.5h-1.5z"
                        fill="#fff"
                      />
                    </G>
                    <Defs>
                      <ClipPath id="clip0_586_1180">
                        <Path
                          fill="#fff"
                          transform="translate(63 47)"
                          d="M0 0H32V32H0z"
                        />
                      </ClipPath>
                    </Defs>
                  </Svg>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* <View style={styles.space10}></View> */}

          <View>
            <TouchableOpacity onPress={() => setIssVisible(true)}>
              <View style={styles.editnamemain}>
                <Text style={styles.editnametext}>
                  {!IsSubmit ? 'Name' : petNameText}
                </Text>
                <FontAwesome
                  name="pencil"
                  color="#6D7177"
                  size={20}></FontAwesome>
              </View>
              <Text style={styles.petusername}> Pet Username </Text>
              <Text style={styles.familytext}>Family Member</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.space20}></View>
          {petNameUserNameErr && (
            <Text style={styles.requiredErr}>{petNameUserNameErr}</Text>
          )}

          <View style={styles.space20}></View>
          <View>
            <View style={styles.inputmain}>
              <View style={[styles.labelContainer, styles.selecttext]}>
                <Text style={styles.label}>Breed</Text>
              </View>
              <View style={styles.inputContainerDrop}>
                <Dropdown
                  search={true}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={breadArray}
                  maxHeight={300}
                  labelField="breed_name"
                  valueField="breed_cat_id"
                  placeholder="Select item"
                  searchPlaceholder="Search..."
                  value={breadArray}
                  onChange={item => {
                    setValue(item.breed_name);
                    // console.log(item.breed_name,item.breed_cat_id)
                    setBreed(item.breed_cat_id);
                    setBreedErr('');
                  }}
                  renderLeftIcon={() => (
                    <View style={styles.leftselect}>
                      <Svg
                        id="icons-RZ_Weiss"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 50 50"
                        width={45}
                        height={45}>
                        <Defs></Defs>
                        <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                        <Path
                          className="cls-1"
                          d="M37.65 11.69a1.75 1.75 0 00-.89-1.45 1.77 1.77 0 00-1.7-.04c-3.32 1.69-5.72 4.07-7.15 5.77l-.02.02h-.03c-.54-.13-1.09-.19-1.64-.19h-2.46c-.55 0-1.11.06-1.64.19h-.03l-.02-.02c-1.86-2.21-3.99-4.01-6.34-5.34-.54-.3-1.09-.62-1.68-.62-.29 0-.56.07-.82.23-.52.3-.85.84-.89 1.45-.19 3.57.61 6.74 1.32 8.77.5 1.44 1.51 2.64 2.83 3.39h.02v3.69c0 2.7.61 5.28 1.76 7.45.74 1.39 2.05 3.27 4.1 4.34.85.44 1.74.67 2.63.67.69 0 1.38-.14 2.04-.41 2.06-.85 3.45-2.6 4.25-3.91 1.41-2.3 2.16-5.12 2.16-8.14v-3.68h.02a6.344 6.344 0 002.83-3.41c.71-2.03 1.51-5.19 1.32-8.77zM19.3 24.11c0-.3.12-.58.33-.79s.49-.33.79-.33.58.12.79.33c.21.21.33.49.33.79v.79c0 .3-.12.58-.33.79s-.49.33-.79.33-.58-.12-.79-.33-.33-.49-.33-.79v-.79zm16.2-4.29l-.11.31a5.339 5.339 0 01-2.65 3.01l-.05.04s-.02.02-.04.03l-.07.08v.02l.07.04h-.1l-.06.15v4.05c0 4.22-1.57 8.02-4.19 10.15-.81.66-2.11 1.44-3.63 1.32-1.68-.14-3.04-1.27-3.89-2.2-1.41-1.55-2.43-3.63-2.93-6.01v-.05h2.21c1.39 0 2.69-.54 3.67-1.52s1.52-2.29 1.52-3.67V16.8h.98c1.22 0 2.41.36 3.43 1.03.11.07.24.1.37.07a.487.487 0 00.38-.58.527.527 0 00-.21-.31c-.39-.26-.81-.48-1.24-.65l-.06-.02.04-.05c1.33-1.52 3.54-3.66 6.55-5.19.24-.13.52-.12.75.02.23.14.38.38.39.64.17 3.28-.53 6.2-1.16 8.07z"
                          fill="#223656"
                        />
                        <Path
                          className="cls-1"
                          d="M29.58 22.99c-.3 0-.58.12-.79.33-.21.21-.33.49-.33.79v.79a1.12 1.12 0 002.24 0v-.79c0-.3-.12-.58-.33-.79-.21-.21-.49-.33-.79-.33zM25.89 33.41l-.59.32c-.18.1-.41.1-.59 0l-.59-.32c-.2-.11-.44-.1-.63.03l-.63.41c-.3.2-.49.54-.49.9 0 .32.14.62.38.82l1.85 1.57c.23.19.56.19.79 0l1.85-1.57c.24-.2.38-.51.38-.82 0-.36-.18-.7-.49-.9l-.63-.41a.643.643 0 00-.63-.03z"
                          fill="#223656"
                        />
                      </Svg>
                    </View>
                  )}
                />
              </View>
              {breedErr && <Text style={styles.errormsg}>{breedErr}</Text>}
            </View>
          </View>
          <View style={styles.inputmain}>
            <View style={[styles.labelContainer, styles.selecttext]}>
              <Text style={styles.label}>Sex</Text>
            </View>
            <View style={styles.inputContainerDrop}>
              <Dropdown
                search={true}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={gender}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={gendervalue}
                onChange={item => {
                  setGenderValue(item.value);
                  // console.log(item.label)
                  setSex(item.label);
                  setSexErr('');
                }}
                renderLeftIcon={() => (
                  <View style={styles.leftselect}>
                    <Svg
                      id="Layer_2"
                      xmlns="http://www.w3.org/2000/svg"
                      width={45}
                      height={45}
                      viewBox="0 0 57.81 57">
                      <G id="Layer_1-2">
                        <Path
                          d="M28.07 56.73c-2.07-.09-4.17-.41-6.1-.93-5.63-1.53-10.53-4.37-14.49-8.76-2.97-3.29-5.03-7.05-6.17-11.21C.49 32.8-.29 29.67.1 26.45c.05-.4.14-.8.25-1.19.8-3.02 1.19-6.14 2.68-8.98C6.67 9.4 12 4.38 19.49 1.75 22.54.68 25.73-.04 28.96 0c4.56.06 8.93 1.2 13.03 3.23 3.11 1.53 5.91 3.48 8.23 6.06 2.65 2.94 4.56 6.27 5.88 9.98 1.12 3.15 1.55 6.37 1.69 9.67.03.62-.08 1.21-.21 1.82-.28 1.35-.37 2.76-.65 4.08-.35 1.67-.97 3.33-1.64 4.96-1.36 3.33-3.52 6.11-6.02 8.61-2.48 2.48-5.45 4.34-8.7 5.79-3.13 1.4-6.42 2.03-9.76 2.54-.92.14-1.84.15-2.75 0z"
                          fill="#91bcbf"
                        />
                        <Path
                          d="M28.07 56.73h2.75c-.92.36-1.84.35-2.75 0z"
                          fill="#dceae9"
                        />
                        <Path
                          d="M38.79 13.45c.07-.5-.12-.81-.58-.4-2.07 1.83-4.07 3.73-5.93 5.77-.38.42-.11.76.22 1.05.9.77 1.36 1.85 2.05 2.76.51.68.55 1.43.52 2.22-.07 1.77.09 3.47-.88 5.21-1.44 2.6-3.56 3.88-6.37 4.27-.61.09-.76.3-.75.84.02 1.43.03 2.86 0 4.3-.01.58.21.8.8.79 1.12-.03 2.25 0 3.37 0 .37 0 .81-.04.8.51 0 .59-.48.46-.82.46-1.04.02-2.08.06-3.12 0-.85-.05-1.08.28-1.04 1.06.06 1.02.02 2.05 0 3.07 0 .35.08.79-.51.77-.59-.02-.47-.47-.48-.81-.01-1.06-.04-2.13 0-3.19.03-.71-.24-.93-.94-.9-1.04.04-2.08 0-3.12 0-.44 0-.91-.04-.89-.6.02-.58.56-.36.88-.37 1.04-.03 2.08-.04 3.12 0 .67.03.98-.15.96-.88a64.42 64.42 0 010-4.17c.02-.62-.2-.79-.83-.89-4.99-.82-7.79-5.44-7.11-10.04.2-1.36 1.07-2.72 2.15-3.65 2.35-2.02 4.91-3.71 8.32-2.74.04.01.1 0 .12.01 1.91 1.55 2.95.02 4.11-1.11 1.35-1.33 2.71-2.66 4.05-4 .24-.24.73-.44.53-.86-.16-.34-.6-.17-.91-.18-.87-.02-1.75 0-2.62-.02-.37 0-.82.03-.81-.52.01-.47.42-.43.74-.44 1.83 0 3.66 0 5.49-.02.52 0 .75.17.74.71-.02 1.8 0 3.6 0 5.4 0 .32.06.7-.42.75-.38.04-.77.07-.85-.46-.16-1.24-.15-2.47 0-3.71z"
                          fill="#223656"
                        />
                        <Path
                          d="M38.79 13.45v3.71c-.39-1.24-.35-2.47 0-3.71z"
                          fill="#c2dedd"
                        />
                        <Path
                          d="M26.55 33.37c-4.2 0-7.49-3.2-7.46-7.26.02-3.25 4.15-7.4 7.44-7.48 3.74-.08 7.45 3.81 7.58 7.71.12 3.51-3.86 7.48-7.55 7.03z"
                          fill="#91bcbe"
                        />
                      </G>
                    </Svg>
                  </View>
                )}
              />
            </View>
            {sexErr && <Text style={styles.errormsg}>{sexErr}</Text>}
          </View>
          <View style={styles.inputmain}>
            <View style={[styles.labelContainer, styles.selecttext]}>
              <Text style={styles.label}>Location</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginTop: -22}}>
                  <Svg
                    id="icons-RZ_Weiss"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                    width={45}
                    height={45}>
                    <Defs></Defs>
                    <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                    <Path
                      className="cls-1"
                      d="M25.31 39.88c.11-.11 10.2-10.22 10.2-18.68 0-3.74-1.16-6.75-3.36-8.7l-.02-.02c-1.81-1.61-4.34-2.49-7.14-2.49s-5.34.89-7.15 2.5c-2.2 1.95-3.37 4.96-3.37 8.7 0 8.46 10.04 18.51 10.14 18.61.12.12.28.2.42.18.11 0 .21-.05.27-.11zm-.96-1.86a51.192 51.192 0 01-3.93-4.91c-3.22-4.57-4.92-8.69-4.92-11.91 0-7.5 4.9-10.18 9.49-10.18 6.99 0 9.49 5.26 9.49 10.18 0 6.6-6.77 14.55-8.85 16.83l-.64.71-.64-.71z"
                      fill="#223656"
                    />
                    <Path
                      className="cls-1"
                      d="M25 14.15c-3.55 0-6.42 2.95-6.42 6.54s2.87 6.5 6.42 6.5 6.42-2.95 6.42-6.54-2.87-6.5-6.42-6.5z"
                      fill="#223656"
                    />
                  </Svg>
                </View>

                {/* <TextInput placeholder="Enter Location" style={styles.selectedTextStyle} 
                                 value={location}                 
                                 onChange={(event) => {handleChange("location", event) }} /> */}
                <GooglePlacesInput
                  setLocation={setLocation}
                  location={location}
                />
              </View>
            </View>
          </View>
          <View style={styles.dotmain}>
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dotactive} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
            <Badge status="success" badgeStyle={styles.dot} />
          </View>
          <Text style={styles.onboardtext}>
            Add the basic details of your pet. You can edit these later
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

          {/* upload popup */}
          <BottomSheet modalProps={{}} isVisible={isVisible}>
            <ScrollView style={[styles.bottomsheetmainsmall]}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
              </TouchableOpacity>
              <View style={styles.space20}></View>
              <View>
                <Text style={styles.createacc}>Profile Photo</Text>
              </View>
              <View style={styles.space20}></View>
              <View style={styles.uploadphotomain}>
                <View style={styles.uploadphotoinner}>
                  <TouchableOpacity
                    onPress={() => chooseCamera()}
                    style={{alignItems: 'center'}}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Circle-Turquoise-Blue"
                      viewBox="0 0 48 48"
                      width={50}
                      height={50}>
                      <Defs></Defs>
                      <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                      <Path
                        className="cls-2"
                        d="M36.48 15.29h-5.67c-.43-1.65-1.13-3.56-3.26-3.56h-7.1c-2.15 0-2.84 1.91-3.26 3.56h-5.67c-1.39 0-2.52 1.13-2.52 2.52v15.95c0 1.39 1.13 2.52 2.52 2.52h24.95c1.39 0 2.52-1.13 2.52-2.52V17.84c0-1.4-1.13-2.54-2.52-2.54zm1.02 18.46c0 .56-.46 1.02-1.02 1.02H11.52c-.56 0-1.02-.46-1.02-1.02V17.8c0-.56.46-1.02 1.02-1.02h6.25c.35 0 .65-.24.73-.57.51-2.11.9-2.99 1.95-2.99h7.1c1.04 0 1.43.88 1.95 2.99.08.33.38.57.73.57h6.25c.56 0 1.02.48 1.02 1.04v15.92z"
                      />
                      <Path
                        className="cls-2"
                        d="M24 19.28c-3.6 0-6.54 2.92-6.54 6.51S20.39 32.3 24 32.3s6.54-2.92 6.54-6.51-2.93-6.51-6.54-6.51zm0 11.52c-2.78 0-5.04-2.25-5.04-5.01s2.26-5.01 5.04-5.01 5.04 2.25 5.04 5.01S26.78 30.8 24 30.8z"
                      />
                    </Svg>
                    <Text style={styles.uploadtext}>Camera</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.uploadphotoinner}>
                  <TouchableOpacity
                    onPress={() => chooseGallery()}
                    style={{alignItems: 'center'}}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Circle-Turquoise-Blue"
                      viewBox="0 0 48 48"
                      width={50}
                      height={50}>
                      <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                      <Path
                        className="cls-2"
                        d="M17.3 19.39l5.97-5.93v15.81c0 .4.33.72.73.72s.73-.33.73-.72V13.46l5.97 5.93c.28.27.76.27 1.03 0 .14-.14.21-.32.21-.51s-.08-.38-.21-.51l-7.21-7.16c-.28-.27-.76-.27-1.03 0l-7.21 7.16c-.14.14-.21.32-.21.51s.08.38.21.51c.29.28.75.28 1.03 0z"
                      />
                      <Path
                        className="cls-2"
                        d="M35.25 29c-.41 0-.75.34-.75.75v3.75h-21v-3.75c0-.41-.34-.75-.75-.75s-.75.34-.75.75v4.5c0 .41.34.75.75.75h22.5c.41 0 .75-.34.75-.75v-4.5c0-.41-.34-.75-.75-.75z"
                      />
                    </Svg>
                    <Text style={styles.uploadtext}>Upload</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
            </ScrollView>
          </BottomSheet>
          {/* Add-pet name and user-name */}
          <BottomSheet modalProps={{}} isVisible={issVisible}>
            <ScrollView style={[styles.bottomsheetmain]}>
              <TouchableOpacity onPress={() => closeNamePopup()}>
                <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
              </TouchableOpacity>
              <View style={styles.space20}></View>
              <View>
                <Text style={styles.createacc}>Add Pet Name </Text>
              </View>
              <View style={styles.space20}></View>
              <View style={styles.inputmain}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Pet Name</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Pet Name"
                    style={styles.input}
                    value={petName}
                    onChange={event => {
                      handleChange('petName', event);
                    }}
                    maxLength={15}
                  />
                </View>
                {petNameErr && (
                  <Text style={styles.errormsg}>{petNameErr}</Text>
                )}
              </View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              {/* <View style={styles.inputmain}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Pet Username</Text>
                </View>
                <View style={[styles.inputContainer, styles.passwordmain]}>
                  <TextInput placeholder="Pet Username" style={styles.input}
                    autoCapitalize='none'
                    value={petUserName}
                    onChange={(event) => { handleChange("petUserName", event) }}
                    maxLength={15}
                  />

                  {petUserName.length == 0 ? '' : (
                    <>
                      {CheckpetUserName == true ?
                        <View style={styles.password}>
                          <Octicons name="check-circle-fill" size={30} color="#008000"></Octicons>
                        </View>
                        :
                        <View style={styles.password}>
                          <Octicons name="x-circle-fill" size={30} color="#EE4B2B"></Octicons>
                        </View>
                      }
                    </>
                  )}


                </View>
                {petUserNameErr && (
                  <Text style={styles.errormsg}>{petUserNameErr}</Text>
                )}
              </View> */}
              <TouchableOpacity
                style={styles.bluebtn}
                onPress={() => handleNameSubmit()}>
                <Text style={styles.bluebtntext}>Submit</Text>
              </TouchableOpacity>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
              <View style={styles.space20}></View>
            </ScrollView>
          </BottomSheet>

          {congratsMsg == true ? (
            <MotivationalMessage
              MessagePop={MessagePop}
              congratsMsg={congratsMsg}
              setCongratsMsg={setCongratsMsg}
            />
          ) : (
            ''
          )}
        </KeyboardAwareScrollView>
      </ScrollView>
    </>
  );
};

export default SliderAdd2;
