import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';

const LogoutScreen: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const clearEmployeeId = async () => {
      try {
        await AsyncStorage.removeItem('employeeId');
        // Navigate to the login screen or another appropriate screen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }], // Replace 'Login' with your login screen name
          })
        );
      } catch (error) {
        console.error('Failed to remove employeeId:', error);
      }
    };

    clearEmployeeId();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Logging out...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
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
