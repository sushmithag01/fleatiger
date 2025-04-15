import React from 'react';
import {Image, View, Text} from 'react-native';
import styles from '../../Common.css';
import moment from 'moment';

function ProfileComponent({data}) {
  return (
    <>
        <View style={styles.imgSection}>
          <Image
            source={{
              uri:
                data?.pet_image_path ??
                'https://devapi.fleatiger.com/pets/pet_profile_default.png',
            }}
            style={[styles.ProfileLogo, styles.addupload]}
          />
          <View style={{width: 125, margin: 10}}>
            <Text style={styles.homecardtext1}>
              {data?.pet_name ?? 'petName'}
            </Text>
            <Text style={styles.logdate}>
              {moment.utc(data?.getdate??data?.activity_time).format('DD-MMM-YYYY')}
            </Text>
          </View>
        </View>
        
    </>
  );
}

export default ProfileComponent;
