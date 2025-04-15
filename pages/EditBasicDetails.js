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
  KeyboardAvoidingView,
} from 'react-native';
import styles from '../Common.css';
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
import {
  CheckUserNameApi,
  EditPetBasicDetailsApi,
  EditPetDetailsApi,
  EditcheckImeiExixtsApi,
  GetBreadDropdownApi,
  UpdatePetDetailsApi,
} from './API/ApiCalls';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {BottomSheet, Button, ListItem} from '@rneui/themed';
import ErrorText from './ErrorText/ErrorText';
import {useIsFocused} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import Regex from './Regex/Regex';
import GooglePlacesInput from './Maps/GooglePlacesInput';
import Octicons from 'react-native-vector-icons/Octicons';
import Loader from './CommonScreens/Loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EditBasicDetailsHeaderLeft} from '../navigation/CustomBackNavigation';

const EditBasicDetails = ({navigation}) => {
  const [breadArray, setBreadArray] = useState([]);
  const [breed, setBreed] = useState('');

  const [profileImg, setProfileImg] = useState('');
  const [petName, setPetName] = useState('');

  const [sex, setSex] = useState('');
  const [gendervalue, setGenderValue] = useState([]);

  const [location, setLocation] = useState('');
  const [color, setColor] = useState('');
  const [imeiNumber, setimeiNumber] = useState('');
  const [filePath, setFilePath] = useState('');
  const [IsImgUpload, setIsImgUpload] = useState(false);

  // feilds
  const [birthday, setbirthday] = useState('Enter Birthday');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  // err-feild
  const [petNameErr, setPetNameErr] = useState('');
  const [breedErr, setBreedErr] = useState('');
  const [sexErr, setSexErr] = useState('');
  const [locationErr, setLocationErr] = useState('');
  const [colorErr, setColorErr] = useState('');
  const [birthdayErr, setBirthdayErr] = useState('');

  const [imeiNumberErr, setimeiNumberErr] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  // to detect - add now or finish
  const isFocused = useIsFocused();

  const [issVisible, setIssVisible] = useState(false);
  // const [petUserNameErr, setpetUserNameErr] = useState('');
  const [CheckpetUserName, setCheckpetUserName] = useState(false);
  const [IsSubmit, setIsSubmit] = useState(false);
  const [petNameUserNameErr, setpetNameUserNameErr] = useState('');
  const [petUserName, setpetUserName] = useState('');
  const [petNameText, setPetNameText] = useState('');
  const [petUserNameText, setpetUserNameText] = useState('');
  const [existingImg, setExistingImg] = useState('');
  const [loading, setLoading] = useState(false);
  const [ValidImei, setValidImei] = useState('');

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => (
          <EditBasicDetailsHeaderLeft navigation={navigation} />
        ),
      });
      GetProfileData();
    }
  }, [isFocused]);

  const GetProfileData = async () => {
    setLoading(true);
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      id: PetId,
    };
    const Response = await EditPetBasicDetailsApi(payload);
    if (Response == false) {
      setLoading(false);
      Toast.show(ErrorText.InternalError, {
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
      if (Response.success == true) {
        setPetName(Response?.data[0]?.pet_name);
        setpetUserName(Response?.data[0]?.user_name);
        setPetNameText(Response?.data[0]?.pet_name);
        setpetUserNameText(Response?.data[0]?.user_name);
        setLocation(Response?.data[0]?.location);
        setColor(Response?.data[0]?.color);

        setbirthday(Response?.data[0]?.birth_day);
        setFilePath(Response?.data[0]?.pet_image);
        if (Response?.data[0]?.imei_tracker_id == null) {
          setimeiNumber('');
          // setpetUserNameErr('')
        } else {
          setimeiNumber(Response?.data[0]?.imei_tracker_id[0]);
        }

        // breed list
        setBreadArray(Response?.data[0]?.breed_list);
        setBreed(Response?.data[0]?.breed_list[0].value);
        // sex-listr
        setGenderValue(Response?.data[0]?.genderlist);
        const genderToApi =
          Response?.data[0]?.genderlist[0].label.toLowerCase();
        setSex(genderToApi);
        console.log(genderToApi, 'genderToApi');
        setLoading(false);
      } else {
        setLoading(false);
        Toast.show(ErrorText.InternalError, {
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
    setFilePath(`data:image/jpeg;base64,${result.assets[0].base64}`);
    setProfileImg(`data:image/jpeg;base64,${result.assets[0].base64}`);
    setIsVisible(false);
    setIsImgUpload(true);
    // Toast.show(result.errorCode, {
    //   duration: Toast.durations.LONG,
    //   position: 50,
    //   shadow: true,
    //   animation: true,
    //   hideOnPress: true,
    //   delay: 0,
    //   backgroundColor: '#fff',
    //   textColor: '#000',
    // });
    // alert(result,"result1")
  };
  const chooseGallery = async () => {
    const result = await launchImageLibrary(options);
    setFilePath(`data:image/jpeg;base64,${result.assets[0].base64}`);
    setProfileImg(`data:image/jpeg;base64,${result.assets[0].base64}`);
    setIsVisible(false);
    setIsImgUpload(true);
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
  };

  // input-feild
  const handleChange = async (value, event) => {
    if (value == 'location') {
      setLocation(event.nativeEvent.text);
      if (event.nativeEvent.text.length != 0) {
        setLocationErr('');
      } else {
        setLocationErr(ErrorText.LocatonRequired);
      }
    }
    if (value == 'petName') {
      setPetName(event.nativeEvent.text);
      if (event.nativeEvent.text.length != 0) {
        setPetNameErr('');
      } else {
        setPetNameErr(ErrorText.PetNameRequired);
      }
    }
    if (value == 'color') {
      setColor(event.nativeEvent.text);
      if (event.nativeEvent.text.length != 0) {
        setColorErr('');
      } else {
        setColorErr(ErrorText.ColorRequired);
      }
    }

    if (value == 'imeiNumber') {
      setimeiNumber(event.nativeEvent.text);
      if (Regex.OnlyNumberTest.test(event.nativeEvent.text) === false) {
        setimeiNumberErr(ErrorText.ImeiNumberValidError);
      } else if (event.nativeEvent.text.length === 15) {
        let payload = {
          imei: event.nativeEvent.text,
          user_id: await AsyncStorage.getItem('userId'),
          pet_id:await AsyncStorage.getItem("PetId"),
        };
        const checkImei = await EditcheckImeiExixtsApi(payload);
        console.log('checkImei', checkImei);
        if (checkImei.status === 200) {
          setimeiNumberErr('');
        } else {
          setimeiNumberErr(ErrorText.ImeiNumberValidError);
        }
      } else {
        setimeiNumberErr('');
      }
    }

    if (value == 'petUserName') {
      setpetUserName(event.nativeEvent.text);
      if (event.nativeEvent.text.length != 0) {
        // setpetUserNameErr('');
      } else {
        // setpetUserNameErr(ErrorText.PetuserNameRequired);
      }
    }
  };

  // next-button
  const handleNext = async () => {
    // setLoading(true)
    if (petName.length == 0) {
      setpetNameUserNameErr(ErrorText.PetNameAndUserNameRequired);
    }
    if (breed.length == 0) {
      setBreedErr(ErrorText.PetBreedrequired);
    }
    if (sex.length == 0) {
      setSexErr(ErrorText.PetSexrequired);
    }
    // if (location.length == 0) {
    //   setLocationErr(ErrorText.LocatonRequired);
    // }
    // if (color.length == 0) {
    //   setColorErr(ErrorText.ColorRequired);
    // }
    if (birthday == 'Enter Birthday') {
      setBirthdayErr(ErrorText.BirthdayRequired);
    }

    // if (imeiNumber.length == 0) {
    //   setimeiNumberErr(ErrorText.ImeiNumberRequiredError);
    // }
    if (imeiNumber && imeiNumber.length < 15) {
      setimeiNumberErr(ErrorText.ImeiNumberMaxError);
    }

    if (
      petName.length != 0 &&
      breed.length != 0 &&
      sex.length != 0 &&
      // color.length != 0 &&
      // location.length != 0 &&
      petNameErr.length == 0 &&
      breedErr.length == 0 &&
      sexErr.length == 0
      // &&
      // colorErr.length == 0 &&
      // locationErr.length == 0
      // (imeiNumber && imeiNumber.length == 15)
    ) {
      const UserID = await AsyncStorage.getItem('userId');
      const PetId = await AsyncStorage.getItem('PetId');
      const CroppedPath = filePath.split('/');
      console.log(CroppedPath.length, 'CroppedPath');
      if (CroppedPath && CroppedPath.length == 6) {
        setExistingImg(
          CroppedPath[3] + '/' + CroppedPath[4] + '/' + CroppedPath[5],
        );
      } else {
        setExistingImg(CroppedPath[3] + '/' + CroppedPath[4]);
      }

      // console.log("SendImageExistingPath",SendImageExistingPath)
      const payload = {
        pet_id: parseInt(PetId),
        user_id: parseInt(UserID),
        breed: breed,
        gender: sex,
        location: location,
        color: color,
        birthday: birthday,
        pet_name: petName,
        pet_image_path:
          IsImgUpload == true
            ? {
                data: filePath,
                file_type: 'jpg',
              }
            : CroppedPath && CroppedPath.length == 6
              ? CroppedPath[3] + '/' + CroppedPath[4] + '/' + CroppedPath[5]
              : CroppedPath[3] + '/' + CroppedPath[4],
        isupload: IsImgUpload == true ? 1 : 0,
        imei_tracker_id: imeiNumber,
        user_name: petUserName,
      };
      console.log('payload', payload);
      const Response = await UpdatePetDetailsApi(payload).finally(() => {
        setLoading(false);
      });
      // console.log("Response", Response)
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
    }
  };

  const handleNameSubmit = () => {
    if (petName.length == 0) {
      setPetNameErr(ErrorText.PetNameRequired);
    }
    // if (petUserName.length == 0) {
    //   // setpetUserNameErr(ErrorText.PetuserNameRequired);
    // }
    if (
      petName.length != 0 &&
      // petUserName.length != 0 &&
      petNameErr.length == 0
    ) {
      setPetNameText(petName);
      // setpetUserNameText(petUserName);
      closeNamePopup();
      setIsSubmit(true);
      setpetNameUserNameErr('');
    }
  };

  // useEffect(() => {
  //   if (petUserName.length != 0) {
  //     checkUserName();
  //   } else {
  //     // setpetUserNameErr('');
  //   }
  // }, [petUserName]);

  const checkUserName = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const payload = {
      user_id: parseInt(UserID),
      user_name: petUserName,
      pet_id: 0,
    };
    const Response = await CheckUserNameApi(payload);
    if (Response.success == false) {
      // setpetUserNameErr(Response.message);
      setCheckpetUserName(false);
    } else {
      // setpetUserNameErr('');
      setCheckpetUserName(true);
    }
  };

  const closeNamePopup = () => {
    setIssVisible(false);
    setPetNameErr('');
    // setpetUserNameErr('');
    setCheckpetUserName(false);
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView style={styles.fleamain} showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          {/* <View style={styles.navheader}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}>
              <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
            </TouchableOpacity>
          </View> */}
          <View style={styles.logosection}>
            {filePath.length != 0 ? (
              <>
                <View style={styles.adduploadmain}>
                  <TouchableOpacity
                    onPress={() => setIsVisible(true)}
                    style={styles.adduploadmain}>
                    <ImageBackground
                      style={[styles.ProfileLogo, styles.addupload]}
                      source={{uri: filePath}}></ImageBackground>
                  </TouchableOpacity>
                  <View styles={styles.addupload1}></View>
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

          <View>
            <TouchableOpacity onPress={() => setIssVisible(true)}>
              <View style={styles.editnamemain}>
                <Text style={styles.editnametext}>
                  {!IsSubmit ? petNameText : petName}
                </Text>
                {/* <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height={20} width={20}>
                  <Circle cx={24} cy={24} r={24} fill="#ce5757" strokeWidth={0} />
                  <Path
                    d="M38.75 17.37l-3.95-3.94a.907.907 0 00-.44-.24c-.05 0-.1-.01-.14-.01a.754.754 0 00-.61.25L18.24 28.8a.88.88 0 00-.24.48l-.55 3.88H9.84c-.47 0-.84.38-.84.84s.38.84.84.84h8.45l4.6-.66c.18-.02.34-.1.48-.23l15.37-15.37c.16-.16.25-.38.25-.6s-.09-.44-.25-.6zm-3.55 2.36L23.01 31.92l-2.75-2.76 12.18-12.19 2.76 2.76zm1.76-1.77l-.56.57-2.76-2.76.57-.57 2.75 2.76z"
                    fill="#fff"
                    strokeWidth={0}
                  />
                </Svg> */}
                <FontAwesome
                  name="pencil"
                  color="#6D7177"
                  size={20}></FontAwesome>
              </View>
              <Text style={styles.petusername}>
                {!IsSubmit ? petUserNameText : petUserName}
              </Text>
              <Text style={styles.familytext}>Family Member</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.space20}></View>
          {petNameUserNameErr && (
            <Text style={styles.requiredErr}>{petNameUserNameErr}</Text>
          )}

          <View>
            {/* dropdown */}
            <View style={styles.inputmain}>
              {breadArray?.length == 0 ? (
                <View style={styles.inputmain}>
                  <View style={[styles.labelContainer, styles.selecttext]}>
                    <Text style={styles.label}>Breed</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <View style={styles.leftselect}>
                      <View style={styles.selecticon}>
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
                    </View>
                    <Text style={styles.selectedTextStyle}>-</Text>
                  </View>
                </View>
              ) : (
                <>
                  <View style={[styles.labelContainer, styles.selecttext]}>
                    <Text style={styles.label}>Breed</Text>
                  </View>
                  <View style={styles.inputContainerDrop}>
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={breadArray}
                      maxHeight={300}
                      search={true}
                      labelField="label"
                      valueField="value"
                      placeholder="Select item"
                      searchPlaceholder="Search..."
                      value={breadArray[0]}
                      mode="modal"
                      onChange={item => {
                        // setValue(item.label);
                        // console.log(item.value)
                        setBreed(item.value);
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
                </>
              )}
              {breedErr && <Text style={styles.errormsg}>{breedErr}</Text>}
            </View>
          </View>

          <View style={styles.inputmain}>
            {gendervalue.length == 0 ? (
              <View style={styles.inputmain}>
                <View style={[styles.labelContainer, styles.selecttext]}>
                  <Text style={styles.label}>Sex</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.leftselect}>
                    <View style={styles.selecticon}>
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
                  </View>
                  <Text style={styles.selectedTextStyle}>-</Text>
                </View>
              </View>
            ) : (
              <>
                <View style={[styles.labelContainer, styles.selecttext]}>
                  <Text style={styles.label}>Sex</Text>
                </View>
                <View style={styles.inputContainerDrop}>
                  <Dropdown
                    search={true}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={gendervalue}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select item"
                    searchPlaceholder="Search..."
                    value={gendervalue[0]}
                    onChange={item => {
                      // setGenderValue(item.value);
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
              </>
            )}
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
            {locationErr && <Text style={styles.errormsg}>{locationErr}</Text>}
          </View>
          {/* color */}
          <View style={styles.inputmain}>
            <View style={[styles.labelContainer, styles.selecttext]}>
              <Text style={styles.label}>Color</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.leftselect}>
                <View style={styles.selecticon}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="icons-RZ_Weiss"
                    viewBox="0 0 50 50"
                    width={50}
                    height={50}>
                    <Defs></Defs>
                    <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                    <Path
                      className="cls-1"
                      d="M36.7 29.3a9.094 9.094 0 002.68-6.46c0-3.43-1.34-6.65-3.76-9.07A12.814 12.814 0 0026.55 10c-4.25 0-8.25 1.66-11.26 4.67s-4.66 7-4.67 11.26v.62c0 3.59 1.41 6.97 3.95 9.51s5.92 3.94 9.51 3.95h.18c.74 0 1.45-.3 1.97-.82.53-.54.82-1.24.81-2v-.14c0-.64-.26-1.23-.71-1.67-.44-.43-1.04-.67-1.65-.67h-.04c-.34 0-.68-.14-.92-.38-.25-.26-.39-.62-.38-.98 0-.36.14-.7.4-.95.26-.26.6-.4.96-.4h5.55c2.44 0 4.73-.95 6.46-2.68zm-13.69 2.4a2.38 2.38 0 00-.67 1.69c0 .61.24 1.2.67 1.62.44.44 1.05.68 1.67.67.36 0 .7.14.96.4s.4.6.4.96v.14c0 .48-.19.96-.53 1.3-.33.34-.79.53-1.26.53h-.18c-3.33 0-6.45-1.3-8.81-3.66a12.434 12.434 0 01-3.66-8.81v-.62c0-3.99 1.56-7.74 4.38-10.55s6.57-4.37 10.55-4.38c3.16 0 6.14 1.24 8.37 3.47 2.24 2.24 3.47 5.21 3.47 8.37 0 2.17-.85 4.22-2.39 5.75a8.08 8.08 0 01-5.75 2.39h-5.55c-.63 0-1.24.26-1.67.71z"
                      fill="#223656"
                    />
                    <Path
                      className="cls-1"
                      d="M18.21 30.67c-.63 0-1.23.25-1.67.69-.44.44-.69 1.04-.69 1.67s.25 1.23.69 1.67c.44.44 1.04.69 1.67.69s1.23-.25 1.67-.69c.44-.44.69-1.04.69-1.67 0-.63-.25-1.23-.69-1.67a2.36 2.36 0 00-1.67-.69zM18.67 26.55a2.628 2.628 0 00-2.62-2.62 2.628 2.628 0 00-2.62 2.62 2.628 2.628 0 002.62 2.62 2.628 2.628 0 002.62-2.62zM19.45 22.34c.77 0 1.5-.3 2.04-.85s.85-1.27.85-2.04-.3-1.5-.85-2.04-1.27-.85-2.04-.85-1.5.3-2.04.85-.85 1.27-.85 2.04a2.901 2.901 0 002.89 2.89zM27.78 19.83c.83 0 1.64-.33 2.23-.92.59-.59.92-1.39.92-2.23s-.33-1.64-.92-2.23c-.59-.59-1.39-.92-2.23-.92s-1.64.33-2.23.92a3.147 3.147 0 002.22 5.37z"
                      fill="#223656"
                    />
                  </Svg>
                </View>
              </View>
              <TextInput
                placeholder="Enter Color"
                style={styles.selectedTextStyle}
                value={color == '' ? '' : color}
                onChange={event => {
                  handleChange('color', event);
                }}
              />
            </View>
            {colorErr && <Text style={styles.errormsg}>{colorErr}</Text>}
          </View>
          {/* birthday */}
          <View style={styles.inputmain}>
            <View style={[styles.labelContainer, styles.selecttext]}>
              <Text style={styles.label}>Birthday</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.leftselect}>
                <View style={styles.selecticon}>
                  <Svg
                    id="icons-RZ_Weiss"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                    width={45}
                    height={45}>
                    <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                    <Path
                      d="M11.87 27.62v11.89c0 .27.22.5.5.5h25.27c.27 0 .5-.22.5-.5V27.62c0-2.33-1.9-4.23-4.23-4.23h-6.85v-6.04c0-.26-.2-.44-.5-.44h-3.17c-.24 0-.44.2-.44.44v6.04H16.1c-2.33 0-4.23 1.9-4.23 4.23zm12.07-9.22c0-.3.25-.55.55-.55h1.01c.3 0 .55.25.55.55v4.99h-2.12V18.4zm-5.4 10.36c.52-.51.98-.95 1.54-.95.52 0 1.02.35 1.6.76.82.58 1.84 1.29 3.32 1.29s2.48-.71 3.3-1.27c.6-.42 1.12-.78 1.67-.78s.98.44 1.5.94c.66.64 1.4 1.36 2.48 1.36s2.11-.36 2.97-1.03l.2-.16v9.42c0 .37-.3.67-.67.67H13.53a.67.67 0 01-.67-.67v-9.42l.2.16c.86.68 1.89 1.03 2.97 1.03s1.86-.72 2.51-1.35zM22.7 13.24c0 1.28 1.05 2.36 2.3 2.36s2.3-1.04 2.3-2.36-.96-2.78-2.09-3.18h-.01a.42.42 0 00-.21-.06c-.15 0-.27.09-.33.15-.14.16-.3.34-.47.51-.73.79-1.49 1.6-1.49 2.57zm2.14-1.86c.07-.08.13-.15.19-.21l.07-.08.09.06c.66.46 1.17 1.38 1.17 2.09 0 .76-.61 1.37-1.37 1.37-.71 0-1.31-.63-1.31-1.37 0-.59.66-1.32 1.15-1.86z"
                      fill="#223656"
                    />
                  </Svg>
                </View>
              </View>
              <View>
                <Text
                  placeholder="Enter Birthday"
                  style={styles.selectedTextStyle}
                  onPress={() => setOpen(true)}>
                  {birthday}
                </Text>
              </View>
              <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                title="Select Birthday"
                value={date}
                maximumDate={new Date()}
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                  const DateValue = new Date(date);
                  const shortMonth = DateValue.toLocaleString('en-US', {
                    month: 'short',
                  });
                  const day = DateValue.toLocaleString('en-US', {
                    day: 'numeric',
                  });
                  const year = DateValue.toLocaleString('en-US', {
                    year: 'numeric',
                  });
                  const formattedDate = day + ' ' + shortMonth + ' ' + year;
                  const formattedDateAPi =
                    date.getFullYear() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getDate();
                  setbirthday(formattedDateAPi);
                  setBirthdayErr('');
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
            {birthdayErr && <Text style={styles.errormsg}>{birthdayErr}</Text>}
          </View>

          {/* IMEI */}
          <View style={styles.inputmain}>
            <View style={[styles.labelContainer, styles.selecttext]}>
              <Text style={styles.label}>Tracker Number</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.leftselect}>
                <View style={styles.selecticon}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Circle-Turquoise-White"
                    viewBox="0 0 48 48"
                    width={50}
                    height={50}>
                    <Defs></Defs>
                    <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                    <Path
                      className="cls-1"
                      d="M36.25 10.5h-24.5C10.24 10.5 9 11.73 9 13.25v21.51c0 1.51 1.23 2.75 2.75 2.75h24.51c1.51 0 2.75-1.23 2.75-2.75V13.25c0-1.51-1.23-2.75-2.75-2.75zm1.25 24.25c0 .69-.56 1.25-1.25 1.25h-24.5c-.69 0-1.25-.56-1.25-1.25v-21.5c0-.69.56-1.25 1.25-1.25h24.51c.69 0 1.25.56 1.25 1.25v21.51z"
                      fill="#223656"
                    />
                    <Path
                      className="cls-1"
                      d="M15.27 15.75c-.41 0-.75.34-.75.75v15c0 .41.34.75.75.75s.75-.34.75-.75v-15c0-.41-.34-.75-.75-.75zM32.73 15.75c-.41 0-.75.34-.75.75v15c0 .41.34.75.75.75s.75-.34.75-.75v-15c0-.41-.34-.75-.75-.75zM25.21 15.75c-.41 0-.75.34-.75.75V29c0 .41.34.75.75.75s.75-.34.75-.75V16.5c0-.41-.34-.75-.75-.75zM21.73 15.75c-.69 0-1.25.56-1.25 1.25v11.5a1.25 1.25 0 002.5 0V17c0-.69-.56-1.25-1.25-1.25zM18.25 15.75c-.41 0-.75.34-.75.75V29c0 .41.34.75.75.75s.75-.34.75-.75V16.5c0-.41-.34-.75-.75-.75zM28.96 15.75c-.83 0-1.5.67-1.5 1.5v11c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5z"
                      fill="#223656"
                    />
                  </Svg>
                </View>
              </View>
              <TextInput
                placeholder="Enter Tracker Number"
                style={styles.selectedTextStyle}
                value={imeiNumber == null ? '' : imeiNumber}
                onChange={event => {
                  handleChange('imeiNumber', event);
                }}
                maxLength={15}
              />
            </View>

            {imeiNumberErr && (
              <Text style={styles.errormsg}>{imeiNumberErr}</Text>
            )}
          </View>

          <View>
            <TouchableOpacity
              style={styles.bluebtnsmallSave}
              onPress={() => handleNext()}>
              <Text style={styles.bluebtnsmalltextSave}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* upload popup */}
          <BottomSheet modalProps={{}} isVisible={isVisible}>
            <ScrollView
              style={[styles.bottomsheetmainsmall]}
              showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close-outline" size={30} color="#CE5757"></Ionicons>
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
            <ScrollView
              style={[styles.bottomsheetmain]}
              showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={() => closeNamePopup()}>
                <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
              </TouchableOpacity>
              <View style={styles.space20}></View>

              <View>
                <Text style={styles.createacc}>Edit Pet Name </Text>
              </View>
              <View style={styles.space20}></View>
              <KeyboardAvoidingView
                style={{flex: 1}}
                behavior="padding"
                enabled>
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
                    />
                  </View>
                  {petNameErr && (
                    <Text style={styles.errormsg}>{petNameErr}</Text>
                  )}
                </View>
                {/* <View style={styles.inputmain}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Pet Username</Text>
                  </View>
                  <View style={[styles.inputContainer, styles.passwordmain]}>
                    <TextInput
                      editable={false}
                      placeholder="Pet Username"
                      style={styles.input}
                      autoCapitalize="none"
                      value={petUserName}
                      onChange={event => {
                        handleChange('petUserName', event);
                      }}
                    />

                    {petUserName.length == 0 ? (
                      ''
                    ) : (
                      <>
                        {CheckpetUserName == true ? (
                          <View style={styles.password}>
                            <Octicons
                              name="check-circle-fill"
                              size={30}
                              color="#008000"></Octicons>
                          </View>
                        ) : (
                          <View style={styles.password}>
                            <Octicons
                              name="x-circle-fill"
                              size={30}
                              color="#EE4B2B"></Octicons>
                          </View>
                        )}
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
              </KeyboardAvoidingView>
            </ScrollView>
          </BottomSheet>
        </KeyboardAwareScrollView>
      </ScrollView>
    </>
  );
};
export default EditBasicDetails;
