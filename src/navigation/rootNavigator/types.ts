import { NavigationProp } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
export type RootStackParamList = {
  navigate(myWebView: string): unknown;
  SplashScreen: undefined;
  Login: undefined;
  MyWebView: undefined;
  NotificationScreen: undefined;
  Profile: undefined;
  LogoutScreen: undefined;

};

export const screenNames = {
  splashScreen: 'SplashScreen',
  login: 'Login',
  myWebView: 'MyWebView',
  notificationScreen: 'NotificationScreen',
  profile: '"Profile"',
  logoutScreen: 'LogoutScreen'

} as const;

export type NavigationActionType = NavigationProp<RootStackParamList>;

// Define the Route type for your RootStackParamList
export type Route = RouteProp<RootStackParamList, keyof RootStackParamList>;

// import { NavigationProp } from '@react-navigation/native';
// import { RouteProp } from '@react-navigation/native';

// export type RootStackParamList = {
//   Login: undefined;
//   MyWebView: undefined;
//   Profile: undefined;
// };

// export const screenNames = {
//   login: 'Login',
//   myWebView: 'MyWebView',
//   profile: 'Profile',
// } as const;

// export type NavigationActionType = NavigationProp<RootStackParamList>;

// // Define the Route type for your RootStackParamList
// export type Route = RouteProp<RootStackParamList, keyof RootStackParamList>;

