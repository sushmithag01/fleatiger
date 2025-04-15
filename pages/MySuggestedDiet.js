import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import styles from '../Common.css';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  NavigationContainer,
  DrawerActions,
  useIsFocused,
} from '@react-navigation/native';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Profile from './Profile';
import Loader from './CommonScreens/Loader';

const MySuggestedDiet = props => {
  const {FoodData, loading, setLoading, foodDietPlan} = props;
  const isFocused = useIsFocused();
  // open-link - new tabs
  const supportedURL = 'https://fleatiger.com/the-story-behind-fleatiger/';
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [isFocused]);

  const handlePress1 = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.show(`Server error to open this URL: ${url}`, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    }
  };
  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      {foodDietPlan > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.space20}></View>
          <Text style={[styles.homecardtext1, styles.marhoz15]}>
            My suggested diet
          </Text>

          <View style={styles.space10}></View>

          <View style={{padding: 10}}>
            {FoodData?.map((item, key) => {
              return (
                <View style={styles.dflexonly}>
                  <View style={styles.flexdiet1}>
                    <Text style={styles.foodcardtext}>{item.foodName}</Text>
                  </View>
                  <View style={styles.flexdiet2}>
                    <Text style={styles.foodvalue}>
                      {item.foodName === 'Water'
                        ? `${item.foodValue} liters`
                        : `${item.foodValue} g`}{' '}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.space50}></View>

          {/* <View style={styles.homecardmain}>
        <TouchableOpacity style={styles.foodcardinner} onPress={()=>navigation.navigate('Health')}>  
           <Text style={styles.foodcardtext}>Active Time</Text>
           <View style={styles.food1}>
             <Image source={require('../assets/pic2.png')} style={styles.foodimg}></Image>
           </View>
           <Text style={styles.foodvalue}>100g</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.foodcardinner} onPress={()=>navigation.navigate('Health')}>  
           <Text style={styles.foodcardtext}>Meat</Text>
           <View style={styles.food1}>
             <Image source={require('../assets/pic3.png')} style={styles.foodimg}></Image>
           </View>
           <Text style={styles.foodvalue}>100g</Text>
        </TouchableOpacity>
     </View>
     <View style={styles.homecardmain}>
     <TouchableOpacity style={styles.foodcardinner} onPress={()=>navigation.navigate('Health')}>  
           <Text style={styles.foodcardtext}>Meat</Text>
           <View style={styles.food1}>
             <Image source={require('../assets/pic4.png')} style={styles.foodimg}></Image>
           </View>
           <Text style={styles.foodvalue}>100g</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.foodcardinner} onPress={()=>navigation.navigate('Health')}>  
           <Text style={styles.foodcardtext}>Meat</Text>
           <View style={styles.food1}>
             <Image source={require('../assets/pic5.png')} style={styles.foodimg}></Image>
           </View>
           <Text style={styles.foodvalue}>100g</Text>
        </TouchableOpacity>
     </View> */}
          <View style={styles.bluebtnsmallmain}>
            <TouchableOpacity
              style={styles.bluebtnsmall}
              onPress={() => handlePress1(supportedURL)}>
              <Text style={styles.bluebtnsmalltext}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View>
          <Text style={styles.addprofiletext12}>
            Upgrade your plan to use this feature
          </Text>
        </View>
      )}
    </>
  );
};

export default MySuggestedDiet;
