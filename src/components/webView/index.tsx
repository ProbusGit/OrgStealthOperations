// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Alert,
//   View,
//   Text,
//   ActivityIndicator,
//   BackHandler,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// import autoLoginUtil from '../../components/webView/helper';
// import Header from './header';
// import { useMMKVObject } from 'react-native-mmkv';
// import { asyncStorageKeys } from '../../common/constants';
// import { Button } from 'react-native-paper';

// const AutoLoginWebView = () => {
//   const webViewRef = useRef(null);
//   const route = useRoute();
//   const { screenName } = route.params || {};
//   const navigation = useNavigation();
//   const [userCredintials] = useMMKVObject(asyncStorageKeys.employeeCredintials);
//   const [loginCredentials, setLoginCredentials] = useState(null);
//   const [error, setError] = useState(null);
//   const [canGoBack, setCanGoBack] = useState(false);

//   useEffect(() => {
//     if (userCredintials) {
//       setLoginCredentials({
//         loginId: userCredintials.loginId,
//         password: userCredintials.password,
//       });
//     }
//   }, [userCredintials]);

//   const handleBackPress = useCallback(() => {
//     if (canGoBack) {
//       webViewRef.current.goBack();
//     } else {
//       Alert.alert(
//         'Exit App',
//         'Do you want to exit the app?',
//         [
//           {
//             text: 'No',
//             onPress: () => null,
//             style: 'cancel',
//           },
//           { text: 'Yes', onPress: () => BackHandler.exitApp() },
//         ],
//         { cancelable: false }
//       );
//     }
//     return true;
//   }, [canGoBack]);

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => handleBackPress();

//       BackHandler.addEventListener('hardwareBackPress', onBackPress);

//       return () => {
//         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//       };
//     }, [handleBackPress])
//   );

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//         <Button mode="contained" onPress={() => setError(null)}>
//           Retry
//         </Button>
//       </View>
//     );
//   }

//   if (!loginCredentials) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   const { loginId, password } = loginCredentials;

//   const injectedJavaScript = autoLoginUtil(loginId, password);

//   const onMessage = (event) => {
//     console.log('Message from WebView:', event.nativeEvent.data);
//   };

//   const onShouldStartLoadWithRequest = (request) => {
//     return true;
//   };

//   const onReceivedSslError = (event) => {
//     const { url, code, message } = event.nativeEvent;
//     Alert.alert(
//       'SSL Certificate Error',
//       `An SSL error occurred: ${message} (${code}) for URL: ${url}. Do you want to proceed anyway?`,
//       [
//         {
//           text: 'Cancel',
//           onPress: () => event.nativeEvent.preventDefault(),
//           style: 'cancel',
//         },
//         {
//           text: 'Proceed',
//           onPress: () => event.nativeEvent.proceed(),
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   // const dynamicUrl = `http://church.stealthems.in/Home/AppCall/?username=${loginId}&password=${password}`;

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* <Header /> */}
//       <WebView
//         ref={webViewRef}
//         source={{ uri: 'http://ops.stealthems.in/AO/AO' }}
//         // source={{ uri: screenName || dynamicUrl }}
//         injectedJavaScript={injectedJavaScript}
//         onMessage={onMessage}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         startInLoadingState={true}
//         onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
//         onReceivedSslError={onReceivedSslError}
//         onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     margin: 20,
//   },
// });

// export default AutoLoginWebView;






// import React, {useRef, useEffect,useState,useCallback} from 'react';
// import {SafeAreaView, StyleSheet, Alert,BackHandler} from 'react-native';
// import {WebView} from 'react-native-webview';
// import {useIsFocused, useNavigation, useRoute,useFocusEffect} from '@react-navigation/native';
// import autoLoginUtil from '../../components/webView/helper';
// import Header from './header';
// import HeaderSecond from './headerSecond';
// import {screenNames} from '../../navigation/rootNavigator/types';
// import {useMMKVObject} from 'react-native-mmkv';
// import {asyncStorageKeys} from '../../common/constants';

// const AutoLoginWebView = () => {
//   const [canGoBack, setCanGoBack] = useState(false);
//   const webViewRef = useRef(null);
//   const route = useRoute();
//   const {screenName} = route.params || {};
//   // const  {screenName} = useRoute().params
//   // const { screenName } = route.params as { screenName: string }; 
//   const isFocused = useIsFocused();
//   console.log('screenNameName', screenName);

//   const navigation = useNavigation();
//   const [userCredintials, setUserCredintials] = useMMKVObject(
//     asyncStorageKeys.employeeCredintials,
//   );

//   useEffect(() => {
//     if (isFocused) {
//       console.log('route.params', route.params);
//     }
//   }, [route.params, isFocused]);
//   console.log(userCredintials);
//   // const route = useRoute();
//   // const {userId} = route.params; // Get userId from route parameters
//   // const {setUserId} = route.params; // Get setUserId function from params

//   // Extract loginId and password from route params
//   // const {loginId, password} = route.params || {};
//   // console.log(loginId, password);
//   // useEffect(() => {
//   //   if (userId) {
//   //     setUserId(userId);

//   //     // Navigate to MyWebView screen with userId as a parameter
//   //     navigation.replace(screenNames.profile, {userId});
//   //   }
//   // }, [userId, setUserId, navigation]);

//   // Generate the injected JavaScript with the provided username and password
//   const injectedJavaScript = autoLoginUtil(
//     userCredintials?.loginId,
//     userCredintials?.password,
//   );

