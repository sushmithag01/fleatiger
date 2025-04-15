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
  Alert,
  ImageBackground,
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
import Toast from 'react-native-root-toast';
import {GetBreadDropdownApi} from './API/ApiCalls';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {BottomSheet, Button, ListItem} from '@rneui/themed';

const UpdateProfileImageName = ({navigation}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [profileImg, setProfileImg] = useState('');
  const [petName, setPetName] = useState('Name');
  const [filePath, setFilePath] = useState('');

  const options = {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.5,
    mediaType: 'photo',
    includeBase64: true,
    presentationStyle: 'pageSheet',
    cameraType: 'back',
  };

  // {"assets": [{"fileName": "rn_image_picker_lib_temp_2b7c5a8c-526e-456f-8aa4-36a79de77514.jpg", "fileSize": 200509, "height": 1280, "type": "image/jpeg", "uri": "file:///data/user/0/com.fleatiger/cache/rn_image_picker_lib_temp_2b7c5a8c-526e-456f-8aa4-36a79de77514.jpg", "width": 960}]}

  const chooseCamera = async () => {
    const result = await launchCamera(options);
    console.log('sgvfh', result);
    // setFilePath(`data:image/jpeg;base64,${result.assets[0].base64}`)
    Toast.show(result.errorCode, {
      duration: Toast.durations.LONG,
      position: 50,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: '#fff',
      textColor: '#000',
    });
    // alert(result,"result1")
  };

  const chooseGallery = async () => {
    const result = await launchImageLibrary(options);
    setFilePath(`data:image/jpeg;base64,${result.assets[0].base64}`);
    // console.log(`data:image/jpeg;base64,${result.assets[0].base64}`,"result1")
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          style={styles.fleamain}
          showsVerticalScrollIndicator={false}>
          <View style={styles.logosection}>
            {filePath.length != 0 ? (
              <>
                <View style={styles.adduploadmain}>
                  <View>
                    <Text>Upload</Text>
                  </View>
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
          <View style={styles.editnamemain}>
            <TextInput
              style={styles.editnametext}
              value={petName == '' || null ? 'Lucky' : petName}
              onChange={event => {
                handleChange('petName', event);
              }}
            />

            <FontAwesome name="pencil" color="#6D7177" size={20}></FontAwesome>
          </View>
          <Text style={styles.familytext}>Family Member</Text>

          <View></View>

          {/* upload popup */}
          <BottomSheet modalProps={{}} isVisible={isVisible}>
            <ScrollView
              style={[styles.bottomsheetmainsmall]}
              showsVerticalScrollIndicator={false}>
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
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default UpdateProfileImageName;
