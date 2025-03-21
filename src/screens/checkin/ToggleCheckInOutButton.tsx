import React, { useState } from 'react';
import { TouchableOpacity, Alert, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { convertToMilliseconds } from '../../common/helper/userTracking/helper';

type ToggleCheckInOutButtonProps = {
  isDayStarted: boolean;
  setIsDayStarted: (value: boolean) => void;
  deviceInfo: { mid: string; mip: string };
  location: { latitude: number; longitude: number };
  employeeId: string;
  trackTimeData: any; // Replace 'any' with the appropriate type if known
  updateForeground: (time: number) => void;
  removeForeground: () => void;
  startDay: (payload: any) => Promise<any>; // Replace 'any' with the appropriate type if known
  endDay: (payload: any) => Promise<any>; // Replace 'any' with the appropriate type if known
  setSnackMessage: (message: string) => void;
};

const ToggleCheckInOutButton: React.FC<ToggleCheckInOutButtonProps> = ({
  isDayStarted,
  setIsDayStarted,
  deviceInfo,
  location,
  employeeId,
  trackTimeData,
  updateForeground,
  removeForeground,
  startDay,
  endDay,
  setSnackMessage,
}) => {
  const [loading, setLoading] = useState(false);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const toggleCheckInOut = async () => {
    if (trackTimeData && Platform.OS === 'android') {
      updateForeground(convertToMilliseconds(trackTimeData));
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const formattedTime = getCurrentTime();

    if (!formattedTime) {
      console.error('Time is undefined or invalid');
      Alert.alert('Error', 'Failed to get current time.');
      return;
    }

    if (!employeeId) {
      Alert.alert('Error', 'Employee ID is not available. Please check your login status.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        mid: deviceInfo.mid,
        mip: deviceInfo.mip,
        hR_EMPMAIN_FormId: employeeId,
        ...(isDayStarted
          ? {
              outDate: formattedDate,
              outTime: formattedTime,
              outLat: location.latitude,
              outLong: location.longitude,
              status: 'inout',
            }
          : {
              inDate: formattedDate,
              inTime: formattedTime,
              inLat: location.latitude,
              inLong: location.longitude,
              status: 'in',
            }),
      };

      console.log('Payload:', payload);

      if (isDayStarted) {
        const response = await endDay(payload).unwrap();
        console.log('End day response:', response);
        if (trackTimeData && Platform.OS === 'android') {
          removeForeground();
        }
        setSnackMessage('Day ended successfully');
      } else {
        const response = await startDay(payload).unwrap();
        console.log('Start day response:', response);
        setSnackMessage('Day started successfully');
        if (trackTimeData && Platform.OS === 'android') {
          updateForeground(convertToMilliseconds(trackTimeData));
        }
      }

      setIsDayStarted(!isDayStarted);
    } catch (err) {
      console.error('Error during API call:', err);
      Alert.alert('Error', err?.data?.message || 'Failed to update day status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={{ backgroundColor: '#1d1d1c', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, marginTop: 10 }} onPress={toggleCheckInOut} disabled={loading}>
      <Text style={{ fontSize: 18, color: '#ffffff', fontWeight: 'bold' }}>
        {isDayStarted ? 'Check Out' : 'Check In'}
      </Text>
    </TouchableOpacity>
  );
};

export default ToggleCheckInOutButton;
