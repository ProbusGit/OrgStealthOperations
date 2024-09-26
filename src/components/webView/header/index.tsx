// import React, { useEffect, useState, useCallback } from 'react';
// // import React, { useEffect, useState} from 'react';
// import {
//   ImageBackground,
//   Pressable,
//   View,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import FastImage from 'react-native-fast-image';
// import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
// // import { useNavigation, useTheme } from '@react-navigation/native';
// import {
//   NavigationActionType,
//   screenNames,
// } from '../../../navigation/rootNavigator/types';
// import useStyles from './useStyles';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import useHeader from './useHeader';
// import { useMMKV } from 'react-native-mmkv';
// import { CommonActions } from '@react-navigation/native';
// import greetUser from './greeting';
// import { useAppTheme } from '../../../theme';
// import axios from 'axios'; // Import Axios

// const images = {
//   sunny: require('../../../asset/images/webView/sunny.webp'),
//   cloudy: require('../../../asset/images/webView/cloudy.jpg'),
//   rainy: require('../../../asset/images/webView/rainy.jpg'),
//   scatterd: require('../../../asset/images/webView/scattered-cloud.jpg'),
//   snowy: require('../../../asset/images/webView/cloudy.jpg'),
//   defaultBackground: require('../../../asset/images/webView/cloudy.jpg'), // Fallback/default image
//   appImages: {
//     noProfile: require('../../../asset/images/webView/cloudy.jpg'),
//   },
// };

// type Props = {};

// const Header = (props: Props) => {
//   const styles = useStyles();
//   const theme = useTheme();
//   const { employeeDetails } = useHeader();
//   const { message } = greetUser();
//   const navigation = useNavigation<NavigationActionType>();
//   console.log('employeeDetailsHeader', employeeDetails);
//   const storage = useMMKV();
//   const handleLogout = () => {
//     storage.clearAll();
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [{ name: screenNames.login }],
//       }),
//     );
//   };

//   const handleProfileImagePress = () => {
//     navigation.navigate(screenNames.profile, { userId: null });
//   };

