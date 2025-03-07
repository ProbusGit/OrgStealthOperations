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
  import React, { useCallback, useEffect, useRef, useState } from 'react';
  import Geolocation from 'react-native-geolocation-service';
 import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
  import { useAddTrackTimeMutation } from './src/redux/services/attendance/attendanceApiSlice';
  import DeviceInfo from 'react-native-device-info';
  import { useAppSelector } from './src/redux/hooks/hooks';
  let ReactNativeForegroundService = Platform.OS === 'android' ? require('@supersami/rn-foreground-service').default : null;
  const Track = () => {
    const { employeeDetails } = useAppSelector((state) => state.employee);
    const watchIdRef = useRef(null);
    const [addTrack, addTrackResult] = useAddTrackTimeMutation();
    const [batteryStatus, setBatteryStatus] = useState('0');
  
    useEffect(() => {
      if (Platform.OS === 'android') {
        requestLocationPermission();
        requestNotificationPermission();
      }
      updateForeground();
      Notification();
      startTracking();
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
      if (Platform.OS === 'ios') {
        const status = await request(PERMISSIONS.IOS.NOTIFICATIONS);
        if (status === RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      } else {
        // Android handles notification permissions differently
        // It does not need explicit permission request for notifications
        const status = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (status === RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
        console.log('Notification permission not explicitly required on Android');
      }
    };
  
    const updateForeground = () => {
      ReactNativeForegroundService.add_task(() => startTracking(), {
        delay: 1000,
        onLoop: true,
        taskId: 'taskid',
        onError: e => console.log(`Error logging:`, e),
      });
    };
    const removeForeground = () => {
      ReactNativeForegroundService.remove_task('taskid');
    }
    const Notification = () => {
      ReactNativeForegroundService.start({
        id: 1244,
        title: 'Foreground Service',
        message: 'We are live World',
        icon: 'ic_launcher',
        visibility: 'public',
        number: 1,
        button: true,
        button2: true,
        buttonText: 'Button',
        button2Text: 'Another Button',
        buttonOnPress: 'cray',
        setOnlyAlertOnce: true,
        color: '#000000',
        progress: {
          max: 100,
          curr: 50,
        },
        importance: 'high',
      });
      startTracking();
    };
  
    const getCurrentPayload = async (latitude, longitude) => {
      const deviceId = DeviceInfo.getDeviceId();
      const ip = await DeviceInfo.getIpAddress();
      const currentDate = new Date();
      const logDate = currentDate.toISOString().split('T')[0];
      const logTime = currentDate.toTimeString().split(' ')[0];
      const batteryStatus = await DeviceInfo.getBatteryLevel();
      return {
        mid: deviceId,
        mip: ip,
        hR_EMPMAIN_Formid: '151', // Replace this with the actual employee ID
        logDate: logDate,
        logTime: logTime,
        gpsLat: latitude.toString(),
        gpsLog: longitude.toString(),
        batteryStatus: (batteryStatus * 100).toFixed(0), // Battery level in percentage
      };
    };
  
    const startTracking = async () => {
      Geolocation.requestAuthorization('always');
      Geolocation.getCurrentPosition(
        async position => {
          const { longitude, latitude } = position.coords;
          console.log(longitude, latitude);
  
          const payload = await getCurrentPayload(latitude, longitude);
          addTrack(payload)
            .unwrap()
            .then(response => {
              console.log('addTrack Resp', response);
            })
            .catch(err => {
              console.log('error sending coordinates', err);
            });
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    };
  
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ color: 'red', fontWeight: '600', fontSize: 20, margin: 30 }}>
          Location Tracking
        </Text>
        {Platform.OS === 'android' && (
          <Button onPress={Notification} title="Start Tracking" />
        )}
        <Button onPress={removeForeground} title="Remove Tracking" />
  
      </View>
    );
  };
  
  export default Track;
  
  const styles = StyleSheet.create({});
  