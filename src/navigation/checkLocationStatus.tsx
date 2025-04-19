import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import RNLocationEnabler from 'react-native-location-enabler';

export const checkLocationStatus = async () => {
  try {
    if (Platform.OS === 'android') {
      // Check if location providers are enabled
      const providers = await RNLocationEnabler.checkSettings({
        interval: 10000, // ms
        fastInterval: 5000, // ms
      });

      return {
        gpsEnabled: providers.gps,
        networkEnabled: providers.network,
        isLocationEnabled: providers.gps || providers.network,
      };
    } else {
      // iOS - check authorization status
      const status = await new Promise((resolve) => {
        Geolocation.requestAuthorization(
          () => resolve('granted'),
          () => resolve('denied')
        );
      });

      return {
        isLocationEnabled: status === 'granted',
        status
      };
    }
  } catch (error) {
    console.error('Error checking location status:', error);
    return {
      isLocationEnabled: false,
      error: error.message
    };
  }
};