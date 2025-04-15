import React, { useEffect, useState } from 'react'
import { Tab, Text, TabView } from '@rneui/themed';
import ChatListRenderItem from '../RenderComponents/ChatListRenderItem';
import { chatHighlightApi, getChatListApi, getgroupChatListApi } from '../API/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import styles from '../../Common.css'
import { SafeAreaView } from 'react-native';
import Search from '../SearchBar';
import GroupChatListRenderItem from '../RenderComponents/GroupChatListRenderItem';

function ChatComponent({ index_val }) {
    const isFocused = useIsFocused();
    const [index, setIndex] = useState(index_val);
    const [chatData, setMyFriendList] = useState([]);
    const [GlobalMyfriendList, setGlobalMyFriendList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupsChat, setGroupsChat] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isFocused) {
            handleChatList();
        }
    }, [isFocused, chatData])

    useEffect(() => {
        if (isFocused) {
            if (groupsChat.length <= 0) {
                handleGroupList();
            }
        }
    }, [groupsChat, isFocused])

    useEffect(() => {
        if (index === 0) {
            handleChatList();
        } else {
            handleGroupList();
        }
    }, [search, index])

    const handleChatList = async () => {
        setLoading(true);
        let payload = {
            // user_id: await AsyncStorage.getItem("userId"),
            pet_id: parseInt(await AsyncStorage.getItem('PetId'), 10),
            search: search,
        };
        const chatData = await getChatListApi(payload).finally(() => {
            setLoading(false);
        });
        if (chatData.status === 200) {
            setMyFriendList(chatData.pet_details.receiver_details);
            setGlobalMyFriendList(chatData.pet_details.receiver_details);
        } else {
            setMyFriendList([]);
            setGlobalMyFriendList([]);
        }
    };

    const handleGroupList = async () => {
        let payload = {
            // user_id: await AsyncStorage.getItem("userId"),
            pet_id: parseInt(await AsyncStorage.getItem('PetId'), 10),
            search: search,
        };

        const responsedata = await getgroupChatListApi(payload);
        if (responsedata.status === 200) {
            setGroupsChat(responsedata.data)
        } else {
            setGroupsChat([]);
        }
    }

    return (
        <>
            <Search search={search} setSearch={setSearch} placeholdertext={index === 0 ? "Find your BFF here" : "Find your Squad here"} />
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
                        title="My Chats"
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
                        title="Groups Chat"
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
                {index === 0 ? (
                    <SafeAreaView>
                        <FlatList
                            keyExtractor={item => item.chat_id}
                            data={chatData}
                            renderItem={item => (
                                <ChatListRenderItem item={item} chatType={0} />
                            )}
                            // contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                            nestedScrollEnabled={true}
                            horizontal={false}
                        />
                    </SafeAreaView>) : (<SafeAreaView>
                        <FlatList
                            keyExtractor={item => item.chat_id}
                            data={groupsChat}
                            renderItem={item => (
                                <GroupChatListRenderItem item={item} chatType={1} />
                            )}
                            // contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                            nestedScrollEnabled={true}
                            horizontal={false}
                        />
                    </SafeAreaView>)}
            </View>

        </>
    )
}

export default ChatComponent