//   const [weather, setWeather] = useState(null);
//   const [backgroundImage, setBackgroundImage] = useState(images.defaultBackground); // Default background image
//   const [notificationCount, setNotificationCount] = useState(0); // State for notification count
//   console.log('NotificatonCounet',notificationCount)
//   const fetchWeather = async (location: string) => {
//     const API_KEY = '3192dfcf1643de07950bd30f3f729e36'; // Replace with your actual API key
//     const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
//     try {
//       const response = await fetch(
//         `${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`,
//       );
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getBackgroundImage = (weather: any) => {
//     if (!weather || !weather.weather || weather.weather.length === 0) {
//       return images.defaultBackground;
//     }
//     const weatherCondition = weather.weather[0].main.toLowerCase();
//     switch (weatherCondition) {
//       case 'clear':
//         return images.sunny;
//       case 'clouds':
//         return images.cloudy;
//       case 'rain':
//         return images.rainy;
//       case 'snow':
//         return images.snowy;
//       default:
//         return images.defaultBackground;
//     }
//   };

//   // const fetchNotificationCount = async () => {
//   //   const API_URL = 'http://49.248.250.54:8081/api/Count';
//   //   const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc';
    
//   //   try {
//   //     const response = await axios.get(API_URL, {
//   //       headers: {
//   //         Authorization: `Bearer ${TOKEN}`,
//   //       },
//   //     });
//   //     console.log('API response:', response.data); // Log the response data
//   //     if (response.data && typeof response.data.count === 'number') {
//   //       setNotificationCount(response.data.count); // Update to use response.data.count
//   //     } else {
//   //       console.error('Unexpected API response format:', response.data);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching notification count:', error);
//   //   }
//   // };

//   const fetchNotificationCount = async () => {
//     const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc';
//        const employee = employeeDetails?.id;
  
//     if (!employee) {
//       console.error('EmployeeId is missing.');
//       return;
//     }
  
//     let API_URL = '';
//     if (employeeDetails?.role === 'Leader') {
//       API_URL = 'http://49.248.250.54:8081/api/Count';
//     } else if (employeeDetails?.role === 'Individual') {
//       API_URL = 'http://49.248.250.54:8081/api/CountNotification';
//     }
  
//     if (!API_URL) {
//       console.error('Role not recognized or API URL is missing.');
//       return;
//     }
  
//     try {
//       const response = await axios.get(API_URL, {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//         },
//       });
//       console.log('API response:', response.data);
//       if (response.data && typeof response.data.count === 'number') {
//         setNotificationCount(response.data.count);
//       } else {
//         console.error('Unexpected API response format:', response.data);
//       }
//     } catch (error) {
//       if (error.response) {
//         // Server responded with a status other than 200 range
//         console.error('Error fetching notification count:', error.response.data);
//       } else if (error.request) {
//         // Request was made but no response received
//         console.error('No response received:', error.request);
//       } else {
//         // Something happened in setting up the request
//         console.error('Error setting up request:', error.message);
//       }
//     }
//   };

//   // const fetchNotificationCount = async () => {
//   //   const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc';
//   //   const employee = employeeDetails?.id;
  
//   //   if (!employee) {
//   //     console.error('EmployeeId is missing.');
//   //     return;
//   //   }
  
//   //   let API_URL = '';
//   //   if (employeeDetails?.role === 'Leader') {
//   //     API_URL = 'http://49.248.250.54:8081/api/Count';
//   //   } else if (employeeDetails?.role === 'Individual') {
//   //     API_URL = 'http://49.248.250.54:8081/api/CountNotification';
//   //   }
//   // console.log('API_URL',API_URL)
//   //   if (!API_URL) {
//   //     console.error('Role not recognized or API URL is missing.');
//   //     return;
//   //   }
  
//   //   try {
//   //     const response = await axios.get(API_URL, {
//   //       headers: {
//   //         Authorization: `Bearer ${TOKEN}`,
     
//   //       },
//   //     });
//   //     console.log('API response:', response.data);
//   //     if (response.data && typeof response.data.count === 'number') {
//   //       setNotificationCount(response.data.count);
//   //     } else {
//   //       console.error('Unexpected API response format:', response.data);
//   //     }
//   //   } catch (error) {
//   //     if (error.response) {
//   //       // Server responded with a status other than 200 range
//   //       console.error('Error fetching notification count:', error.response.data);
//   //     } else if (error.request) {
//   //       // Request was made but no response received
//   //       console.error('No response received:', error.request);
//   //     } else {
//   //       // Something happened in setting up the request
//   //       console.error('Error setting up request:', error.message);
//   //     }
//   //   }
//   // };
  
//   useFocusEffect(
//     useCallback(() => {
//       fetchNotificationCount();
//     }, [])
//   );
  

//   useEffect(() => {
//     const getWeather = async () => {
//       const data = await fetchWeather('pune'); // Replace with the desired location
//       setWeather(data);
//       setBackgroundImage(getBackgroundImage(data));
//     };

//     getWeather();
//     fetchNotificationCount(); // Fetch notification count on component mount
//   }, []);

//   return (
//     <ImageBackground
//       blurRadius={2}
//       style={styles.headerImageBackgroundView}
//       imageStyle={styles.headerImage}
//       source={backgroundImage}>
//       <View style={styles.parentContainer}>
//         <View style={styles.headerContainer}>
//           <View style={styles.rowLeftContainer}>
//             <View style={styles.userGreetContainer}>
//               <Text style={styles.greetText}>{message}</Text>
//               <Text style={styles.usernameText}>
//                 {employeeDetails?.employeeName
//                   ? employeeDetails?.employeeName
//                   : 'User'}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.rowRightContainer}>
//             {/* <Pressable onPress={handleProfileImagePress}>
//               <FastImage
//                 resizeMode="cover"
//                 style={styles.profileImage}
//                 source={
//                   employeeDetails?.photo
//                     ? { uri: employeeDetails.photo }
//                     : images.appImages.noProfile
//                 }
//               />
//             </Pressable> */}
//             <TouchableOpacity
//               onPress={handleLogout}
//               style={styles.logoutButton}>
//               <Icon name="sign-out" size={26} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//           }}>
//           <View style={styles.weatherContainer}>
//             {weather ? (
//               <View>
//                 <Text style={styles.weatherText}>{weather.main.temp}°C</Text>
//                 <Text style={styles.weatherText}>
//                   {weather.weather[0].description}
//                 </Text>
//               </View>
//             ) : (
//               <Text style={styles.loadingText}>Loading...</Text>
//             )}
//           </View>

//           <View style={styles.bellIconContainer}>
//             <Icon
//               name="bell"
//               size={22}
//               color={'#ffffff'}
//               onPress={() =>
//                 navigation.navigate(screenNames.notificationScreen)
//               }
//             />

//             <View style={styles.notificationBadge}>
//               <Text style={styles.notificationText}>{notificationCount}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// export default Header;


// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   ImageBackground,
//   Pressable,
//   View,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import FastImage from 'react-native-fast-image';
// import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
// import { NavigationActionType, screenNames } from '../../../navigation/rootNavigator/types';
// import useStyles from './useStyles';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import useHeader from './useHeader';
// import { useMMKV } from 'react-native-mmkv';
// import { CommonActions } from '@react-navigation/native';
// import greetUser from './greeting';
// import { useAppTheme } from '../../../theme';
// import axios from 'axios';

// // const images = {
// //   sunny: require('../../../asset/images/webView/sunny.webp'),
// //   cloudy: require('../../../asset/images/webView/cloudy.jpg'),
// //   rainy: require('../../../asset/images/webView/rainy.jpg'),
// //   scatterd: require('../../../asset/images/webView/scattered-cloud.jpg'),
// //   snowy: require('../../../asset/images/webView/cloudy.jpg'),
// //   defaultBackground: require('../../../asset/images/webView/cloudy.jpg'),
// //   appImages: {
// //     noProfile: require('../../../asset/images/webView/cloudy.jpg'),
// //   },
// // };

// type Props = {};

// const Header = (props: Props) => {
//   const styles = useStyles();
//   const theme = useTheme();
//   const { employeeDetails } = useHeader();
//   const { message } = greetUser();
//   const navigation = useNavigation<NavigationActionType>();
//   const storage = useMMKV();

//   console.log('employeeDetailsHeader', employeeDetails); // Log employee details

//   const handleLogout = async () => {
//     console.log('Starting logout process...');

//     try {
//       console.log('Clearing storage...');
//       await storage.clearAll();
//       console.log('Storage cleared');

//       navigation.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [{ name: screenNames.login }],
//         }),
//       );
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//   };

//   const handleProfileImagePress = () => {
//     navigation.navigate(screenNames.profile, { userId: null });
//   };

//   const [weather, setWeather] = useState<any>(null);
//   // const [backgroundImage, setBackgroundImage] = useState(images.defaultBackground);
//   const [notificationCount, setNotificationCount] = useState(0);

//   console.log('NotificationCount:', notificationCount); // Log notification count

//   const fetchWeather = async (location: string) => {
//     const API_KEY = '3192dfcf1643de07950bd30f3f729e36';
//     const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
//     try {
//       const response = await fetch(
//         `${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`,
//       );
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching weather:', error); // Log weather fetch error
//     }
//   };

//   const getBackgroundImage = (weather: any) => {
//     if (!weather || !weather.weather || weather.weather.length === 0) {
//       return images.defaultBackground;
//     }
//     const weatherCondition = weather.weather[0].main.toLowerCase();
//     switch (weatherCondition) {
//       case 'clear':
//         return images.sunny;
//       case 'clouds':
//         return images.cloudy;
//       case 'rain':
//         return images.rainy;
//       case 'snow':
//         return images.snowy;
//       default:
//         return images.defaultBackground;
//     }
//   };

//   const fetchNotificationCount = async () => {
//     const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc';
//     const employee = employeeDetails?.id;

//     if (!employee) {
//       console.error('EmployeeId is missing.');
//       return;
//     }

//     let API_URL = '';
//     if (employeeDetails?.role === 'Leader') {
//       API_URL = 'http://49.248.250.54:8081/api/Count';
//     } else if (employeeDetails?.role === 'Individual') {
//       API_URL = 'http://49.248.250.54:8081/api/CountNotification';
//     }

//     console.log('API_URL:', API_URL); // Log the API URL being used

//     if (!API_URL) {
//       console.error('Role not recognized or API URL is missing.');
//       return;
//     }

//     try {
//       const response = await axios.get(API_URL, {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//         },
//       });
//       console.log('API response:', response.data); // Log API response
//       if (response.data && typeof response.data.count === 'number') {
//         setNotificationCount(response.data.count);
//       } else {
//         console.error('Unexpected API response format:', response.data);
//       }
//     } catch (error) {
//       if (error.response) {
//         console.error('Error fetching notification count:', error.response.data);
//       } else if (error.request) {
//         console.error('No response received:', error.request);
//       } else {
//         console.error('Error setting up request:', error.message);
//       }
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchNotificationCount();
//     }, [])
//   );

//   useEffect(() => {
//     const getWeather = async () => {
//       const data = await fetchWeather('pune'); // Replace with the desired location
//       setWeather(data);
//       setBackgroundImage(getBackgroundImage(data));
//     };

//     getWeather();
//     fetchNotificationCount(); // Fetch notification count on component mount
//   }, []);

//   return (
//     <ImageBackground
//       blurRadius={2}
//       style={styles.headerImageBackgroundView}
//       imageStyle={styles.headerImage}
//       >
//       <View style={styles.parentContainer}>
//         <View style={styles.headerContainer}>
//           <View style={styles.rowLeftContainer}>
//             <View style={styles.userGreetContainer}>
//               <Text style={styles.greetText}>{message}</Text>
//               <Text style={styles.usernameText}>
//                 {employeeDetails?.employeeName
//                   ? employeeDetails?.employeeName
//                   : 'User'}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.rowRightContainer}>
//             {/* <TouchableOpacity
//               onPress={handleLogout}
//               style={styles.logoutButton}>
//               <Icon name="sign-out" size={26} color="#fff" />
//             </TouchableOpacity> */}
//           </View>
//         </View>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//           }}>
//           <View style={styles.weatherContainer}>
//             {weather ? (
//               <View>
//                 <Text style={styles.weatherText}>{weather.main.temp}°C</Text>
//                 <Text style={styles.weatherText}>
//                   {weather.weather[0].description}
//                 </Text>
//               </View>
//             ) : (
//               <Text style={styles.loadingText}>Loading...</Text>
//             )}
//           </View>

//           <View style={styles.bellIconContainer}>
//             <Icon
//               name="bell"
//               size={22}
//               color={'#ffffff'}
//               onPress={() =>
//                 navigation.navigate(screenNames.notificationScreen)
//               }
//             />
//             <View style={styles.notificationBadge}>
//               <Text style={styles.notificationText}>{notificationCount}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// export default Header;


import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

type Props = {};

const Header = (props: Props) => {
  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);

  // Check if the user is checked in when the component mounts
  useEffect(() => {
    const checkCheckedInStatus = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem('userLocation');
        if (storedLocation) {
          setCheckedIn(true);
        }
      } catch (error) {
        console.error('Error retrieving location from AsyncStorage:', error);
      }
    };
    checkCheckedInStatus();
  }, []);

  const handleCheckIn = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Save the location to AsyncStorage
          await AsyncStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
          setCheckedIn(true);
          Alert.alert('Check-In Successful', 'You have checked in successfully.');
        } catch (error) {
          console.error('Error saving location:', error);
          Alert.alert('Check-In Failed', 'Please try again.');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert('Location Error', 'Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleCheckOut = async () => {
    try {
      // Remove the location from AsyncStorage
      await AsyncStorage.removeItem('userLocation');
      setCheckedIn(false);
      Alert.alert('Check-Out Successful', 'You have checked out successfully.');
    } catch (error) {
      console.error('Error removing location:', error);
      Alert.alert('Check-Out Failed', 'Please try again.');
    }
  };

  return (
    <ImageBackground
      style={{
        width: '100%',
        height: 100,
        justifyContent: 'center',
        backgroundColor: 'grey',
      }}
      blurRadius={2}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        {/* Left Side: Check-In/Check-Out Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ffffff',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
          onPress={checkedIn ? handleCheckOut : handleCheckIn}
        >
          <Text
            style={{
              color: '#000000',
              fontWeight: 'bold',
              fontSize: 14,
            }}
          >
            {checkedIn ? 'Check-Out' : 'Check-In'}
          </Text>
        </TouchableOpacity>

        {/* Right Side: Notification Bell */}
        <View
          style={{
            position: 'relative',
          }}
        >
          {/* <Icon
            name="bell"
            size={22}
            color={'#ffffff'}
            onPress={() =>
              navigation.navigate('NotificationScreen') // Adjust screen name if necessary
            }
          /> */}
          {notificationCount > 0 && (
            <View
              style={{
                position: 'absolute',
                right: -10,
                top: -5,
                backgroundColor: 'red',
                borderRadius: 10,
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              >
                {notificationCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default Header;










