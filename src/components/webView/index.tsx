import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import autoLoginUtil from '../../components/webView/helper';
import { useGetStartEndDayDetailsQuery, useStartDayMutation } from '../../redux/services/activity/ActivitySlice';
import { handleStartDay } from '../../common/utils/checkInHelper';
import { useGetTrackDataQuery } from '../../redux/services/user/userApiSlice';
import useTrackUser from '../../common/helper/userTracking/useLocationTracking';
import { setSnackMessage } from '../../redux/slices/snackbarSlice';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '../../navigation/rootNavigator/types';

const WebViewComponent = () => {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [dynamicUrl, setDynamicUrl] = useState();
  const [injectedJavaScript, setInjectedJavaScript] = useState('');
  const { data: startEndDayDetails } = useGetStartEndDayDetailsQuery();
  const [startDay] = useStartDayMutation();
  const { data: trackTimeData } = useGetTrackDataQuery();
  const { updateForeground } = useTrackUser();

  useEffect(() => {
    console.log('startEndDayDetails date', new Date(startEndDayDetails?.checkInOutDateTime).toDateString(), new Date().toDateString());
    if (
      startEndDayDetails?.status !== 'in' ||
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
            navigation.replace(screenNames.myWebView, {nextScreen: 'CheckIn'} );
            console.log('Day started successfully');
            //await AsyncStorage.setItem('StartDayPromptShown', 'true');
          } catch (error) {
            console.error('Failed to start the day:', error);
            Alert.alert('Error', 'Failed to start the day. Please try again.');
          }
          },
        },
      ]);
    }
  }, [startEndDayDetails]);

  console.log('dynamicUrl', dynamicUrl);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = await AsyncStorage.getItem('WebUrl');
        const userId = await AsyncStorage.getItem('userId');
        const password = await AsyncStorage.getItem('password');
        if (url) {
          setDynamicUrl(url);
        }
        else if (userId && password) {
          setDynamicUrl(`https://ekstasis.net/area_officer/Home/AppCall/?UserName=${userId}&Password=${password}`);
        }

        if (userId && password) {
          setInjectedJavaScript(autoLoginUtil(userId, password, { overrideExisting: true }));
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <WebView
      ref={webViewRef}
      source={{
        uri: dynamicUrl,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        },
      }}
      injectedJavaScript={injectedJavaScript}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      onReceivedSslError={(event) => {
        const { url, code, message } = event.nativeEvent;
        Alert.alert(
          'SSL Certificate Error',
          `An SSL error occurred: ${message} (${code}) for URL: ${url}. Do you want to proceed anyway?`,
          [
            { text: 'Cancel', onPress: () => event.nativeEvent.preventDefault(), style: 'cancel' },
            { text: 'Proceed', onPress: () => event.nativeEvent.proceed() },
          ],
          { cancelable: false }
        );
      }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.log('WebView error: ', JSON.stringify(nativeEvent));
        if (nativeEvent.description === 'net::ERR_CONNECTION_RESET') {
          Alert.alert(
            'Connection Reset',
            'The connection was reset. please retry or check your internet connection.',
            [
              
              { text: 'Retry', onPress: () => webViewRef.current?.reload() },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert('Error', 'Failed to load page. Please check your internet connection or try again later.');
        }
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.log('HTTP error: ', JSON.stringify(nativeEvent));
      }}
/>

  );
};

export default WebViewComponent;