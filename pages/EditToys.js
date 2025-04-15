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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import {EditViewToysApi, ToySliderApi, UpdateToysApi} from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorText from './ErrorText/ErrorText';
import EditToysList from './EditToysList';
import Toast from 'react-native-root-toast';
import {EditToysHeaderLeft} from '../navigation/CustomBackNavigation';

const EditToys = ({navigation, route}) => {
  const {PetName, EditPetImg} = route.params;
  const [data, setData] = useState([]);

  const isFocused = useIsFocused();
  // show-name
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <EditToysHeaderLeft navigation={navigation} />,
    });
    if (isFocused) {
      getSliderData();
    }
  }, [isFocused]);

  const getSliderData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: UserID,
      id: PetId,
    };
    const Response = await EditViewToysApi(payload);
    console.log(Response, 'list');
    setData(Response?.data[0]?.toylist);
  };

  // save selectedPersonality
  const handleSave = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      id: parseInt(PetId),
      toybox_list: data,
    };

    console.log(payload, 'edittoys');

    const Response = await UpdateToysApi(payload);
    console.log(Response, 'res');
    if (Response.success == true) {
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
  };

  console.log('data', data);
  return (
    <>
      <ScrollView
        style={[styles.mainpage, styles.padhoz15]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        {/* <View style={styles.navheader}>
     <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#B85A57"></Ionicons>
      </TouchableOpacity>
    </View> */}

        {/* ProfileImage */}
        <View style={[styles.logosection]}>
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

        <View style={styles.centerHeading}>
          <Text style={[styles.createacc, styles.createacc1]}>My Toys</Text>
          {/* <Text style={styles.forgotcontent2}>What does {PetName} like to play with?</Text> */}
        </View>
        <View style={styles.space30}></View>

        {data?.length == 0 ? (
          <>
            <View style={{flex: 1}}>
              <Text style={styles.activestatetext}>{ErrorText.NoData}</Text>
            </View>
          </>
        ) : (
          <>
            {data?.map((item, key) => {
              return (
                <View key={key}>
                  <EditToysList item={item} data={data} setData={setData} />
                </View>
              );
            })}
          </>
        )}

        <View style={styles.space20}></View>
        <View style={styles.space20}></View>

        <View>
          <TouchableOpacity
            style={styles.bluebtnsmallSave}
            onPress={() => handleSave()}>
            <Text style={styles.bluebtnsmalltextSave}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default EditToys;
