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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DiscoverActivitiesAPI, GetDashboardApi} from './API/ApiCalls';
import {useIsFocused} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from './CommonScreens/ProfileScreen';
import {DiscoverActivitiesHeaderLeft} from '../navigation/CustomBackNavigation';

const DiscoverActivities = props => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => (
          <DiscoverActivitiesHeaderLeft navigation={navigation} />
        ),
      });
      GetDiscover();
    }
  }, [isFocused]);

  const GetDiscover = async () => {
    const Response = await DiscoverActivitiesAPI();
    // console.log(Response.data, 'pteeettt');
    setData(Response.data);
  };
  return (
    <>
      <View style={styles.mainpage}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <TopHeader />
        {/* <ProfileScreen />
        <Text style={styles.familytext}>Family Member</Text> */}
        <View style={styles.space20}></View>

        <View>
          <Text style={styles.myfamilytext}>Discover Activities</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.marginhz20}>
            {data.map((item, key) => {
              return (
                <View style={styles.homecardinner1}>
                  <View style={styles.logmain}>
                    <View>
                      <Text style={styles.homecardtext5}>
                        {item.activity_type_name}
                      </Text>
                    </View>

                    <Image
                      // source={require('../assets/profile.png')}
                      style={[styles.activityImgDis]}
                      source={{uri: item.activity_image_path}}></Image>
                  </View>
                  <View style={styles.aligncenter}>
                    <Text style={styles.homecardtext6}>{item.description}</Text>
                    {/* <Image source={{ uri: item.activity_discoverblock_image_path }} style={styles.discimg}></Image> */}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.space30}></View>
      </View>
    </>
  );
};

export default DiscoverActivities;