//   const onMessage = event => {
//     console.log('Message from WebView:', event.nativeEvent.data);
//   };

//   const onShouldStartLoadWithRequest = request => {
//     // Handle any custom URL schemes or conditions here
//     return true;
//   };

//   const onReceivedSslError = event => {
//     // This function will handle SSL certificate errors
//     const {url, code, message} = event.nativeEvent;
//     Alert.alert(
//       'SSL Certificate Error',
//       `An SSL error occurred: ${message} (${code}) for URL: ${url}. Do you want to proceed anyway?`,
//       [
//         {
//           text: 'Cancel',
//           onPress: () => event.nativeEvent.preventDefault(),
//           style: 'cancel',
//         },
//         {
//           text: 'Proceed',
//           onPress: () => event.nativeEvent.proceed(),
//         },
//       ],
//       {cancelable: false},
//     );
//   };

//   const handleBackPress = useCallback(() => {
//     if (canGoBack) {
//       webViewRef.current.goBack();
//     } else {
//       Alert.alert(
//         'Exit App',
//         'Do you want to exit the app?',
//         [
//           { text: 'Yes', onPress: () => BackHandler.exitApp() },
//           {
//             text: 'No',
//             onPress: () => null,
//             style: 'cancel',
//           },
         
//         ],
//         { cancelable: false }
//       );
//     }
//     return true;
//   }, [canGoBack]);

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => handleBackPress();

//       BackHandler.addEventListener('hardwareBackPress', onBackPress);

//       return () => {
//         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//       };
//     }, [handleBackPress])
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header />
//       <WebView
//         ref={webViewRef}
//         source={{ uri: 'http://ops.stealthems.in/AO/AO' }}
//         injectedJavaScript={injectedJavaScript}
//         onMessage={onMessage}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         startInLoadingState={true}
//         onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
//         onReceivedSslError={onReceivedSslError}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default AutoLoginWebView;







import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  View,
  Text,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoLoginUtil from '../../components/webView/helper';
import Header from './header';
import { Button } from 'react-native-paper';

const AutoLoginWebView = () => {
  const webViewRef = useRef(null);
  const navigation = useNavigation();
  const [loginCredentials, setLoginCredentials] = useState<{ userID: string | null; password: string | null } | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Function to load credentials and employeeId from AsyncStorage
  const loadCredentials = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userID');
      const storedPassword = await AsyncStorage.getItem('password');
      const storedEmployeeId = await AsyncStorage.getItem('employeeId');

      if (storedUserId && storedPassword) {
        setLoginCredentials({
          userID: storedUserId,
          password: storedPassword,
        });
      } else {
        setError('No credentials found,Please Login');
      }

      if (storedEmployeeId) {
        setEmployeeId(storedEmployeeId);
      } else {
        setError('No employeeId found');
      }
    } catch (err) {
      setError('Failed to load credentials');
    }
  };

  

  

  useEffect(() => {
    loadCredentials(); // Load credentials when the component mounts
  }, []);

  // Save credentials and employeeId to AsyncStorage whenever they change
  useEffect(() => {
    const saveCredentials = async () => {
      if (loginCredentials) {
        try {
          await AsyncStorage.multiSet([
            ['userID', loginCredentials.userID],
            ['password', loginCredentials.password],
          ]);
        } catch (err) {
          console.error('Failed to save credentials:', err);
        }
      }
      if (employeeId) {
        try {
          await AsyncStorage.setItem('employeeId', employeeId);
        } catch (err) {
          console.error('Failed to save employeeId:', err);
        }
      }
    };
    saveCredentials();
  }, [loginCredentials, employeeId]);

  const handleBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current.goBack();
    } else {
      Alert.alert(
        'Exit App',
        'Do you want to exit the app?',
        [
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
         
        ],
        { cancelable: false }
      );
    }
    return true;
  }, [canGoBack]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [handleBackPress])
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={() => setError(null)}>
          Retry
        </Button>
      </View>
    );
  }

  if (!loginCredentials || !employeeId) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const { userID, password } = loginCredentials;

  const injectedJavaScript = autoLoginUtil(userID, password);

  const onMessage = (event) => {
    console.log('Message from WebView:', event.nativeEvent.data);
  };

  const onShouldStartLoadWithRequest = (request) => {
    // Handle any custom URL schemes or conditions here
    return true;
  };

  const onReceivedSslError = (event) => {
    const { url, code, message } = event.nativeEvent;
    Alert.alert(
      'SSL Certificate Error',
      `An SSL error occurred: ${message} (${code}) for URL: ${url}. Do you want to proceed anyway?`,
      [
        {
          text: 'Cancel',
          onPress: () => event.nativeEvent.preventDefault(),
          style: 'cancel',
        },
        {
          text: 'Proceed',
          onPress: () => event.nativeEvent.proceed(),
        },
      ],
      { cancelable: false }
    );
  };

  const dynamicUrl = `http://ops.stealthems.in/Home/AppCall/?UserName=${userID}&Password=${password}`;

  console.log('fhjdfh',userID, password);

  return (
    <SafeAreaView style={styles.container}>
       <Header />
      <WebView
        ref={webViewRef}
        source={{ uri: dynamicUrl }}
        // source={{ uri: 'http://qc.stealthems.in/Home/Main' }}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onReceivedSslError={onReceivedSslError}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});

export default AutoLoginWebView;






