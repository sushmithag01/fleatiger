import React, { useEffect, useState } from 'react';
import {
    Text,
    View, ScrollView,
    Image, TouchableOpacity, FlatList
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
import { AvailableGroupMembersApi, getFriendListApi } from './API/ApiCalls';
import { SafeAreaView } from 'react-native';

function EditMemberstoGroup(props) {
    const { is_addnewMem, setis_addnewMem, groupId, members_added } = props;
    const navigation = useNavigation();
    const [MyfriendList, setMyFriendList] = useState([]);
    const [search, setSearch] = useState('');
    const [memberList, setMembersList] = useState([]);
    const [memberId, setMembersId] = useState([]);
    const [memberInfo, setMemberInfo] = useState([]);

    useEffect(() => {
        updateGroupmembers();
    }, [])

    useEffect(() => {
        const saveMemberId = async () => {
            try {
                await AsyncStorage.setItem('edited_group_members_id', JSON.stringify(memberId));
                await AsyncStorage.setItem('edited_group_members_info', JSON.stringify(memberInfo));
            } catch (error) {
                console.error("Failed to save memberId to AsyncStorage:", error);
            }
        };

        saveMemberId(); // Call the async function
    }, [memberId, memberInfo]);


    const updateGroupmembers = async () => {
        let payload = {
            group_id: groupId,
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            user_pet_id: parseInt(await AsyncStorage.getItem('PetId')),
        }
        const responseData = await AvailableGroupMembersApi(payload);
        if (responseData.status === 200) {
            setMyFriendList(responseData.data)
        } else {
            setMyFriendList([]);
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
                        <Search setSearch={setSearch} search={search} placeholdertext="Find your BFF here"/>
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
                    <TouchableOpacity onPress={() => { memberList?.length > 0 ? [navigation.navigate('Messages', { screen: 'EditGroup', params: { pageName: 'editgroup', groupId: groupId,memberId:memberId } }), setis_addnewMem(!is_addnewMem)] : null }}>
                        <Text style={[styles.homecardtext1, { color: '#ffffff', marginRight: 20, }]}>Update</Text>
                    </TouchableOpacity>

                </View>
            </BottomSheet>

        </>
    )
}

export default EditMemberstoGroup
