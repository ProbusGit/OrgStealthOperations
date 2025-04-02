import React, { useEffect, useRef, useState } from 'react';
import { Alert, ActivityIndicator, View, StyleSheet, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import autoLoginUtil from '../../components/webView/helper';
import { useGetStartEndDayDetailsQuery, useStartDayMutation } from '../../redux/services/activity/ActivitySlice';
import { handleStartDay } from '../../common/utils/checkInHelper';
import { useGetTrackDataQuery } from '../../redux/services/user/userApiSlice';
import useTrackUser from '../../common/helper/userTracking/useLocationTracking';
import { setSnackMessage } from '../../redux/slices/snackbarSlice';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { screenNames } from '../../navigation/rootNavigator/types';
import { Button, Text } from 'react-native-paper';

const WebViewComponent = () => {
  const navigation = useNavigation();
  const webViewRef = useRef<WebView>(null);
  const [dynamicUrl, setDynamicUrl] = useState('');
  const [injectedJavaScript, setInjectedJavaScript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { data: startEndDayDetails } = useGetStartEndDayDetailsQuery();
  const BaseUrl = 'https://ekstasis.net/area_officer/Home/AppCall/';
  const [userName, setUserName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      const [fetchedUserName, fetchedPassword] = await Promise.all([
        AsyncStorage.getItem('userName'),
        AsyncStorage.getItem('password'),
      ]);
      setUserName(fetchedUserName);
      setPassword(fetchedPassword);
    };

    fetchCredentials();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = await AsyncStorage.getItem('WebUrl');
        const userId = await AsyncStorage.getItem('userId');
        const password = await AsyncStorage.getItem('password');

        if (url) {
          setDynamicUrl(url);
        } else if (userId && password) {
          setDynamicUrl(`${BaseUrl}?UserName=${userId}&Password=${password}`);
        }
        setLoading(false);

        if (userId && password) {
          setInjectedJavaScript(autoLoginUtil(userId, password, { overrideExisting: true }));
        }
        
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
        setHasError(true);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWebViewLoad = () => {
    setLoading(false);
  };

  const handleWebViewError = () => {
    setError('Failed to load the webpage. Please try again.');
    setLoading(false);
  };

  const handleNavigationStateChange = async (navState: any) => {
    setCanGoBack(navState.canGoBack);
    console.log("navState=========", navState)
    console.log(navState.url == 'https://ekstasis.net/area_officer/', navState.title == 'Login', navState.canGoBack == true)
    
    if(navState.url == 'https://ekstasis.net/area_officer/' && navState.title == 'Login' && navState.canGoBack == true)
      {
        console.log('inside')
        await AsyncStorage.clear();
          // Navigate to the login screen or another appropriate screen
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }], // Replace 'Login' with your login screen name
            })
          );
      }
    if ( userName && password) {
      const generatedWebUrl = `${BaseUrl}?UserName=${userName}&Password=${password}`;
      setDynamicUrl(generatedWebUrl);
    }
  };

  const handleWebViewLoadStart = () => {
    //dispatch(setIsWebviewLoading(true));
  };

  const handleRetry = () => {
    webViewRef.current?.reload()
    setError(null);
    setLoading(true);
    if (userName && password) {
      const generatedWebUrl = `${BaseUrl}?UserName=${userName}&Password=${password}`;
      setDynamicUrl(generatedWebUrl);
    setLoading(false);

    }
  };

  useEffect(() => {
    const checkStartDay = async () => {
      console.log('--------------',startEndDayDetails?.status,new Date(startEndDayDetails?.checkInOutDateTime).toDateString(), new Date().toDateString())
      if (startEndDayDetails &&
        startEndDayDetails?.status !== 'in' &&
        new Date(startEndDayDetails?.checkInOutDateTime).toDateString() !== new Date().toDateString()
      ) {
        Alert.alert('Start Your Day', 'Please start your day to proceed.', [
          { text: 'No', onPress: () => {}, style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              console.log('User chose to start the day');
              try {
                // await handleStartDay(startDay, trackTimeData, updateForeground, setSnackMessage);
                navigation.replace(screenNames.myWebView, { nextScreen: 'CheckIn' });
                console.log('Day started successfully');
                // await AsyncStorage.setItem('StartDayPromptShown', 'true');
              } catch (error) {
                console.error('Failed to start the day:', error);
                Alert.alert('Error', 'Failed to start the day. Please try again.');
              }
            },
          },
        ]);
      }
    };

    checkStartDay();
  }, [startEndDayDetails]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={handleRetry}>
          Retry
        </Button>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ backgroundColor: 'black', flex: 1 }}>
          <ActivityIndicator size="large" color="white" />
          {loading && (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 10 }}>
              <Text style={{
                fontSize: 25,
                fontFamily: "Montserrat-Bold",
                color: "white"
              }}> Hold on !</Text>
              <Text style={{ textAlign: 'center', fontFamily: "Montserrat-Bold", fontSize: 16, color: 'white' }}>Preparing Data for you...!</Text>
            </View>
          )}
        </View>
      </View>
      {dynamicUrl && (
        <WebView
          ref={webViewRef}
          source={{ uri: dynamicUrl }}
          style={styles.webView}
          originWhitelist={['https://*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          cacheEnabled={false}
          allowsBackForwardNavigationGestures={true}
          onLoad={handleWebViewLoad}
          onLoadStart={handleWebViewLoadStart}
          onError={(syntheticEvent) => {
            webViewRef.current?.reload()
            const { nativeEvent } = syntheticEvent;
            console.log('WebView error: ', nativeEvent);
            
            if (nativeEvent.description.includes('ERR_CONNECTION_RESET')) {
              Alert.alert(
                'Connection Issue',
                'Having trouble connecting to the server. Retrying...',
                [
                  
                  { text: 'Retry', onPress: () => webViewRef.current?.reload() },
                ],
                { cancelable: false }
              );
              setTimeout(() => webViewRef.current?.reload(), 2000);
            } else {
              Alert.alert(
                'Loading Error',
                'Failed to load page. Please check your internet connection.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Retry', onPress: () => webViewRef.current?.reload() }
                ]
              );
            }
          }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('HTTP error: ', nativeEvent.statusCode);
          webViewRef.current?.reload();
        }}
        onContentProcessDidTerminate={() => {
          Alert.alert('Process Terminated', 'The web process terminated. Reloading...');
          webViewRef.current?.reload();
        }}
        onNavigationStateChange={handleNavigationStateChange}
      />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  loadingAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default WebViewComponent;