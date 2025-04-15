import React from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';

const AllPages = ({navigation}) => {
  return (
    <>
      <TouchableOpacity onPress={ () => navigation.navigate('SignIn')}>
        <Text>
          SignIn Page
        </Text>
      </TouchableOpacity>
    </>
  )
}


export default AllPages
