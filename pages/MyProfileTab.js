import React from 'react';
import {Tab, TabView} from '@rneui/themed';
import {Text, View, Image, ScrollView} from 'react-native';
import styles from '../Common.css';
import MeHome from './MeHome';
import Profile from './Profile';
import MyEnergy from './MyEnergy';
import MySuggestedDiet from './MySuggestedDiet';
import ActiveTimeDay from './Dashboard-ActiveTime/ActiveTimeDay';
import ActiveTimeWeek from './Dashboard-ActiveTime/ActiveTimeWeek';
import ActiveTimeMonth from './Dashboard-ActiveTime/ActiveTimeMonth';
import ActiveTimeYear from './Dashboard-ActiveTime/ActiveTimeYear';
import TopHeader from './TopHeader';
import MyProfilePet from './MyProfilePet';

const MyProfileTab = props => {
  const [index, setIndex] = React.useState(0);
  return (
    <>
      {/* <ScrollView style={{marginTop:100}} showsVerticalScrollIndicator={false}>
    <View style={styles.tabmain3}>
    <Tab
      value={index}
      onChange={(e) => setIndex(e)}
      indicatorStyle={{
        backgroundColor: '#495F75',
          }}
    >
      <Tab.Item
        title="Pet"
        titleStyle={(active) => ({
           textAlign:"right",
           alignContent:"flex-end",
           alignItems:"flex-end",
           justifyContent:"flex-end",
           fontSize:12,
           fontFamily: 'Montserrat-Bold',
           color:active ? "#495F75" : "#495F75",
           padding:0,
           margin:0        })}
        containerStyle={(active) => ({
          borderBottomColor: active ? "#495F75" : "#CED4D8",
          borderBottomWidth:4,
          padding:0,
          margin:0
        })}
      />
      <Tab.Item
        title="Tracker"
        titleStyle={(active) => ({
          textAlign:"right",
          alignContent:"flex-end",
          alignItems:"flex-end",
          justifyContent:"flex-end",
          fontSize:12,
          fontFamily: 'Montserrat-Bold',
          color:active ? "#495F75" : "#495F75",
          padding:0,
          margin:0
          })}
        containerStyle={(active) => ({
          borderBottomColor: active ? "#495F75" : "#CED4D8",
          borderBottomWidth:4
        })}
      />
    <Tab.Item
        title="Family"
        titleStyle={(active) => ({
          textAlign:"right",
          alignContent:"flex-end",
          alignItems:"flex-end",
          justifyContent:"flex-end",
          fontSize:12,
          fontFamily: 'Montserrat-Bold',
          color:active ? "#495F75" : "#495F75",
          padding:0,
          margin:0
          })}
        containerStyle={(active) => ({
          borderBottomColor: active ? "#495F75" : "#CED4D8",
          borderBottomWidth:4
        })}
      />
    </Tab>

    <TabView value={index} onChange={setIndex} animationType="spring">
      <TabView.Item style={{ backgroundColor: '#000',flex:1 }}>
        <Text>sgdnsidhsdisdn</Text>
        <MyProfilePet/>
      </TabView.Item>
      <TabView.Item style={{ backgroundColor: '#fff', width: '100%' }}>
        <ActiveTimeWeek/>
      </TabView.Item>
      <TabView.Item style={{ backgroundColor: '#fff', width: '100%' }}>
        <ActiveTimeMonth/>
      </TabView.Item>
      <TabView.Item style={{ backgroundColor: '#fff', width: '100%' }}>
        <ActiveTimeYear/>
      </TabView.Item>
    </TabView>
    </View>
    </ScrollView> */}

      <View style={styles.mainpage}>
        <View style={styles.space20}></View>
        <View style={styles.space20}></View>
        <TopHeader />
        <View style={styles.tabmain1}>
          <Profile />
        </View>
        <View style={styles.todaysec}>
          <Text style={styles.todaytext}>Active time</Text>
        </View>
        <View style={styles.tabmain3}>
          <Tab
            value={index}
            onChange={e => setIndex(e)}
            indicatorStyle={{
              backgroundColor: '#495F75',
            }}>
            <Tab.Item
              title="D"
              titleStyle={active => ({
                fontSize: 12,
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 25,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#495F75',
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
              title="W"
              titleStyle={active => ({
                fontSize: 12,
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 25,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#495F75',
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
              })}
            />
            <Tab.Item
              title="M"
              titleStyle={active => ({
                fontSize: 12,
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 25,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#495F75',
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
              })}
            />
            <Tab.Item
              title="Y"
              titleStyle={active => ({
                fontSize: 12,
                textAlign: 'right',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                fontSize: 25,
                fontFamily: 'Montserrat-Bold',
                color: active ? '#495F75' : '#495F75',
              })}
              containerStyle={active => ({
                borderBottomColor: active ? '#495F75' : '#CED4D8',
                borderBottomWidth: 4,
              })}
            />
          </Tab>

          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{backgroundColor: '#fff', flex: 1}}>
              <ActiveTimeDay />
            </TabView.Item>
            <TabView.Item style={{backgroundColor: '#fff', width: '100%'}}>
              <ActiveTimeWeek />
            </TabView.Item>
            <TabView.Item style={{backgroundColor: '#fff', width: '100%'}}>
              <ActiveTimeMonth />
            </TabView.Item>
            <TabView.Item style={{backgroundColor: '#fff', width: '100%'}}>
              <ActiveTimeYear />
            </TabView.Item>
          </TabView>
        </View>
      </View>
    </>
  );
};

export default MyProfileTab;
