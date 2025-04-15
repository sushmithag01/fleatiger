import React from 'react'
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
import styles from '../../Common.css'
import { useNavigation } from '@react-navigation/native';

function ListRenderItem({ item }) {
    const navigation = useNavigation();
    const chatType = 1;

    const handleGroup = async (data) => {
        navigation.navigate('Messages', {
            screen: 'GroupInner',
            params: { groupId: data?.id }
        })


    }
    return (
        <>

            <View style={styles.logmain}>
                <View style={styles.logmain2}>
                    <TouchableOpacity
                        onPress={() =>
                            handleGroup(item?.item)
                        }
                    >
                        <Image
                            source={item?.item?.group_image ? { uri: item?.item?.group_image } :
                                require('../../assets/pic9.png')
                            }
                            style={styles.newsimg1}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleGroup(item?.item)
                        }
                    >
                        <View>
                            <Text style={styles.logdate}>{item?.item?.group_type}</Text>
                            <Text style={styles.homecardtext1}>{item?.item?.group_name}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default ListRenderItem