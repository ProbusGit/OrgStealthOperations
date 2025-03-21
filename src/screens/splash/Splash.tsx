import React, {useEffect} from 'react';
import {View, Text, Platform, Alert, NativeModules, PermissionsAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {screenNames} from '../../navigation/rootNavigator/types';
import {useAppTheme} from '../../theme';
import {useMMKVObject} from 'react-native-mmkv';
import {mmkvKeys} from '../../common';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {useLoginMutation} from '../../redux/services/auth/login/LoginApiSlice';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import { useAppDispatch } from '../../redux/hooks/hooks';
import { setCheckInOutData } from '../../redux/slices/attendance';

const SplashScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const dispatch=useAppDispatch()
  // const { data: checkInoutData } = useGetLatestInOutQuery();
  const [loginUser] = useLoginMutation();

  const {BatteryOptimization} = NativeModules;
  useEffect(() => {
    if(Platform.OS=='android'){
      checkBatteryOptimization();
    }

    requestNotificationPermission();
  }, []);
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

  const checkBatteryOptimization = async () => {
    try {
      const isOptimized =
        await BatteryOptimization.isBatteryOptimizationEnabled();
      if (isOptimized) {
        BatteryOptimization.openBatteryOptimizationSettings();
      }
    } catch (error) {
      console.error(error.toString());
    }
  };

  useEffect(() => {
    const fetchData = async () => {
 
      // Request location permission
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      const result = await check(permission);

      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        if (requestResult !== RESULTS.GRANTED) {
          Alert.alert(
            'Location Permission',
            'Location permission is required to use this feature',
            [{text: 'OK'}],
          );
          return;
        }
      }
      const userID = await AsyncStorage.getItem('userID');
      const password = await AsyncStorage.getItem('password');
      if (userID && password) {
        try {
          const checkInoutData = await loginUser({userID, password}).unwrap();
          console.log('Login Result',checkInoutData)
          // await saveUserDetails();
          if (checkInoutData?.data) {
            dispatch(setCheckInOutData(checkInoutData?.data));
          }
          navigation.replace(screenNames.myWebView);
        } catch (error) {
          console.error(error?.data);
          Alert.alert(
            'Login Failed',
            error?.data?.message || 'An error occurred during login',
          );
          navigation.replace(screenNames.login);
        }
      } else {
        navigation.replace(screenNames.login);
      }
    };

    fetchData();
  }, []);

  // const saveUserDetails = async () => {
  //   let userDetails = await getRemoteUserDetails('').unwrap();
  //   if (userDetails?.data) {
  //     setLocalUserDetails(userDetails.data);
  //   } else {
  //     userDetails = localUserDetails;
  //   }
  //   dispatch(setEmployeeDetails(userDetails.data));
  //   if (userDetails?.data?.role) {
  //     dispatch(setRole(userDetails.data?.role.toLowerCase()));
  //   }
  // };

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const employeeId = await AsyncStorage.getItem('employeeId');
        if (employeeId) {
          // If an employeeId exists, navigate to the WebView screen
          navigation.replace(screenNames.myWebView);
        } else {
          // If no employeeId exists, navigate to the login screen
          navigation.replace(screenNames.login);
        }
      } catch (error) {
        console.error('Failed to fetch employeeId', error);
        navigation.replace(screenNames.login);
      }
    };

    const timer = setTimeout(() => {
      checkLoginState();
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#000000', '#434343', '#7d7d7d', '#b0b0b0']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: '#ffffff', fontSize: 34, fontWeight: 'bold'}}>
        Stealth Group
      </Text>
    </LinearGradient>
  );
};

export default SplashScreen;
