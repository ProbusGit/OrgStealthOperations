import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  Button,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import NetInfo, {fetch} from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import { useAddTrackTimeMutation, useGetTrackTimeQuery } from '../../../redux/services/attendance/attendanceApiSlice';
import { useAppSelector } from '../../../redux/hooks/hooks';
import {convertToMilliseconds} from './helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

let ReactNativeForegroundService = Platform.OS === 'android' ? require('@supersami/rn-foreground-service').default : null;

const useTrackUser = () => {
  const [isConnected, setIsConnected] = useState(true);
  const watchIdRef = useRef(null);
  const [addTrack, addTrackResult] = useAddTrackTimeMutation();
  const [batteryStatus, setBatteryStatus] = useState('0');
  const {data: trackTime} = useGetTrackTimeQuery(null);

  // Key for storing offline payloads in AsyncStorage
  const OFFLINE_PAYLOADS_KEY = 'offline_payloads';

  // Function to store payloads locally
  const storePayload = async (payload) => {
    try {
      console.log('Payloads: start net', payload);
      const existingPayloads = await AsyncStorage.getItem(OFFLINE_PAYLOADS_KEY);
      const payloads = existingPayloads ? JSON.parse(existingPayloads) : [];
      payloads.push(payload);
      console.log('Payloads: stop net', payloads);
      await AsyncStorage.setItem(OFFLINE_PAYLOADS_KEY, JSON.stringify(payloads));
      console.log('Payload stored offline:', payload);
    } catch (error) {
      console.error('Error storing payload:', error);
    }
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
      requestNotificationPermission();
    }
  }, []);

  const isTrackingAvailable = () => {
    return trackTime && trackTime?.data != null;
  };

  const startTrackingUser = () => {
    const trackingInterval = convertToMilliseconds(trackTime.data);
    updateForeground(trackingInterval);
  };

  const stopTrackingUser = () => {
    removeForeground();
  };

  // Function to retrieve stored payloads
  const getStoredPayloads = async () => {
    try {
      console.log('Getting stored payloads');
      const payloads = await AsyncStorage.getItem(OFFLINE_PAYLOADS_KEY);
      return payloads ? JSON.parse(payloads) : [];
    } catch (error) {
      console.error('Error retrieving stored payloads:', error);
      return [];
    }
  };

  // Function to clear stored payloads
  const clearStoredPayloads = async () => {
    try {
      console.log('Clearing stored payloads');
      await AsyncStorage.removeItem(OFFLINE_PAYLOADS_KEY);
      console.log('Stored payloads cleared');
    } catch (error) {
      console.error('Error clearing stored payloads:', error);
    }
  };

  // Function to sync offline data when network is restored
  const syncOfflineData = async () => {
    console.log('Syncing offline data');
    const storedPayloads = await getStoredPayloads();
    console.log('Stored payloads:', storedPayloads);
    if (storedPayloads.length > 0) {
      try {
        for (const payload of storedPayloads) {
          await addTrack(payload).unwrap();
          console.log('addTrack Resp', payload);
          console.log('Offline payload synced:', payload);
        }
        await clearStoredPayloads(); // Clear stored payloads after successful sync
      } catch (err) {
        console.error('Error syncing offline data:', err);
      }
    }
  };

  // Network connectivity listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      //setIsConnected(state.isConnected);
      if (state.isConnected) {
        console.log('Network restored');
        syncOfflineData(); // Sync offline data when network is restored
      }
    });

    return () => unsubscribe();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }

      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message:
            'We need access to your location so you can get live quality updates.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } catch (err) {
      console.warn(err);
    }
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'We need permission to send you notifications.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
  
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };
  const updateForeground = interval => {
    if (!interval) {
      Alert.alert('No Time Interval Provided');
    return;
    }
    startNotification();
    const taskId = ReactNativeForegroundService.add_task(
      () => startTracking(),
      {
        delay: interval,
        onLoop: true,
        taskId: 'trackUser',
        onSuccess() {
          console.log('location Tracking started with taskId', taskId);
        },
        onError: e => console.log(`Error logging:`, e),
      },
    );
   
  };

  const removeForeground = () => {
    ReactNativeForegroundService.stopAll();
    ReactNativeForegroundService.remove_task('trackUser');
  };

  const updateNotification = () => {
    ReactNativeForegroundService.update({
      id: 1244,
      title: 'Tracking Disabled!',
      message: 'Location Tracking Stopped',
      icon: 'ic_launcher',
      visibility: 'public',
      number: '1',
      button: true,
      button2: true,
      buttonOnPress: 'cray',
      setOnlyAlertOnce: 'true',
      color: '#000000',
      importance: 'high',
      vibration: true,
    });
  };
  const keepNotificationAwake = () => {
    ReactNativeForegroundService.update({
      id: 1244,
      title: 'Tracking Location!',
      message: 'Location Tracking Started',
      icon: 'ic_launcher',
      setOnlyAlertOnce: 'true',
      ServiceType:'location',
      color: '#000000',
      progress: {
        max: 100,
        curr: 50,
      },
      importance:'high'
    });
  };
  const alertNotificationForGPS = () => {
    ReactNativeForegroundService.update({
      id: 1244,
      title: 'GPS Disabled!',
      message: 'Please turn on GPS.',
      icon: 'ic_launcher',
      visibility: 'public',
      ServiceType:'location',
      number: '1',
      buttonOnPress: 'cray',
      setOnlyAlertOnce: 'true',
      color: '#000000',
      importance: 'high',
      vibration: true,
    });
  };

  const startNotification = () => {
    ReactNativeForegroundService.start({
      id: 1244,
      title: 'Tracking Location!',
      message: 'Location Tracking Started',
      ServiceType:'location',
      icon: 'ic_launcher',
      setOnlyAlertOnce: 'true',
      color: '#000000',
      progress: {
        max: 100,
        curr: 50,
      },
      importance:'high'
    });
  };

  // Function to get current payload
  const getCurrentPayload = async (latitude, longitude) => {
    const deviceId = DeviceInfo.getDeviceId();
    const ip = await DeviceInfo.getIpAddress();
    const currentDate = new Date();
    const logDate = currentDate.toISOString().split('T')[0];
    const logTime = currentDate.toTimeString().split(' ')[0];
    const batteryStatus = await DeviceInfo.getBatteryLevel();
    return [
      {
        mid: deviceId,
        mip: ip,
        hR_EMPMAIN_Formid: await AsyncStorage.getItem('employeeId'), // Replace this with the actual employee ID
        logDate: logDate,
        logTime: logTime,
        gpsLat: latitude.toString(),
        gpsLog: longitude.toString(),
        batteryStatus: (batteryStatus * 100).toFixed(0), // Battery level in percentage
      },
    ];
  };

  // Function to start tracking
  const startTracking = async () => {
    Geolocation.requestAuthorization('always');
    console.log('Started tracking');
    console.log('===========');
    const providers = await DeviceInfo.isLocationEnabled();
    console.log('providers=========', providers, typeof providers, providers == false, providers == true)
    if (providers == false) {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected === false) {
        ReactNativeForegroundService.update({
          id: 1244,
          title: 'GPS Disabled and No Network!',
          message: 'Please turn on GPS and check your network connection.',
          // message: 'Please turn on GPS.',
          icon: 'ic_launcher',
          visibility: 'public',
          ServiceType:'location',
          number: '1',
          buttonOnPress: 'cray',
          setOnlyAlertOnce: 'true',
          color: 'red',
          importance: 'high',
          vibration: true,
        })
      }
    console.log('providers======;')
      ReactNativeForegroundService.update({
          id: 1244,
          title: 'GPS off. Tracking stopped. Check location settings.',
          message: 'GPS is disabled. Tracking has stopped. Please check if your location is turned on.',
          icon: 'ic_launcher',
          visibility: 'public',
          ServiceType: 'location',
          number: '1',
          buttonOnPress: 'cray',
          setOnlyAlertOnce: 'true',
          color: '#FF0000',
          importance: 'high',
          vibration: true,
        });
    }else
    Geolocation.getCurrentPosition(
      async position => {
        const {longitude, latitude} = position.coords;
        const payload = await getCurrentPayload(latitude, longitude);
        const netInfo = await fetch();
        console.log('NetInfo:', netInfo.isConnected);
        if (netInfo.isConnected) {
          try {
            await addTrack(payload).unwrap();
            console.log('addTrack Resp', payload);
            keepNotificationAwake();
          } catch (err) {
            ReactNativeForegroundService.update({
          id: 1244,
          title: err,
          message: err+'! Please check.',
          icon: 'ic_launcher',
          visibility: 'public',
          number: '1',
          buttonOnPress: 'cray',
          setOnlyAlertOnce: 'true',
          color: '#000000',
          importance: 'high',
          vibration: true,
        });
            console.log('Error sending coordinates:', err);
            await storePayload(payload); // Store payload offline if API call fails
          }
        } else {
           ReactNativeForegroundService.update({
          id: 1244,
          title: 'Check You Network!',
          message: 'Please check your network connection.',
          icon: 'ic_launcher',
          visibility: 'public',
          number: '1',
          buttonOnPress: 'cray',
          setOnlyAlertOnce: 'true',
          color: '#000000',
          importance: 'high',
          vibration: true,
        });
          console.log('Error sending coordinates:',);
          await storePayload(payload); // Store payload offline if network is unavailable
        }
      },
      error => {
        console.log('Failed to fetch location during tracking:', error);
        ReactNativeForegroundService.update({
          id: 1244,
          title: 'GPS Disabled!',
          message: 'Please turn on GPS to continue tracking.',
          icon: 'ic_launcher_red', // Use a red icon to indicate importance (ensure the icon exists in your resources)
          visibility: 'public',
          ServiceType: 'location',
          number: '1',
          buttonOnPress: 'cray',
          setOnlyAlertOnce: 'true',
          color: '#FF0000', // Red color to indicate urgency
          importance: 'high', // High importance for critical notifications
          vibration: true,
        });
        Alert.alert('Location Error', 'Please enable GPS to proceed.');
        console.log('Error fetching location:', error);
        if (error.code === -1 || error.code === 2 || error.code == 1) {
          alertNotificationForGPS();
        }
      },
    );

  };

  // Other functions (updateForeground, removeForeground, etc.) remain unchanged

  return {
    requestLocationPermission,
    requestNotificationPermission,
    updateForeground,
    removeForeground,
    startNotification,
    startTracking,
    isTrackingAvailable,
    startTrackingUser,
    stopTrackingUser,
  };
};

export default useTrackUser;