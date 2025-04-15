import React from 'react';
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
import Entypo from 'react-native-vector-icons/Entypo';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import ErrorText from './ErrorText/ErrorText';

const ViewBasicDetails = props => {
  const {data, PetName, EditPetImg} = props;
  const navigation = useNavigation();

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.homecardinner1}>
          <Text style={styles.homecardtext1}>Basic Details</Text>
          <View style={styles.act1}>
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
                d="M37.65 11.69a1.75 1.75 0 00-.89-1.45 1.77 1.77 0 00-1.7-.04c-3.32 1.69-5.72 4.07-7.15 5.77l-.02.02h-.03c-.54-.13-1.09-.19-1.64-.19h-2.46c-.55 0-1.11.06-1.64.19h-.03l-.02-.02c-1.86-2.21-3.99-4.01-6.34-5.34-.54-.3-1.09-.62-1.68-.62-.29 0-.56.07-.82.23-.52.3-.85.84-.89 1.45-.19 3.57.61 6.74 1.32 8.77.5 1.44 1.51 2.64 2.83 3.39h.02v3.69c0 2.7.61 5.28 1.76 7.45.74 1.39 2.05 3.27 4.1 4.34.85.44 1.74.67 2.63.67.69 0 1.38-.14 2.04-.41 2.06-.85 3.45-2.6 4.25-3.91 1.41-2.3 2.16-5.12 2.16-8.14v-3.68h.02a6.344 6.344 0 002.83-3.41c.71-2.03 1.51-5.19 1.32-8.77zM19.3 24.11c0-.3.12-.58.33-.79s.49-.33.79-.33.58.12.79.33c.21.21.33.49.33.79v.79c0 .3-.12.58-.33.79s-.49.33-.79.33-.58-.12-.79-.33-.33-.49-.33-.79v-.79zm16.2-4.29l-.11.31a5.339 5.339 0 01-2.65 3.01l-.05.04s-.02.02-.04.03l-.07.08v.02l.07.04h-.1l-.06.15v4.05c0 4.22-1.57 8.02-4.19 10.15-.81.66-2.11 1.44-3.63 1.32-1.68-.14-3.04-1.27-3.89-2.2-1.41-1.55-2.43-3.63-2.93-6.01v-.05h2.21c1.39 0 2.69-.54 3.67-1.52s1.52-2.29 1.52-3.67V16.8h.98c1.22 0 2.41.36 3.43 1.03.11.07.24.1.37.07a.487.487 0 00.38-.58.527.527 0 00-.21-.31c-.39-.26-.81-.48-1.24-.65l-.06-.02.04-.05c1.33-1.52 3.54-3.66 6.55-5.19.24-.13.52-.12.75.02.23.14.38.38.39.64.17 3.28-.53 6.2-1.16 8.07z"
                fill="#223656"
              />
              <Path
                className="cls-1"
                d="M29.58 22.99c-.3 0-.58.12-.79.33-.21.21-.33.49-.33.79v.79a1.12 1.12 0 002.24 0v-.79c0-.3-.12-.58-.33-.79-.21-.21-.49-.33-.79-.33zM25.89 33.41l-.59.32c-.18.1-.41.1-.59 0l-.59-.32c-.2-.11-.44-.1-.63.03l-.63.41c-.3.2-.49.54-.49.9 0 .32.14.62.38.82l1.85 1.57c.23.19.56.19.79 0l1.85-1.57c.24-.2.38-.51.38-.82 0-.36-.18-.7-.49-.9l-.63-.41a.643.643 0 00-.63-.03z"
                fill="#223656"
              />
            </Svg>
            <View>
              <Text style={styles.activestatemain}>Breed</Text>
              <Text style={styles.activestatetext}>
                {data?.breed_name == '' ? '-' : data?.breed_name}
              </Text>
            </View>
          </View>
          <View style={styles.act1}>
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
            <View>
              <Text style={styles.activestatemain}>Colour</Text>
              <Text style={styles.activestatetext}>
                {data?.color == '' ? '-' : data?.color}
              </Text>
            </View>
          </View>
          <View style={styles.act1}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              id="icons-RZ_Weiss"
              viewBox="0 0 50 50"
              width={50}
              height={50}>
              <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
              <Path
                d="M34.07 10.31c-.02-.05-.06-.1-.09-.14 0 0 0-.01-.01-.02 0 0-.01 0-.02-.01a.56.56 0 00-.15-.1c-.04-.02-.09-.02-.13-.03-.02 0-.04-.01-.06-.01h-4.92c-.28 0-.5.22-.5.5s.22.5.5.5h3.72l-5.87 5.87a7.078 7.078 0 00-3.48-.91c-3.95 0-7.16 3.2-7.16 7.16s2.94 6.88 6.66 7.13v4.82h-3.44c-.28 0-.5.22-.5.5s.22.5.5.5h3.44v3.44c0 .28.22.5.5.5s.5-.22.5-.5v-3.44H27c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-3.44v-4.82c3.72-.26 6.66-3.35 6.66-7.13 0-2.32-1.11-4.38-2.83-5.69l5.73-5.72v3.72c0 .28.22.5.5.5s.5-.22.5-.5v-4.92c0-.07-.01-.13-.04-.19zm-4.85 12.81c0 3.4-2.76 6.16-6.16 6.16s-6.16-2.76-6.16-6.16 2.76-6.16 6.16-6.16 6.16 2.76 6.16 6.16z"
                fill="#223656"
              />
            </Svg>
            <View>
              <Text style={styles.activestatemain}>Gender</Text>
              <Text
                style={[styles.activestatetext, {textTransform: 'capitalize'}]}>
                {data?.gender == '' ? '-' : data?.gender}
              </Text>
            </View>
          </View>
          <View style={styles.act1}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              id="icons-RZ_Weiss"
              viewBox="0 0 50 50"
              width={50}
              height={50}>
              <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
              <Path
                d="M11.87 27.62v11.89c0 .27.22.5.5.5h25.27c.27 0 .5-.22.5-.5V27.62c0-2.33-1.9-4.23-4.23-4.23h-6.85v-6.04c0-.26-.2-.44-.5-.44h-3.17c-.24 0-.44.2-.44.44v6.04H16.1c-2.33 0-4.23 1.9-4.23 4.23zm12.07-9.22c0-.3.25-.55.55-.55h1.01c.3 0 .55.25.55.55v4.99h-2.12V18.4zm-5.4 10.36c.52-.51.98-.95 1.54-.95.52 0 1.02.35 1.6.76.82.58 1.84 1.29 3.32 1.29s2.48-.71 3.3-1.27c.6-.42 1.12-.78 1.67-.78s.98.44 1.5.94c.66.64 1.4 1.36 2.48 1.36s2.11-.36 2.97-1.03l.2-.16v9.42c0 .37-.3.67-.67.67H13.53a.67.67 0 01-.67-.67v-9.42l.2.16c.86.68 1.89 1.03 2.97 1.03s1.86-.72 2.51-1.35zM22.7 13.24c0 1.28 1.05 2.36 2.3 2.36s2.3-1.04 2.3-2.36-.96-2.78-2.09-3.18h-.01a.42.42 0 00-.21-.06c-.15 0-.27.09-.33.15-.14.16-.3.34-.47.51-.73.79-1.49 1.6-1.49 2.57zm2.14-1.86c.07-.08.13-.15.19-.21l.07-.08.09.06c.66.46 1.17 1.38 1.17 2.09 0 .76-.61 1.37-1.37 1.37-.71 0-1.31-.63-1.31-1.37 0-.59.66-1.32 1.15-1.86z"
                fill="#223656"
              />
            </Svg>
            <View>
              <Text style={styles.activestatemain}>Birthday</Text>
              <Text style={styles.activestatetext}>
                {data?.birth_day == '' ? '-' : data?.birth_day}
              </Text>
            </View>
          </View>

          <View style={styles.act1}>
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
                d="M25.31 39.88c.11-.11 10.2-10.22 10.2-18.68 0-3.74-1.16-6.75-3.36-8.7l-.02-.02c-1.81-1.61-4.34-2.49-7.14-2.49s-5.34.89-7.15 2.5c-2.2 1.95-3.37 4.96-3.37 8.7 0 8.46 10.04 18.51 10.14 18.61.12.12.28.2.42.18.11 0 .21-.05.27-.11zm-.96-1.86a51.192 51.192 0 01-3.93-4.91c-3.22-4.57-4.92-8.69-4.92-11.91 0-7.5 4.9-10.18 9.49-10.18 6.99 0 9.49 5.26 9.49 10.18 0 6.6-6.77 14.55-8.85 16.83l-.64.71-.64-.71z"
                fill="#223656"
              />
              <Path
                className="cls-1"
                d="M25 14.15c-3.55 0-6.42 2.95-6.42 6.54s2.87 6.5 6.42 6.5 6.42-2.95 6.42-6.54-2.87-6.5-6.42-6.5z"
                fill="#223656"
              />
            </Svg>
            <View style={{width: 200}}>
              <Text style={styles.activestatemain}>Location</Text>
              <Text style={styles.activestatetext} numberOfLines={3}>
                {data?.location == '' ? '-' : data?.location}
              </Text>
            </View>
          </View>

          <View style={styles.act1}>
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
            <View>
              <Text style={styles.activestatemain}>Tracker Number</Text>
              <Text style={styles.activestatetext}>
                {data?.imei_tracker_id == null ? '-' : data?.imei_tracker_id}
              </Text>
            </View>
          </View>

          <View styles={styles.editinner}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditBasicDetails')}>
              <View
                style={{
                  width: 35,
                  height: 35,
                  backgroundColor: '#CE5757',
                  alignItems: 'center',
                  borderRadius: 50,
                  right: 0,
                  position: 'absolute',
                  bottom: 0,
                  zIndex: 1,
                }}>
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <Circle
                    cx={24}
                    cy={24}
                    r={24}
                    fill="#ce5757"
                    strokeWidth={0}
                  />
                  <Path
                    d="M38.75 17.37l-3.95-3.94a.907.907 0 00-.44-.24c-.05 0-.1-.01-.14-.01a.754.754 0 00-.61.25L18.24 28.8a.88.88 0 00-.24.48l-.55 3.88H9.84c-.47 0-.84.38-.84.84s.38.84.84.84h8.45l4.6-.66c.18-.02.34-.1.48-.23l15.37-15.37c.16-.16.25-.38.25-.6s-.09-.44-.25-.6zm-3.55 2.36L23.01 31.92l-2.75-2.76 12.18-12.19 2.76 2.76zm1.76-1.77l-.56.57-2.76-2.76.57-.57 2.75 2.76z"
                    fill="#fff"
                    strokeWidth={0}
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.homecardinner1}>
          <Text style={styles.homecardtext1}>Metrics</Text>
          <View style={styles.act1}>
            <View style={styles.editsameline}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                id="icons-RZ_Weiss"
                viewBox="0 0 50 50"
                width={50}
                height={50}>
                <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                <Path
                  d="M22.15 9.99h-7.08c-1.75 0-3.18 1.42-3.18 3.18v23.66c0 1.75 1.42 3.18 3.18 3.18h7.03c1.75 0 3.18-1.42 3.18-3.18V13.17c.02-.84-.3-1.63-.88-2.23-.6-.61-1.4-.95-2.25-.95zm2.19 9.96h-4.67c-.25 0-.47.22-.47.47s.22.47.47.47h4.67v3.65h-4.67c-.25 0-.47.22-.47.47s.22.47.47.47h4.67V29h-4.67c-.25 0-.47.22-.47.47s.22.47.47.47h4.67v3.52h-4.67c-.25 0-.47.22-.47.47 0 .27.23.52.47.52h4.67v2.23c0 1.21-.98 2.19-2.19 2.19h-7.08a2.19 2.19 0 01-2.19-2.19V13.17c0-1.21.98-2.19 2.19-2.19h7.03c1.21 0 2.19.98 2.19 2.19v2.31h-4.62c-.25 0-.47.22-.47.47s.22.47.47.47h4.67v3.52zM37.55 35.5h-.01c-.08 0-.16 0-.27.12l-.05.04-2.75 2.69V11.53l2.79 2.73c.2.2.5.19.69 0 .19-.19.19-.49 0-.68l-3.56-3.42c-.24-.21-.49-.22-.68-.04l-.36.36-3.38 3.15c-.1.09-.15.21-.16.34 0 .13.04.25.12.33.05.06.13.16.34.16.11 0 .23-.05.3-.11l2.89-2.84v26.83l-2.88-2.68a.457.457 0 00-.31-.13c-.06 0-.22.01-.3.11-.2.22-.19.54 0 .73l3.72 3.5c.19.16.47.16.67-.01l.29-.24 3.24-3.2c.09-.09.15-.21.15-.34s-.05-.25-.15-.34c-.14-.18-.24-.25-.35-.26z"
                  fill="#223656"
                />
              </Svg>
              <View style={{flex: 1}}>
                <Text style={styles.activestatemain}>Height</Text>
                <Text style={styles.activestatetext}>
                  {data?.height == '' ? '-' : data?.height} {data?.height_unit}
                </Text>
              </View>
            </View>
            <View styles={[styles.editright]}>
              <View style={styles.space10}></View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditHeight', {
                    heightValue: data?.height,
                    heightUnitValue: data?.height_unit,
                    PetName: PetName,
                    EditPetImg: EditPetImg,
                  });
                }}>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    backgroundColor: '#CE5757',
                    alignItems: 'center',
                    borderRadius: 50,
                  }}>
                  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <Circle
                      cx={24}
                      cy={24}
                      r={24}
                      fill="#ce5757"
                      strokeWidth={0}
                    />
                    <Path
                      d="M38.75 17.37l-3.95-3.94a.907.907 0 00-.44-.24c-.05 0-.1-.01-.14-.01a.754.754 0 00-.61.25L18.24 28.8a.88.88 0 00-.24.48l-.55 3.88H9.84c-.47 0-.84.38-.84.84s.38.84.84.84h8.45l4.6-.66c.18-.02.34-.1.48-.23l15.37-15.37c.16-.16.25-.38.25-.6s-.09-.44-.25-.6zm-3.55 2.36L23.01 31.92l-2.75-2.76 12.18-12.19 2.76 2.76zm1.76-1.77l-.56.57-2.76-2.76.57-.57 2.75 2.76z"
                      fill="#fff"
                      strokeWidth={0}
                    />
                  </Svg>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.act1}>
            <View style={styles.editsameline}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={50}
                height={50}>
                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                <Path
                  d="M36.87 11.45c-.82-.92-2-1.45-3.22-1.45H14.4c-1.21 0-2.33.5-3.17 1.4-.87.94-1.31 2.23-1.21 3.52l1.42 18.85c.17 2.37 2.09 4.22 4.38 4.22h16.36c2.29 0 4.21-1.85 4.38-4.22l1.42-18.82c.15-1.28-.25-2.55-1.1-3.5zm-.54 3.35l-1.42 18.86c-.11 1.51-1.31 2.69-2.74 2.69H15.81c-1.43 0-2.63-1.18-2.74-2.7l-1.42-18.86c-.06-.85.22-1.68.78-2.28.52-.56 1.22-.87 1.96-.87h19.25c.75 0 1.48.33 1.99.9.53.6.79 1.41.69 2.25z"
                  fill="#223656"
                  strokeWidth={0}
                />
                <Path
                  d="M24 13.38c-4.1 0-7.44 3.34-7.44 7.44 0 .35.29.64.64.64h3.09c.35 0 .64-.29.64-.64s-.29-.64-.64-.64h-2.41c.07-.66.25-1.3.53-1.91l.63.37c.3.17.71.06.88-.24.09-.15.11-.32.06-.49s-.15-.3-.3-.39l-.62-.36c.38-.52.84-.96 1.35-1.33l.35.61c.17.3.58.41.88.24.15-.09.26-.23.3-.39s.02-.34-.06-.49l-.35-.6c.58-.26 1.19-.42 1.82-.49v.69c0 .35.29.64.64.64s.64-.29.64-.64v-.69c.63.07 1.24.23 1.82.49l-.35.6c-.09.15-.11.32-.07.49.04.17.15.3.3.39.3.17.71.06.88-.24l.35-.61c.51.37.97.82 1.35 1.33l-.62.36c-.15.09-.26.23-.3.39-.04.17-.02.34.06.49.17.3.58.41.88.24l.63-.37c.28.61.46 1.25.53 1.91h-2.41c-.35 0-.64.29-.64.64s.29.64.64.64h3.09c.35 0 .64-.29.64-.64 0-4.1-3.34-7.44-7.44-7.44z"
                  fill="#223656"
                  strokeWidth={0}
                />
                <Path
                  d="M25.89 20.82c0-.5-.2-.95-.52-1.29l.73-1.37c.14-.25.04-.57-.21-.7a.522.522 0 00-.7.21l-.72 1.34c-.15-.04-.31-.07-.48-.07-1.04 0-1.89.85-1.89 1.89s.85 1.89 1.89 1.89 1.89-.85 1.89-1.89zM23.39 27.22c0-1.56-1.14-2.84-2.55-2.84h-.86c-1.41 0-2.55 1.27-2.55 2.83 0 .21.09.42.24.58a.82.82 0 001.4-.58c0-.7.59-1.19.91-1.19h.86c.32 0 .91.49.91 1.19 0 .38-.09.74-.24.96-.14.2-.24.24-.37.24h-1.3c-.21-.02-.42.09-.58.24-.16.16-.25.37-.25.58s.09.42.25.58c.16.16.37.25.58.24h1.31c.14 0 .24.04.37.23.12.17.24.52.24.97 0 .7-.59 1.19-.91 1.19h-.86c-.32 0-.91-.49-.91-1.19a.82.82 0 00-1.4-.58c-.16.16-.25.37-.24.58 0 1.56 1.14 2.84 2.55 2.84h.86c1.41 0 2.55-1.27 2.55-2.84 0-.73-.19-1.38-.54-1.89l-.09-.12c.03-.04.06-.08.09-.13.35-.51.54-1.16.54-1.88zM30.58 27.29c0-1.09-.58-2.03-1.41-2.47-.32-.17-.66-.27-1.03-.27h-.83c-.37 0-.72.1-1.03.27-.83.44-1.41 1.38-1.41 2.47 0 .7.18 1.33.52 1.82l.09.12-.09.12c-.34.49-.52 1.12-.52 1.83 0 1.51 1.1 2.74 2.44 2.74h.83c1.35 0 2.44-1.23 2.44-2.74 0-.7-.18-1.33-.52-1.83l-.09-.12.09-.12c.34-.49.52-1.12.52-1.82zm-2.36 5.01s-.06.03-.08.03h-.83s-.06-.02-.08-.03c-.31-.07-.78-.5-.78-1.12 0-.44.12-.77.23-.93.13-.18.22-.22.36-.22h1.38c.14 0 .23.04.36.22.11.17.23.5.23.93 0 .62-.47 1.06-.78 1.12zm.55-4.09c-.13.19-.23.23-.36.23h-1.38c-.13 0-.23-.04-.36-.23-.15-.21-.23-.56-.23-.92 0-.68.56-1.15.87-1.15h.83c.31 0 .87.47.87 1.15 0 .36-.09.71-.23.92z"
                  fill="#223656"
                  strokeWidth={0}
                />
              </Svg>
              <View style={{flex: 1}}>
                <Text style={styles.activestatemain}>Weight</Text>
                <Text style={styles.activestatetext}>
                  {data?.weight == '' ? '-' : data?.weight} {data?.weight_unit}
                </Text>
              </View>
            </View>
            <View styles={[styles.editright]}>
              <View style={styles.space10}></View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditWeight', {
                    weightValue: data?.weight,
                    weightUnitValue: data?.weight_unit,
                    PetName: PetName,
                    EditPetImg: EditPetImg,
                  });
                }}>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    backgroundColor: '#CE5757',
                    alignItems: 'center',
                    borderRadius: 50,
                  }}>
                  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <Circle
                      cx={24}
                      cy={24}
                      r={24}
                      fill="#ce5757"
                      strokeWidth={0}
                    />
                    <Path
                      d="M38.75 17.37l-3.95-3.94a.907.907 0 00-.44-.24c-.05 0-.1-.01-.14-.01a.754.754 0 00-.61.25L18.24 28.8a.88.88 0 00-.24.48l-.55 3.88H9.84c-.47 0-.84.38-.84.84s.38.84.84.84h8.45l4.6-.66c.18-.02.34-.1.48-.23l15.37-15.37c.16-.16.25-.38.25-.6s-.09-.44-.25-.6zm-3.55 2.36L23.01 31.92l-2.75-2.76 12.18-12.19 2.76 2.76zm1.76-1.77l-.56.57-2.76-2.76.57-.57 2.75 2.76z"
                      fill="#fff"
                      strokeWidth={0}
                    />
                  </Svg>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.homecardinner1}>
          <Text style={styles.homecardtext1}>Personality</Text>
          <View style={styles.act1}>
            <View style={styles.editsameline}>
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
                  d="M32.86 30.29c-.49 0-.88.39-.88.88s.39.88.88.88.88-.39.88-.88-.39-.88-.88-.88zM34.22 27.96c0 .49.39.88.88.88s.88-.39.88-.88-.39-.88-.88-.88-.88.39-.88.88zM30.61 27.08c-.49 0-.88.39-.88.88s.39.88.88.88.88-.39.88-.88-.39-.88-.88-.88zM16.3 31.17c0 .49.39.88.88.88s.88-.39.88-.88-.39-.88-.88-.88-.88.39-.88.88zM20.3 27.96c0-.49-.39-.88-.88-.88s-.88.39-.88.88.39.88.88.88.88-.39.88-.88zM14.05 27.96c0 .49.39.88.88.88s.88-.39.88-.88-.39-.88-.88-.88-.88.39-.88.88z"
                  fill="#223656"
                />
                <Path
                  className="cls-1"
                  d="M39.5 28.43c-.28 0-.5.22-.5.5 0 3.71-3.02 6.73-6.73 6.73s-6.5-2.81-6.71-6.33c.14-.06.28-.13.4-.23l4.46-3.77a2.586 2.586 0 00-.25-4.14l-1.51-1c-.46-.3-1.04-.32-1.52-.06l-1.42.78c-.44.24-.98.24-1.42 0l-1.42-.78c-.48-.26-1.06-.24-1.52.06l-1.51 1c-.73.48-1.17 1.29-1.17 2.16 0 .76.34 1.48.92 1.98l4.46 3.77c.12.1.26.17.4.23-.21 3.53-3.14 6.33-6.71 6.33s-6.73-3.02-6.73-6.73c0-.28-.22-.5-.5-.5s-.5.22-.5.5c0 4.26 3.47 7.73 7.73 7.73 3.35 0 6.19-2.14 7.27-5.12 1.07 2.98 3.92 5.12 7.27 5.12 4.26 0 7.73-3.47 7.73-7.73 0-.28-.22-.5-.5-.5zM13.46 16.71l2.61-2.2a.67.67 0 01.88 0l2.61 2.2a.49.49 0 00.7-.06c.18-.21.15-.53-.06-.7l-2.61-2.2a1.68 1.68 0 00-2.17 0l-2.61 2.2c-.21.18-.24.49-.06.7.18.21.49.24.7.06zM30.44 16.71l2.61-2.21c.26-.21.62-.21.88 0l2.61 2.21a.49.49 0 00.7-.06c.18-.21.15-.53-.06-.7l-2.61-2.21c-.63-.53-1.54-.53-2.16 0l-2.61 2.21c-.21.18-.24.49-.06.7.18.21.49.24.7.06z"
                  fill="#223656"
                />
              </Svg>
              <View style={{flex: 1}}>
                <Text style={styles.activestatemain}>Personality</Text>
                <Text style={styles.activestatetext}>
                  {data?.personality_name == '' ? '-' : data?.personality_name}
                </Text>
              </View>
            </View>
            <View styles={[styles.editright]}>
              <View style={styles.space10}></View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditPersonality', {
                    PetName: PetName,
                    EditPetImg: EditPetImg,
                  });
                }}>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    backgroundColor: '#CE5757',
                    alignItems: 'center',
                    borderRadius: 50,
                  }}>
                  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <Circle
                      cx={24}
                      cy={24}
                      r={24}
                      fill="#ce5757"
                      strokeWidth={0}
                    />
                    <Path
                      d="M38.75 17.37l-3.95-3.94a.907.907 0 00-.44-.24c-.05 0-.1-.01-.14-.01a.754.754 0 00-.61.25L18.24 28.8a.88.88 0 00-.24.48l-.55 3.88H9.84c-.47 0-.84.38-.84.84s.38.84.84.84h8.45l4.6-.66c.18-.02.34-.1.48-.23l15.37-15.37c.16-.16.25-.38.25-.6s-.09-.44-.25-.6zm-3.55 2.36L23.01 31.92l-2.75-2.76 12.18-12.19 2.76 2.76zm1.76-1.77l-.56.57-2.76-2.76.57-.57 2.75 2.76z"
                      fill="#fff"
                      strokeWidth={0}
                    />
                  </Svg>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.homecardinner1}>
          <View>
            <View style={styles.editsameline}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                id="icons-RZ_Weiss"
                viewBox="0 0 50 50"
                width={50}
                height={50}>
                <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                <Path
                  d="M39.77 18.64v-.03c0-.07-.03-.14-.06-.2v-.03l-5.08-8.14a.482.482 0 00-.42-.23H15.62c-.18 0-.34.09-.43.24l-4.89 8.14v.03c-.03.06-.06.13-.06.21v20.88c0 .28.22.5.5.5h28.55c.28 0 .5-.22.5-.5V18.64zm-26.32 9.08c.42-.77 1.07-1.37 1.86-1.72.32.89.26 1.83-.18 2.64-.44.8-1.19 1.37-2.12 1.58-.13-.85.01-1.73.43-2.5zm4.24 5.78c-.9.18-1.84.03-2.65-.41a3.963 3.963 0 01-1.79-2c1.16-.28 2.12-1 2.68-2.03.56-1.03.64-2.22.24-3.35.9-.18 1.84-.03 2.65.41.82.45 1.45 1.15 1.79 2-1.16.28-2.12 1-2.68 2.03-.56 1.03-.64 2.22-.24 3.35zm1.85-10.87c0-.65.53-1.18 1.18-1.18h8.56c.65 0 1.18.53 1.18 1.18s-.53 1.18-1.18 1.18h-8.56c-.65 0-1.18-.53-1.18-1.18zm.88 8.87c-.42.77-1.07 1.37-1.86 1.72-.32-.89-.26-1.83.17-2.64.44-.8 1.19-1.36 2.12-1.58.13.85-.01 1.73-.43 2.5zm15.37.42c-.15.52-.5.95-.98 1.21-.43.23-.92.3-1.39.2-.54-.12-1.01-.45-1.3-.91l-5.63 3.05c.21.45.25.96.11 1.44-.15.52-.5.95-.98 1.21-.43.23-.92.3-1.39.2a2.02 2.02 0 01-1.36-1.02c-.27-.5-.32-1.08-.14-1.61-.54-.14-1-.5-1.27-1-.26-.48-.32-1.03-.16-1.55.15-.52.5-.95.98-1.21.43-.23.92-.3 1.39-.2.55.12 1.03.46 1.32.94l5.62-3.05c-.47-.97-.1-2.16.86-2.68.43-.23.92-.3 1.39-.2.58.12 1.08.5 1.36 1.02.27.5.32 1.08.14 1.61.54.14 1 .5 1.27 1 .26.48.32 1.03.16 1.55zM11.61 18.14l4.29-7.15h18.02l4.45 7.15H11.61z"
                  fill="#223656"
                />
              </Svg>
              <View style={{flex: 1}}>
                <Text style={[styles.activestatemain, styles.bogedittext]}>
                  My Toybox
                </Text>
                <View></View>
              </View>
            </View>
          </View>

          <View style={styles.toyboxmain}>
            <View style={{flex: 1}}>
              <Text style={[styles.activestatemain, styles.mb6]}>Love</Text>

              {data?.toybox_love?.length != 0 ? (
                <>
                  {data?.toybox_love?.map(item => {
                    return (
                      <Text style={[styles.activestatetext, styles.mb6]}>
                        {item}
                      </Text>
                    );
                  })}
                </>
              ) : (
                <Text style={[styles.activestatetext, styles.mb6]}>-</Text>
              )}
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.activestatemain, styles.mb6]}>No way</Text>
              {data?.toybox_noway?.length != 0 ? (
                <>
                  {data?.toybox_noway?.map(item => {
                    return (
                      <Text style={[styles.activestatetext, styles.mb6]}>
                        {item}
                      </Text>
                    );
                  })}
                </>
              ) : (
                <Text style={[styles.activestatetext, styles.mb6]}>-</Text>
              )}
            </View>
          </View>

          <View styles={styles.editinner}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditToys', {
                  PetName: PetName,
                  EditPetImg: EditPetImg,
                });
              }}>
              <View
                style={{
                  width: 35,
                  height: 35,
                  backgroundColor: '#CE5757',
                  alignItems: 'center',
                  borderRadius: 50,
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                }}>
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <Circle
                    cx={24}
                    cy={24}
                    r={24}
                    fill="#ce5757"
                    strokeWidth={0}
                  />
                  <Path
                    d="M38.75 17.37l-3.95-3.94a.907.907 0 00-.44-.24c-.05 0-.1-.01-.14-.01a.754.754 0 00-.61.25L18.24 28.8a.88.88 0 00-.24.48l-.55 3.88H9.84c-.47 0-.84.38-.84.84s.38.84.84.84h8.45l4.6-.66c.18-.02.34-.1.48-.23l15.37-15.37c.16-.16.25-.38.25-.6s-.09-.44-.25-.6zm-3.55 2.36L23.01 31.92l-2.75-2.76 12.18-12.19 2.76 2.76zm1.76-1.77l-.56.57-2.76-2.76.57-.57 2.75 2.76z"
                    fill="#fff"
                    strokeWidth={0}
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.homecardinner1}>
          <View>
            <View style={styles.editsameline}>
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
                  d="M37.17 21.08c-.04-.22-.12-.44-.24-.64-.02-.05-.05-.09-.07-.12-.8-1.23-2.98-2.23-6.12-2.82h-.1c-.03-.92-.31-1.59-.85-2-.84-.64-2.03-.41-2.56-.26-1.26-1.07-2.48-1.49-3.64-1.22-1.56.34-2.51 1.8-2.88 2.49-1.09-.2-1.94-.02-2.53.53-.21.19-.38.42-.51.71-2.68.63-4.44 1.57-5.08 2.69-.02.02-.03.04-.03.06-.13.24-.21.49-.23.72l-2.32 7.59v.07l.06.13c1.77 4.27 7.58 7.05 14.8 7.09h.24c7.21-.08 13.03-2.9 14.83-7.18l.06-.15v-.07l-2.82-7.59zm-19.84-1.81c-.64-.08-1.19.05-1.63.39-.96.72-1 2.11-1 2.39 0 .27.23.49.5.49a.5.5 0 00.49-.5c0-.05 0-1.13.6-1.58.32-.24.8-.27 1.42-.08l.61.18s.07 0 .09-.02a.08.08 0 00.03-.09l-.1-.63s-.11-.74.09-1.39c.04-.06.06-.13.06-.16.09-.21.2-.37.33-.49.41-.37 1.08-.44 2.02-.21l.33.08s.1-.01.12-.06l.13-.32c.09-.2.91-1.96 2.36-2.27.89-.2 1.9.2 2.98 1.18l.18.17s.07.03.1.02l.23-.09c.34-.14 1.35-.39 1.89.02.39.3.54.94.43 1.9l-.05.44s0 .06.03.08c.02.02.05.03.07.03h.45c.14 0 3.35.04 3.81 3.37.03.25.24.43.49.43h.07a.53.53 0 00.33-.19c.08-.1.12-.24.1-.37-.14-1.04-.52-1.91-1.12-2.6 1.13.45 1.92.97 2.24 1.47l.18.47v.08c0 .78-1.21 1.66-3.16 2.29-2.2.72-5.15 1.12-8.3 1.12-6.54 0-11.43-1.79-11.45-3.42l.14-.48c.45-.77 1.9-1.54 3.91-2.07l-.03.44zm16.03 5.36c1.63-.53 2.75-1.18 3.35-1.94l2.23 5.99c-.86 1.91-2.66 3.51-5.2 4.65-2.44 1.09-5.51 1.71-8.64 1.74h-.24c-3.13-.01-6.19-.61-8.63-1.69-2.54-1.12-4.33-2.72-5.18-4.63l1.82-5.98c.62.72 1.72 1.34 3.27 1.84 2.31.76 5.36 1.17 8.61 1.17s6.3-.42 8.61-1.17z"
                  fill="#223656"
                />
                <Path
                  className="cls-1"
                  d="M22.1 32.45c.78 0 1.44-.54 1.62-1.26h3.04a1.677 1.677 0 003.3-.42c0-.29-.08-.58-.23-.84.15-.26.23-.54.23-.84a1.677 1.677 0 00-3.3-.42h-3.04a1.677 1.677 0 00-3.3.42c0 .29.08.58.23.84-.15.26-.23.54-.23.84 0 .93.75 1.68 1.68 1.68z"
                  fill="#223656"
                />
              </Svg>
              <View style={{flex: 1}}>
                <Text style={[styles.activestatemain, styles.bogedittext]}>
                  My Food
                </Text>
                <View></View>
              </View>
            </View>
          </View>
          <View style={styles.toyboxmain}>
            <View style={{flex: 1}}>
              <Text style={[styles.activestatemain, styles.mb6]}>Yum</Text>

              {data?.yum?.length != 0 ? (
                <>
                  {data?.yum?.map(item => {
                    return (
                      <Text style={[styles.activestatetext, styles.mb6]}>
                        {item}
                      </Text>
                    );
                  })}
                </>
              ) : (
                <Text style={[styles.activestatetext, styles.mb6]}>-</Text>
              )}
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.activestatemain, styles.mb6]}>Yuck</Text>
              {data?.yuck?.length != 0 ? (
                <>
                  {data?.yuck?.map(item => {
                    return (
                      <Text style={[styles.activestatetext, styles.mb6]}>
                        {item}
                      </Text>
                    );
                  })}
                </>
              ) : (
                <Text style={[styles.activestatetext, styles.mb6]}>-</Text>
              )}
            </View>
          </View>

          <View styles={styles.editinner}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditFood', {
                  PetName: PetName,
                  EditPetImg: EditPetImg,
                });
              }}>
              <View
                style={{
                  width: 35,
                  height: 35,
                  backgroundColor: '#CE5757',
                  alignItems: 'center',
                  borderRadius: 50,
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                }}>
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <Circle
                    cx={24}
                    cy={24}
                    r={24}
                    fill="#ce5757"
                    strokeWidth={0}
                  />
                  <Path
                    d="M38.75 17.37l-3.95-3.94a.907.907 0 00-.44-.24c-.05 0-.1-.01-.14-.01a.754.754 0 00-.61.25L18.24 28.8a.88.88 0 00-.24.48l-.55 3.88H9.84c-.47 0-.84.38-.84.84s.38.84.84.84h8.45l4.6-.66c.18-.02.34-.1.48-.23l15.37-15.37c.16-.16.25-.38.25-.6s-.09-.44-.25-.6zm-3.55 2.36L23.01 31.92l-2.75-2.76 12.18-12.19 2.76 2.76zm1.76-1.77l-.56.57-2.76-2.76.57-.57 2.75 2.76z"
                    fill="#fff"
                    strokeWidth={0}
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.homecardinner1}>
          <View>
            <View style={styles.editsameline}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                id="icons-RZ_Weiss"
                viewBox="0 0 50 50"
                width={50}
                height={50}>
                <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                <Path
                  d="M32.63 13.25c.58 0 1.14.17 1.63.49l4.05 2.67A5.956 5.956 0 0141 21.38c0 1.75-.77 3.41-2.12 4.55L26.9 36.05a2.958 2.958 0 01-3.82 0L11.1 25.93a5.956 5.956 0 01-2.11-4.55c0-2 1-3.86 2.69-4.97l4.05-2.67c.48-.32 1.05-.49 1.63-.49.5 0 .99.13 1.42.36l3.83 2.1a4.958 4.958 0 004.76 0l3.83-2.1c.43-.24.93-.36 1.42-.36m0-1c-.65 0-1.31.16-1.9.49l-3.83 2.1c-.59.32-1.25.49-1.9.49s-1.31-.16-1.9-.49l-3.83-2.1c-.59-.33-1.25-.49-1.9-.49-.76 0-1.52.22-2.18.65l-4.05 2.67a6.955 6.955 0 00-3.14 5.81c0 2.04.9 3.98 2.47 5.31l11.98 10.12c.74.62 1.64.93 2.55.93s1.82-.31 2.55-.93l11.98-10.12a6.943 6.943 0 002.47-5.31c0-2.34-1.18-4.52-3.14-5.81L34.8 12.9c-.66-.43-1.42-.65-2.18-.65z"
                  fill="#223656"
                />
              </Svg>
              <View style={{flex: 1}}>
                <Text style={[styles.activestatemain, styles.bogedittext]}>
                  Likes/Dislikes
                </Text>
                <View></View>
              </View>
            </View>
          </View>
          <View style={styles.toyboxmain}>
            <View style={{flex: 1}}>
              <Text style={[styles.activestatemain, styles.mb6]}>Love</Text>
              {data?.love_it?.length != 0 ? (
                <>
                  {data?.love_it?.map(item => {
                    return (
                      <Text style={[styles.activestatetext, styles.mb6]}>
                        {item}
                      </Text>
                    );
                  })}
                </>
              ) : (
                <Text style={[styles.activestatetext, styles.mb6]}>-</Text>
              )}
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.activestatemain, styles.mb6]}>No way</Text>
              {data?.no_way?.length != 0 ? (
                <>
                  {data?.no_way?.map(item => {
                    return (
                      <Text style={[styles.activestatetext, styles.mb6]}>
                        {item}
                      </Text>
                    );
                  })}
                </>
              ) : (
                <Text style={[styles.activestatetext, styles.mb6]}>-</Text>
              )}
            </View>
          </View>

          <View styles={styles.editinner}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditLikesDislikes', {
                  PetName: PetName,
                  EditPetImg: EditPetImg,
                });
              }}>
              <View
                style={{
                  width: 35,
                  height: 35,
                  backgroundColor: '#CE5757',
                  alignItems: 'center',
                  borderRadius: 50,
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                }}>
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <Circle
                    cx={24}
                    cy={24}
                    r={24}
                    fill="#ce5757"
                    strokeWidth={0}
                  />
                  <Path
                    d="M38.75 17.37l-3.95-3.94a.907.907 0 00-.44-.24c-.05 0-.1-.01-.14-.01a.754.754 0 00-.61.25L18.24 28.8a.88.88 0 00-.24.48l-.55 3.88H9.84c-.47 0-.84.38-.84.84s.38.84.84.84h8.45l4.6-.66c.18-.02.34-.1.48-.23l15.37-15.37c.16-.16.25-.38.25-.6s-.09-.44-.25-.6zm-3.55 2.36L23.01 31.92l-2.75-2.76 12.18-12.19 2.76 2.76zm1.76-1.77l-.56.57-2.76-2.76.57-.57 2.75 2.76z"
                    fill="#fff"
                    strokeWidth={0}
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ViewBasicDetails;
