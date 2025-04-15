import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "../Common.css";
import Svg, {
  Path, Circle,
} from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import MotivationalMessage from './Popups/MotivationalMessage';

const MyProfileFamily = (props) => {
  const navigation = useNavigation();
  const { FamilyViewList, addFamilyMemberCount } = props;
  const MessagePop = "Upgrade your plan to use this feature";
  const [ShowPopUp, setShowPopUp] = useState(false);

  const handleAddMember = () => {
    if (addFamilyMemberCount > 0) {
      navigation.navigate('AddNewMember',{screen:'SliderAdd1'})
    } else {
      setShowPopUp(true)
    }

  }
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => handleAddMember()}>
          <View style={styles.addprofilemain1}>
            <View style={styles.addprofileinner1}>
              <View style={[styles.logosection]}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="icons-RZ_Weiss"
                  viewBox="0 0 50 50"
                  width={70}
                  height={70}
                >
                  <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                  <Path
                    d="M38.5 23.5H26.51v-12c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v11.99H11.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h11.99v11.99c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V26.49h11.99c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"
                    fill="#223656"
                  />
                </Svg>
              </View>
            </View>
            <View style={styles.addprofileinner1}>
              <Text style={styles.addprofiletext1}>Add Member</Text>
            </View>
          </View>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {FamilyViewList.map((item, key) => {
            return (
              //  <TouchableOpacity>
              <View style={styles.addprofilemain1} key={key}>
                <View style={styles.addprofileinner1}>
                  <View style={[styles.logosection]}>
                    <Image
                      source={{ uri: item.pet_image }}
                      style={[styles.ProfileLogo, styles.addupload]}></Image>
                  </View>
                </View>
                <View style={styles.addprofileinner1}>
                  <Text style={styles.addprofiletext1}>{item.pet_name}</Text>
                </View>
              </View>
              // </TouchableOpacity>

            );
          })}


        </ScrollView>
        {ShowPopUp == true ? (
          <MotivationalMessage
            MessagePop={MessagePop}
            congratsMsg={ShowPopUp}
            setCongratsMsg={setShowPopUp} 
            status="activity"
            />
        ) : ''}
      </ScrollView>
      <View style={styles.space20}></View>
      <View>
        <TouchableOpacity style={styles.bluebtnsmall} onPress={() => navigation.navigate('Compare')}>
          <Text style={styles.bluebtnsmalltext}>COMPARE FAMILY METRICS</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.space20}></View>

    </>
  );
};

export default MyProfileFamily;
