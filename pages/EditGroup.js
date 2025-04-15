import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView, Image, SafeAreaView } from 'react-native';
import styles from '../Common.css'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
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
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CheckBox, Icon } from '@rneui/themed';
import { FlatList } from 'react-native';
import GroupMemberRenderItem from './RenderComponents/GroupMemberRenderItem';
import { Switch } from '@rneui/themed';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CreateGroupHeaderLeft } from '../navigation/CustomBackNavigation';
import { CreateGroupApi, getFriendListApi, GroupInfoApi, UpdateGroupApi } from './API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import ErrorText from './ErrorText/ErrorText';
import AddMemberstoGroup from './AddMemberstoGroup';
import Loader from './CommonScreens/Loader';
import EditMemberstoGroup from './EditMemberstoGroup';


function EditGroup({ route }) {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [isVisible, setIsVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [MyfriendList, setMyFriendList] = useState([]);
    const [checkedPublic, setCheckedPublic] = useState(false);
    const [groupIds, setGroupIds] = useState([]);
    const [groupImg, setGroupImg] = useState('');
    const [GroupnameErr, setGroupnameErr] = useState('');
    const [GroupdescErr, setGroupdescErr] = useState('');
    const [pageName, setPageName] = useState('editgroup');
    const [is_addnewMem, setis_addnewMem] = useState(false);
    const [Data, setData] = useState([]);
    const [groupInfo, setGroupInfo] = useState([]);
    const [groupId, setGroupId] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (isFocused) {
            setLoading(true)
            setGroupImg('');
            setGroupName('');
            setGroupDescription('')
            navigation.setOptions({
                headerLeft: () => <CreateGroupHeaderLeft navigation={navigation} />,
            });
            setGroupId(route?.params?.groupId)
            handleGroupInfo();
        }
    }, [isFocused, route, groupId]);

    useEffect(() => {
        const saveMemberId = async () => {
            let userInfo;
            let userInfoId;
            try {
                userInfo = await AsyncStorage.getItem('edited_group_members_info');
                userInfoId = await AsyncStorage.getItem('edited_group_members_id');

                if (userInfo) {
                    const parsedUserInfo = JSON.parse(userInfo);
                    setMyFriendList(parsedUserInfo);
                }
                if (userInfoId) {
                    const user_ids = userInfoId;
                    setGroupIds(user_ids)
                }
            } catch (error) {
                console.error("Failed to save memberId to AsyncStorage:", error);
            }
        };

        saveMemberId(); // Call the async function
    }, [route]);

    const handleGroupInfo = async () => {
        const payload = {
            group_id: groupId,
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            pet_id: parseInt(await AsyncStorage.getItem('PetId'))
        }
        const responseData = await GroupInfoApi(payload);
        console.log("responseData edit group page",responseData,payload)
        if (responseData.status === 200) {
            setGroupInfo(responseData?.data)
            setData(responseData?.data?.members)
            // const petIds = responseData?.data?.members.map(pet => pet.pet_id);
            setGroupName(responseData?.data?.group_name)
            setGroupImg(responseData?.data?.group_image)
            setGroupDescription(responseData?.data?.description)
            setCheckedPublic(responseData?.data?.group_type === 'public' ? true : false)
        } else {
            setData([]);
            setGroupInfo([]);
        }
        setLoading(false);

    }



    const options = {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.5,
        mediaType: 'photo',
        includeBase64: true,
        presentationStyle: 'pageSheet',
        cameraType: 'back',
    };

    const chooseCamera = async () => {
        const result = await launchCamera(options);
        setGroupImg(`data:image/jpeg;base64,${result.assets[0].base64}`);
        setIsVisible(false)

    };

    const chooseGallery = async () => {
        const result = await launchImageLibrary(options);
        setGroupImg(`data:image/jpeg;base64,${result.assets[0].base64}`);
        setIsVisible(false)

    };
    const handleUpdateGroup = async () => {
        let payload = {
            group_name: groupName,
            description: groupDescription,
            pet_ids_to_add: groupIds.length > 0 ? JSON.parse(groupIds) : [],
            pet_ids_to_remove: [],
            group_type: checkedPublic === true ? "public" : "private",
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            created_by_pet_id: parseInt(await AsyncStorage.getItem('PetId')),
            group_id: groupId
        }
        const responseData = await UpdateGroupApi(payload);

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
        await AsyncStorage.removeItem('edited_group_members_info');
        await AsyncStorage.removeItem('edited_group_members_id');
        navigation.navigate("Messages", { screen: 'GroupInner', params: { groupId: groupId } });
    }

    return (

        <>
            {loading ? <Loader loading={loading} /> : ''}
            <ScrollView style={{ backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
                <View style={[styles.fleamain,]}>
                    <Text style={styles.newFrndTitle}>Edit Group </Text>
                    <View style={[styles.adduploadmain, { backgroundColor: '#000' }]}>

                        <View styles={styles.addupload1}></View>
                    </View>
                    <View style={{ backgroundColor: '#F1F3F4', margin: 10, flexDirection: 'row', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginVertical: 10 }}>
                        {groupImg ? (
                            <>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => setIsVisible(true)}
                                    >
                                        <ImageBackground
                                            style={[styles.ProfileLogo, styles.addupload, { width: 40, height: 40, marginVertical: 5 }]}
                                            source={{ uri: groupImg }}></ImageBackground>
                                    </TouchableOpacity>
                                    <View styles={styles.addupload1}></View>
                                </View>
                            </>
                        ) : (
                            <TouchableOpacity onPress={() => setIsVisible(true)}>
                                <View>
                                    <Svg
                                        width={50}
                                        height={50}
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
                                        <G clipPath="url(#clip0_586_1180)">
                                            <Path
                                                d="M79 79c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16z"
                                                fill="#CE5757"
                                            />
                                            <Path
                                                d="M78.25 68.25v-4.5h-4.5v-1.5h4.5v-4.5h1.5v4.5h4.5v1.5h-4.5v4.5h-1.5z"
                                                fill="#fff"
                                            />
                                        </G>
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
                                </View>
                            </TouchableOpacity>
                        )}
                        <View style={{ paddingLeft: 10, justifyContent: 'center' }}>
                            <TextInput placeholder='Group Name'
                                style={{ textAlignVertical: 'center' }}
                                onChange={(e) => e.nativeEvent.text ? [setGroupName(e.nativeEvent.text), setGroupnameErr('')] : setGroupnameErr(ErrorText.GroupNameRequired)}
                                placeholderTextColor="#888"
                                value={groupName}
                            />
                        </View>
                    </View>
                    <Text style={{ color: 'red', marginHorizontal: 10 }}>{GroupnameErr}</Text>
                    <View style={{ backgroundColor: '#F1F3F4', margin: 10, flexDirection: 'row', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }}>

                        <View style={{ alignItems: 'center', paddingLeft: 10, padding: 2, }}>
                            <TextInput
                                placeholder='Group Description'
                                onChange={(e) => e.nativeEvent.text ? [setGroupDescription(e.nativeEvent.text), setGroupdescErr('')] : setGroupdescErr(ErrorText.GroupDescRequired)}
                                multiline={true}
                                numberOfLines={4}
                                placeholderTextColor="#888"
                                maxLength={100}
                                style={[styles.selectedTextStyle2, { textAlignVertical: 'top', }]}
                                value={groupDescription}
                            />
                        </View>
                    </View>
                    <Text style={{ color: 'red', marginHorizontal: 10 }}>{GroupdescErr}</Text>
                    <View>
                        <Text style={{ fontFamily: 'Montserrat-Medium', margin: 10 }}>Group Members</Text>
                        <View>
                            {
                                pageName === 'editgroup' ? <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                    <TouchableOpacity onPress={() => setis_addnewMem(true)}>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={50}
                                            height={50}
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

                                    <Text style={{ fontFamily: 'Montserrat-Medium', textAlign: 'center', margin: 10 }}>Add Members</Text>
                                </View>
                                    : null
                            }
                            {
                                Data?.length > 0 &&
                                <SafeAreaView>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <FlatList
                                            keyExtractor={item => item.friend_list_id}
                                            data={Data}
                                            renderItem={item => (
                                                <GroupMemberRenderItem item={item} parameter={pageName === 'creategroup' || pageName === 'editgroup' ? 'display_members_create' : 'display_members_edit'} />
                                            )}
                                            // contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                                            nestedScrollEnabled={true}
                                        />
                                    </ScrollView>
                                </SafeAreaView>

                            }


                            {
                                MyfriendList?.length > 0 &&

                                <SafeAreaView>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <FlatList
                                            keyExtractor={item => item.friend_list_id}
                                            data={MyfriendList}
                                            renderItem={item => (
                                                <GroupMemberRenderItem item={item} parameter={pageName === 'creategroup' || pageName === 'editgroup' ? 'display_members_create' : 'display_members_edit'} />
                                            )}
                                            // contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                                            nestedScrollEnabled={true}
                                        />
                                    </ScrollView>
                                </SafeAreaView>

                            }
                        </View>
                    </View>

                    <View>
                        <Text style={{ fontFamily: 'Montserrat-Medium', margin: 10 }}>Group Settings</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                            <Text style={{
                                color: '#436077',
                                fontFamily: 'Montserrat-Bold',
                                fontSize: 16, margin: 10,
                            }}>Public Group</Text>
                            <Switch
                                value={checkedPublic}
                                onValueChange={value => {
                                    setCheckedPublic(value);
                                }}
                                color="#436077"
                            />
                        </View>

                    </View>

                </View>

            </ScrollView>
            <View style={[styles.joinBtn2, { flexDirection: 'row', justifyContent: 'space-between', }]}>
                <TouchableOpacity onPress={() => { navigation.navigate('Messages', { screen: 'AddMemberstoGroup' }) }}>
                    <Text style={[styles.homecardtext1, { color: '#ffffff', margin: 10, opacity: 0.6, marginLeft: 20, }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUpdateGroup()}>
                    <Text style={[styles.homecardtext1, { color: '#ffffff', marginRight: 20, }]}>Update</Text>
                </TouchableOpacity>
            </View>

            <BottomSheet modalProps={{}} isVisible={isVisible}>
                <ScrollView
                    style={[styles.bottomsheetmainsmall]}
                    showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => setIsVisible(false)}>
                        <Ionicons name="close-outline" size={30} color="#B85A57"></Ionicons>
                    </TouchableOpacity>
                    <View style={styles.space20}></View>
                    <View>
                        <Text style={styles.createacc}>Upload Group Image</Text>
                    </View>
                    <View style={styles.space20}></View>

                    <View style={styles.uploadphotomain}>
                        <View style={styles.uploadphotoinner}>
                            <TouchableOpacity
                                onPress={() => chooseCamera()}
                                style={{ alignItems: 'center' }}>
                                <Svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    id="Circle-Turquoise-Blue"
                                    viewBox="0 0 48 48"
                                    width={50}
                                    height={50}>
                                    <Defs></Defs>
                                    <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                                    <Path
                                        className="cls-2"
                                        d="M36.48 15.29h-5.67c-.43-1.65-1.13-3.56-3.26-3.56h-7.1c-2.15 0-2.84 1.91-3.26 3.56h-5.67c-1.39 0-2.52 1.13-2.52 2.52v15.95c0 1.39 1.13 2.52 2.52 2.52h24.95c1.39 0 2.52-1.13 2.52-2.52V17.84c0-1.4-1.13-2.54-2.52-2.54zm1.02 18.46c0 .56-.46 1.02-1.02 1.02H11.52c-.56 0-1.02-.46-1.02-1.02V17.8c0-.56.46-1.02 1.02-1.02h6.25c.35 0 .65-.24.73-.57.51-2.11.9-2.99 1.95-2.99h7.1c1.04 0 1.43.88 1.95 2.99.08.33.38.57.73.57h6.25c.56 0 1.02.48 1.02 1.04v15.92z"
                                    />
                                    <Path
                                        className="cls-2"
                                        d="M24 19.28c-3.6 0-6.54 2.92-6.54 6.51S20.39 32.3 24 32.3s6.54-2.92 6.54-6.51-2.93-6.51-6.54-6.51zm0 11.52c-2.78 0-5.04-2.25-5.04-5.01s2.26-5.01 5.04-5.01 5.04 2.25 5.04 5.01S26.78 30.8 24 30.8z"
                                    />
                                </Svg>
                                <Text style={styles.uploadtext}>Camera</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.uploadphotoinner}>
                            <TouchableOpacity
                                onPress={() => chooseGallery()}
                                style={{ alignItems: 'center' }}>
                                <Svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    id="Circle-Turquoise-Blue"
                                    viewBox="0 0 48 48"
                                    width={50}
                                    height={50}>
                                    <Circle cx={24} cy={24} r={24} fill="#92bcbf" />
                                    <Path
                                        className="cls-2"
                                        d="M17.3 19.39l5.97-5.93v15.81c0 .4.33.72.73.72s.73-.33.73-.72V13.46l5.97 5.93c.28.27.76.27 1.03 0 .14-.14.21-.32.21-.51s-.08-.38-.21-.51l-7.21-7.16c-.28-.27-.76-.27-1.03 0l-7.21 7.16c-.14.14-.21.32-.21.51s.08.38.21.51c.29.28.75.28 1.03 0z"
                                    />
                                    <Path
                                        className="cls-2"
                                        d="M35.25 29c-.41 0-.75.34-.75.75v3.75h-21v-3.75c0-.41-.34-.75-.75-.75s-.75.34-.75.75v4.5c0 .41.34.75.75.75h22.5c.41 0 .75-.34.75-.75v-4.5c0-.41-.34-.75-.75-.75z"
                                    />
                                </Svg>
                                <Text style={styles.uploadtext}>Upload</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.space20}></View>
                    <View style={styles.space20}></View>
                    <View style={styles.space20}></View>
                    <View style={styles.space20}></View>
                    <View style={styles.space20}></View>

                </ScrollView>
            </BottomSheet>


            {is_addnewMem && (
                <EditMemberstoGroup
                    is_addnewMem={is_addnewMem}
                    setis_addnewMem={setis_addnewMem}
                    pageName={pageName}
                    groupId={groupId}
                    members_added={Data}
                />
            )}

        </>
    )
}

export default EditGroup;