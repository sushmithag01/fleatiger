import React, {useState} from 'react';
import styles from '../Common.css';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
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
import {useNavigation} from '@react-navigation/native';
import Moment from 'moment';
import PinchZoom from './PinchZoom';

const LogbookList = props => {
  const {eachItem} = props;
  const navigation = useNavigation();
  // Images-list
  const [SliderImages, setSliderImages] = useState(eachItem.activity_imglist);
  const [imageModalVisible, setImageModalVisible] = useState({
    state: false,
    url: '',
  });

  // Duration
  const TimeVAl = eachItem.duration;
  const getTime = TimeVAl.split(':');

  // Date
  const DateValue = new Date(eachItem.activity_time);

  const shortMonth = DateValue.toLocaleString('en-US', {
    month: 'short',
  });
  const day = DateValue.toLocaleString('en-US', {
    day: 'numeric',
  });
  const year = DateValue.toLocaleString('en-US', {
    year: 'numeric',
  });
  const MonthNum = DateValue.toLocaleString('en-US', {
    month: 'numeric',
  });
  const formattedDate = day + ' ' + shortMonth + ' ' + year;
  const dateForCompltedActivity = year + '-' + MonthNum + '-' + day;


  return (
    <View>
      <View style={styles.homecardinner1}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddActivity', {
              screen: 'CompletedActivity',
              params: {
                item: eachItem,
                dateClicked: Moment(eachItem.activity_time).format('YYYY-M-DD'),
                status: '',
                PageName: 'LogBook',
              },
            });
          }}>
          <View style={styles.logmain}>
            <View>
              <Text style={styles.homecardtext1}>{eachItem.activity_name}</Text>
              <Text style={styles.logdate}>
                {Moment(eachItem.activity_time).format('DD MMM YYYY')}
              </Text>
            </View>
            <Image
              style={[styles.activityImgDis]}
              source={{uri: eachItem.activity_image_path}}></Image>
          </View>
          <View style={styles.brownbtnmain}>
            <View style={styles.brownbtnLog}>
              <Text style={styles.brownbtntext}>
                {' '}
                {getTime[0] == '00' ? '00' : `${getTime[0]}`}:
                {getTime[1] == '00' ? '00' : `${getTime[1]}`} hrs
              </Text>
            </View>
            <View style={styles.brownbtnLog}>
              <Text style={styles.brownbtntext}>
                {eachItem?.distance}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.space20}></View>

        <View style={[styles.dflex]}>
          <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
            <View style={{flexDirection: 'row'}}>
              {SliderImages == null ? (
                ''
              ) : (
                <View style={{flexDirection: 'row', width: '100%'}}>
                  {SliderImages.map((item, key) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          setImageModalVisible({state: true, url: item})
                        }>
                        <View style={styles.place}>
                          <Image
                            source={{uri: item}}
                            style={styles.placeimg}></Image>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>
          <Modal
            visible={imageModalVisible.state}
            transparent={true}
            animationType="slide">
            <PinchZoom
              imageModalVisible={imageModalVisible}
              setImageModalVisible={setImageModalVisible}
            />
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default LogbookList;
