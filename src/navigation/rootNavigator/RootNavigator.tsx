import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SplashScreen from '../../screens/splash';
import Login from '../../screens/auth/login';
import BottomNavigator from '../bottomNavigator';
import NotificationScreen from '../../screens/notification';
import Profile from '../../screens/profile';
import MyWebView from '../../components/webView';
import LogoutScreen from '../../screens/logout';
import { useAppTheme } from '../../theme';
import Header from './components/header';
import { RootStackParamList, screenNames } from './types';
import { Text } from 'react-native-paper';


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
          options={{ headerShown: false }}
          component={SplashScreen}
        />
        <Stack.Screen
          name={screenNames.login}
          options={{ headerShown: false }}
          component={Login}
        />



        <Stack.Screen
          name={screenNames.myWebView}
          options={{ headerShown: false }}
          component={BottomNavigator}
        />

<Stack.Screen
          name={screenNames.notificationScreen}
          options={{ headerShown: false }}
          component={NotificationScreen}
        />

        
<Stack.Screen
          name={screenNames.profile}
          options={{ headerShown: false }}
          component={Profile}
        />
        <Stack.Screen
          name={screenNames.logoutScreen}
          options={{ headerShown: false }}
          component={LogoutScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;



// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Login from '../../screens/auth/login';
// import BottomNavigator from '../bottomNavigator';
// import Profile from '../../screens/profile';
// import { useAppTheme } from '../../theme';
// import Header from './components/header';
// import { RootStackParamList, screenNames } from './types';
// import { ActivityIndicator, View } from 'react-native';



// type Props = {};
// const RootNavigator = (props: Props) => {
//   const Stack = createStackNavigator<RootStackParamList>();
//   const theme = useAppTheme();
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         setIsLoggedIn(!!token); // Set to true if token exists, otherwise false
//       } catch (error) {
//         console.error('Failed to load token from storage', error);
//         setIsLoggedIn(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkLoginStatus();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           header: Header,
//         }}>
//         {isLoggedIn ? (
//           <>
//             <Stack.Screen
//               name={screenNames.myWebView}
//               options={{ headerShown: false }}
//               component={BottomNavigator}
//             />
//             <Stack.Screen
//               name={screenNames.profile}
//               options={{ headerShown: false }}
//               component={Profile}
//             />
//           </>
//         ) : (
//           <Stack.Screen
//             name={screenNames.login}
//             options={{ headerShown: false }}
//             component={Login}
//           />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default RootNavigator;

