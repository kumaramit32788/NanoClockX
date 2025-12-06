/**
 * NanoClockX - A precise clock
 *
 * @format
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Dimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <View
        style={[
          styles.safeArea,
          isDarkMode ? styles.darkContainer : styles.lightContainer,
        ]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ClockScreen isDarkMode={isDarkMode} />
      </View>
    </SafeAreaProvider>
  );
}

function ClockScreen({ isDarkMode }: { isDarkMode: boolean }) {
  const [time, setTime] = useState(new Date());
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isLandscape = useMemo(
    () => dimensions.width > dimensions.height,
    [dimensions.width, dimensions.height],
  );

  const { hours, minutes, seconds, dateString } = useMemo(() => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const dateString = time.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return { hours, minutes, seconds, dateString };
  }, [time]);

  const dateContainerStyle = useMemo(
    () => [
      styles.dateContainer,
      { paddingTop: safeAreaInsets.top + 20 },
      isLandscape && styles.dateContainerLandscape,
    ],
    [safeAreaInsets.top, isLandscape],
  );

  const dateTextStyle = useMemo(
    () => [
      styles.dateText,
      isLandscape && styles.dateTextLandscape,
      isDarkMode ? styles.darkText : styles.lightText,
    ],
    [isLandscape, isDarkMode],
  );

  const clockContainerStyle = useMemo(
    () => [
      styles.clockContainer,
      isLandscape && styles.clockContainerLandscape,
    ],
    [isLandscape],
  );

  const timeRowStyle = useMemo(
    () => [styles.timeRow, isLandscape && styles.timeRowLandscape],
    [isLandscape],
  );

  const separatorStyle = useMemo(
    () => [
      styles.separator,
      isLandscape && styles.separatorLandscape,
      isDarkMode ? styles.darkText : styles.lightText,
    ],
    [isLandscape, isDarkMode],
  );

  const containerStyle = useMemo(
    () => [
      styles.container,
      isDarkMode ? styles.darkContainer : styles.lightContainer,
    ],
    [isDarkMode],
  );

  return (
    <View style={containerStyle}>
      <View style={dateContainerStyle}>
        <Text style={dateTextStyle}>{dateString}</Text>
      </View>

      <View style={clockContainerStyle}>
        <View style={timeRowStyle}>
          <TimeSegment
            value={hours}
            label="HOURS"
            isDarkMode={isDarkMode}
            isLandscape={isLandscape}
          />
          <Text style={separatorStyle}>:</Text>
          <TimeSegment
            value={minutes}
            label="MINUTES"
            isDarkMode={isDarkMode}
            isLandscape={isLandscape}
          />
          <Text style={separatorStyle}>:</Text>
          <TimeSegment
            value={seconds}
            label="SECONDS"
            isDarkMode={isDarkMode}
            isLandscape={isLandscape}
          />
        </View>
      </View>
    </View>
  );
}

const TimeSegment = React.memo(
  ({
    value,
    label,
    isDarkMode,
    isLandscape,
  }: {
    value: string;
    label: string;
    isDarkMode: boolean;
    isLandscape: boolean;
  }) => {
    const segmentStyle = useMemo(
      () => [styles.segment, isLandscape && styles.segmentLandscape],
      [isLandscape],
    );

    const timeValueStyle = useMemo(
      () => [
        styles.timeValue,
        isLandscape && styles.timeValueLandscape,
        isDarkMode ? styles.darkText : styles.lightText,
      ],
      [isLandscape, isDarkMode],
    );

    const timeLabelStyle = useMemo(
      () => [
        styles.timeLabel,
        isLandscape && styles.timeLabelLandscape,
        isDarkMode ? styles.darkTextSecondary : styles.lightTextSecondary,
      ],
      [isLandscape, isDarkMode],
    );

    return (
      <View style={segmentStyle}>
        <Text style={timeValueStyle}>{value}</Text>
        <Text style={timeLabelStyle}>{label}</Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  dateContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dateContainerLandscape: {
    paddingBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 1,
    textAlign: 'center',
  },
  dateTextLandscape: {
    fontSize: 16,
  },
  clockContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  clockContainerLandscape: {
    paddingVertical: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  timeRowLandscape: {
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  segmentLandscape: {
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: {
    fontSize: 72,
    fontWeight: '200',
    letterSpacing: 2,
    marginBottom: 8,
  },
  timeValueLandscape: {
    fontSize: 120,
    letterSpacing: 4,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  timeLabelLandscape: {
    fontSize: 14,
  },
  separator: {
    fontSize: 72,
    fontWeight: '200',
    marginBottom: 8,
  },
  separatorLandscape: {
    fontSize: 120,
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  darkTextSecondary: {
    color: '#CCCCCC',
  },
  lightTextSecondary: {
    color: '#666666',
  },
});

export default App;
