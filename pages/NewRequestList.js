import {Image, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import styles from '../Common.css';
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
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AcceptFriendRequestAPI, DeclineFriendRequestAPI} from './API/ApiCalls';
import ProfileRemovedConfirmation from './Popups/ProfileRemovedConfirmation';

const NewRequestList = props => {
  const {listData, setLoading, GetRequestList} = props;

  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalDecline, setModalDecline] = useState(false);

  const handleAccept = async (e, key) => {
    setLoading(true);
    setModalDecline(false);

    const payload = {
      friend_request_id: parseInt(listData[key].friend_request_id),
    };
    // console.log("listData[key].friend_request_id",payload)
    const Response = await AcceptFriendRequestAPI(payload);
    if (Response.success == false) {
      setLoading(false);
    } else {
      setLoading(false);
      setTimeout(() => {
        GetRequestList();
        setModalSuccess(true);
      }, 1000);
    }
  };

  const handleDecline = async (e, key) => {
    // setLoading(true)
    setModalDecline(true);
    console.log(
      listData[key].friend_request_id,
      'listData[key].friend_request_id',
    );
    const payload = {
      friend_request_id: parseInt(listData[key].friend_request_id),
    };

    const Response = await DeclineFriendRequestAPI(payload);
    console.log('Response', Response);
    if (Response.success == false) {
      setLoading(false);
    } else {
      setLoading(false);
      setTimeout(() => {
        GetRequestList();
        setModalSuccess(true);
      }, 1000);
    }
  };

  return (
    <View>
      {listData.map((item, key) => {
        var text = item.location;
        var parts = text.split(','); // Split the string into an array of strings by character /
        var lastIndexOf = parts.length - 1; // Determine the last word's 0-based index in array (length -1)
        var location = parts[lastIndexOf]; // Grab the last part of the array.

        return (
          <View style={styles.logmain}>
            <View style={styles.logmain2}>
              <Image
                source={
                  item.pet_image_path == 'https://devapi.fleatiger.com/'
                    ? require('../assets/pic9.png')
                    : {uri: item.pet_image_path}
                }
                style={styles.newsimg1}></Image>

              <View style={{width: 125}}>
                <Text style={styles.homecardtext1}>{item.pet_name}</Text>
                <Text style={styles.logdate}>{location}</Text>
              </View>
            </View>

            {item.request_status_state === 'acceptordecline' ? (
              <View style={styles.likesec1}>
                <TouchableOpacity onPress={e => handleAccept(e, key)}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={45}
                    height={45}
                    viewBox="0 0 30 30"
                    fill="none">
                    <G clipPath="url(#clip0_1_197)">
                      <Path
                        d="M15 29.4c7.953 0 14.4-6.447 14.4-14.4S22.953.6 15 .6.6 7.047.6 15 7.047 29.4 15 29.4z"
                        fill="#9BBBBE"
                      />
                      <Path
                        d="M23.1 14.1h-7.194V6.9a.899.899 0 10-1.8 0v7.194H6.9a.899.899 0 100 1.8h7.194v7.194a.899.899 0 101.8 0v-7.194h7.194a.899.899 0 100-1.8l.012.006z"
                        fill="#223656"
                      />
                    </G>
                    <Defs>
                      <ClipPath id="clip0_1_197">
                        <Path fill="#fff" d="M0 0H30V30H0z" />
                      </ClipPath>
                    </Defs>
                  </Svg>
                </TouchableOpacity>

                <TouchableOpacity onPress={e => handleDecline(e, key)}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="icons-RZ_Weiss"
                    viewBox="0 0 50 50"
                    width={45}
                    height={45}>
                    <Circle cx={25} cy={25} r={24} fill="#92bcbf" />
                    <Path
                      d="M38.5 26.5h-27c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h26.99c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
                      fill="#223656"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.likesec1}>
                <TouchableOpacity
                  style={[styles.requestSentbtn]}>
                  <Text style={styles.brownbtntextAdd}>Sent</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* pop-up */}
          </View>
        );
      })}

      {modalSuccess == true ? (
        <ProfileRemovedConfirmation
          visible={modalSuccess}
          onRequestClose={() => {
            setModalSuccess(false);
            setModalDecline(false);
          }}
          modalSuccess={modalSuccess}
          setModalSuccess={setModalSuccess}
          text={
            modalDecline == false
              ? 'FRIEND REQUEST ACCEPTED'
              : 'FRIEND REQUEST DECLINED'
          }
          shortText={
            modalDecline == false
              ? 'You can now chat and share activities'
              : 'If you would like to be friends, send them friend request'
          }
        />
      ) : (
        ''
      )}
    </View>
  );
};

export default NewRequestList;
