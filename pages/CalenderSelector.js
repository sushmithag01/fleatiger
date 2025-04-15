import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';


const CalenderSelector = (props) => {

  const [selected, setSelected] = useState('');

  const { GetDashboard } = props;

  const marked = useMemo(() => ({
    [selected]: {
      selected: true,
      selectedColor: '#495F75',
      selectedTextColor: '#FFF',
    }
  }), [selected]);



  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        firstDay={1}
        showWeekNumbers={false}
        markedDates={marked}
        onDayPress={(day) => {
          console.log(day)
          setSelected(day.dateString);
          GetDashboard(day.dateString)
          props.onDaySelect && props.onDaySelect(day);
        }}
        {...props}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          todayTextColor: "#fff",
          todayBackgroundColor: '#CE5757',
          arrowColor: '#CE5757',
          'stylesheet.calendar.header': {
            dayHeader: {
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            },
            week: {
              backgroundColor: '#eee',
              margin: 10,
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }
          }
        }}
        style={{
          borderRadius: 5,
          margin: 12,
          elevation: 5,
          borderWidth: 1,
          borderColor: 'rgba(100, 100, 100, 0.2)'
        }}
      />
    </SafeAreaView>
  )
}

export default CalenderSelector

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
});
