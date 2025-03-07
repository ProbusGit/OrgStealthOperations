import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity,  Alert, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../../redux/hooks/hooks';
import useTrackUser from '../../common/helper/userTracking/useLocationTracking';
import { useStartDayMutation, useEndDayMutation, useGetStartEndDayDetailsQuery } from '../../redux/services/activity/ActivitySlice';
import { convertToMilliseconds } from '../../common/helper/userTracking/helper';
import { useGetTrackDataQuery } from '../../redux/services/user/userApiSlice';
import { Text } from 'react-native-paper';

const HomeScreen = () => {
  const [isDayStarted, setIsDayStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackMessage, setSnackMessage] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({ mid: '', mip: '' });
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [employeeId, setEmployeeId] = useState(null); // State to store employeeId
  const { data: startEndDayDetails } = useGetStartEndDayDetailsQuery();
  const {data:trackTimeData}=useGetTrackDataQuery();
  console.log('trackTimeData',trackTimeData)
  const [startDay] = useStartDayMutation();
  const [endDay] = useEndDayMutation();
  const { updateForeground, removeForeground, } = useTrackUser();

  console.log('startEndDayDetails', startEndDayDetails);

  // Initialize the state based on startEndDayDetails
  useEffect(() => {
    if (startEndDayDetails) {
      setIsDayStarted(startEndDayDetails.status === 'in');
    }
  }, [startEndDayDetails]);

  // Fetch employee ID from AsyncStorage on component mount
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const id = await AsyncStorage.getItem('employeeId');
        if (id) {
          setEmployeeId(id);
        } else {
          console.error('No employeeId found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to fetch employeeId from AsyncStorage:', error);
      }
    };

    fetchEmployeeId();
  }, []);

  // Fetch device information and location on component mount
  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const mid = await DeviceInfo.getUniqueId();
        const mip = await DeviceInfo.getIpAddress();
        setDeviceInfo({ mid, mip });
      } catch (err) {
        setError('Failed to fetch device information');
        setSnackMessage('Failed to fetch device information');
      }
    };

    const fetchLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        error => {
          setError('Failed to fetch location');
          setSnackMessage('Failed to fetch location');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    };

    fetchDeviceInfo();
    fetchLocation();
  }, []);

  // Hardcoded 5-minute interval for tracking location
  useEffect(() => {
    const interval = setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          console.log('Location updated every 5 minutes:', position.coords);
        },
        error => {
          console.log('Failed to fetch location during tracking:', error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    }, 300000); // 5 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  const toggleCheckInOut = async () => {
    if(trackTimeData && Platform.OS=='android'){

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
        if(trackTimeData && Platform.OS=='android'){
          removeForeground();
        }
    
        setSnackMessage('Day ended successfully');
      } else {
        const response = await startDay(payload).unwrap();
        console.log('Start day response:', response);
        setSnackMessage('Day started successfully');
        if(trackTimeData && Platform.OS=='android'){
          updateForeground(convertToMilliseconds(trackTimeData));
        }

       
      }

      setIsDayStarted(!isDayStarted);
    } catch (err) {
      console.error('Error during API call:', err);
      setError(err?.data?.message || 'Failed to update day status');
      Alert.alert('Error', err?.data?.message || 'Failed to update day status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={isDayStarted ? 'check-circle' : 'check-circle-outline'}
          size={100}
          color={isDayStarted ? 'green' : 'gray'}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={toggleCheckInOut}>
        <Text style={styles.buttonText}>
          {isDayStarted ? 'Check Out' : 'Check In'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.statusText}>
        {isDayStarted ? 'You are checked in!' : 'You are not checked in.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  iconContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1d1d1c',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default HomeScreen;
