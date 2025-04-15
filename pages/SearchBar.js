import React, { useEffect, useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import ErrorText from './ErrorText/ErrorText';


const Search = ({setSearch,search,placeholdertext}) => {

  return (
    <View style={styles.view}>
      <SearchBar
        placeholder={placeholdertext}
        onChangeText={setSearch}
        value={search}
        inputContainerStyle={styles.searchbarinner}
        containerStyle={styles.searchbarmain}
        searchIcon={{ color: "#436077", fontFamily: 'Montserrat-Medium', }}
        placeholderTextColor="#CDD4D9"
        inputStyle={styles.searchinput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    marginRight: 5,
    marginTop: 0,
  },
  searchbarinner: {
    backgroundColor: "#fff",
    borderColor: "#CDD4D9",
    borderWidth: 0,
    color: "#E66100"
  },
  searchbarmain: {
    backgroundColor: "#fff",
    borderColor: "#CDD4D9",
    borderWidth: 1,
    padding: 0,
    margin: 0,
    borderBottomColor: "#CDD4D9",
    borderTopColor: "#CDD4D9",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 5
  },
  searchinput: {
    color: "#436077",
    fontFamily: 'Montserrat-Medium',
  }
});

export default Search;