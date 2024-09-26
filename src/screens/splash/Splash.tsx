import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { screenNames } from '../../navigation/rootNavigator/types';
import { useAppTheme } from '../../theme';

const SplashScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const employeeId = await AsyncStorage.getItem('employeeId');
        if (employeeId) {
          // If an employeeId exists, navigate to the WebView screen
          navigation.navigate(screenNames.myWebView);
        } else {
          // If no employeeId exists, navigate to the login screen
          navigation.navigate(screenNames.login);
        }
      } catch (error) {
        console.error('Failed to fetch employeeId', error);
        navigation.navigate(screenNames.login);
        
      }
    };

    const timer = setTimeout(() => {
      checkLoginState();
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#000000', '#434343', '#7d7d7d', '#b0b0b0']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ color: '#ffffff', fontSize: 34, fontWeight: 'bold' }}>
        Stealth Group
      </Text>
    </LinearGradient>
  );
};

export default SplashScreen;

