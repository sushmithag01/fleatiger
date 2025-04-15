import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import styles from '../../Common.css';
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
import Entypo from 'react-native-vector-icons/Entypo';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const SubscriptionPlanMessage = props => {
  const {setCongratsMsg, congratsMsg} = props;
  const navigation = useNavigation();

  const handleContinueBtn = async () => {
    setCongratsMsg(false);
    navigation.navigate('Home');
  };

  const handleSltNewBtn = async () => {
    setCongratsMsg(false);
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.logopopup}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={79}
                height={79}
                viewBox="0 0 79 79"
                fill="none">
                <G clipPath="url(#clip0_120_3)">
                  <Path
                    d="M39.5 79C61.315 79 79 61.315 79 39.5S61.315 0 39.5 0 0 17.685 0 39.5 17.685 79 39.5 79z"
                    fill="#92BCBF"
                  />
                  <G clipPath="url(#clip1_120_3)">
                    <Path
                      d="M72.662 32.29l-19.45-14.122a2.359 2.359 0 00-2.487-.136c-.107.058-.21.122-.309.193l-9.754 6.065a2.262 2.262 0 01-2.337 0l-9.721-6.052a2.576 2.576 0 00-.372-.227 1.611 1.611 0 00-.436-.17 2.305 2.305 0 00-2.01.331L6.339 32.29a2.43 2.43 0 00-.621 3.138l7.98 14.732a2.401 2.401 0 002.134 1.39 2.405 2.405 0 002.186-1.308l1.192-2.552 10.21 9.436a14.757 14.757 0 0020.152 0l10.218-9.443 1.195 2.558a2.4 2.4 0 003.453.92c.378-.246.678-.594.868-1.002l7.974-14.733a2.427 2.427 0 00-.616-3.139l-.001.003zm-24.145 23.7a13.293 13.293 0 01-8.248 3.536v-4.805c.113-.058.22-.128.317-.21l5.096-4.304a2.952 2.952 0 00-.283-4.725l-1.725-1.137a1.693 1.693 0 00-1.736-.07l-1.628.89a1.693 1.693 0 01-1.62 0l-1.627-.89a1.684 1.684 0 00-1.737.07l-1.724 1.137a2.951 2.951 0 00-.283 4.724l5.096 4.304c.094.079.197.147.306.203v4.812a13.293 13.293 0 01-8.249-3.537l-10.575-9.772L31.324 21.76l6.182 3.844.01.007.01.006a3.815 3.815 0 003.931 0l.01-.006.011-.007 6.194-3.85 11.421 24.458-10.578 9.777h.003z"
                      fill="#223656"
                    />
                  </G>
                </G>
                <Defs>
                  <ClipPath id="clip0_120_3">
                    <Path fill="#fff" d="M0 0H79V79H0z" />
                  </ClipPath>
                  <ClipPath id="clip1_120_3">
                    <Path
                      fill="#fff"
                      transform="translate(5.4 17.744)"
                      d="M0 0H68.1992V43.3574H0z"
                    />
                  </ClipPath>
                </Defs>
              </Svg>
            </View>
            {/* <Pressable
                            style={[styles.buttonClose]}
                            onPress={() => setCongratsMsg(!congratsMsg)}>
                            <Text style={styles.textStyle}><Entypo name="circle-with-cross" size={30} color="#CE5757"></Entypo></Text>
                        </Pressable> */}
            <Text style={styles.modalText}>
              Are you sure you want to continue with the free subscription?
            </Text>
            <Text style={styles.modalinnerText}>
              you can upgrade at any time to gain full access of Fleatiger's
              features
            </Text>
            <View
              style={{
                flexDirection: 'row',
                padding: 20,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Pressable
                onPress={() => handleContinueBtn()}
                style={styles.buttonconfirm2}>
                <Text style={styles.btnText2}>YES,CONTINUE</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSltNewBtn()}
                style={styles.buttonconfirm2}>
                <Text style={styles.btnText2}>SELECT NEW</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SubscriptionPlanMessage;
