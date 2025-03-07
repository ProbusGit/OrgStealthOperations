import SplashScreen from './Splash';
export default SplashScreen;








// import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { screenNames } from '../../navigation/rootNavigator/types';
// import { useAppTheme } from '../../theme';
// import { useMMKVObject } from 'react-native-mmkv';
// import { mmkvKeys } from '../../common';
// import { useLoginMutation } from '../../redux/services/auth/login/LoginApiSlice';
// import { useGetLatestInOutQuery } from '../../redux/services/attendance/attendanceApiSlice';
// import ReactNativeForegroundService from '@supersami/rn-foreground-service';

// const SplashScreen = () => {
//   const theme = useAppTheme();
//   const navigation = useNavigation();
//   const [userCredentials, setUserCredentials] = useMMKVObject(mmkvKeys.userCredentials);
//   const { data: checkInoutData } = useGetLatestInOutQuery();
//   const [loginUser] = useLoginMutation();
//   const [localUserDetails, setLocalUserDetails] = useMMKVObject(mmkvKeys.userDetails);


//   useEffect(() => {
//     const fetchData = async () => {
//      const is_task_running= ReactNativeForegroundService.is_task_running("trackUser");
//      console.log('is_task_running',is_task_running)
//       // Request location permission
//       const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
//       const result = await check(permission);

//       if (result === RESULTS.DENIED) {
//         const requestResult = await request(permission);
//         if (requestResult !== RESULTS.GRANTED) {
//           Alert.alert(
//             'Location Permission',
//             'Location permission is required to use this feature',
//             [{ text: 'OK' }],
//           );
//           return;
//         }
//       }

//       if (userCredentials) {
//         try {
//           const result = await loginUser(userCredentials).unwrap();
//           await saveUserDetails();
//           if (checkInoutData?.data) {
//             dispatch(setCheckInOutData(checkInoutData?.data));
//           }
//           navigation.replace(screenNames.mainNavigator);
//         } catch (error) {
//           console.error(error?.data);
//           Alert.alert(
//             'Login Failed',
//             error?.data?.message || 'An error occurred during login',
//           );
//           navigation.replace('Login');
//         }
//       } else {
//         navigation.replace('Login');
//       }
//     };

//     fetchData();
//   }, [userCredentials, checkInoutData?.data]);

//   useEffect(() => {
//     const checkLoginState = async () => {
//       try {
//         const employeeId = await AsyncStorage.getItem('employeeId');
//         if (employeeId) {
//           // If an employeeId exists, navigate to the WebView screen
//           navigation.navigate(screenNames.myWebView);
//         } else {
//           // If no employeeId exists, navigate to the login screen
//           navigation.navigate(screenNames.login);
//         }
//       } catch (error) {
//         console.error('Failed to fetch employeeId', error);
//         navigation.navigate(screenNames.login);
        
//       }
//     };

//     const timer = setTimeout(() => {
//       checkLoginState();
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [navigation]);

//   return (
//     <LinearGradient
//       colors={['#000000', '#434343', '#7d7d7d', '#b0b0b0']}
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}>
//       <Text style={{ color: '#ffffff', fontSize: 34, fontWeight: 'bold' }}>
//         Stealth Group
//       </Text>
//     </LinearGradient>
//   );
// };

// export default SplashScreen;








// import { useMMKVString } from 'react-native-mmkv';
// import { mmkvKeys } from '../../common'; // Adjust the import path as needed

// useEffect(() => {
//   const checkLoginState = async () => {
//     // Use MMKV to get the employeeId
//     const [employeeId] = useMMKVString(mmkvKeys.employeeId);

//     if (employeeId) {
//       // If an employeeId exists, navigate to the WebView screen
//       navigation.navigate(screenNames.myWebView);
//     } else {
//       // If no employeeId exists, navigate to the login screen
//       navigation.navigate(screenNames.login);
//     }
//   };

//   const timer = setTimeout(() => {
//     checkLoginState();
//   }, 2000);

//   return () => clearTimeout(timer);
// }, [navigation]);



