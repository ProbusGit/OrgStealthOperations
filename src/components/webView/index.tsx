
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
import Header from './components/header';
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

  if (!loginCredentials ) {
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

  const dynamicUrl = `https://ekstasis.net/area_officer/Home/AppCall/?UserName=${userID}&Password=${password}`; //ops


  console.log('fhjdfh',userID, password);

  return (
    <SafeAreaView style={styles.container}>
       {/* <Header /> */}
       <WebView
  ref={webViewRef}
  source={{ uri: dynamicUrl }}
  injectedJavaScript={injectedJavaScript}
  onMessage={onMessage}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  startInLoadingState={true}
  onReceivedSslError={(event) => {
    console.log('SSL Error: ', event.nativeEvent);
    event.nativeEvent.proceed(); // Proceed despite the SSL error (unsafe)
  }}
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error: ', nativeEvent);
  }}
  onHttpError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('HTTP error: ', nativeEvent.statusCode);
  }}
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






