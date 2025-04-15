import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import styles from '../Common.css';
import Svg, {
    Circle, Path, G,
    Defs,
} from "react-native-svg";
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import GooglePlacesInput from './Maps/GooglePlacesInput';
import { CreateEventApi, getActivityTypeApi } from './API/ApiCalls';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CreateGroupHeaderLeft } from '../navigation/CustomBackNavigation';
import ErrorText from './ErrorText/ErrorText';
import Toast from 'react-native-root-toast';

const CreateEvent = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const [date, setDate] = useState(new Date());
    const [groupId, setGroupId] = useState('');
    const [eventSatrtTime, setEventSatrtTime] = useState('Satrt Time');
    const [eventEndTime, setEventEndTime] = useState('End Time');
    const [eventDateOpen, setEventDateOpen] = useState(false);
    const [eventDate, setEventDate] = useState('Select Date');
    const [is24Format, setIs24Format] = useState('');
    const [eventStartOpen, setEventStartOpen] = useState(false);
    const [eventEndOpen, setEventEndtOpen] = useState(false);
    const [eventLocation, setEventLocation] = useState('');
    const [ActivityType, setActivityType] = useState([]);
    const [ActivityTypeName, setActivityTypeName] = useState('');
    const [ActivityTypeId, setActivityTypeId] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventNameErr, setEventNameErr] = useState('');
    const [eventDesc, setEventDesc] = useState('')
    const [eventDateErr, setEventDateErr] = useState('');
    const [eventSatrtTimeErr, setEventSatrtTimeErr] = useState('');
    const [eventEndTimeErr, setEventEndTimeErr] = useState('');
    const [eventLocationErr, setEventLocationErr] = useState('');

    useEffect(() => {
        if (isFocused) {

            navigation.setOptions({
                headerLeft: () => <CreateGroupHeaderLeft navigation={navigation} />,

            });
            setGroupId(route.params.groupId)
        }

    }, [isFocused, route]);

    useEffect(() => {
        getTimeFormatFromLocal();
        GetActivityTypeList();
    }, [])
    const getTimeFormatFromLocal = async () => {
        const gettimeformat = await AsyncStorage.getItem('selected_time_format');
        const is24Hour = JSON.parse(gettimeformat);
        setIs24Format(is24Hour);
    }

    const handleConfirm = async (selectedDate, parameter) => {
        setDate(selectedDate)
        const gettimeformat = await AsyncStorage.getItem('selected_time_format');
        const is24Hour = JSON.parse(gettimeformat);
        setEventDateOpen(false);
        setEventStartOpen(false);
        if (parameter === 'date') {
            // Formatting the date (YYYY-MM-DD)
            const formattedDate =
                moment(selectedDate).format('YYYY-MM-DD')
            setEventDate(formattedDate);
        } else if (parameter.includes("time")) {
            // Formatting the time in 12-hour or 24-hour format
            let hours = selectedDate.getHours();
            let minutes = selectedDate.getMinutes().toString().padStart(2, '0');
            let formattedTime = '';
            if (is24Hour === null || is24Hour.time_format_name === '24-hour') {
                // 24-hour format
                formattedTime = hours.toString().padStart(2, '0') + ':' + minutes;
            } else {
                // 12-hour format with AM/PM
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12; // Convert to 12-hour format
                formattedTime = hours + ':' + minutes + ' ' + ampm;
            }
            if (parameter === 'starttime') {
                setEventSatrtTime(formattedTime);
            } else {
                setEventEndTime(formattedTime);
            }

        }

    };

    const GetActivityTypeList = async () => {
        const payload = {
            user_id: await AsyncStorage.getItem('userId'),
            pet_id: await AsyncStorage.getItem('PetId'),
        };
        const Response = await getActivityTypeApi(payload);
        if (Response.status) {
            setActivityType(Response?.data);
        } else {
            setActivityType([])
        }

    };

    const handleCreateEvent = async () => {
        if (!eventName) {
            setEventNameErr(ErrorText.EventNameRequired)
        } else {
            setEventNameErr('')
        }
        if (!eventLocation) {
            setEventLocationErr(ErrorText.EventLocationRequired)
        } else {
            setEventLocationErr('')
        }
        if (!dateRegex.test(eventDate)) {
            setEventDateErr(ErrorText.EventDateRequired)
        } else {
            setEventDateErr('')
        }
        if (eventSatrtTime === 'Satrt Time' || eventSatrtTime === '') {
            setEventSatrtTimeErr(ErrorText.EventStartTimeRequired)
        } else {
            setEventSatrtTimeErr('')
        }
        if (eventEndTime === 'End Time' || eventEndTime === '') {
            setEventEndTimeErr(ErrorText.EventEndTimeRequired)
        } else {
            setEventEndTimeErr('')
        }

        if (eventDateErr === '' && eventEndTimeErr === '' && eventLocationErr === '' && eventSatrtTimeErr === '' && eventNameErr === '') {
            let payload = {
                group_id: groupId,
                event_name: eventName,
                event_description: eventDesc,
                meeting_date: eventDate,
                start_time: eventSatrtTime,
                end_time: eventEndTime,
                location: eventLocation,
                activity: ActivityTypeId,
                user_id: await AsyncStorage.getItem('userId'),
                created_by_pet_id: await AsyncStorage.getItem('PetId')
            }
            const responseData = await CreateEventApi(payload);
            if(responseData.status === 200){
                navigation.navigate("Messages", { screen: 'GroupInner', params: { groupId: groupId } });
            }
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
           
            setEventDate('');
            setEventName('');
            setEventDesc('');
            setEventSatrtTime('')
            setEventEndTime('')
            setEventLocation('')
        } else {
         
        }

    }

    const handleLocation = (data)=>{
        setEventLocation(data)
        setEventLocationErr('')
    }

    return (
        <>
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <View style={{ margin: 20, }}>
                    <Text style={{ fontFamily: 'Montserrat-medium', textAlign: 'center', margin: 10, color: '#436077', fontSize: 20 }}>New Event</Text>
                    <View style={styles.marginhz15}>
                        <Text style={styles.addmanuallytext}>Event Name</Text>
                        <View style={[styles.inputContainer1]}>
                            <TextInput
                                placeholder="Event Name"
                                style={styles.selectedTextStyle2}
                                maxLength={50}
                                value={eventName}
                                onChange={
                                    (e) => e.nativeEvent.text ?
                                        [setEventName(e.nativeEvent.text), setEventNameErr('')]
                                        :
                                        [setEventName(), setEventNameErr(ErrorText.EventNameRequired)]
                                }
                            />
                        </View>
                        {
                            eventNameErr ? <Text style={{ color: 'red', }}>{eventNameErr}</Text> : null
                        }

                    </View>

                    <View style={[styles.space20, { height: 10 }]}></View>
                    <View style={styles.marginhz15}>
                        <Text style={styles.addmanuallytext}>Event Description</Text>
                        <View style={[styles.inputContainer1]}>
                            <TextInput
                                placeholder="Event Description"
                                style={styles.selectedTextStyle2}
                                maxLength={200}
                                multiline={true}
                                value={eventDesc}
                                onChange={
                                    (e) => e.nativeEvent.text ?
                                        [setEventDesc(e.nativeEvent.text)]
                                        :
                                        [setEventDesc()]
                                }
                            />
                        </View>
                    </View>
                    <View style={styles.space20}></View>
                    <View>
                        <Text style={[styles.addmanuallytext, { marginHorizontal: 20 }]}>Event Start Time</Text>
                        <View style={[styles.marginhz15, { flexDirection: 'row', gap: 10 }]}>
                            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={50} height={50}>
                                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                                <Path
                                    d="M14.75 27.3h3.7c.34 0 .62-.28.62-.62v-3.7c0-.29-.27-.62-.62-.62h-3.7c-.34 0-.62.28-.62.62v3.7c0 .29.27.62.62.62zM22.15 27.3h3.7c.34 0 .62-.28.62-.62v-3.7c0-.29-.27-.62-.62-.62h-3.7c-.34 0-.62.28-.62.62v3.7c0 .29.27.62.62.62zM29.55 27.3h3.7c.34 0 .62-.28.62-.62v-3.7c0-.29-.27-.62-.62-.62h-3.7c-.34 0-.62.28-.62.62v3.7c0 .29.27.62.62.62zM29.55 34.57h3.7c.34 0 .62-.28.62-.62v-3.7c0-.29-.27-.62-.62-.62h-3.7c-.34 0-.62.28-.62.62v3.7c0 .29.27.62.62.62zM14.75 34.71h3.7c.34 0 .62-.28.62-.62v-3.7c0-.29-.27-.62-.62-.62h-3.7c-.34 0-.62.28-.62.62v3.7c0 .29.27.62.62.62zM22.15 34.71h3.7c.34 0 .62-.28.62-.62v-3.7c0-.29-.27-.62-.62-.62h-3.7c-.34 0-.62.28-.62.62v3.7c0 .29.27.62.62.62z"
                                    fill="#223656"
                                    strokeWidth={0}
                                />
                                <Path
                                    d="M34.31 12.47H31.1V10.9c0-.24-.1-.48-.3-.66a.874.874 0 00-.68-.23c-.43.05-.79.45-.78.88v1.58H18.56V10.9c0-.24-.1-.48-.3-.66a.9.9 0 00-.68-.23c-.43.05-.79.45-.78.88v1.58h-3.1c-2.04 0-3.7 1.66-3.7 3.7v18.12c0 2.04 1.66 3.7 3.7 3.7h20.6c2.04 0 3.69-1.66 3.69-3.7V16.17c0-2.04-1.66-3.7-3.69-3.7zm-22.67 8.34h24.72V34.3c0 1.14-.92 2.06-2.05 2.06H13.7c-1.14 0-2.06-.93-2.06-2.06V20.81zm5.4-4.53l.09.1c.12.11.31.18.5.19h.1c.21-.01.41-.11.57-.27.17-.17.26-.4.26-.62V14.1h10.78v1.57c0 .23.09.45.26.62.16.16.36.25.6.27h.08c.2-.02.39-.1.54-.25.18-.19.27-.41.27-.63V14.1h3.21c1.13 0 2.05.92 2.05 2.06v2.99H11.64v-2.99c0-1.14.93-2.06 2.06-2.06h3.1v1.57c0 .23.09.45.23.59z"
                                    fill="#223656"
                                    strokeWidth={0}
                                />
                            </Svg>
                            <TouchableOpacity onPress={() => setEventDateOpen(!eventDateOpen)} style={[styles.inputContainer1, { width: '82%', justifyContent: 'center' }]}>
                                <View >
                                    <Text style={[styles.selectedTextStylePlace, { textAlignVertical: 'center' }]}>
                                        {eventDate}
                                    </Text>
                                    <DatePicker
                                        is24HourFormat={true}
                                        modal
                                        open={eventDateOpen}
                                        date={date}
                                        mode="date"
                                        title="Select Date"
                                        value={date}
                                        locale={is24Format?.time_format_name === '24-hour' ? "en_GB" : "en_IN"}
                                        // locale="en_IN"
                                        // maximumDate={new Date()}
                                        is24hourSource="locale"
                                        // timeZoneOffsetInMinutes={0}
                                        onConfirm={(e) => [handleConfirm(e, "date"), setEventDateErr('')]}
                                        onCancel={() => {
                                            [setEventDateOpen(false),]
                                        }}
                                    />
                                </View>

                            </TouchableOpacity>

                        </View>

                    </View>
                    {
                        eventDateErr ? <Text style={{ color: 'red', marginHorizontal: 30 }}>{eventDateErr}</Text> : null
                    }

                    <View style={styles.space20}></View>
                    <View>
                        <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
                            <Text style={[styles.addmanuallytext, { marginLeft: 60 }]}>Event Start Time</Text>
                            <Text style={[styles.addmanuallytext, { marginRight: 10 }]}>Event End Time</Text>
                        </View>

                        <View style={[styles.marginhz15, { flexDirection: 'row', gap: 10 }]}>
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
                            <TouchableOpacity onPress={() => setEventStartOpen(!eventStartOpen)} style={[styles.inputContainer1, { width: '40%', justifyContent: 'center' }]}>
                                <View >
                                    <Text style={[styles.selectedTextStylePlace, { textAlignVertical: 'center' }]}>
                                        {eventSatrtTime}
                                    </Text>
                                    <DatePicker
                                        is24HourFormat={true}
                                        modal
                                        open={eventStartOpen}
                                        date={date}
                                        mode="time"
                                        title="Select Time"
                                        value={date}
                                        locale={is24Format?.time_format_name === '24-hour' ? "en_GB" : "en_IN"}
                                        // locale="en_IN"
                                        // maximumDate={new Date()}
                                        is24hourSource="locale"
                                        // timeZoneOffsetInMinutes={0}
                                        onConfirm={(e) => [handleConfirm(e, "starttime"),setEventSatrtTimeErr('')]}
                                        onCancel={() => {
                                            setEventStartOpen(false);
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setEventEndtOpen(!eventEndOpen)} style={[styles.inputContainer1, { width: '40%', justifyContent: 'center' }]}>
                                <View >
                                    <Text style={[styles.selectedTextStylePlace, { textAlignVertical: 'center' }]}>
                                        {eventEndTime}
                                    </Text>
                                    <DatePicker
                                        is24HourFormat={true}
                                        modal
                                        open={eventEndOpen}
                                        date={date}
                                        mode="time"
                                        title="Select Time"
                                        value={date}
                                        locale={is24Format?.time_format_name === '24-hour' ? "en_GB" : "en_IN"}
                                        // locale="en_IN"
                                        // maximumDate={new Date()}
                                        is24hourSource="locale"
                                        // timeZoneOffsetInMinutes={0}
                                        onConfirm={(e) => [handleConfirm(e, "endtime"),setEventEndTimeErr('')]}
                                        onCancel={() => {
                                            setEventEndtOpen(false);
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 5 }}>
                            {eventSatrtTimeErr ? <Text style={{ color: 'red', }}>{eventSatrtTimeErr}</Text> : null}
                            {eventEndTimeErr ? <Text style={{ color: 'red', }}>{eventEndTimeErr}</Text> : null}
                        </View>

                    </View>
                    <View style={styles.space20}></View>
                    <View>
                        <Text style={[styles.addmanuallytext, { marginHorizontal: 20 }]}>Select Activity</Text>
                        <View style={[styles.marginhz15, { flexDirection: 'row', gap: 10 }]}>
                            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={50} height={50}>
                                <Circle cx={24} cy={24} r={24} fill="#92bcbf" strokeWidth={0} />
                                <Path
                                    d="M34.32 26.89l-8.06-6.8a3.494 3.494 0 00-4.51 0l-8.06 6.8a5.503 5.503 0 00-1.96 4.2c0 1.85.93 3.57 2.49 4.6l2.73 1.8c1.08.72 2.47.77 3.61.15l2.57-1.41c.55-.3 1.21-.3 1.76 0l2.57 1.41a3.5 3.5 0 003.61-.15l2.73-1.8a5.48 5.48 0 002.49-4.6c0-1.62-.71-3.15-1.96-4.2zM13.46 24.43c.21 0 .42-.03.62-.07 1.4-.33 2.45-1.78 2.45-3.52s-1.05-3.18-2.45-3.52c-.2-.05-.41-.07-.62-.07-.42 0-.83.1-1.19.28-.55.27-1.02.73-1.35 1.3a3.997 3.997 0 00-.52 2.01c0 1.24.54 2.33 1.35 2.98.49.39 1.08.61 1.71.61zM36.7 18.3c-.55-.65-1.32-1.05-2.17-1.05-1.69 0-3.06 1.61-3.06 3.59s1.37 3.59 3.06 3.59 3.06-1.61 3.06-3.59c0-.99-.34-1.89-.9-2.54zM19.53 18.05c.49 0 .95-.11 1.37-.31.42-.2.8-.49 1.12-.86.64-.72 1.03-1.72 1.03-2.82 0-2.2-1.58-3.99-3.53-3.99s-3.53 1.79-3.53 3.99 1.58 3.99 3.53 3.99zM28.39 18.05c1.95 0 3.53-1.79 3.53-3.99s-1.58-3.99-3.53-3.99c-.49 0-.95.11-1.37.31-.42.2-.8.49-1.12.86-.64.72-1.03 1.72-1.03 2.82 0 2.2 1.58 3.99 3.53 3.99z"
                                    fill="#223656"
                                    strokeWidth={0}
                                />
                            </Svg>
                            <View style={[styles.inputunitContainer3, styles.acttype, { width: '84%' }]}>
                                <Dropdown
                                    search={true}
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyleunit}
                                    selectedTextStyle={styles.selectedTextStyleunit}
                                    inputSearchStyle={styles.inputSearchStyle1}
                                    baseColor={'#000000'}
                                    labelStyle={{ color: 'black' }}
                                    data={ActivityType}
                                    maxHeight={150}
                                    labelField="activity_type_name"
                                    valueField="activity_type_id"
                                    placeholder="Activity Type"
                                    itemTextStyle={styles.activitylabel}
                                    // value={ActivityName}
                                    onChange={item => {
                                        setActivityTypeId(item.activity_type_id);
                                        setActivityTypeName(item.activity_type_name);

                                    }}
                                />
                            </View>
                        </View>
                    </View>


                    <View style={styles.space20}></View>
                    <View>
                        <Text style={[styles.addmanuallytext, { marginHorizontal: 20 }]}>Add Location</Text>
                        <View style={[styles.marginhz15, { flexDirection: 'row', gap: 10 }]}>
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
                            <View style={[styles.inputContainer1, { width: '84%' }]}>
                                <GooglePlacesInput
                                    setLocation={handleLocation}
                                    location={eventLocation}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        eventLocationErr ? <Text style={{ color: 'red', marginHorizontal: 80 }}>{eventLocationErr}</Text> : null
                    }

                </View>
            </ScrollView>
            <View style={[styles.joinBtn, { flexDirection: 'row', justifyContent: 'space-between', padding: 5 }]}>
                <TouchableOpacity>
                    <Text style={[styles.homecardtext1, { color: '#ffffff', margin: 10, textAlign: 'center' }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCreateEvent()}>
                    <Text style={[styles.homecardtext1, { color: '#ffffff', margin: 10, textAlign: 'center' }]}>Save</Text>
                </TouchableOpacity>
            </View>
        </>

    )
}

export default CreateEvent