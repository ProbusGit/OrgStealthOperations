import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

type Props = {};

const Header = (props: Props) => {
  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);

  // Check if the user is checked in when the component mounts
  useEffect(() => {
    const checkCheckedInStatus = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem('userLocation');
        if (storedLocation) {
          setCheckedIn(true);
        }
      } catch (error) {
        console.error('Error retrieving location from AsyncStorage:', error);
      }
    };
    checkCheckedInStatus();
  }, []);

  const handleCheckIn = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Save the location to AsyncStorage
          await AsyncStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
          setCheckedIn(true);
          Alert.alert('Check-In Successful', 'You have checked in successfully.');
        } catch (error) {
          console.error('Error saving location:', error);
          Alert.alert('Check-In Failed', 'Please try again.');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert('Location Error', 'Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleCheckOut = async () => {
    try {
      // Remove the location from AsyncStorage
      await AsyncStorage.removeItem('userLocation');
      setCheckedIn(false);
      Alert.alert('Check-Out Successful', 'You have checked out successfully.');
    } catch (error) {
      console.error('Error removing location:', error);
      Alert.alert('Check-Out Failed', 'Please try again.');
    }
  };

  return (
    <ImageBackground
      style={{
        width: '100%',
        height: 100,
        justifyContent: 'center',
        backgroundColor: 'grey',
      }}
      blurRadius={2}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        {/* Left Side: Check-In/Check-Out Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ffffff',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
          onPress={checkedIn ? handleCheckOut : handleCheckIn}
        >
          <Text
            style={{
              color: '#000000',
              fontWeight: 'bold',
              fontSize: 14,
            }}
          >
            {checkedIn ? 'Check-Out' : 'Check-In'}
          </Text>
        </TouchableOpacity>

        {/* Right Side: Notification Bell */}
        <View
          style={{
            position: 'relative',
          }}
        >
          {/* <Icon
            name="bell"
            size={22}
            color={'#ffffff'}
            onPress={() =>
              navigation.navigate('NotificationScreen') // Adjust screen name if necessary
            }
          /> */}
          {notificationCount > 0 && (
            <View
              style={{
                position: 'absolute',
                right: -10,
                top: -5,
                backgroundColor: 'red',
                borderRadius: 10,
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              >
                {notificationCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default Header;










