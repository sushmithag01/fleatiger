import React, { useState, useEffect } from 'react'
import { SafeAreaView, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import styles from '../Common.css';
import Search from './SearchBar';
import ListRenderItem from './RenderComponents/ListRenderItem';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { GroupsListLeftHeader } from '../navigation/CustomBackNavigation';
import { AllGroupsListApi, getgroupsListApi } from './API/ApiCalls';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tab, Text, TabView } from '@rneui/themed';
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

function GroupsList() {
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <GroupsListLeftHeader navigation={navigation} />,
      });
      handleGroupList()
    }
  }, [isFocused, search, index]);

  const handleGroupList = async () => {
    let payload = {
      search: search,
      user_id: await AsyncStorage.getItem('userId'),
      pet_id: await AsyncStorage.getItem('PetId'),
      request_type: index === 0 ? "all_groups" : "my_groups",
    }
    const response = await getgroupsListApi(payload);
    if (response.status === 200) {
      setGroups(response.data)
    } else {
      setGroups([]);
    }
  }
  return (

    <>
      <View style={styles.mainpage} showsVerticalScrollIndicator={false}>
        <View style={styles.space20}></View>
        <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{navigation.navigate("Messages",{screen:'CreateGroup'})}}>
          <View style={{ width: '63%', backgroundColor: '#495F75', borderRadius: 30, padding: 5, flexDirection:'row',alignContent:'center',}}>
            <Svg
              width={45}
              height={45}
              viewBox="0 0 50 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <Path
                d="M25 29.4c7.953 0 14.4-6.447 14.4-14.4S32.953.6 25 .6 10.6 7.047 10.6 15 17.047 29.4 25 29.4z"
                fill="#CE5757"
              />
              <Path
                d="M30.408 14.404h-4.8V9.6a.6.6 0 10-1.2 0v4.8H19.6a.6.6 0 100 1.2h4.8v4.8a.6.6 0 101.2 0v-4.8h4.8a.6.6 0 100-1.2l.008.004z"
                fill="#fff"
              />
            </Svg>
            <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-Bold', color: '#fff', marginBottom: 10 ,fontSize:16,marginVertical:'4%'}}>Create your own Group</Text>
          </View>
          
        </TouchableOpacity>



        {/* search */}
        <Search search={search} setSearch={setSearch} placeholdertext="Find your Squad here" />
        {/* <View style={styles.space20}></View> */}
        <View>
          <Tab
            value={index}
            onChange={e => setIndex(e)}
            containerStyle={{ backgroundColor: '#fff' }}
            indicatorStyle={{
              backgroundColor: '#495F75',
              marginTop: 0,
              flex: 1,
            }}>
            <Tab.Item
              title="All Groups"
              titleStyle={active => ({
                fontSize: 12,
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 20,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#CED4D8',
                padding: 2,
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
                padding: 0,
                margin: 0,
              })}
            />
            <Tab.Item
              title="My Groups"
              titleStyle={active => ({
                fontSize: 12,
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 20,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#CED4D8',
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
              })}
            />
          </Tab>
          <View style={{ margin: 20 }}>
            <SafeAreaView>
              <FlatList
                extraData={item => item.id}
                data={groups}
                renderItem={(item) => <ListRenderItem item={item} />}
              />
            </SafeAreaView>
          </View>

        </View>
        {/**/}
      </View>
    </>
  )
}

export default GroupsList