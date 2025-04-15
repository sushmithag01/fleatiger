import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from "../Common.css"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useIsFocused } from '@react-navigation/native';
import { EditViewFoodApi, EditViewToysApi, ToySliderApi, UpdateToysApi, UpdateFoodApi, EditViewLikesDislikesApi, UpdateLikesDislikesApi } from './API/ApiCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorText from './ErrorText/ErrorText';
import Toast from 'react-native-root-toast';
import EditFoodList from './EditfoodList';
import EditLikesDisLikesList from './EditLikesDisLikesList';
import { EditLikesDislikesHeaderLeft } from '../navigation/CustomBackNavigation';

const EditLikesDislikes = ({ navigation, route }) => {
  const { PetName, EditPetImg } = route.params;
  const [data, setData] = useState([])

  const isFocused = useIsFocused()
  // show-name
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <EditLikesDislikesHeaderLeft navigation={navigation} />,
      
  });
    if (isFocused) {
      getSliderData()
    }
  }, [isFocused])

  const getSliderData = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      id: parseInt(PetId),
    };
    // console.log("payload", payload)
    const Response = await EditViewLikesDislikesApi(payload)
    // console.log(Response?.data[0], "list")
    setData(Response?.data[0]?.pet_like_dislike_list)
  }


  // save selectedPersonality
  const handleSave = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');
    const payload = {
      user_id: parseInt(UserID),
      id: parseInt(PetId),
      pet_like_dislike_list: data
    };

    // console.log(payload, "updatepetlikesdislikes")

    const Response = await UpdateLikesDislikesApi(payload)
    // console.log(Response, "res");
    if (Response.success == true) {
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000'
      });
      navigation.navigate('EditProfile')
    } else {
      Toast.show(Response.message, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000'
      });
    }

  };

  // console.log("data", data)
  return (
    <>
      <ScrollView style={[styles.mainpage, styles.padhoz15]} showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
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
            source={{ uri: EditPetImg }}
          ></Image>
        </View>

        <View style={styles.editnamemain}>
          <Text style={styles.editnametext}>{PetName == null ? 'Lucky' : PetName}</Text>
        </View>
        <View style={styles.centerHeading}>
          <Text style={[styles.createacc, styles.createacc1]}>My Likes</Text>
          {/* <Text style={styles.forgotcontent2}>What does {PetName} like to eat?</Text> */}
        </View>
        <View style={styles.space30}></View>

        {data?.length == 0 ? (
          <>
            <View style={{ flex: 1 }}>
              <Text style={styles.activestatetext}>{ErrorText.NoData}</Text>
            </View>
          </>
        ) : (

          <>
            {data?.map((item, key) => {
              return (
                <EditLikesDisLikesList
                  item={item}
                  data={data}
                  setData={setData}
                />
              );
            })}
          </>
        )}

        <View style={styles.space50}></View>
        <View style={styles.space20}></View>

        <View>
          <TouchableOpacity style={styles.bluebtnsmallSave}
            onPress={() => handleSave()}
          >
            <Text style={styles.bluebtnsmalltextSave}>Save</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </>
  )
}

export default EditLikesDislikes