import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, StyleSheet,AppState} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

const DummyPage = () => {
  const [time, setTime] = useState(0); // time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const backgroundStartTime = useRef(0);

  // Convert milliseconds to hh:mm:ss:ms format
  const formatTime = milliseconds => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10); // two-digit ms

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms
      .toString()
      .padStart(2, '0')}`;
  };

  // Start stopwatch
  const startStopwatch = () => {
    setIsRunning(true);
    const startTime = Date.now() - time; // Adjust time to continue from the last point

    intervalRef.current = BackgroundTimer.setInterval(() => {
      setTime(Date.now() - startTime); // Update the time state
    }, 10); // Update every 10 ms for precision
  };

  // Stop stopwatch
  const stopStopwatch = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      BackgroundTimer.clearInterval(intervalRef.current);
    }
  };

  // Reset stopwatch
  const resetStopwatch = () => {
    stopStopwatch();
    setTime(0);
  };

  // Handle app moving to background and foreground
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'background') {
        backgroundStartTime.current = Date.now(); // Record the time when going to background
      } else if (nextAppState === 'active' && isRunning) {
        // Adjust time after coming back to foreground
        const now = Date.now();
        const backgroundDuration = now - backgroundStartTime.current;
        setTime(prevTime => prevTime + backgroundDuration);
      }
    };

    // Add event listener for app state change
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      // Cleanup listener when component unmounts
      subscription.remove();
    };
  }, [isRunning]);

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(time)}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={isRunning ? 'Stop' : 'Start'}
          onPress={isRunning ? stopStopwatch : startStopwatch}
        />
        <Button title="Reset" onPress={resetStopwatch} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
});

export default DummyPage;
