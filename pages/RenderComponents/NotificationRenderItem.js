import React, {useEffect} from 'react';
import {Image, Text, View} from 'react-native';
import styles from '../../Common.css';

function NotificationRenderItem({item, index}) {
  useEffect(() => {}, [item]);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <View style={styles.notificationContainer}>
          {/* Left side with Image and Text */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{
                uri: item?.item?.pet_image,
              }}
              style={[styles.ProfileLogoDes, styles.addupload]}
            />
            <View style={{marginLeft: 10}}>
              <Text style={styles.notificationTitle}>
                {item?.item?.pet_name}
              </Text>
              <Text style={styles.notificationText}>{item?.item?.title}</Text>
            </View>
          </View>

          {/* Right side highlighter
          {item.item.read_status === 0 ? (
            <View style={styles.badgeHightLighter}></View>
          ) : null} */}
        </View>
        <View style={styles.underLine} />
        {/* Divider Line */}
      </View>
    </>
  );
}

export default NotificationRenderItem;
