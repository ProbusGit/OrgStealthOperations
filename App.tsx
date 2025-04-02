import React, { useEffect } from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {
  Drawer,
  MD3LightTheme,
  MD3Theme,
  PaperProvider,
} from 'react-native-paper';
import theme, {useAppTheme} from './src/theme';
import RootNavigator from './src/navigation/rootNavigator/RootNavigator';
import {Provider} from 'react-redux';
import {store} from './src/redux/store/store';
import {dark, light} from './src/theme/themes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SnackBar from './src/components/snackbar';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { Alert, BackHandler } from 'react-native';
import createNotificationChannels from './src/screens/createNotificationChannels';
// Setup Notification Handlers
const useNotificationHandlers = () => {
  useEffect(() => {
    // Initialize Notification Channels
    createNotificationChannels();

    // Handle Foreground Notifications
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      // await processNotification(remoteMessage);
      await notifee.displayNotification({
        title: remoteMessage?.notification.title,
        body: remoteMessage?.notification.body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher', // Change to your app's icon
        },
      });
    });

    // Handle Background Notifications
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message received:', remoteMessage);
      //await processNotification(remoteMessage);
    });

    // Handle App Opened from Background
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log('Notification opened app from background:', remoteMessage);
      //await handleNotificationClick(remoteMessage);
    });

    // Handle App Opened from Killed State
    messaging().getInitialNotification().then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from killed state with notification:', remoteMessage);
        //await handleNotificationClick(remoteMessage);
      }
    });

    // Handle Notifee Background Click Events
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notification was pressed in background:', detail);
        //await handleNotificationClick(detail.notification);
      }
    });

    // Handle Notifee Foreground Click Events
    notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notification was pressed in foreground:', detail);
        await handleNotificationClick(detail.notification);
      }
    });

    return () => {
      // Clean up listeners when the component unmounts
      unsubscribeOnMessage();
      unsubscribeOpenedApp();
    };
  }, []);
};
function App(): React.JSX.Element {
  const systemColorScheme = useColorScheme();
  const appTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      // ...(systemColorScheme === 'dark' ? dark.colors : light.colors),
      ...light.colors,
    },
  };
  useNotificationHandlers();
  // const appTheme = {...theme, ...(systemColorScheme === 'dark' ? dark : light)};
  return (
    <Provider store={store}>
      <PaperProvider theme={appTheme}>
        <SafeAreaView
          style={{flex: 1, backgroundColor: appTheme.colors.surface}}>
          <GestureHandlerRootView style={{flex: 1}}>
            <SnackBar />
            <RootNavigator />
          </GestureHandlerRootView>
        </SafeAreaView>
      </PaperProvider>
       </Provider>
 
  );
}

const styles = StyleSheet.create({});

export default App;

