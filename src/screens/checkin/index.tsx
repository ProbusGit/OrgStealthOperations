import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform, Linking, PermissionsAndroid } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../../redux/hooks/hooks';
import useTrackUser from '../../common/helper/userTracking/useLocationTracking';
import { useStartDayMutation, useEndDayMutation, useGetStartEndDayDetailsQuery } from '../../redux/services/activity/ActivitySlice';
import { convertToMilliseconds } from '../../common/helper/userTracking/helper';
import { useGetTrackDataQuery, useLazyGetTrackDataQuery } from '../../redux/services/user/userApiSlice';
import { Text } from 'react-native-paper';
import { setSnackMessage } from '../../redux/slices/snackbarSlice';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '../../navigation/rootNavigator/types';
import { useLoginMutation } from '../../redux/services/auth/login/LoginApiSlice';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import RNLocation from 'react-native-location';
import { openSettings } from 'react-native-permissions';
const CheckInScreen = () => {
  const navigation = useNavigation();
  const [isDayStarted, setIsDayStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackMessage, setSnackMessage] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({ mid: '', mip: '' });
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [employeeId, setEmployeeId] = useState(null); // State to store employeeId
  const { data: startEndDayDetails } = useGetStartEndDayDetailsQuery();
  const [getTrackData, { data: effectiveTrackTimeData }] = useLazyGetTrackDataQuery();
  // const defaultTrackTime = '00:01:00';
  // const trackTimeData = effectiveTrackTimeData || defaultTrackTime;
  const [trackTimeData, setTrackTimeData] = useState('00:01:00');

  console.log('trackTimeData', trackTimeData)
  const [startDay] = useStartDayMutation();
  const [endDay] = useEndDayMutation();
  const { updateForeground, removeForeground, } = useTrackUser();

  console.log('startEndDayDetails', startEndDayDetails);
  const [login, { isLoading }] = useLoginMutation();
  // Initialize the state based on startEndDayDetails
  useEffect(() => {
    if (startEndDayDetails) {
      setIsDayStarted(startEndDayDetails?.status === 'in');
    }
  }, [startEndDayDetails]);


  const fetchLocation = async () => {
    try {
      console.log('Fetching location...');
      // First check if location services are enabled
      const isLocationEnabled = await RNLocation.checkSettings({
        android: {
          // Check both network and GPS providers
          providers: ['gps', 'network'],
        },
      });
      console.log('isLocationEnabled', isLocationEnabled)
      if (!isLocationEnabled) {
        // Prompt user to enable location
        await RNLocation.requestSettings({
          android: {
            rationale: {
              title: "Location Services Required",
              message: "This app needs location services to track your work hours.",
              buttonPositive: "Enable",
              buttonNegative: "Cancel"
            },
            providers: ['gps', 'network'],
          },
        });
      }
  
      // Now get the location
      const position = await RNLocation.getLatestLocation({ timeout: 10000 });
      console.log('position', position)
      if (position) {
        setLocation({
          latitude: position.latitude.toString(),
          longitude: position.longitude.toString(),
        });
      }
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchAllRequiredData = async () => {
      try {

        // Fetch location
        //fetchLocation();
        Geolocation.getCurrentPosition(
          position => {
            console.log('Location fetched:', position);
            setLocation({
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
            });
          },
          error => {
            console.log('Failed to fetch location:', error);
            setError('Failed to fetch location');
            setSnackMessage('Failed to fetch location');
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );

        // Fetch employeeId
        const id = await AsyncStorage.getItem('employeeId');
        if (id) setEmployeeId(id);

        // Fetch device info
        const mid = await DeviceInfo.getUniqueId();
        const mip = await DeviceInfo.getIpAddress();
        setDeviceInfo({ mid, mip });

        // Fetch track time data
        // const trackData = await getTrackData().unwrap();
        if (effectiveTrackTimeData) setTrackTimeData(effectiveTrackTimeData);


        // Check if day has started
        if (startEndDayDetails) {
          if (startEndDayDetails?.status === 'in') {
            setTimeout(() => {
              toggleCheckInOut();
            }, 5000);
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setError(error.message);
        setSnackMessage('Failed to fetch initial data ' + error?.message);
      }
    };

    fetchAllRequiredData();
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
          ReactNativeForegroundService.update({
            id: 1244,
            title: 'GPS Disabled!',
            message: 'Please turn on GPS.',
            icon: 'ic_launcher',
            visibility: 'public',
            ServiceType: 'location',
            number: '1',
            buttonOnPress: 'cray',
            setOnlyAlertOnce: 'true',
            color: '#000000',
            importance: 'high',
            vibration: true,
          });
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
  const checkLocationServices = async () => {
    if (Platform.OS === 'android') {

      let enabled;
console.log('checkLocationServices called');
const granted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  {
    title: 'Location Permission',
    message: 'This app needs access to your location',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  }
);
console.log('granted', granted);


      //enabled = await Geolocation.requestAuthorization('whenInUse');
   
      if (!granted) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services to use this feature',
          [
            { text: 'Cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => openSettings() 
            }
          ]
        );
        return false;
      }
    }
    return true;
  };
  const toggleCheckInOut = async (mode = '') => {
    const locationAvailable = await checkLocationServices();
    console.log('locationAvailable', locationAvailable)
  // if (!locationAvailable) {
  //    Alert.alert('Location services are diabled. Please enable them in settings.');
  //    return;}
    // console.log('toggleCheckInOut called with mode:', mode, location, deviceInfo, employeeId);
    // if (!employeeId || !location.latitude || !location.longitude || !deviceInfo.mid ) {
    //   Alert.alert('Error', 'Please wait while we prepare all required data...');
    //   return;
    // }
    const providers = await DeviceInfo.isLocationEnabled();

    console.log('providers=========', providers)
    if (providers === false) {
      Alert.alert(
        'Location Services Disabled',
        'Please enable location services to use this feature.',
        [{ text: 'OK' }],
      );
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
        color: '#000000',
        importance: 'high',
        vibration: true,
      });
    } else if (mode == 'change') {
      if (trackTimeData && Platform.OS == 'android') {

        updateForeground(convertToMilliseconds(trackTimeData));
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const formattedTime = getCurrentTime();setLoading(true);
      if (!formattedTime) {
        console.error('Time is undefined or invalid');
        Alert.alert('Error', 'Failed to get current time.');
        return;
      }

      if (!employeeId) {
        Alert.alert('Error', 'Employee ID is not available. Please try again later.');
        return;
      }
      if (!location.latitude || !location.longitude) {
        Alert.alert('Error', 'Location is not available. Please try again later.');
        return;
      }
      if (!deviceInfo.mid || !deviceInfo.mip) {
        Alert.alert('Error', 'Device information is not available. Please try again later.');
        return;
      }
    

      
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
          let response = []
          if (isDayStarted && mode == 'change') {
            try {
              response = await endDay(payload).unwrap();
            } catch (err) {
              console.log('Error during endDay API call:', err);
              const userID = await AsyncStorage.getItem('userID');
              const password = await AsyncStorage.getItem('password');
              if (!userID || !password) {
                console.error('UserID or Password not found in AsyncStorage');
                throw err; // Re-throw the error if credentials are missing
              }
              if (err?.data?.message === 'Updated connection string not found in session.') {
                console.log('Session expired. Redirecting to login...');
                await login({ userID, password }).unwrap();
                // Retry the API call after re-login
                response = await endDay(payload).unwrap();
              } else {
                throw err; // Re-throw the error if it's not the specific session error
              }
            }
            console.log('End day response:', response);
            if (trackTimeData && Platform.OS == 'android') {
              removeForeground();
            }

            setSnackMessage('Day ended successfully');
          } else{
            try {
              if (mode == 'change') {
                response = await startDay(payload).unwrap();
              }
            } catch (err) {
              console.log('Error during startDay API call:', err);
              const userID = await AsyncStorage.getItem('userID');
              const password = await AsyncStorage.getItem('password');
              if (!userID || !password) {
                console.error('UserID or Password not found in AsyncStorage');
                throw err; // Re-throw the error if credentials are missing
              }
              if (err?.data?.message === 'Updated connection string not found in session.') {
                console.log('Session expired. Redirecting to login...');
                await login({ userID, password }).unwrap();
                // Retry the API call after re-login
                response = await startDay(payload).unwrap();
              } else {
                throw err; // Re-throw the error if it's not the specific session error
              }
            }
            console.log('Start day response:', response);
            setSnackMessage('Day started successfully');
            if (trackTimeData && Platform.OS == 'android') {
              updateForeground(convertToMilliseconds(trackTimeData));
            }
          }
          if (mode == 'change') {
            changeMode()
          }
        

      } catch (err) {
        console.log('============Error during API call:', err);
        console.log('Error during endDay API call:', err);
        const userID = await AsyncStorage.getItem('userID');
        const password = await AsyncStorage.getItem('password');
        if (!userID || !password) {
          console.error('UserID or Password not found in AsyncStorage');
          throw err; // Re-throw the error if credentials are missing
        }
        if (err?.data?.message === 'Updated connection string not found in session.') {
          console.log('Session expired. Redirecting to login...');
          await login({ userID, password }).unwrap();
          // Retry the API call after re-login
        } else {
          setError(err?.data?.message);
          Alert.alert('Error', err?.data?.message);
          throw err; // Re-throw the error if it's not the specific session error
        }

      } finally {
        setLoading(false);
      }
    } else {
      if (trackTimeData && Platform.OS == 'android') {
        updateForeground(convertToMilliseconds(trackTimeData));
      }
    }
  };
    const changeMode = () => {
      console.log('changeMode================')
      setIsDayStarted(!isDayStarted);
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
        <TouchableOpacity style={styles.button} onPress={() => toggleCheckInOut('change')}>
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

  export default CheckInScreen;