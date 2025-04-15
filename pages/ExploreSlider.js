import * as React from 'react';
import {Dimensions, Text, View, Image, TouchableOpacity} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const ExploreSlider = props => {
  const width = Dimensions.get('window').width;
  return (
    <>
      <View style={{flex: 1, marginTop: 10}}>
        <Carousel
          loop
          mode={'parallax'}
          width={width * 0.95}
          pagingEnabled={true}
          snapEnabled={true}
          height={width * 0.37}
          autoPlay={false}
          data={[...new Array(6)]}
          scrollAnimationDuration={1000}
          renderItem={({index}) => (
            <View style={{flex: 1, margin: 0}}>
              <TouchableOpacity style={{flex: 1, margin: 0}}>
                <Image source={require('../assets/banner-home.png')}></Image>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </>
  );
};

export default ExploreSlider;
