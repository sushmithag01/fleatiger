import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView, Text, View } from 'react-native';
import styles from '../Common.css';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CreateGroupHeaderLeft, GroupInnerHeaderLeft, GroupInnerRightHeader } from '../navigation/CustomBackNavigation';
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
import GroupMemberRenderItem from './RenderComponents/GroupMemberRenderItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';
import EventListRenderItem from './RenderComponents/EventListRenderItem';
import { DeleteGroupApi, ExitGroupApi, GroupInfoApi, RequestToJoinApi } from './API/ApiCalls';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native';
import Loader from './CommonScreens/Loader';

const GroupInner = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [MyfriendList, setMyFriendList] = useState([]);
    const [checkedPublic, setCheckedPublic] = useState(false);
    const [eventLists, setEventsList] = useState([]);
    const [groupId, setGroupId] = useState(route?.params?.groupId);
    const [Data, setData] = useState([]);
    const [groupInfo, setGroupInfo] = useState([]);
    const [requestedMembers, setRequestedMembers] = useState([]);
    const [loading, setLoading] = useState(false)
    const [chatProps, setChatProps] = useState({
        group_desc: '',
        group_name: '',
        group_id: '',
        group_type: '',
        group_admin: '',
        group_image: ''
    })

    useEffect(() => {
        if (isFocused) {
            navigation.setOptions({
                headerLeft: () => <GroupInnerHeaderLeft navigation={navigation} />,
                headerRight: () => (
                    ['Admin', 'Member'].includes(groupInfo?.join_status)
                        ? <GroupInnerRightHeader navigation={navigation} chatProps={chatProps} />
                        : null
                ),
            });
            setGroupId(route?.params?.groupId)
        }
    }, [isFocused, chatProps, groupInfo,route]);

    useEffect(() => {
        if (isFocused) {
            setLoading(true)
            handleGroupInfo();
        }
    }, [isFocused,route,groupId]);

    const handleGroupInfo = async () => {
        const payload = {
            group_id: groupId,
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            pet_id: parseInt(await AsyncStorage.getItem('PetId'))
        }
        const responseData = await GroupInfoApi(payload);
        console.log("responseData",responseData,payload)
        if (responseData.status === 200) {
            setGroupInfo(responseData?.data)
            setData(responseData?.data?.members)
            setRequestedMembers(responseData?.data?.join_requests_members)
            setEventsList(responseData?.data?.events)
            setLoading(false);
            setChatProps({
                group_desc: responseData?.data?.description,
                group_name: responseData?.data?.group_name,
                group_id: responseData?.data?.group_id,
                group_type: responseData?.data?.group_type,
                group_image: responseData?.data?.group_image,
            });
        } else {
            setData([]);
            setGroupInfo([]);
            setLoading(false);
        }


    }

    const handleExitGroup = async () => {
        let payload = {
            group_id: groupId,
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            pet_id: parseInt(await AsyncStorage.getItem('PetId'))

        }
        const Responsedata = await ExitGroupApi(payload);
        // console.log("Responsedata", Responsedata, payload)
        if (Responsedata.status === 200) {
            Toast.show(Responsedata.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            })
            navigation.navigate('ChatListing', { index: 1 })
        } else {
            Toast.show(Responsedata.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            })
        }

    }


    const handleDeleteGroup = async () => {
        let payload = {
            group_id: groupId,
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            pet_id: parseInt(await AsyncStorage.getItem('PetId'))

        }
        const Responsedata = await DeleteGroupApi(payload);
        // console.log("Responsedata", Responsedata, payload)
        if (Responsedata.status === 200) {
            Toast.show(Responsedata.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            })
            navigation.navigate('ChatListing', { index: 1 })
        } else {
            Toast.show(Responsedata.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            })
        }

    }

    const handleRequesttojoin = async () => {
        const payload = {
            group_id: groupId,
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            pet_id: parseInt(await AsyncStorage.getItem('PetId'))
        }
        const ResponseData = await RequestToJoinApi(payload)
        if (ResponseData.status === 200) {
            Toast.show(ResponseData.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            })
            handleGroupInfo();
        } else {
            Toast.show(ResponseData.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            })
        }
    }

    return (
        <>
            {loading ? <Loader loading={loading} /> : ''}
            <ScrollView style={[{ backgroundColor: '#fff' }]} showsVerticalScrollIndicator={false}>
                <View style={{ padding: 5, marginTop: 10, margin: 10 }}>
                    {
                        groupInfo?.join_status === 'Admin' &&
                        <TouchableOpacity
                            style={{ alignItems: 'flex-end', marginBottom: 10 }}
                            onPress={() => navigation.navigate('EditGroup', { groupId: groupInfo?.group_id })}>
                            <Image source={require('../assets/edit_pencil.png')} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    }

                    <View>
                        <View style={[styles.logosection]}>
                            <View>
                                {
                                    groupInfo?.group_image ? <Image style={[styles.ProfileLogo, styles.addupload, { width: 60, height: 60, marginVertical: 5 }]} source={{ uri: groupInfo?.group_image }} /> : <Svg
                                        width={80}
                                        height={80}
                                        viewBox="0 0 95 79"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <Path
                                            d="M39.5 79C61.315 79 79 61.315 79 39.5S61.315 0 39.5 0 0 17.685 0 39.5 17.685 79 39.5 79z"
                                            fill="#CCD2D4"
                                        />
                                        <Path
                                            d="M70.614 31.77L52.222 18.403a2.23 2.23 0 00-2.352-.128 2.697 2.697 0 00-.292.182l-9.224 5.741a2.138 2.138 0 01-2.21 0L28.95 18.47a2.443 2.443 0 00-.352-.215 1.527 1.527 0 00-.412-.162 2.18 2.18 0 00-1.9.314L7.896 31.77a2.3 2.3 0 00-.588 2.971l7.546 13.944a2.273 2.273 0 004.086.078l1.127-2.416 9.655 8.932a13.947 13.947 0 0019.057 0l9.662-8.938 1.13 2.421a2.272 2.272 0 004.086-.078l7.54-13.945a2.3 2.3 0 00-.582-2.97l-.001.001zM47.782 54.203a12.564 12.564 0 01-7.8 3.348v-4.548c.107-.055.208-.122.3-.2L45.1 48.73a2.792 2.792 0 00-.268-4.473l-1.631-1.076a1.6 1.6 0 00-1.642-.067l-1.54.844a1.6 1.6 0 01-1.531 0l-1.54-.844a1.592 1.592 0 00-1.641.067l-1.63 1.076a2.794 2.794 0 00-.268 4.472l4.819 4.074c.089.075.186.14.289.192v4.555a12.565 12.565 0 01-7.8-3.348l-10-9.25 10.804-23.149 5.846 3.64.01.005.01.006a3.604 3.604 0 003.717 0l.01-.006.01-.006 5.857-3.645 10.8 23.151-10.003 9.255h.003z"
                                            fill="#fff"
                                        />
                                        <Defs>
                                            <ClipPath id="clip0_586_1180">
                                                <Path
                                                    fill="#fff"
                                                    transform="translate(63 47)"
                                                    d="M0 0H32V32H0z"
                                                />
                                            </ClipPath>
                                        </Defs>
                                    </Svg>
                                }

                            </View>
                        </View>
                        <Text style={[styles.newFrndTitle, { padding: 10 }]}>
                            {groupInfo?.group_name}
                        </Text>
                        <Text style={{ fontFamily: 'Montserrat-medium', textAlign: 'center', marginBottom: 10, color: '#436077' }}>
                            {groupInfo.description}
                        </Text>
                        <Text style={{ fontFamily: 'Montserrat', opacity: 0.8, textAlign: 'center' }}>
                            {Data?.length} Members
                        </Text>
                    </View>
                    <View style={styles.space20}></View>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Montserrat-Medium', margin: 10 }}>Upcoming Events</Text>
                            {
                                groupInfo?.join_status === 'Admin' &&
                                <TouchableOpacity onPress={() => { navigation.navigate('CreateEvent', { groupId: groupId }) }}>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', margin: 10, color: '#436077' }}>Create Event</Text>
                                </TouchableOpacity>
                            }


                        </View>
                        {eventLists?.length > 0 ?
                            <SafeAreaView>
                                <FlatList
                                    data={eventLists}
                                    keyExtractor={item => item.index}
                                    renderItem={item => (<EventListRenderItem item={item} groupId={groupId} />)}
                                    nestedScrollEnabled={true}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </SafeAreaView> :
                            <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-Medium', marginVertical: 5, fontWeight: '800' }}> No Upcoming Events</Text>
                        }
                    </View>


                    <View style={styles.space20}></View>
                    <View>
                        <Text style={{ fontFamily: 'Montserrat-Medium', margin: 10 }}>Group Members</Text>
                        <View>
                            <SafeAreaView>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <FlatList
                                        keyExtractor={item => item.chat_id}
                                        data={Data}
                                        renderItem={item => (
                                            <GroupMemberRenderItem
                                                item={item} parameter={"display_members_groupinner"}
                                                groupId={groupId}
                                                joinStatus={groupInfo?.join_status}
                                                handleGroupInfo={handleGroupInfo} />
                                        )}
                                        // contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                                        nestedScrollEnabled={true}
                                        horizontal={false}
                                    />
                                </ScrollView>
                            </SafeAreaView>

                        </View>
                    </View>
                    {groupInfo?.join_status === 'Admin' && requestedMembers.length > 0 ? (<View>
                        <Text style={{ fontFamily: 'Montserrat-Medium', margin: 10 }}>Requested Members</Text>
                        <View>
                            <SafeAreaView>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <FlatList
                                        keyExtractor={item => item.chat_id}
                                        data={requestedMembers}
                                        renderItem={item => (
                                            <GroupMemberRenderItem item={item} parameter={"requested"} groupId={groupId} handleGroupInfo={handleGroupInfo} />
                                        )}
                                        // contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                                        nestedScrollEnabled={true}
                                        horizontal={false}
                                    />
                                </ScrollView>
                            </SafeAreaView>

                        </View>
                    </View>) : null}


                </View>
                {['Admin', 'Member'].includes(groupInfo?.join_status) && (
                    <View style={{ backgroundColor: '#F0F0F0', height: groupInfo?.join_status === 'Admin' ? '8%' : '5%', marginVertical: '20%', borderRadius: 10, margin: 20, justifyContent: 'space-around' }}>
                        {groupInfo?.join_status === 'Admin' && (
                            <>
                                <TouchableOpacity onPress={() => handleDeleteGroup()}>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', color: '#B85A57', textAlign: 'center', padding: 10 }}>Delete Group</Text>
                                </TouchableOpacity>
                                <View style={{
                                    width: '80%',
                                    height: 1,
                                    backgroundColor: '#888',
                                    alignItems: 'center',
                                    marginHorizontal: 40,
                                    opacity: 0.4
                                }} ></View>
                            </>
                        )
                        }
                        <TouchableOpacity onPress={() => handleExitGroup()}>
                            <Text style={{ fontFamily: 'Montserrat-Medium', color: '#B85A57', textAlign: 'center', padding: 10 }}>Exit Group</Text>
                        </TouchableOpacity>

                    </View>
                )}
            </ScrollView>
            {['Request to Join', 'Join'].includes(groupInfo?.join_status) && (
                <View>
                    <TouchableOpacity style={styles.joinBtn} onPress={handleRequesttojoin}>
                        <Text style={[styles.homecardtext1, { color: '#ffffff', margin: 10, textAlign: 'center' }]}>
                            {groupInfo?.join_status}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    )
}

export default GroupInner