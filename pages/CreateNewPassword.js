import React,{useState} from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';


const CreateNewPassword = ({navigation}) => {
  return (
    <>
    <SafeAreaView>
     <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
      <View style={styles.logosection}>
        <Image source={require('../assets/Logo-new.png')} style={styles.logo}/>
      </View>
      <View>
        <Text style={styles.signintext}>Create New password</Text>
      </View>
      <View>
        <Text style={styles.label}>Create Password <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          placeholderTextColor="#ccc"
        />
      </View>
      <View>
        <Text style={styles.label}>Confirm Password* <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          placeholderTextColor="#ccc"
        />
      </View>
      <View>
        <TouchableOpacity style={styles.submitbtn} onPress={()=>navigation.navigate('HomeStackNavigator',{screen:'Home'})}>
          <Text style={styles.submitbtntext}>Save</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  main:{
    backgroundColor:"#000",
    paddingHorizontal:5,
    minHeight:'100%'
  },
  logo:{
    width:135,
    height:117,
    padding:20
  },
  logosection:{
    flex:1,
    flexDirection:"row",
    justifyContent:"center",
    alignContent:"center",
    marginTop:40
  },
  input: {
    height: 40,
    marginVertical: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor:"rgba(255, 255, 255, 0.25);",
    color:"#fff",
    marginBottom:20,
    flex:1,
    borderRadius:5,
    fontFamily: 'Montserrat-Medium'
  },
  label:{
    color:"#fff",
    fontSize:16,
    fontFamily: 'Montserrat-Medium'
  },
  required:{
    color:"#eee"
  },
  signintext:{
    textAlign:"center",
    fontSize:18,
    color:"#fff",
    marginVertical:15,
    fontFamily: 'Montserrat-Bold',
    marginBottom:30
  },
  required:{
    color:"#E66100"
  },
  forgottext:{
    color:"#fff",
    flex:1,
    textAlign:"right",
    color:"#E66100",
    fontSize:15,
    fontFamily: 'Montserrat-Medium'
  },
  submitbtn:{
    backgroundColor:"#E66100",
    paddingVertical:10,
    marginTop:20,
    borderRadius:5,
    fontFamily: 'Montserrat-Bold'
  },
  submitbtntext:{
    color:"#fff",
    textAlign:"center",
    fontSize:18,
    fontWeight:'700',
     fontFamily: 'Montserrat-Bold'
  },
  loginwith:{
    color:"#fff",
    textAlign:"center",
    marginVertical:20,
    fontSize:18,
    fontFamily: 'Montserrat-Medium'
  },
  socialsection:{
    flex:2,
    flexDirection:"row"
  },
  socialmain:{
    marginHorizontal:10
  },
  registersection:{
    backgroundColor:"#fff",
    flex:2,
    flexDirection:"row",
    marginVertical:20,
    padding:20,
    borderRadius:10
  },
  regtext1:{
    fontSize:15,
    fontFamily: 'Montserrat-Medium',
    color:"#000"
  },
  regtext2:{
    fontSize:18,
    fontWeight:'700',
    fontFamily: 'Montserrat-Regular',
    color:"#000"
  },
  regbtn:{
    backgroundColor:"#E66100",
    paddingVertical:10,
    marginTop:0,
    borderRadius:5,
    marginLeft:20
  },
  regbtntext:{
    color:"#fff",
    textAlign:"center",
    fontSize:18,
    width:100,
    fontWeight:'700',
    fontFamily: 'Montserrat-Medium'
  },
  noaccountmain:{
    flex:2,
    flexDirection:"row",
    justifyContent:"center",
    marginTop:0,
    marginBottom:50
  },
  noaccount:{
    color:"#fff",
    fontSize:16,
    fontFamily: 'Montserrat-Medium'
  },
  signuptext:{
    color:"#E66100",
    fontSize:16,
    fontWeight:'700',
    fontFamily: 'Montserrat-Medium'
  },
  eyeicon:{
    position:"absolute",
    right:10,
    zIndex:9999,
    top:37
  }
});

export default CreateNewPassword
