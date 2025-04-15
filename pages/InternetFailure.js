import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const InternetFailure = (props) => {
    const { loading } = props
    const colorOrange = "#BE7542"
    const colorMaroon = "#CE5757"
    const colorBlue = "#92BCBF"
    const colorDarkBlue = "#223656"
    const colorGrey = "#495F754D"


    return (
        <View style={{ marginTop: 300, marginBottom: 200 }}>
            <ActivityIndicator size="large" />
            <View style={{ textAlign: "center", fontWeight: 800 }}>
                <Text style={{ textAlign: "center", fontWeight: 900 }}>Loading...</Text>
                <Text style={{ textAlign: "center", fontWeight: 600 }}>Please Check your internet connection...!!!</Text>
            </View>

        </View >
    )
}


const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Montserrat-medium',

    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

export default InternetFailure;