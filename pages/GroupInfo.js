import React, { useState, useEffect } from 'react'
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
} from 'react-native';
import styles from '../Common.css';
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
import LikeListRenderItem from './RenderComponents/LikeListRenderItem';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { GroupInfoLeftHeader } from '../navigation/CustomBackNavigation';
import { ExitGroupApi, GroupInfoApi, RequestToJoinApi } from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './CommonScreens/Loader';
import Toast from 'react-native-root-toast';
import GroupMemberRenderItem from './RenderComponents/GroupMemberRenderItem';

function GroupInfo({ route }) {
    const [Data, setData] = useState([]);
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [groupId, setGroupId] = useState('');
    const [groupInfo, setGroupInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requestedMembers, setRequestedMembers] = useState([]);

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            setGroupId(route?.params?.groupId)
            navigation.setOptions({
                headerLeft: () => <GroupInfoLeftHeader navigation={navigation} />,
            });
            handleGroupInfo();
        }
    }, [isFocused, groupId, groupInfo]);


    const handleGroupInfo = async () => {
        const payload = {
            group_id: groupId,
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            pet_id: parseInt(await AsyncStorage.getItem('PetId'))
        }
        const responseData = await GroupInfoApi(payload);
        if (responseData.status === 200) {
            setGroupInfo(responseData?.data)
            setData(responseData?.data?.members)
            setRequestedMembers(responseData?.data?.join_requests_members)
        } else {
            setData([]);
            setGroupInfo([]);
        }
        setLoading(false);
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

    const handleExitGroup = async () => {
        let payload = {
            group_id: groupId,
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            pet_id: parseInt(await AsyncStorage.getItem('PetId'))

        }
        const Responsedata = await ExitGroupApi(payload);
        console.log("Responsedata", Responsedata, payload)
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
    return (
        <>
            {loading ? <Loader loading={loading} /> : ''}
            <ScrollView style={{ backgroundColor: '#fff' }}>
                {
                    groupInfo?.join_status === 'Admin' &&
                    <TouchableOpacity
                        style={{ alignItems: 'flex-end', marginBottom: 10, margin: 10 }}
                        onPress={() => navigation.navigate('EditGroup', { pageName: 'editgroup', groupId: groupInfo?.group_id })}>
                        <Image source={require('../assets/edit_pencil.png')} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                }
                <View style={{ marginTop: 20 }}>
                    <View>
                        <View style={[styles.logosection]}>
                            <Image
                                source={groupInfo?.group_image ? { uri: groupInfo?.group_image } :
                                    require('../assets/pic9.png')
                                }
                                style={styles.newsimg1}></Image>
                        </View>
                        <Text style={styles.profilename}>
                            {groupInfo?.group_name}
                        </Text>
                        <Text style={[styles.activestatetext, styles.mb6, { textAlign: 'center', color: '#436077', }]}> {groupInfo.description}</Text>
                    </View>
                </View>
                <View style={styles.space20}></View>
                <View>
                    <Text style={[styles.activestatetext, styles.mb6]}>Group Members</Text>
                    <View style={styles.space20}></View>
                    <SafeAreaView>
                        <ScrollView style={{ marginHorizontal: 20 }}>
                            <FlatList
                                data={Data}
                                keyExtractor={item => item}
                                renderItem={item => <GroupMemberRenderItem item={item} parameter={"display_members_groupinner"} groupId={groupId} joinStatus={groupInfo?.join_status} handleGroupInfo={handleGroupInfo}
                                    nestedScrollEnabled={true}
                                />
                                }
                            />
                        </ScrollView>
                    </SafeAreaView>
                </View>
                <View style={styles.space20}></View>
                <View style={{ margin: 20 }}>
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
            {
                ['Member', 'Admin'].includes(groupInfo?.join_status) && (
                    <View>
                        <TouchableOpacity style={styles.joinBtn} onPress={() => handleExitGroup()}>
                            <Text style={[styles.homecardtext1, { color: '#ffffff', margin: 10, textAlign: 'center' }]}>
                                Exit Group
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            }

        </>
    )
}

export default GroupInfo