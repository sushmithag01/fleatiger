import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Image, Modal} from 'react-native';
import PinchZoom from '../PinchZoom';
import styles from '../../Common.css';

function AcivityImageRenderItem({item}) {
  const [imageModalVisible, setImageModalVisible] = useState({
    state: false,
    url: '',
  });

  return (
    <>
      <TouchableOpacity
        onPress={() => setImageModalVisible({state: true, url: item.item})}>
        <View style={styles.place}>
          <Image source={{uri: item.item}} style={styles.placeimg}></Image>
        </View>
      </TouchableOpacity>

      <Modal
        visible={imageModalVisible.state}
        transparent={true}
        animationType="slide">
        <PinchZoom
          imageModalVisible={imageModalVisible}
          setImageModalVisible={setImageModalVisible}
        />
      </Modal>
    </>
  );
}

export default AcivityImageRenderItem;
