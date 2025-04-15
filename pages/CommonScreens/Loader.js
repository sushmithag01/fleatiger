import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Text } from 'react-native-svg';

const Loader = (props) => {
  const {loading} = props
  const colorOrange = "#BE7542"
  const colorMaroon = "#CE5757"
  const colorBlue = "#92BCBF"
  const colorDarkBlue = "#223656"
  const colorGrey = "#495F754D"

  return(
    <View>
    
    {/* <ActivityIndicator size="large" color={colorBlue} /> */}
    <Spinner
          visible={loading}
          textContent={props.pagename === 'friendsmap'?'Your friends are roaming around. Hang tight ...':'Loading...'}
          textStyle={props.pagename === 'friendsmap' ? [styles.spinnerTextStyle,{marginLeft:100,width:300}]:styles.spinnerTextStyle}
          overlayColor='rgba(0, 0, 0, 0.6)'
        />
  </View>
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

export default Loader;