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
// import {
//   useAddTrackTimeMutation,
//   useGetTrackTimeQuery,
// } from '../../../../redux/services/attendance/attendanceApiSlice';
import { useAddTrackTimeMutation, useGetTrackTimeQuery } from '../../../redux/services/attendance/attendanceApiSlice';
import { useAppSelector } from '../../../redux/hooks/hooks';
import {convertToMilliseconds} from './helper';
// import {
//   getLocationTracking,
//   saveLocationTracking,
//   clearLocationTracking,
// } from '../../../../components/services/sqlite/locationTracking';
import {isLocationEnabled} from 'react-native-android-location-enabler';

import { mmkvKeys } from '../..';
import AsyncStorage from '@react-native-async-storage/async-storage';
let ReactNativeForegroundService = Platform.OS === 'android' ? require('@supersami/rn-foreground-service').default : null;
const useTrackUser = () => {
  const [isConnected, setIsConnected] = useState(true);

  // const {employeeDetails} = useAppSelector(state => state.employee);
  const watchIdRef = useRef(null);
  const [addTrack, addTrackResult] = useAddTrackTimeMutation();
  const [batteryStatus, setBatteryStatus] = useState('0');
  const {data: trackTime} = useGetTrackTimeQuery(null);

  const syncOfflineData = async () => {
    // try {
    //   const offlineData = await getLocationTracking(); // Retrieve offline data from DB
    //   console.log('offlineData', offlineData);
    //   if (offlineData.length > 0) {
    //     try {
    //       await addTrack(offlineData); // Replace with your actual API call\

    //       await clearLocationTracking();
    //     } catch (err) {
    //       console.error('Error syncing offline data', err);
    //     }

    //     console.log('Offline data synced successfully', offlineData);
    //     // Here, you might want to clear the data from the DB after successful sync
    //   }
    // } catch (error) {
    //   console.error('Error syncing offline data:', error);
    // }
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
      button: true,
      button2: true,
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

  const startTracking = async () => {
    Geolocation.requestAuthorization('always');
console.log('started tracking')
    Geolocation.getCurrentPosition(
      async position => {
        const {longitude, latitude} = position.coords;
        const payload = await getCurrentPayload(latitude, longitude);
        const netInfo = await fetch();
        if (netInfo.isConnected) {
          await syncOfflineData();
          console.log('location fetched position',position)
          addTrack(payload)
            .unwrap()
            .then(response => {
              console.log('addTrack Resp', response);
              keepNotificationAwake();
            })
            .catch(async err => {
              console.log('Error sending coordinates', err);
              // Store data offline if network is unavailable
              console.log('saving offline payload', payload);
              // await saveLocationTracking(payload); // Save data to DB instead of MMKV
              keepNotificationAwake();
            });
        } else {
          // Store data offline if network is unavailable
          console.log('saving offline payload', payload);
          // await saveLocationTracking(payload); // Save data to DB instead of MMKV
          keepNotificationAwake();
        }
      },
      async error => {
        console.log('error', error.code, error.message);
        // Check if the error is due to GPS being disabled
        if (error.code === -1 || error.code === 2 || error.code == 1) {
          // Error codes for GPS not available
          console.log('gps off');
          alertNotificationForGPS();
        }

        // Store data offline in case of any other errors
        // await saveLocationTracking([]); // Save empty payload to DB for debugging purposes
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
    );
  };

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