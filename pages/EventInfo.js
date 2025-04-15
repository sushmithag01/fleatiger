import React, { useState, useEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View, FlatList } from 'react-native'
import styles from '../Common.css';
import Svg, {
    Circle, Path, G,
    Defs,
} from "react-native-svg";
import GroupMemberRenderItem from './RenderComponents/GroupMemberRenderItem';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CreateGroupHeaderLeft } from '../navigation/CustomBackNavigation';
import { SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventInfoApi, EventJoinRequestApi } from './API/ApiCalls';
import moment from 'moment';
import Toast from 'react-native-root-toast';

const EventInfo = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [participants, setParticipants] = useState([]);
    const [event, setEvent] = useState('');
    const [is24Format, setIs24Format] = useState(null);

    useEffect(() => {
        if (isFocused) {
            getTime();
        }
    }, [isFocused, is24Format])

    const getTime = async () => {
        const gettimeformat = await AsyncStorage.getItem('selected_time_format');
        const is24Hour = JSON.parse(gettimeformat);
        setIs24Format(is24Hour);
    }


    useEffect(() => {
        if (isFocused) {
            navigation.setOptions({
                headerLeft: () => <CreateGroupHeaderLeft navigation={navigation} />,

            });

            handleEventInfo()
        }
    }, [isFocused, route]);

    const handleEventInfo = async () => {
        let payload = {
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            pet_id: parseInt(await AsyncStorage.getItem('PetId')),
            event_id: route?.params?.eventId,
            group_id: route?.params?.groupId,
        }
        const responseData = await EventInfoApi(payload)
        if (responseData.status === 200) {
            setEvent(responseData.data)
            setParticipants(responseData?.data?.participants)
        } else {
            setEvent('')
            setParticipants([])
        }
    }


    const handleEventRequest = async () => {
        let payload = {
            event_id: route?.params?.eventId,
            user_id: parseInt(await AsyncStorage.getItem('userId')),
            pet_id: parseInt(await AsyncStorage.getItem('PetId')),
        }
        const responseData = await EventJoinRequestApi(payload)
        handleEventInfo()
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
            <ScrollView style={{ backgroundColor: '#fff', }}>
                <View style={{ margin: 10, padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ width: 70, height: 70, backgroundColor: '#F1F3F4', borderRadius: 10, margin: 10, borderStyle: 'solid', overflow: 'hidden' }}>
                        <Text style={{ backgroundColor: '#436077', color: '#fff', fontFamily: 'Montserrat-Medium', textAlign: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10, padding: 2, overflow: 'hidden' }}>{moment(event?.meeting_date).format("MMM").toUpperCase()}</Text>
                        <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', textAlign: 'center', fontSize: 16, padding: 2 }}>{moment(event?.meeting_date).format("DD")}</Text>
                        <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', textAlign: 'center', fontSize: 14, paddingBottom: 2 }}>{moment(event.meeting_date).format("ddd").toUpperCase()}</Text>
                    </View>
                    <View>
                        <View>
                            <Text style={{ color: '#436077', fontFamily: 'Montserrat-Bold', fontSize: 16 }}>{event?.event_name}</Text>
                            <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', fontSize: 12 }}>
                                {
                                    is24Format === null || is24Format?.time_format_name === '24-hour' ?
                                        moment(event?.start_time, "hh:mm:ss").format("HH:mm").toUpperCase()
                                        :
                                        moment(event?.start_time, "HH:mm:ss").format("hh:mm A").toUpperCase()
                                }
                                -
                                {
                                    is24Format === null || is24Format?.time_format_name === '24-hour' ?
                                        moment(event?.end_time, "hh:mm:ss").format("HH:mm").toUpperCase()
                                        :
                                        moment(event?.end_time, "HH:mm:ss").format("hh:mm A").toUpperCase()
                                }</Text>
                        </View>
                    </View>

                </View>
                <View style={{ marginHorizontal: 20 }}>
                    {/* <Text style={{ color: '#436077', fontFamily: 'Montserrat-Bold', fontSize: 16 }}>Morning walk and coffee</Text> */}
                    <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', fontSize: 14, paddingVertical: 5 }}>{event?.event_description}</Text>
                </View>
                <View style={styles.space20}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.marginhz15,]}>
                        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={50} height={50}>
                            <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                            <Path
                                d="M29.99 25.47l-5.03-2.16v-8.14c0-.46-.37-.83-.83-.83s-.83.37-.83.83v8.69c0 .33.2.63.5.76l5.54 2.37c.11.04.21.07.32.07.33 0 .63-.2.77-.5a.834.834 0 00-.44-1.09z"
                                fill="#223656"
                                strokeWidth={0}
                            />
                            <Path
                                d="M24 10c-7.72 0-14 6.28-14 14s6.28 14 14 14 14-6.28 14-14-6.28-14-14-14zm0 26.32c-6.79 0-12.32-5.53-12.32-12.32S17.21 11.68 24 11.68 36.32 17.21 36.32 24 30.79 36.32 24 36.32z"
                                fill="#223656"
                                strokeWidth={0}
                            />
                        </Svg>


                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
                        <View style={{ backgroundColor: '#F1F3F4', padding: 10, width: 140, borderRadius: 10 }}>
                            <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', fontSize: 18, paddingVertical: 5 }}>  {
                                is24Format === null || is24Format?.time_format_name === '24-hour' ?
                                    moment(event?.start_time, "hh:mm:ss").format("HH:mm").toUpperCase()
                                    :
                                    moment(event?.start_time, "HH:mm:ss").format("hh:mm A").toUpperCase()
                            }</Text>
                        </View>
                        <View style={{ backgroundColor: '#F1F3F4', padding: 10, width: 140, borderRadius: 10 }}>
                            <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', fontSize: 18, paddingVertical: 5 }}> {
                                is24Format === null || is24Format?.time_format_name === '24-hour' ?
                                    moment(event?.end_time, "hh:mm:ss").format("HH:mm").toUpperCase()
                                    :
                                    moment(event?.end_time, "HH:mm:ss").format("hh:mm A").toUpperCase()
                            }</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.space20}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.marginhz15,]}>
                        <Svg
                            id="icons-RZ_Weiss"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 50 50"
                            width={50}
                            height={50}>
                            <Defs></Defs>
                            <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                            <Path
                                className="cls-1"
                                d="M25.31 39.88c.11-.11 10.2-10.22 10.2-18.68 0-3.74-1.16-6.75-3.36-8.7l-.02-.02c-1.81-1.61-4.34-2.49-7.14-2.49s-5.34.89-7.15 2.5c-2.2 1.95-3.37 4.96-3.37 8.7 0 8.46 10.04 18.51 10.14 18.61.12.12.28.2.42.18.11 0 .21-.05.27-.11zm-.96-1.86a51.192 51.192 0 01-3.93-4.91c-3.22-4.57-4.92-8.69-4.92-11.91 0-7.5 4.9-10.18 9.49-10.18 6.99 0 9.49 5.26 9.49 10.18 0 6.6-6.77 14.55-8.85 16.83l-.64.71-.64-.71z"
                                fill="#223656"
                            />
                            <Path
                                className="cls-1"
                                d="M25 14.15c-3.55 0-6.42 2.95-6.42 6.54s2.87 6.5 6.42 6.5 6.42-2.95 6.42-6.54-2.87-6.5-6.42-6.5z"
                                fill="#223656"
                            />
                        </Svg>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
                        <View style={{ backgroundColor: '#F1F3F4', padding: 10, width: '85%', borderRadius: 10 }}>
                            <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', fontSize: 14, paddingVertical: 5 }}>{event?.location}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.space20}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.marginhz15,]}>
                        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={50} height={50}>
                            <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                            <Path
                                d="M34.32 26.89l-8.06-6.8a3.494 3.494 0 00-4.51 0l-8.06 6.8a5.503 5.503 0 00-1.96 4.2c0 1.85.93 3.57 2.49 4.6l2.73 1.8c1.08.72 2.47.77 3.61.15l2.57-1.41c.55-.3 1.21-.3 1.76 0l2.57 1.41a3.5 3.5 0 003.61-.15l2.73-1.8a5.48 5.48 0 002.49-4.6c0-1.62-.71-3.15-1.96-4.2zM13.46 24.43c.21 0 .42-.03.62-.07 1.4-.33 2.45-1.78 2.45-3.52s-1.05-3.18-2.45-3.52c-.2-.05-.41-.07-.62-.07-.42 0-.83.1-1.19.28-.55.27-1.02.73-1.35 1.3a3.997 3.997 0 00-.52 2.01c0 1.24.54 2.33 1.35 2.98.49.39 1.08.61 1.71.61zM36.7 18.3c-.55-.65-1.32-1.05-2.17-1.05-1.69 0-3.06 1.61-3.06 3.59s1.37 3.59 3.06 3.59 3.06-1.61 3.06-3.59c0-.99-.34-1.89-.9-2.54zM19.53 18.05c.49 0 .95-.11 1.37-.31.42-.2.8-.49 1.12-.86.64-.72 1.03-1.72 1.03-2.82 0-2.2-1.58-3.99-3.53-3.99s-3.53 1.79-3.53 3.99 1.58 3.99 3.53 3.99zM28.39 18.05c1.95 0 3.53-1.79 3.53-3.99s-1.58-3.99-3.53-3.99c-.49 0-.95.11-1.37.31-.42.2-.8.49-1.12.86-.64.72-1.03 1.72-1.03 2.82 0 2.2 1.58 3.99 3.53 3.99z"
                                fill="#223656"
                                strokeWidth={0}
                            />
                        </Svg>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
                        <View style={{ backgroundColor: '#F1F3F4', padding: 10, width: '85%', borderRadius: 10 }}>
                            <Text style={{ color: '#436077', fontFamily: 'Montserrat-Medium', fontSize: 14, paddingVertical: 5 }}>{event?.activity}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.space20}></View>
                <View style={styles.space20}></View>
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ fontFamily: 'Montserrat-Medium', marginBottom: 10 }}>Who’s going</Text>
                    <View >
                        <SafeAreaView>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <FlatList
                                    keyExtractor={item => item.chat_id}
                                    data={participants}
                                    renderItem={item => (
                                        <GroupMemberRenderItem item={item} parameter={"display_members"} />
                                    )}
                                    // contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                                    nestedScrollEnabled={true}
                                    horizontal={false}
                                />
                            </ScrollView>
                        </SafeAreaView>

                    </View>
                </View>


            </ScrollView>
            {
                event?.status !== 'Member' ? <View style={[styles.joinBtn, { flexDirection: 'row', justifyContent: 'center', padding: 5 }]}>
                    <TouchableOpacity onPress={() => handleEventRequest()}>
                        <Text style={[styles.homecardtext1, { color: '#ffffff', margin: 10, textAlign: 'center', fontFamily: 'Montserrat-Bold', fontSize: 16 }]}>I'm In</Text>
                    </TouchableOpacity>

                </View> : null
            }

        </>
    )
}

export default EventInfo