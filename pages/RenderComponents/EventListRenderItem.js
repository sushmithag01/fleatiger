import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from '../../Common.css';
import LikeRenderItem from './LikeRenderItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EventMemberRenderItem from './EventMemberRenderItem';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventListRenderItem = ({ item, groupId }) => {
    const navigation = useNavigation();
    const [is24Format, setIs24Format] = useState(null);

    useEffect(() => {
        getTime();
    }, [is24Format])

    const getTime = async () => {
        const gettimeformat = await AsyncStorage.getItem('selected_time_format');
        const is24Hour = JSON.parse(gettimeformat);
        setIs24Format(is24Hour);
    }

    return (
        <>
            <View style={{ backgroundColor: '#F1F3F4', padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                <View style={{ width: 70, height: 70, backgroundColor: '#fff', borderRadius: 10, margin: 10, borderStyle: 'solid', overflow: 'hidden', }}>
                    <Text style={{ backgroundColor: '#436077', color: '#fff', fontFamily: 'Montserrat-Medium', textAlign: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10, padding: 2, overflow: 'hidden' }}>
                        {moment(item?.item?.meeting_date).format("MMM").toUpperCase()}
                    </Text>
                    <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', textAlign: 'center', fontSize: 16, padding: 2 }}>
                        {moment(item?.item?.meeting_date).format("DD")}
                    </Text>
                    <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', textAlign: 'center', fontSize: 14, paddingBottom: 2 }}>
                        {moment(item?.item?.meeting_date).format("ddd").toUpperCase()}
                    </Text>
                </View>
                <View>
                    <View>
                        <Text style={{ color: '#436077', fontFamily: 'Montserrat-Bold', fontSize: 16 }}>{item?.item?.event_name}</Text>
                        <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', fontSize: 12 }}>
                            {
                                is24Format?.time_format_name === '24-hour' || is24Format === null ?
                                    moment(item?.item?.start_time, "hh:mm:ss").format("HH:mm").toUpperCase()
                                    :
                                    moment(item?.item?.start_time, "hh:mm:ss").format("hh:mm A").toUpperCase()
                            }
                            -
                            {
                                is24Format?.time_format_name === '24-hour' || is24Format === null ?
                                    moment(item?.item?.end_time, "hh:mm:ss").format("HH:mm").toUpperCase()
                                    :
                                    moment(item?.item?.end_time, "hh:mm:ss").format("hh:mm A").toUpperCase()
                            }
                        </Text>
                    </View>
                    {/* <SafeAreaView>
                        <View style={{ flexDirection: 'row' }}>
                            <FlatList
                                keyExtractor={item => item.profile}
                                data={item?.item?.event_members}
                                renderItem={item =>
                                (item?.index < 3 ? <EventMemberRenderItem
                                    item={item}
                                /> : null)
                                }
                                contentContainerStyle={{
                                    flexDirection: 'row',
                                    width: '100%',
                                }}
                                nestedScrollEnabled={true}
                            />
                            <Text style={{ fontSize: 12, padding: 3 }}> 3 people are joined</Text>
                        </View>
                    </SafeAreaView> */}



                </View>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('EventInfo', { eventId: item?.item?.event_id, groupId: groupId })}>
                    <Ionicons
                        color="#223656"
                        name="chevron-forward"
                        size={30}
                    />
                </TouchableOpacity>

            </View>
        </>

    )
}

export default EventListRenderItem