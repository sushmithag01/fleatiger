import React, { useState, useEffect } from 'react';
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
import styles from '../../Common.css';
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
    Ellipse,
} from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getFriendListApi, getNewgroupsListApi } from '../API/ApiCalls';
import Toast from 'react-native-root-toast';

import { BottomSheet } from '@rneui/themed';
import ProfileRemovedConfirmation from '../Popups/ProfileRemovedConfirmation';
import RemoveProfileMessage from '../Popups/RemoveProfileMessage';
import AddFriend from '../AddFriend';
import AddMemberstoGroup from '../AddMemberstoGroup';
import Search from '../SearchBar';
import ErrorText from '../ErrorText/ErrorText';

const AddNewGroupChat = props => {
    const { is_myGroups, setis_myGroups } = props;
    const chatType = 0;
    const navigation = useNavigation();

    const [openNewFriendList, setNewopenFriendList] = useState(false);

    const [MyGroupList, setMyGroupList] = useState([]);

    // err
    const [NoData, setNoData] = useState('');
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    // popup
    const [openAddFriend, setOpenAddFriend] = useState(false);

    const [newChatReq, setNewChatReq] = useState(false);
    const isFocused = useIsFocused();


    useEffect(() => {
        if (isFocused) {
            GetGroupsListData();
        }
    }, [isFocused, search]);

    const GetGroupsListData = async () => {
        setLoading(true);
        const UserID = await AsyncStorage.getItem('userId');
        const PetId = await AsyncStorage.getItem('PetId');
        const payload = {
            user_id: parseInt(UserID),
            pet_id: parseInt(PetId),
            search: search,
        };
        const Response = await getNewgroupsListApi(payload);
        if (Response.success == true) {
            setLoading(false);
            setMyGroupList(Response?.data);
        } else {
            setLoading(false);
            setMyGroupList([]);
            Toast.show(Response.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            });
        }
    };

    const handleClose = () => {
        setis_myGroups(!is_myGroups);
    };

    const handleNewChat = data => {
        const props = {
            group_desc: data?.description,
            group_name: data?.group_name,
            group_id: data?.id,
            group_type: data?.group_type,
            group_admin: data?.created_by,
            group_image: data?.group_image
        }
        console.log(props,data)
        navigation.navigate('GroupChat', { userInfo: props, chat_type: chatType });
        handleClose();
    };

    return (
        <View>
            <BottomSheet modalProps={{}} isVisible={is_myGroups}>
                <View style={[styles.bottomsheetmainAddfriend]}>
                    {/* <View style={styles.editBtn}> */}
                    <TouchableOpacity onPress={() => handleClose()}>
                        <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
                    </TouchableOpacity>
                    <Text style={styles.newFrndTitle}>My Groups</Text>
                    {/* </View> */}
                    <ScrollView
                        style={styles.mainpage}
                        showsVerticalScrollIndicator={false}>
                        <Search setSearch={setSearch} search={search} placeholdertext="Find your Squad here" />
                        <View style={styles.space20}></View>

                        <View style={styles.homecardinner3}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {MyGroupList &&
                                    MyGroupList?.map((item, key) => {
                                        return (
                                            <View style={styles.logmain}>
                                                <View style={styles.logmain2}>
                                                    {/* {uri:item.pet_image_path} */}
                                                    <Image
                                                        source={
                                                            item.pet_image_path ==
                                                                'https://devapi.fleatiger.com/'
                                                                ? require('../../assets/pic9.png')
                                                                : { uri: item.group_image }
                                                        }
                                                        style={styles.newsimg1}></Image>
                                                    <View style={{ width: 230 }}>
                                                        <Text style={styles.homecardtext1}>
                                                            {item.group_name}
                                                        </Text>
                                                        <Text style={styles.logdate}>{item.group_type}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.likesec1}>
                                                    <TouchableOpacity onPress={() => handleNewChat(item)}>
                                                        <Svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 48 48"
                                                            width={35}
                                                            height={35}>
                                                            <Circle
                                                                cx={24}
                                                                cy={24}
                                                                r={24}
                                                                fill="#92bcbf"
                                                                strokeWidth={0}
                                                            />
                                                            <Path
                                                                d="M36.68 12.06h-25.4a2.3 2.3 0 00-2.3 2.3v15.97a2.3 2.3 0 002.3 2.3h1.98v4.44c0 .35.21.66.53.79a.88.88 0 00.94-.19l5.05-5.05h16.9a2.3 2.3 0 002.3-2.3V14.35a2.3 2.3 0 00-2.3-2.3zm.58 4.17v14.1c0 .32-.26.58-.58.58H19.43a.88.88 0 00-.61.25L14.99 35v-3.23c0-.47-.39-.86-.86-.86h-2.84a.58.58 0 01-.58-.58V14.36c0-.32.26-.58.58-.58h25.39c.32 0 .58.26.58.58v1.87z"
                                                                fill="#223656"
                                                                strokeWidth={0}
                                                            />
                                                            <Path
                                                                d="M28.59 23.68l-3.6-3.04c-.58-.49-1.43-.49-2.02 0l-3.6 3.04c-.56.47-.87 1.15-.87 1.88 0 .83.41 1.59 1.11 2.05l1.22.8c.48.32 1.1.34 1.61.07l1.15-.63c.25-.13.54-.13.79 0l1.15.63c.24.13.49.19.75.19.3 0 .6-.09.86-.26l1.22-.8c.7-.46 1.11-1.22 1.11-2.05 0-.72-.32-1.41-.87-1.88zM19.28 22.58c.09 0 .19-.01.28-.03.62-.15 1.09-.8 1.09-1.57s-.47-1.42-1.09-1.57c-.09-.02-.18-.03-.28-.03-.19 0-.37.04-.53.13-.25.12-.45.33-.6.58-.05.09-.09.18-.13.27-.07.19-.11.4-.11.62 0 .55.24 1.04.6 1.33.22.17.48.27.76.27zM29.65 19.85c-.25-.29-.59-.47-.97-.47-.76 0-1.37.72-1.37 1.6s.61 1.6 1.37 1.6 1.37-.72 1.37-1.6c0-.44-.15-.84-.4-1.13zM21.99 19.73c.22 0 .43-.05.61-.14.19-.09.36-.22.5-.38.29-.32.46-.77.46-1.26 0-.98-.71-1.78-1.58-1.78s-1.58.8-1.58 1.78.71 1.78 1.58 1.78zM25.94 19.73c.87 0 1.58-.8 1.58-1.78s-.71-1.78-1.58-1.78c-.22 0-.43.05-.61.14-.19.09-.36.22-.5.38-.29.32-.46.77-.46 1.26 0 .98.71 1.78 1.58 1.78z"
                                                                fill="#223656"
                                                                strokeWidth={0}
                                                            />
                                                        </Svg>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    })}

                                {NoData && (
                                    <Text style={styles.nodatatext}>{ErrorText.NoData}</Text>
                                )}
                            </ScrollView>
                        </View>
                    </ScrollView>
                    <View style={styles.space20}></View>
                </View>
            </BottomSheet>

        </View>
    );
};

export default AddNewGroupChat;
