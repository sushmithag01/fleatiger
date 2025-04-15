import React, { useEffect, useState } from 'react';
import {
    Text,
    View, ScrollView,
    Image, TouchableOpacity, FlatList,
    Alert
} from 'react-native';
import Svg, {
    Path, Circle
} from 'react-native-svg';
import styles from '../Common.css';
import { BottomSheet } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Search from './SearchBar';
import { CheckBox, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import GroupMemberRenderItem from './RenderComponents/GroupMemberRenderItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AvailableGroupMembersApi, CreateGroupApi, getFriendListApi } from './API/ApiCalls';
import { SafeAreaView } from 'react-native';
import Toast from 'react-native-root-toast';

function AddMemberstoGroup(props) {
    const { is_addnewMem, setis_addnewMem, pageName, groupId, groupDescription, groupName, checkedPublic, groupImg } = props;
    const navigation = useNavigation();
    const [MyfriendList, setMyFriendList] = useState([]);
    const [search, setSearch] = useState('');
    const [memberList, setMembersList] = useState([]);
    const [memberId, setMembersId] = useState([]);
    const [memberInfo, setMemberInfo] = useState([]);

    useEffect(() => {
        getFriendsList();
    }, [])

    // useEffect(() => {
    //     const saveMemberId = async () => {
    //         try {
    //             await AsyncStorage.setItem('added_group_members_id', JSON.stringify(memberId));
    //             await AsyncStorage.setItem('added_group_members_info', JSON.stringify(memberInfo));
    //         } catch (error) {
    //             console.error("Failed to save memberId to AsyncStorage:", error);
    //         }
    //     };

    //     saveMemberId(); // Call the async function
    // }, [memberId, memberInfo]);

    const getFriendsList = async () => {
        const UserID = await AsyncStorage.getItem('userId');
        const PetId = await AsyncStorage.getItem('PetId');
        // setMembersId([...memberId, parseInt(PetId)]);
        const payload = {
            user_id: parseInt(UserID),
            user_pet_id: parseInt(PetId),
            search: search,
        };

        const Response = await getFriendListApi(payload);
        if (Response.status === 200) {
            setMyFriendList(Response.data)
        } else {
            setMyFriendList([]);
        }
    }

    const handleCreateGroup = async () => {
        let payload = {
            group_name: groupName,
            description: groupDescription,
            pet_ids: memberId,
            group_type: checkedPublic === true ? "public" : "private",
            user_id: await AsyncStorage.getItem('userId'),
            created_by_pet_id: await AsyncStorage.getItem('PetId'),
            group_image_path: groupImg
        }
        const responseData = await CreateGroupApi(payload);
        // console.log("responseData", responseData, payload)
        if (responseData.status === 200) {
            Toast.show(responseData.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            });
            navigation.navigate('MessagesStackNavigator', { screen: 'GroupsList' })
            // navigation.navigate('MessagesStackNavigator', { screen: 'ChatListing', params: { index: 1 } })
        } else {
            Toast.show(responseData.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            });
            navigation.goBack();
            await AsyncStorage.removeItem('added_group_members_info');
            await AsyncStorage.removeItem('added_group_members_id');
        }

    }
    const handleMembersList = (member) => {
        const isMemberAlreadyAdded = memberList.some(m => m.member_id === member.member_id);
        if (member.isChecked && !isMemberAlreadyAdded) {
            // Add the member if checked and not already in the list
            setMembersList([...memberList, member]);
            setMembersId([...memberId, member?.member_id]);
            setMemberInfo([...memberInfo, member?.member_info])

        } else if (!member.isChecked && isMemberAlreadyAdded) {
            // Remove the member if unchecked and already in the list
            setMembersList(memberList.filter(m => m.member_id !== member.member_id));
            setMembersId(memberId.filter(m => m !== member.member_id));
            setMemberInfo([memberInfo.filter(m => m !== member.member_info)])

        }
    };
    return (
        <>
            <BottomSheet modalProps={{}} isVisible={is_addnewMem}>
                <View style={[styles.bottomsheetmainAddfriend, { height: 750, }]}>
                    {/* <View style={styles.editBtn}> */}
                    <TouchableOpacity onPress={() => setis_addnewMem(!is_addnewMem)}>
                        <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
                    </TouchableOpacity>
                    <Text style={styles.newFrndTitle}>Add Members</Text>
                    {/* </View> */}
                    <ScrollView
                        style={styles.mainpage}
                        showsVerticalScrollIndicator={false}>
                        <Search setSearch={setSearch} search={search} placeholdertext="Find your BFF here" />
                        <View style={styles.space20}></View>
                        {MyfriendList.length > 0 ? (<View style={styles.homecardinner3}>
                            <SafeAreaView>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <FlatList
                                        keyExtractor={item => item.chat_id}
                                        data={MyfriendList}
                                        renderItem={item => (
                                            <GroupMemberRenderItem item={item} parameter={"add_members"} setMembersList={setMembersList} memberList={memberList} handleMembersList={handleMembersList} />
                                        )}
                                        // contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                                        nestedScrollEnabled={true}
                                        horizontal={false}
                                    />
                                </ScrollView>
                            </SafeAreaView>

                        </View>) : <Text style={[styles.homecardtext1, { textAlign: 'center', marginVertical: 100 }]}
                        >No data available..!!</Text>}

                    </ScrollView>

                </View>
                <View style={[styles.joinBtn, { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }]}>
                    <TouchableOpacity onPress={() => { setis_addnewMem(!is_addnewMem) }}>
                        <Text style={[styles.homecardtext1, { color: '#ffffff', margin: 10, opacity: 0.6, marginLeft: 20, }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { memberList?.length > 0 ? handleCreateGroup() : Alert.alert("Add Members to the group") }}>
                        <Text style={[styles.homecardtext1, { color: '#ffffff', marginRight: 20, }]}>Create</Text>
                    </TouchableOpacity>

                </View>
            </BottomSheet>

        </>
    )
}

export default AddMemberstoGroup