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
const getAccurateLocation = async (maxAttempts = 3, timeout = 15000, minAccuracy = 50) => {
  let attempts = 0;

    
    try {
      const location = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Location request timed out'));
        }, timeout);

        Geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            resolve(position);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: timeout,
            distanceFilter: 0,
            forceRequestLocation: true
          }
        );
      });

      if (location.coords.accuracy <= minAccuracy) {
        return location;
      } else {
        console.warn(`Attempt ${attempts}: Poor accuracy (${location.coords.accuracy}m > ${minAccuracy}m)`);
        ReactNativeForegroundService.update({
          id: 1244,
          title: 'Weak GPS Signal',
          message: `Attempting better location`,
          icon: 'ic_launcher',
          color: '#FFA500', // Orange for warning
          importance: 'high',
          visibility: 'public',
          ServiceType:'location',
          number: '1',
          buttonOnPress: 'cray',
          setOnlyAlertOnce: 'true',
          vibration: true,
        });
      }
    } catch (error) {
      console.warn(`Attempt ${attempts} failed:`, error.message);
    }

    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
  

  throw new Error(`Failed to get location with required accuracy`);
};
  // Function to start tracking
  const startTracking = async () => {
    
    Geolocation.requestAuthorization('always');
    console.log('Started tracking');
    
    const providers = await DeviceInfo.isLocationEnabled();
    if (!providers) {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        ReactNativeForegroundService.update({
          id: 1244,
          title: 'GPS Disabled and No Network!',
          message: 'Please turn on GPS and check network',
          icon: 'ic_launcher',
          color: 'red',
          importance: 'high',
          vibration: true,
        });
      }
      
      ReactNativeForegroundService.update({
        id: 1244,
        title: 'GPS Disabled',
        message: 'Please enable location services',
        icon: 'ic_launcher',
        color: '#FF0000',
        importance: 'high',
      });
      return;
    }

    try {
      // Use the new accurate location function
      const position = await getAccurateLocation();
      const {longitude, latitude} = position.coords;

      const payload = await getCurrentPayload(latitude, longitude);
      const netInfo = await fetch();
      
      if (netInfo.isConnected) {
        await addTrack(payload).unwrap();
        keepNotificationAwake();
      } else {
        await storePayload(payload);
        ReactNativeForegroundService.update({
          id: 1244,
          title: 'Location Saved Offline',
          message: 'Will sync when network returns',
          icon: 'ic_launcher',
          color: '#0000FF', // Blue for info
          importance: 'high'
        });
      }
    } catch (error) {
      console.log('Final location error:', error);
      
      if (error.message.includes('Poor accuracy') || error.message.includes('Failed to get location')) {
        ReactNativeForegroundService.update({
          id: 1244,
          title: 'Location Inaccurate',
          message: 'Move to open area for better GPS',
          icon: 'ic_launcher',
          color: '#FFA500',
          vibration: true,
          importance: 'high'
        });
      } else {
        ReactNativeForegroundService.update({
          id: 1244,
          title: 'Location Error',
          message: error.message,
          icon: 'ic_launcher',
          color: '#FF0000',
          vibration: true,
          importance: 'high'
        });
      }
    }
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