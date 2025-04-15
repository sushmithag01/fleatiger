import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../Common.css'
import { chatHighlightApi, DeleteActivityAPI } from '../API/ApiCalls';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Screen } from 'react-native-screens';
import { Alert } from 'react-native';

function GroupChatListRenderItem({ item, chatType }) {
    const navigation = useNavigation();
    const [chatHighlight, setchatHighlight] = useState([]);

    useEffect(() => {
        notificationHilightHandler();
    }, [])

    const handleChatRoom = (data, chatType) => {
        if (chatType === 1) {
            const props = {
                group_desc: data?.description,
                group_name: data?.group_name,
                group_id: data?.group_id,
                group_type: data?.group_type,
                group_admin: data?.created_by,
                group_image: data?.group_image
            }
            navigation.navigate('GroupChat', { userInfo: props, chat_type: chatType });
        } else {
            const props = {
                friend_list_id: data.friend_list_id,
                location: data.location,
                pet_id: data.pet_id,
                pet_image_path: data.pet_image_path,
                pet_name: data.pet_name,
            };
            navigation.navigate('Chat', { userInfo: props, chat_type: chatType });
        }





    };

    const handleProfile = async (data, chatType) => {
        if (chatType === 1) {
            navigation.navigate('Messages', { screen: 'GroupInner', params: { groupId: data.group_id } });
        } else {
            navigation.navigate('FriendProfile', {
                friendId: data?.pet_id,
                pageName: 'chatListing',
            });
        }

    }
    // hightlight chat based on unread notification
    const notificationHilightHandler = async () => {
        let payload = {
            pet_id: parseInt(await AsyncStorage.getItem('PetId')),
            user_id: await AsyncStorage.getItem('userId'),
            notify_type_id: 'chat',
        };
        const gethiglight = await chatHighlightApi(payload);
        setchatHighlight(gethiglight.data);
    };
    const chatTimeCal = moment(item?.item?.chat_updated_at).format('DD-MM-YYYY');
    const todayDate = moment(new Date()).format('DD-MM-YYYY');
    const getTime = moment(item?.item?.chat_updated_at).format('LT');
    const getDay = moment(item?.item?.chat_updated_at).format('ddd');
    const getDate = moment(item?.item?.chat_updated_at).format('MMM YYYY');
    const text = item?.item?.location;
    var location = '';
    if (/,/.test(text)) {
        var parts = text.split(','); // Split the string into an array of strings by character /
        var lastIndexOf = parts.length - 1; // Determine the last word's 0-based index in array (length -1)
        location = parts[lastIndexOf]; // Grab the last part of the array.
    } else {
        location = text;
    }

    const handleDeleteFromDb = async data => {
        const deleteChatRes = await DeleteActivityAPI(data).finally(() => {
            setLoading(false);
        });
        if (deleteChatRes.status === 200) {
            handleChatList();
            Toast.show(deleteChatRes.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: false,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            });
        } else {
            Toast.show(deleteChatRes.message, {
                duration: Toast.durations.LONG,
                position: 50,
                shadow: false,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000',
            });
        }
        console.log('deleteChatRes', deleteChatRes);
    };




    const handleFromFirebaseDelete = async data => {
        setLoading(true);
        async function massDeleteUsers() {
            // Get all users
            const usersQuerySnapshot = await firestore()
                .collection(data.channel_id)
                .get();

            // Create a new batch instance
            const batch = firestore().batch();

            usersQuerySnapshot.forEach(documentSnapshot => {
                batch.delete(documentSnapshot.ref);
            });

            return batch.commit();
        }

        massDeleteUsers().then(() => {
            let payload = {
                channel_id: data.channel_id,
            };
            console.log('All users deleted in a single batch operation.', payload);
            handleDeleteFromDb(payload);
        });
    };
    return (

        <>
            <TouchableOpacity onPress={() => item?.item?.membership_status === 'not member' ? Alert.alert("You can't send messages to this group because your'e no longera member") : handleChatRoom(item?.item, chatType)}>
                <View
                    style={[
                        styles.logmain,
                        styles.marginhz20,
                        styles.hrline,
                        // , { borderColor: "#223656", borderRadius: 10, borderWidth: 3 }
                    ]}>
                    <View style={{ width: 0 }}>
                        {chatHighlight
                            .filter(data => item?.item?.channel_id === data.channel_id)
                            .map(data => (
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#4287f5',
                                        margin: 0,
                                    }}></View>
                            ))}
                    </View>

                    <View style={[styles.logmain2, styles.marbottom15]}>
                        <TouchableOpacity
                            onPress={() => handleProfile(item?.item, chatType)}>
                            <Image
                                source={
                                    item?.item?.group_image ? { uri: item?.item?.group_image } :
                                        require('../../assets/pic9.png')

                                }
                                style={styles.chatimg}></Image>
                        </TouchableOpacity>
                        <View style={{ width: 125 }}>
                            <Text style={styles.homecardtext1}>{item?.item?.group_name}</Text>
                            {/* <Text style={styles.logdate}>{location}</Text> */}
                        </View>
                    </View>
                    <View></View>
                    <View>
                        <Text style={styles.chattime}>
                            {todayDate === chatTimeCal ? getTime : getDay}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}

export default GroupChatListRenderItem