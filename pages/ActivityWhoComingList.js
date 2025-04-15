import React,{useEffect,useState} from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import styles from "../Common.css"
import { LikeDislikeApi, RemovefriendFromListApi, getFriendListApi } from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, G, Defs, ClipPath , Circle, Mask, Pattern, Use, xlinkHref, style} from "react-native-svg";
import { useNavigation } from '@react-navigation/native';

const ActivityWhoComingList = (props) => {
    const {item,handleComing,isAdded,selectedComing,handleComingRemove,   selectedComingProfile,setSelectedComingProfile} = props;
    const navigation = useNavigation();

console.log(selectedComingProfile,"selectedComingProfile",item)
  return (
    <TouchableOpacity 
    //  onPress={()=>handleViewProfile()}
    >
    <View style={styles.logmain}>
    <View style={styles.logmain2}>
   
    <Image source={item.pet_image_path == 'https://devapi.fleatiger.com/' ? require('../assets/pic9.png') : {uri:item.pet_image_path}} style={styles.newsimg1}></Image>
   
     <View style={{ width: 125 }}>
         <Text style={styles.homecardtext1}>{item.pet_name}</Text>
         <Text style={styles.logdate}>{item.location}</Text>
     </View>
     </View>

{/* pop-up */}
{/* [{"friendId": 134, "petImg": "https://devapi.fleatiger.com/pets/pet_images/pet_2023-05-24-09-18-03_40.jpg", "petname": "Leo"}, {"friendId": 152, "petImg": "https://devapi.fleatiger.com/pets/pet_images/pet_2023-05-25-04-29-01_40.jpg", "petname": "Burno"}, {"friendId": 144, "petImg": "https://devapi.fleatiger.com/pets/pet_images/pet_2023-05-24-10-40-53_40.jpg", "petname": "Lucy"}, {"friendId": 161, "petImg": "https://devapi.fleatiger.com/pets/pet_images/pet_2023-05-25-06-37-51_40.jpg", "petname": "Raly"}]  */}


     <View style={styles.likesec1}>      
        {selectedComingProfile.includes(item) ? 
        <TouchableOpacity 
        onPress={e => handleComingRemove(item)}
        >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              id="icons-RZ_Weiss"
              viewBox="0 0 50 50"
              width={45}
              height={45}>
              <Circle cx={25} cy={25} r={24} fill="#CE5757" />
              <Path
                d="M38.5 26.5h-27c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h26.99c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
                fill="#fff"
              />
            </Svg>
            </TouchableOpacity> 
                :
                <TouchableOpacity 
                onPress={e => handleComing(item)}
                >
                     <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="icons-RZ_Weiss"
                      viewBox="0 0 50 50"
                      width={45}
                      height={45}>
                      <Circle cx={25} cy={25} r={24} fill="#CE5757" />
                      <Path
                        d="M38.5 23.5H26.51v-12c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v11.99H11.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h11.99v11.99c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V26.49h11.99c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"
                        fill="#fff"
                      />
                    </Svg>
                     </TouchableOpacity> 
       
            }
           
     </View>
    </View>
    </TouchableOpacity>
  )
}

export default ActivityWhoComingList;