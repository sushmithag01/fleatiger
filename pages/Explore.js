import React from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {SearchBar} from '@rneui/themed';
import SwitchComponent from './SearchBar';
import Search from './SearchBar';
import Sort from './Sort';
import ExploreSlider from './ExploreSlider';
import Categories from './Categories';
import LatestLocals from './LatestLocals';
import PopularDeals from './PopularDeals';
import ExploreDeals from './ExploreDeals';

const Explore = () => {
  return (
    <>
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <ExploreDeals />
        <ExploreSlider />
        <View style={styles.serachmain}>
          <View style={styles.searchleft}>
            <Search />
          </View>
          <View style={styles.searchright}>
            <Sort />
          </View>
        </View>
        <Categories />
        <LatestLocals />
        <PopularDeals />
        <View></View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 10,
  },
  serachmain: {
    // flex:2,
    flexDirection: 'row',
    marginTop: 10,
    overflow: 'visible',
  },
  searchleft: {
    width: '100%',
    flex: 1,
    overflow: 'visible',
  },
  searchright: {
    width: 100,
  },
});

export default Explore;
