import React from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native';
import styles from '../../Common.css';
import { useNavigation } from '@react-navigation/native';

const EventMemberRenderItem = ({ item }) => {
    const navigation = useNavigation();
    return (
        <>
            <TouchableOpacity
            >
                <View
                    style={
                        [styles.likesImage, { marginLeft: 2, width: 10, }]
                    }>
                    <Image
                        source={{
                            uri:
                                item?.item?.profile,
                        }}
                        style={[styles.addupload, {
                            width: 20, height: 20, borderRadius: 50,
                            borderWidth: 3,
                            borderColor: '#fff'
                        }]}
                    />
                 
                </View>
            </TouchableOpacity>
        </>
    )
}

export default EventMemberRenderItem