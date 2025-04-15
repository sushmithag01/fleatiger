import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import styles from '../../Common.css';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  Ellipse,
} from 'react-native-svg';
import CommentLists from './CommentLists';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import ErrorText from '../ErrorText/ErrorText';
import LikeRenderItem from '../RenderComponents/LikeRenderItem';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import AcivityImageRenderItem from '../RenderComponents/AcivityImageRenderItem';

function AcitivityDescriprionComponent({
  data,
  handleCommentFun,
  setCommentText,
  commentText,
  commentErr,
  setCommentError,
}) {
  useEffect(() => { }, [data]);
  const navigation = useNavigation();
  const TimeVal = data?.duration ?? '00:00:00';
  const getTime = TimeVal.split(':');

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <View style={{ alignSelf: 'flex-start', width: '100%' }}>
          <Text style={styles.activitytextMain}>
            {data?.activity_name ?? 'Activit Name'}
          </Text>
          <Text>{data?.description ?? null}</Text>
          <View style={styles.brownbtnmain}>
            <View style={styles.brownbtnLog}>
              <Text style={styles.brownbtntext}>
                {' '}
                {getTime[0] == '00' ? '00' : `${getTime[0]}`}:
                {getTime[1] == '00' ? '00' : `${getTime[1]}`} hrs
              </Text>
              {/* <Text style={styles.brownbtntext}> {eachItem.duration} hrs</Text>  */}
            </View>
            <View style={styles.brownbtnLog}>
              <Text style={styles.brownbtntext}>{data?.distance}</Text>
            </View>
          </View>
          <View>
            <View style={styles.likescontainer}>
              <View style={styles.likeIcon}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="icons-RZ_Weiss"
                  viewBox="0 0 50 50"
                  width={35}
                  height={35}>
                  <Path
                    d="M30.73 12.74l-3.83 2.1c-1.18.65-2.62.65-3.81 0l-3.83-2.1a3.96 3.96 0 00-4.08.17l-4.05 2.67a6.955 6.955 0 00-3.14 5.81c0 2.04.9 3.98 2.47 5.31l11.98 10.12a3.975 3.975 0 005.11 0L39.53 26.7A6.943 6.943 0 0042 21.39c0-2.34-1.18-4.52-3.14-5.81l-4.05-2.67c-1.22-.81-2.8-.87-4.08-.17z"
                    fill="#223656"
                  />
                </Svg>
              </View>
              <ScrollView>
                <View style={styles.likesSec}>
                  {data?.liked_profiles?.length > 0 ? (
                    <SafeAreaView>
                      <FlatList
                        keyExtractor={item => item.liked_profile}
                        data={data.liked_profiles.slice(0, 4)}
                        renderItem={item => (
                          <LikeRenderItem
                            item={item}
                            ActivityId={data.activity_id}
                          />
                        )}
                        contentContainerStyle={{
                          flexDirection: 'row',
                          width: '100%',
                        }}
                        nestedScrollEnabled={true}
                      />
                      {data.liked_profiles.length > 4 && (
                        <Text
                          style={{
                            marginRight: 150,
                            marginTop: 10,
                            fontSize: 20,
                            fontWeight: '800',
                          }}
                          onPress={() =>
                            navigation.navigate('LikesList', {
                              ActivityId: data.activity_id,
                            })
                          }>
                          ... {/* Ellipsis for more items */}
                        </Text>
                      )}
                    </SafeAreaView>
                  ) : (
                    <Text
                      style={{ marginTop: 15, fontSize: 16, fontWeight: '600' }}>
                      0
                    </Text>
                  )}
                </View>
              </ScrollView>
            </View>
            <SafeAreaView>
              <View style={{ marginBottom: 10 }}>
                <FlatList
                  keyExtractor={item => item.item}
                  data={data?.activity_imglist}
                  renderItem={item => (
                    <AcivityImageRenderItem item={item} ActivityId={data.index} />
                  )}
                  contentContainerStyle={{ flexDirection: 'row', width: '100%' }}
                  nestedScrollEnabled={true}
                />
              </View>
            </SafeAreaView>

          </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.commentInp}>
            <TextInput
              placeholder="Add whoof…"
              style={[styles.selectedTextStyle2]}
              maxLength={100}
              multiline={true}
              // numberOfLines={2}
              value={commentText}
              onChange={e =>
                e.nativeEvent.text
                  ? [setCommentText(e.nativeEvent.text), setCommentError('')]
                  : [
                    setCommentText(''),
                    setCommentError(ErrorText.CommentTextRequired),
                  ]
              }
            />
          </View>

          <TouchableOpacity onPress={() => handleCommentFun(data)}>
            <View
              style={{
                marginRight: -50,
                marginBottom: 0,
                width: 80,
                // marginLeft: 30,
              }}>
              <Icons name="send-circle" size={35} color="#CE5757" />
            </View>
            {/* <View style={{margin: 10}}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={25}
                height={25}>
                <Circle cx={24} cy={24} r={24} fill="#ce5757" strokeWidth={0} />
                <Path
                  d="M35.75 23.38l-9.08-9.12a.87.87 0 00-1.24 0c-.34.34-.34.9 0 1.24l7.58 7.62H12.88c-.48 0-.88.39-.88.88s.39.88.88.88h20.14l-7.58 7.62a.87.87 0 000 1.24.87.87 0 001.24 0l9.08-9.12a.9.9 0 000-1.24z"
                  fill="#fff"
                  strokeWidth={0}
                />
              </Svg>
            </View> */}
          </TouchableOpacity>
        </View>
        {commentErr ? (
          <Text style={[styles.required, { marginLeft: 10 }]}>{commentErr}</Text>
        ) : null}
        <View style={styles.msgContainer}>
          {data?.replies?.length > 0 ? (
            <CommentLists commentsData={data?.replies} />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 110,
                fontFamily: 'Montserrat-Medium',
              }}>
              {' '}
              No Comments to display..!!
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default AcitivityDescriprionComponent;
