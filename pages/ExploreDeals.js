import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const ExploreDeals = props => {
  const [value, setValue] = useState(null);
  return (
    <>
      <View>
        <Text style={styles.exploretext}>Explore Deals in</Text>
      </View>
      <Dropdown

        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={true}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Location"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
        renderLeftIcon={() => (
          <FontAwesome5 style={styles.icon} color="#E66100" name="location-arrow" size={20} />
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    height: 45,
    borderBottomColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    // borderBottomWidth: 0.5,
    marginHorizontal: 10,
    marginTop: 10
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#E66100",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  exploretext: {
    fontSize: 16,
    textAlign: "center",
    color: "#000",
    marginTop: 10,
    fontFamily: 'Montserrat-Bold',
  }
});

export default ExploreDeals