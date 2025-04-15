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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown} from 'react-native-element-dropdown';
import {
  CompareFamilyApi,
  GetDashboardApi,
  getSiblingListApi,
} from './API/ApiCalls';
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
import moment from 'moment-timezone';

const CompareFamilyMetrics = props => {
  const currentTimeZone = moment.tz.guess();
  // const{getPetId} = props;
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [OtherPetdata, setOtherPetData] = useState([]);

  const [ActivePetId, setActivePetId] = useState('');
  const [SiblingName, setSiblingName] = useState('');
  const [SiblingId, setSiblingId] = useState('');

  //  const[activePet_activeTime,setactivePet_activeTime]
  const [health, setHealth] = useState([]);
  const [activeTime, setActiveTime] = useState([]);
  const [activity, setActivity] = useState([]);
  const [energy, setEnergy] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      GetDashboard();
      GetSiblingList();
    }
  }, [isFocused]);

  const GetDashboard = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const payload = {
      user_id: UserID,
      id: PetId,
      timezone : currentTimeZone 
    };
    const Response = await GetDashboardApi(payload);
    console.log(Response.data[0].id, 'pteeettt');
    setData(Response.data[0]);
  };
  const HeightUnit = [{label: data?.pet_name, value: '1'}];

  const GetSiblingList = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const payload = {
      user_id: parseInt(UserID),
      pet_id: parseInt(PetId),
    };
    console.log(payload, 'payload');
    const Response = await getSiblingListApi(payload);
    console.log(Response?.data[0].siblings_id, 'sib');
    setOtherPetData(Response?.data);
    GetCardComapreDetails(Response?.data[0].siblings_id);
  };

  const GetCardComapreDetails = async sib_id => {
    const UserID = await AsyncStorage.getItem('userId');
    const PetId = await AsyncStorage.getItem('PetId');

    const payload = {
      user_pet_id: parseInt(PetId),
      sibling_pet_id: parseInt(sib_id),
      timezone : currentTimeZone
    };
    console.log(payload, 'compare paload');
    const Response = await CompareFamilyApi(payload);
    console.log(Response?.data, 'compare');
    setHealth(Response?.data?.health_score_box);
    setActiveTime(Response?.data?.active_time_box);
    setActivity(Response?.data?.pet_activity_box);
    setEnergy(Response?.data?.energy);
  };

  return (
    <>
      <ScrollView style={styles.mainpage} showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <TopHeader />
        <View style={styles.marginhz15}>
          <TouchableOpacity>
            <Profile
              petImage={data?.pet_image_path}
              petName={data?.pet_name}
              user_name={data?.user_name == '' ? '' : data?.user_name}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.marginhz15}>
          <View style={styles.unitmain1}>
            <View style={styles.unitinner5}>
              <Text style={styles.addmanuallytext}>My pet</Text>

              <View style={styles.inputunitContainer3}>
                <Dropdown
                  search={true}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyleunit}
                  selectedTextStyle={styles.selectedTextStyleunit}
                  data={HeightUnit}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Pet Name"
                  value={HeightUnit[0]}
                  onChange={item => {
                    setActivePetId(item.siblings_id);
                  }}
                />
              </View>
            </View>
            <View style={styles.unitinner6}>
              <Text style={styles.addmanuallytext}>Select pet to compare</Text>

              {OtherPetdata?.length == 0 ? (
                <View style={styles.inputContainerDrop}>
                  <Text>No data</Text>
                </View>
              ) : (
                <View style={styles.inputunitContainer3}>
                  <Dropdown
                    search={true}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyleunit}
                    selectedTextStyle={styles.selectedTextStyleunit}
                    data={OtherPetdata}
                    maxHeight={300}
                    labelField="pet_name"
                    valueField="siblings_id"
                    placeholder="Pet Name"
                    value={OtherPetdata[0]}
                    onChange={item => {
                      setSiblingId(item.siblings_id);
                      setSiblingName(item.pet_name);
                      GetCardComapreDetails(item.siblings_id);
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.space20}></View>
        <View style={styles.space20}></View>

        <View style={styles.marginhz15}>
          <View>
            <Text style={[styles.homecardtext1, styles.padhoz15]}>
              Health Score
            </Text>
          </View>
          <View style={styles.homecardinner1}>
            <View style={styles.dflex}>
              <View style={styles.flex1}>
                <View>
                  <Image
                    source={{uri: health?.user_pet_image_path}}
                    style={[styles.ProfileLogo, styles.addupload]}></Image>
                  <Text style={styles.comparetext}>
                    {health?.user_pet_name}
                  </Text>
                </View>
                <Text style={styles.homecardvalue}>
                  {health?.user_pet_healthscore}
                </Text>
              </View>
              <View style={styles.flex1}>
                <View>
                  <Image
                    source={{uri: health?.sibling_pet_image_path}}
                    style={[styles.ProfileLogo, styles.addupload]}></Image>
                  <Text style={styles.comparetext}>
                    {health?.sibling_pet_name}
                  </Text>
                </View>
                <Text style={styles.homecardvalue}>
                  {health?.sibling_pet_healthscore}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.space20}></View>
        <View style={styles.marginhz15}>
          <View>
            <Text style={[styles.homecardtext1, styles.padhoz15]}>
              Active Time
            </Text>
          </View>
          <View style={styles.homecardinner1}>
            <View style={styles.dflex}>
              <View style={styles.flex1}>
                <View>
                  <Image
                    source={{uri: activeTime?.user_pet_image_path}}
                    style={[styles.ProfileLogo, styles.addupload]}></Image>

                  <Text style={styles.comparetext}>
                    {activeTime?.user_pet_name}
                  </Text>
                </View>
                <Text style={styles.homecardvalue1}>
                  {activeTime?.user_pet_active_time}
                  {'\n'}mins
                </Text>
              </View>

              <View style={styles.flex1}>
                <View>
                  <Image
                    source={{uri: activeTime?.sibling_pet_image_path}}
                    style={[styles.ProfileLogo, styles.addupload]}></Image>
                  <Text style={styles.comparetext}>
                    {activeTime?.sibling_pet_name}
                  </Text>
                </View>
                <Text style={styles.homecardvalue1}>
                  {activeTime?.sibling_pet_active_time}
                  {'\n'}mins
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.space20}></View>
        <View style={styles.marginhz15}>
          <View>
            <Text style={[styles.homecardtext1, styles.padhoz15]}>
              Activities
            </Text>
          </View>
          <View style={styles.homecardinner1}>
            <View style={styles.dflex}>
              <View style={styles.flex1}>
                <View>
                  <Image
                    source={{uri: activity?.user_pet_image_path}}
                    style={[styles.ProfileLogo, styles.addupload]}></Image>

                  <Text style={styles.comparetext}>
                    {activity?.user_pet_name}
                  </Text>
                </View>

                {/* activitiesCount== 0 */}
                {activity?.user_pet_activity == '0' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {/* activitiesCount== 1 */}
                {activity?.user_pet_activity == '1' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {/* activity?.user_pet_activity== 2 */}
                {activity?.user_pet_activity == '2' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {/* activity?.user_pet_activity== 3 */}
                {activity?.user_pet_activity == '3' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {/* activity?.user_pet_activity== 4 */}
                {activity?.user_pet_activity == '4' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.flex1}>
                <View>
                  <Image
                    source={{uri: activity?.sibling_pet_image_path}}
                    style={[styles.ProfileLogo, styles.addupload]}></Image>
                  <Text style={styles.comparetext}>
                    {activity?.sibling_pet_name}
                  </Text>
                </View>

                {/* activitiesCount== 0 */}
                {activity?.sibling_pet_activity == '0' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {/* activitiesCount== 1 */}
                {activity?.sibling_pet_activity == '1' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {/* activity?.sibling_pet_activity== 2 */}
                {activity?.sibling_pet_activity == '2' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityunfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {/* activity?.sibling_pet_activity== 3 */}
                {activity?.sibling_pet_activity == '3' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityunfill}></Text>
                    </View>
                  </View>
                )}
                {/* activity?.sibling_pet_activity== 4 */}
                {activity?.sibling_pet_activity == '4' && (
                  <View>
                    <View style={[styles.activitymain, styles.actmain]}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                    <View style={styles.activitymain}>
                      <Text style={styles.activityfill}></Text>
                      <Text style={styles.activityfill}></Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.space20}></View>
        <View style={styles.marginhz15}>
          <View>
            <Text style={[styles.homecardtext1, styles.padhoz15]}>Energy</Text>
          </View>
          <View style={styles.homecardinner1}>
            <View style={styles.dflex}>
              <View style={styles.flex1}>
                <View>
                  <Image
                    source={{uri: energy?.user_pet_image_path}}
                    style={[styles.ProfileLogo, styles.addupload]}></Image>
                  <Text style={styles.comparetext}>
                    {energy?.user_pet_name}
                  </Text>
                </View>
                <View style={styles.energy}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 116 57"
                    width={116}
                    height={57}>
                    <Path
                      id="bones-pet-svgrepo-com"
                      d="M102.9 36.8q0-1-.1-2-.2-.9-.5-1.8-.3-1-.7-1.8-.4-.9-.9-1.7.5-.8.9-1.7.4-.8.6-1.8.3-.9.4-1.8.1-1 .1-1.9c0-1.8-.4-3.5-1.1-5.1-.7-1.6-1.7-3.1-2.9-4.3-1.3-1.3-2.7-2.3-4.4-3-1.6-.7-3.3-1-5.1-1.1-1.5 0-3 .2-4.4.7-1.4.5-2.8 1.3-4 2.2-1.1 1-2.1 2.2-2.9 3.5-.7 1.3-1.2 2.7-1.5 4.2l-37.6-.6c-.3-1.5-.9-3-1.7-4.3-.8-1.3-1.8-2.5-3-3.5-1.1-1-2.5-1.8-3.9-2.4-1.5-.5-3-.8-4.6-.8-1.7-.1-3.4.2-5 .9-1.6.6-3.1 1.6-4.3 2.8-1.2 1.2-2.1 2.6-2.8 4.2-.6 1.6-.9 3.4-.9 5.1q0 .9.2 1.9.1 1 .4 1.9.3.9.7 1.8.5.9 1 1.7-.5.8-.9 1.6-.4.9-.7 1.8-.2.9-.3 1.9-.2.9-.1 1.9c0 1.7.4 3.5 1.1 5.1.7 1.6 1.6 3.1 2.9 4.3 1.2 1.2 2.7 2.2 4.3 2.9 1.6.7 3.4 1.1 5.1 1.1 1.5.1 3-.2 4.5-.7 1.4-.5 2.7-1.2 3.9-2.2 1.2-.9 2.2-2.1 2.9-3.4.8-1.3 1.3-2.8 1.5-4.3l37.6.7c.3 1.5.9 2.9 1.7 4.3.8 1.3 1.8 2.5 3 3.5s2.5 1.8 4 2.3c1.4.5 3 .8 4.5.9 1.7 0 3.5-.3 5.1-.9 1.6-.7 3-1.6 4.2-2.8 1.2-1.2 2.2-2.7 2.8-4.3.7-1.6 1-3.3.9-5z"
                      fill="#9bbbbe"
                    />
                  </Svg>
                </View>
                <Text style={styles.caltext}>
                  {energy?.user_pet_energy_levevl} Cals
                </Text>
              </View>
              <View style={styles.flex1}>
                <View>
                  <Image
                    source={{uri: energy?.sibling_pet_image_path}}
                    style={[styles.ProfileLogo, styles.addupload]}></Image>
                  <Text style={styles.comparetext}>
                    {energy?.sibling_pet_name}
                  </Text>
                </View>
                <View style={styles.energy}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 116 57"
                    width={116}
                    height={57}>
                    <Path
                      id="bones-pet-svgrepo-com"
                      d="M102.9 36.8q0-1-.1-2-.2-.9-.5-1.8-.3-1-.7-1.8-.4-.9-.9-1.7.5-.8.9-1.7.4-.8.6-1.8.3-.9.4-1.8.1-1 .1-1.9c0-1.8-.4-3.5-1.1-5.1-.7-1.6-1.7-3.1-2.9-4.3-1.3-1.3-2.7-2.3-4.4-3-1.6-.7-3.3-1-5.1-1.1-1.5 0-3 .2-4.4.7-1.4.5-2.8 1.3-4 2.2-1.1 1-2.1 2.2-2.9 3.5-.7 1.3-1.2 2.7-1.5 4.2l-37.6-.6c-.3-1.5-.9-3-1.7-4.3-.8-1.3-1.8-2.5-3-3.5-1.1-1-2.5-1.8-3.9-2.4-1.5-.5-3-.8-4.6-.8-1.7-.1-3.4.2-5 .9-1.6.6-3.1 1.6-4.3 2.8-1.2 1.2-2.1 2.6-2.8 4.2-.6 1.6-.9 3.4-.9 5.1q0 .9.2 1.9.1 1 .4 1.9.3.9.7 1.8.5.9 1 1.7-.5.8-.9 1.6-.4.9-.7 1.8-.2.9-.3 1.9-.2.9-.1 1.9c0 1.7.4 3.5 1.1 5.1.7 1.6 1.6 3.1 2.9 4.3 1.2 1.2 2.7 2.2 4.3 2.9 1.6.7 3.4 1.1 5.1 1.1 1.5.1 3-.2 4.5-.7 1.4-.5 2.7-1.2 3.9-2.2 1.2-.9 2.2-2.1 2.9-3.4.8-1.3 1.3-2.8 1.5-4.3l37.6.7c.3 1.5.9 2.9 1.7 4.3.8 1.3 1.8 2.5 3 3.5s2.5 1.8 4 2.3c1.4.5 3 .8 4.5.9 1.7 0 3.5-.3 5.1-.9 1.6-.7 3-1.6 4.2-2.8 1.2-1.2 2.2-2.7 2.8-4.3.7-1.6 1-3.3.9-5z"
                      fill="#9bbbbe"
                    />
                  </Svg>
                </View>
                <Text style={styles.caltext}>
                  {energy?.sibling_pet_active_time} Cals
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};
export default CompareFamilyMetrics;
