import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native';
import useTrackUser from '../../common/helper/userTracking/useLocationTracking';

const LogoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { updateForeground, removeForeground, } = useTrackUser();
  useFocusEffect(
    React.useCallback(() => {
      const showLogoutConfirmation = () => {
        Alert.alert(
          'Confirm Logout',
          'Are you sure you want to log out?',
          [
            {
              text: 'Yes',
              onPress: () => {
                setIsLoggingOut(true); // Start the logout process
                clearEmployeeId();
                removeForeground()
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => navigation.goBack(), // Navigate back to the previous screen if "Cancel" is pressed
            },
          ],
          { cancelable: false }
        );
      };

      const clearEmployeeId = async () => {
        try {
            await AsyncStorage.clear();
          // Navigate to the login screen or another appropriate screen
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }], // Replace 'Login' with your login screen name
            })
          );
        } catch (error) {
          console.error('Failed to remove employeeId:', error);
          setIsLoggingOut(false); // Reset the state if logout fails
        }
      };

      showLogoutConfirmation();
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      {isLoggingOut ? (
        <>
          <Text>Logging out...</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </>
      ) : (
        <Text>Awaiting confirmation...</Text> // Placeholder while awaiting user confirmation
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LogoutScreen;
