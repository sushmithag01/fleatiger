import React,{useEffect,useState} from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from "../Common.css"
import Entypo from "react-native-vector-icons/Entypo"
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import Svg, { Path, G, Defs, ClipPath, Circle, Mask, Pattern, Use, xlinkHref, style } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from '@react-navigation/native';
import AddNewChat from './AddNewChat';

const ChatTopHeader = (props) => {
    const [openFriendList ,setopenFriendList]=useState(false);
    const navigation = useNavigation();

    const handleRequestNewChat=()=>{
        setopenFriendList(!openFriendList)
    } 
    return (
        <>
            <View style={styles.chattopheader}>
                {/* <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Entypo name="menu" size={30} color="#CE5757"></Entypo>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={()=>handleRequestNewChat()}>
                    <Svg
                        id="icons-RZ_Blau"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 50 50"
                        width={40}
                        height={40}
                    >
                        <Defs></Defs>
                        <Circle cx={25.01} cy={25} r={24} fill="#92bcbf" />
                        <Path
                            className="cls-2"
                            d="M23.94 17.45a.939.939 0 10-1.88 0 .939.939 0 101.88 0z"
                        />
                        <Path
                            className="cls-2"
                            d="M35.19 16.45l-.2-2.01a1.432 1.432 0 00-1.7-1.25l-6.47 1.85-2.08-.96c-.94-.43-1.94-.65-2.98-.65-1.5 0-2.94.46-4.16 1.33l-1.7-3.65a.51.51 0 00-.45-.29c-.19 0-.37.12-.45.3l-1.55 3.48a3.58 3.58 0 00-.28 1.86l.26 2.05-1.76 6.36v.04c-.02.12 0 .24.06.34.07.12.17.2.3.23.05.02.11.02.16.02.26 0 .41-.2.46-.37l1.12-4.06.26 2.1c.03.25.24.44.49.44h.06c.13-.02.25-.08.33-.19.08-.1.12-.23.1-.37l-.84-6.72c-.05-.46.01-.92.2-1.33l1.1-2.49 2.84 6.09c.08.17.26.29.45.29.07 0 .14-.02.21-.05.25-.12.36-.41.24-.66l-1.17-2.51a6.19 6.19 0 013.73-1.26c.89 0 1.75.19 2.56.56l2.25 1.04c.11.05.23.06.35.03l4.84-1.38A2.51 2.51 0 0034 16h.17l.06.56c.04.39-.15.76-.48.96l-6.26 3.76c-.17.1-.26.29-.24.49.03.2.16.36.36.41l6.07 1.74-.22.55c-.24.59-.8 1-1.44 1.04l-5.73.43a.47.47 0 00-.41.29L20.22 38.5c-.06.12-.06.26-.02.38.05.12.14.22.26.28a.493.493 0 00.66-.24l5.54-12 5.43-.4c1.01-.06 1.91-.71 2.29-1.65l.43-1.06c.05-.13.05-.28-.01-.4a.5.5 0 00-.31-.26l-5.51-1.57 5.27-3.17c.66-.4 1.04-1.15.96-1.92zM36.7 17.93c.1 0 .19-.03.23-.05l2.36-1.42c.11-.07.2-.18.23-.31a.51.51 0 00-.06-.38.495.495 0 00-.43-.24c-.09 0-.18.02-.26.07l-2.36 1.42c-.24.14-.31.45-.17.68.15.18.32.22.45.22zM39.51 19.31h-2.36c-.27 0-.5.22-.5.5s.22.5.5.5h2.36c.27 0 .5-.22.5-.5s-.22-.5-.5-.5zM36.59 21.37a.623.623 0 00-.4-.15c-.15 0-.28.06-.37.17-.17.21-.1.55.15.76l2.21 1.77c.12.1.26.15.4.15.15 0 .28-.06.37-.17.17-.21.1-.55-.15-.76l-2.21-1.77z"
                        />
                        <Path
                            className="cls-2"
                            d="M15 29.16c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm3.12 5.5H15.5v2.62c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-2.62h-2.62c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2.62v-2.62c0-.28.22-.5.5-.5s.5.22.5.5v2.62h2.62c.28 0 .5.22.5.5s-.22.5-.5.5z"
                        />
                    </Svg>
                </TouchableOpacity>
               {
                openFriendList && ( <AddNewChat openFriendList={openFriendList} handleRequestNewChat={handleRequestNewChat}
                />)}
            </View>
        </>
    )
}

export default ChatTopHeader