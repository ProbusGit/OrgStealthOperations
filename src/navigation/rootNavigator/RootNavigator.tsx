import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import SplashScreen from '../../screens/splash';
import Login from '../../screens/auth/login';
import BottomNavigator from '../bottomNavigator';
import NotificationScreen from '../../screens/notification';
import Profile from '../../screens/profile';
import MyWebView from '../../components/webView';
// import HomeScreen from '../../screens/home';
import LogoutScreen from '../../screens/logout';
import {useAppTheme} from '../../theme';
import Header from './components/header';
import {RootStackParamList, screenNames} from './types';
import {Text} from 'react-native-paper';
import CheckInScreen from '../../screens/checkin';

type Props = {};

const RootNavigator = (props: Props) => {
  const Stack = createStackNavigator<RootStackParamList>();
  const theme = useAppTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: Header,
        }}>
        <Stack.Screen
          name={screenNames.splashScreen}
          options={{headerShown: false}}
          component={SplashScreen}
        />
        <Stack.Screen
          name={screenNames.login}
          options={{headerShown: false}}
          component={Login}
        />

        <Stack.Screen
          name={screenNames.myWebView}
          options={{headerShown: false}}
          component={BottomNavigator}
        />

        <Stack.Screen
          options={{headerShown: false}}
          name={screenNames.homeScreen}
          component={CheckInScreen}
        />

        <Stack.Screen
          name={screenNames.notificationScreen}
          options={{headerShown: false}}
          component={NotificationScreen}
        />

        <Stack.Screen
          name={screenNames.profile}
          options={{headerShown: false}}
          component={Profile}
        />
        <Stack.Screen
          name={screenNames.logoutScreen}
          options={{headerShown: false}}
          component={LogoutScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
