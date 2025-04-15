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
  Dimensions,
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
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {EditViewPersonalityApi, UpdatePersonalityApi} from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import {EditPersonalityHeaderLeft} from '../navigation/CustomBackNavigation';

const EditPersonality = ({navigation, route}) => {
  const {PetName, EditPetImg} = route.params;
  const width = Dimensions.get('window').width;

  const [data, setData] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [clickedPersonality, setClickedPersonality] = useState('');
  const [autoPlay, setAutoplay] = useState(true);
  const isFocused = useIsFocused();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <EditPersonalityHeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      GetPersonalityData();
    }
  }, [isFocused]);

  const GetPersonalityData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      id: PetId,
    };
    const Response = await EditViewPersonalityApi(payload);
    console.log(
      'Response',
      Response?.data[0]?.personality_list[0].personality_id,
    );
    setData(Response?.data[0]?.personality_list);
    setSelectedPersonality(
      Response?.data[0]?.personality_list[0].personality_id,
    );
  };

  // save selectedPersonality
  const handleSave = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      id: PetId,
      personality: parseInt(selectedPersonality),
    };
    const Response = await UpdatePersonalityApi(payload);
    console.log(Response, 'res');
    if (Response.success === true) {
      Toast.show(Response.Message, {
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
      Toast.show(Response.Message, {
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

  const handlePersonality = data => {
    setSelectedPersonality(data);
    setClickedPersonality(data);
    setAutoplay(false);
  };
  // [{"personality_id": 2, "personality_name": "Energetic"}, {"personality_id": 1, "personality_name": "Playfull"}, {"personality_id": 3, "personality_name": "Curious"}, {"personality_id": 4, "personality_name": "Social"}, {"personality_id": 5, "personality_name": "Aggressive"}]

  return (
    <>
      <SafeAreaView>
        <ScrollView
          style={styles.fleamain}
          showsVerticalScrollIndicator={false}>
          {/* <View style={styles.navheader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
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

          <Text style={styles.familytext}>Family Member</Text>
          <View style={styles.space20}></View>
          {/* <View style={styles.space20}></View> */}
          <View style={styles.centerHeading}>
            <Text style={[styles.createacc, styles.createacc1]}>
              My Personality
            </Text>
            {/* <Text style={styles.forgotcontent2}>What is {PetName} Like?</Text> */}
          </View>
          <View style={styles.space20}></View>

          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Carousel
              loop
              width={width / 1.5}
              height={width / 1.5}
              autoPlay={autoPlay}
              data={data}
              scrollAnimationDuration={1000}
              // onSnapToItem={(index) => setSelectedPersonality(data[index].personality_id)}
              renderItem={({item, index}) => (
                <View
                  style={
                    selectedPersonality === data[index].personality_id
                      ? styles.selectedPersonalitystyle
                      : styles.personalitystyle
                  }>
                  <TouchableOpacity
                    onPress={() =>
                      handlePersonality(data[index].personality_id)
                    }>
                    <View style={{textAlign: 'center'}}>
                      <Image
                        source={{uri: item.pet_personality_image}}
                        style={[styles.personalityImg]}></Image>
                      <View style={styles.space20}></View>
                      <View style={styles.space10}></View>

                      <Text style={styles.personalityText}>
                        {item.personality_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View style={styles.space50}></View>
          <View style={styles.space20}></View>

          <View>
            <TouchableOpacity
              style={styles.bluebtnsmallSave}
              onPress={() => handleSave()}>
              <Text style={styles.bluebtnsmalltextSave}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditPersonality;
