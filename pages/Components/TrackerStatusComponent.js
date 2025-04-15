import React from 'react';
import {Text, View} from 'react-native';
import styles from '../../Common.css';

function TrackerStatusComponent({trackerStatusData}) {
  return (
    <View>
      <View style={styles.marginhz15}>
        <View style={styles.homecardinner1}>
          <Text style={[styles.homecardtext1]}>Tracker</Text>
          {trackerStatusData ? (
            <View>
              <View style={styles.trackerStatusmain}>
                <Text style={styles.comparetext1}>Status</Text>
                <Text style={styles.comparetext2}>
                  {trackerStatusData?.isOnline === true ? 'Online' : 'Offline'}
                </Text>
              </View>
              <View style={styles.trackerStatusmain}>
                <Text style={styles.comparetext1}>Battery Level</Text>
                <Text style={styles.comparetext2}>
                  {trackerStatusData?.battery_level
                    ? trackerStatusData?.battery_level
                    : '0'}
                  %
                </Text>
              </View>
              <View style={styles.trackerStatusmain}>
                <Text style={styles.comparetext1}>Last Connection</Text>
                <Text style={styles.comparetext2}>
                  {trackerStatusData?.last_connection}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.trackerStatusmain}>
              <Text
                style={{
                  textAlign: 'center',
                  paddingHorizontal: 50,
                  margin: 10,
                }}>
                Tracker data not found
              </Text>
            </View>
          )}
          <View style={styles.space20}></View>
          <View style={styles.aligncenter}></View>
        </View>
      </View>
    </View>
  );
}

export default TrackerStatusComponent;
