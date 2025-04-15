import React, { useState } from 'react';
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { CheckBox } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from "../Common.css"

const Categories = props => {
    const [isVisible, setIsVisible] = useState(false);
    const list = [
    { title: 'List Item 1' },
    { title: 'List Item 2' },
    {
    title: 'Cancel',
    containerStyle: { backgroundColor: 'red' },
    titleStyle: { color: 'white' },
    onPress: () => setIsVisible(false),
    },
    ];
    const [checked, setChecked] = React.useState(true);
    const toggleCheckbox = () => setChecked(!checked);
  return (
    <>
    <View style={styles.titlemain}>
        <Text style={[styles.title]}>Categories</Text>
        <TouchableOpacity  onPress={() => setIsVisible(true)}><Text style={styles.seealltext}>See All</Text></TouchableOpacity>
    </View> 
     <View style={styles.catbuttonmain}>
        <TouchableOpacity style={styles.catbutton}>
            <Text style={styles.catbuttontext}>Things to do</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catbutton}>
            <Text style={styles.catbuttontext}>Things to do Things to do</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catbutton}>
            <Text style={styles.catbuttontext}>Things to do</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catbutton}>
            <Text style={styles.catbuttontext}>Things to do</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catbuttonorange}>
            <Text style={styles.catbuttontextorange}>Things to do</Text>
            <Entypo
                style={styles.crossicon}
                color="#fff"
                name="circle-with-cross"
                size={20}
            />
        </TouchableOpacity>
     </View>
     <BottomSheet modalProps={{}} isVisible={isVisible}>
       <View style={styles.bottomsheetmain}>
        <View style={[styles.titlemain,styles.bottomsheetheader]}>
            <Text style={[styles.title, styles.orangetitle]}>
                <TouchableOpacity>
                    <Ionicons color="#E66100" name="chevron-back" style={styles.backorg} size={25}/>
                    </TouchableOpacity>Categories</Text>
            <TouchableOpacity  onPress={() => setIsVisible(true)}><Text style={[styles.seealltext,styles.clearall]}>Clear All</Text></TouchableOpacity>
        </View>
        <View style={styles.checksection}>
            <CheckBox
            checked={checked}
            onPress={toggleCheckbox}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
            containerStyle={styles.checkmain}
            checkedColor="#E66100"
            title={<Text>   Select All <Text>(4)</Text></Text>}
            />
        <View style={styles.selectmain}>
            <CheckBox
            checked={checked}
            onPress={toggleCheckbox}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
            title="Massages"
            containerStyle={styles.checkmain}
            checkedColor="#E66100"
            />
            <Text>4</Text>
        </View>
        <View style={styles.selectmain}>
            <CheckBox
            checked={checked}
            onPress={toggleCheckbox}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
            title="Laser Hair removal"
            containerStyle={styles.checkmain}
            checkedColor="#E66100"
            />
            <Text>4</Text>
        </View>
        <View style={styles.selectmain}>
            <CheckBox
            checked={checked}
            onPress={toggleCheckbox}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
            title="Nail Salons"
            containerStyle={styles.checkmain}
            checkedColor="#E66100"
            />
            <Text>4</Text>
        </View>
        </View>
        <View style={styles.checkbtnmain}>
            <TouchableOpacity style={styles.closebtn} onPress={()=> setIsVisible(false)}><Text style={styles.closebtntext}>Close</Text></TouchableOpacity>
            <TouchableOpacity style={styles.applybtn} onPress={()=> setIsVisible(false)}><Text style={styles.applytext}>Apply</Text></TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
    </>
  )
}



export default Categories