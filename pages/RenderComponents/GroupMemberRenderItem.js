import React, { useEffect, useState } from 'react';
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
    Alert,
} from 'react-native';
import styles from '../../Common.css'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CheckBox, Icon } from '@rneui/themed';
import { BottomSheet } from '@rneui/themed';
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
import { ExitGroupApi, ManageGroupAdminRoleApi, UpdateActivityInfoAPI, UpdateRequestStatusApi } from '../API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';

function GroupMemberRenderItem({ item, parameter, handleMembersList, memberList, groupId, handleGroupInfo, joinStatus }) {
    const [openPop, setOpenPop] = useState(false);
    const [Item, setItem] = useState({});

  

    const isChecked = memberList?.some(m => m.member_id === item?.item?.pet_id);

    const handleCheckboxPress = () => {
        handleMembersList({ isChecked: !isChecked, member_id: item?.item?.pet_id, member_info: item?.item });
    };

    const handleGroupmember = () => {
        setOpenPop(!openPop)
    }

    useEffect(() => {
        setItem(item?.item)
    }, []);


    const handleRequests = async (data) => {
        let payload = {
            group_id: groupId,
            user_id: Item.user_id,
            pet_id: Item.pet_id,
            action: data,
            admin_user_id: await AsyncStorage.getItem('userId'),
            admin_pet_id: await AsyncStorage.getItem('PetId')

        }

        const responseData = await UpdateRequestStatusApi(payload);
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
            })
            handleGroupInfo();
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
            })
        }
    }


    const handleGroupAdmin = async (data) => {
        let payload = {
            action: data,
            group_id: groupId,
            pet_id: Item?.pet_id,
            user_id: Item?.user_id,
            admin_user_id: await AsyncStorage.getItem('userId'),
            admin_pet_id: await AsyncStorage.getItem('PetId'),
        }

        const responseData = await ManageGroupAdminRoleApi(payload)
        handleGroupmember();
        handleGroupInfo();
        Toast.show(responseData.message, {
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

    const handleRemovefromGroup = async () => {
        let payload = {
            group_id: groupId,
            user_id: Item?.user_id,
            pet_id: Item?.pet_id,
        }

        const responseData = await ExitGroupApi(payload)
        handleGroupmember()
        Toast.show(responseData.message, {
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
    return (
        <>
            {Item && <View style={styles.logmain}>
                <TouchableOpacity onLongPress={() => { parameter === "display_members_groupinner" && joinStatus === 'Admin' ? handleGroupmember() : null }}>
                    <View style={[styles.logmain2, { marginBottom: 20 }]}>
                        <Image
                            source={item?.item?.pet_image_path ? { uri: item?.item?.pet_image_path } : item?.item?.pet_image ? { uri: item?.item?.pet_image } :
                                require('../../assets/pic9.png')

                            }
                            style={styles.newsimg1}></Image>
                        <View style={{ width: 125 }}>
                            <Text style={styles.homecardtext1}>
                                {item?.item?.pet_name}
                            </Text>
                            <Text style={styles.logdate}>{item?.item?.country}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {item?.item?.role === 'admin' && <View style={[styles.likesec1]}>
                    <Text style={{ backgroundColor: '#e3ffab', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, fontFamily: 'Montserrat-Medium', textAlign: 'center', color: "#000", overflow: 'hidden' }}>Admin</Text>
                </View>}

                {parameter === 'add_members' ? (
                    <View style={styles.likesec1}>
                        <CheckBox title=""
                            onPress={() => handleCheckboxPress()}
                            iconStyle={{ marginRight: 0 }}
                            checked={isChecked}
                            checkedColor="#B85A57"
                            containerStyle={{ backgroundColor: 'transparent' }}
                        />

                    </View>
                ) : parameter === 'display_members_create' || parameter === 'display_members_groupinner' ? null : (
                    <View style={[styles.likesec1]}>
                        {
                            Item?.action_buttons?.length > 0 && Item?.action_buttons[0] &&
                            <TouchableOpacity onPress={() => handleRequests("approve")}>
                                <Svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={40}
                                    height={40}
                                    viewBox="0 0 30 30"
                                    fill="none">
                                    <G clipPath="url(#clip0_1_197)">
                                        <Path
                                            d="M15 29.4c7.953 0 14.4-6.447 14.4-14.4S22.953.6 15 .6.6 7.047.6 15 7.047 29.4 15 29.4z"
                                            fill="#9BBBBE"
                                        />
                                        <Path
                                            d="M23.1 14.1h-7.194V6.9a.899.899 0 10-1.8 0v7.194H6.9a.899.899 0 100 1.8h7.194v7.194a.899.899 0 101.8 0v-7.194h7.194a.899.899 0 100-1.8l.012.006z"
                                            fill="#223656"
                                        />
                                    </G>
                                    <Defs>
                                        <ClipPath id="clip0_1_197">
                                            <Path fill="#fff" d="M0 0H30V30H0z" />
                                        </ClipPath>
                                    </Defs>
                                </Svg>
                            </TouchableOpacity>
                        }

                        {
                            Item?.action_buttons?.length > 0 && Item?.action_buttons[1] &&
                            <TouchableOpacity onPress={() => handleRequests("reject")}>
                                <Svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    id="icons-RZ_Weiss"
                                    viewBox="0 0 50 50"
                                    width={40}
                                    height={40}>
                                    <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                                    <Path
                                        d="M38.5 26.5h-27c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h26.99c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
                                        fill="#223656"
                                    />
                                </Svg>
                            </TouchableOpacity>
                        }
                    </View>
                )}

            </View>}


            {/* upload popup */}
            <BottomSheet modalProps={{}} isVisible={openPop}>
                <ScrollView
                    style={[styles.bottomsheetmainsmall, { height: 150, padding: 10, }]}
                    showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => setOpenPop(false)}>
                        <Ionicons
                            name="close-outline"
                            size={30}
                            color="#B85A57"></Ionicons>
                    </TouchableOpacity>

                    <View style={{ marginBottom: 60 }}>
                        <TouchableOpacity onPress={() => handleGroupAdmin(Item?.role === 'member' ? "assign" : "remove")}>
                            <View style={{ alignItems: 'center', padding: 20, }}>
                                <Text style={{ fontFamily: 'Montserrat-Medium', color: '#436077', textAlign: 'center', }}>{Item?.role === 'member' ? "Make Group Admin" : "Remove from Admin"}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemovefromGroup()}>
                            <View>
                                <Text style={{ fontFamily: 'Montserrat-Medium', color: '#B85A57', textAlign: 'center', }}>Remove {Item?.pet_name}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.space20}></View>
                    <View style={styles.space20}></View>
                    <View style={styles.space20}></View>
                    <View style={styles.space20}></View>
                    <View style={styles.space20}></View>
                    <View style={styles.space20}></View>
                </ScrollView>
            </BottomSheet>
        </>

    )
}

export default GroupMemberRenderItem